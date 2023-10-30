/******************************************************************************
 *
 *  患者データ移行ツール
 *    特定のディレクトリにCAULから出力した患者（顧客）のCSVと
 *    請求CSV（別ディレクトリ）を配置して実行する
 *
 *    このツールの実行により以下のテーブルに登録｜更新が行われる
 *      患者テーブル（登録）
 *        CSVには生年月日や性別などの基本情報は含まれていないので null やデフォルト値が設定される
 *      患者コード管理テーブル（登録）
 *        同名で同じ住所の患者を同一患者とみなし、レコードを追加する
 *      患者関連施設テーブル（登録）
 *      施設コード管理テーブル（更新）
 *        患者コードの末尾4桁の施設ごとの最大値をシーケンス番号に設定して更新する
 *
 ******************************************************************************/
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'
import * as iconv from 'iconv-lite'
import { addDays, addMonths, endOfMonth, format, startOfMonth, subDays } from 'date-fns'
import { pino } from 'pino'
import { createId } from '@paralleldrive/cuid2'
import {
  PrismaClient,
  PatientGender,
  PatientRelateHealthFacilityReason,
  HealthFacilityCodeManage,
  PatientMedicalInsuranceStatus,
  PatientConsentStatus,
  PatientAccountConfirmStatus,
  CaulPatient,
  PatientStatus,
} from '@prisma/client'
import {
  convertSearchName,
  convertAlphaNumZenToHan,
  convertKanaHanToZen,
  removeSeparator,
} from '../../src/core/utils/convertUtil'
import {
  CommonColumns,
  FacilityRelateData,
  FaciltyData,
  PatientInputModel,
  PatientRelateHealthFacilityInputModel,
  PharmacyData,
  TmpPatientModel,
} from './patientImportModels'
import {
  DEFAULT_START_DATE,
  REGIST_DATE,
  REGIST_USER,
  findPharmacyId,
  getAccountStatus,
  getGender,
  getPatientPaymentType,
} from './patientImporterConfig'
import { createPrismaQueryEventHandler } from 'prisma-query-log'
import differentPatientDef from './differentPatient.json'

//-----------------------------------------------------------------------------
// 各種定義
//-----------------------------------------------------------------------------
// ツールで使用するprismaのインスタンス
const loaderPrisma = new PrismaClient({ log: [{ level: 'query', emit: 'event' }] })
// 数字のみで構成されているかを判断するための正規表現
const NUM_REG = /^[0-9]+$/

//-----------------------------------------------------------------------------
// 関数定義
//-----------------------------------------------------------------------------
/**
 * メイン処理を実行します。
 */
const execute = async () => {
  logging('INF', '★★★ 患者データ移行処理を開始します ★★★')

  // 施設コード管理リストを取得
  logging('INF', '施設コード管理の全レコードを取得します')
  const codeManageList = await loaderPrisma.healthFacilityCodeManage.findMany()
  const manageList: any[] = []
  // 施設関連薬局リストを取得
  logging('INF', '施設関連薬局の全レコードを取得します')
  const facilityRelateList = await loaderPrisma.healthFacilityRelatePharmacy.findMany({
    include: { pharmacy: true, healthFacility: true },
  })

  // 入居者CSVから患者の一時データを作成
  const caulPatientList: CaulPatient[] = []
  const tempPatientList = await createTmpPatientList(CAUL_CSV_PATH, caulPatientList)
  // 請求CSVから患者の一時データに生年月日と性別を設定
  await addInformationByBillCsv(BILL_CSV_PATH, tempPatientList, caulPatientList)
  logging('INF', `CAUL患者データを登録します ${caulPatientList.length}件`)
  await loaderPrisma.caulPatient.createMany({ data: caulPatientList })
  const excludeList = tempPatientList.filter((p) => !p.birthDate).map((p) => p.patientName + '(' + p.patientCode + ')')
  logging(
    'TRC',
    `生年月日が未設定の情報 (${excludeList.length} / ${tempPatientList.length}): ${excludeList.join(', ')}`,
  )
  // ソート（患者名, （生年月日）, 住所, 前回請求締年月日）
  const sortedPatientList = sortTempPatientList(tempPatientList)

  // 一時データをもとにデータを作成
  logging('INF', '一時データをもとに各種登録・更新用データを作成します')
  let lastTempPatient: TmpPatientModel | null = null
  let lastPatient: PatientInputModel | null = null
  const patientList: PatientInputModel[] = []
  for (const tempPatient of sortedPatientList) {
    // シーケンス番号に最大値を設定
    setMaxSeq(tempPatient, codeManageList, manageList)

    // 同一患者処理
    if (lastTempPatient !== null) {
      if (checkSamePatient(tempPatient, lastTempPatient)) {
        lastPatient = patientList[patientList.length - 1]
        doSamePatient(tempPatient, lastPatient, facilityRelateList)
        lastTempPatient = tempPatient
        continue
      }
    }
    // 同一患者終了処理
    setLastRelateFacilityReason(lastPatient, lastTempPatient)

    // 患者と関連データを作成
    const patient = createPatientInput(tempPatient, facilityRelateList)
    patientList.push(patient)
    lastTempPatient = tempPatient
    lastPatient = patient
  }

  // 情報をDBに反映
  await affectDB(patientList, manageList)

  logging('INF', '★★★ 患者データ移行処理が完了しました ★★★')
}

/**
 * CSVレコードからヘッダに一致いる値をを取得します。
 * @param key キー
 * @param record CSVレコード
 */
const getVal = (key: string, record: any) => {
  if (key in record) {
    return record[key].trim()
  }
  if (key !== '来局日') {
    throw new Error(`期待した項目を取得できませんでした key=${key}, record=${JSON.stringify(record)}`)
  }
  return ''
}

/**
 * CSVファイルを読み込み患者一時データのリストを作成します。
 * @param csvPath CSVファイルを格納したパス
 * @returns 患者一時データのリスト
 */
const createTmpPatientList = async (csvPath: string, caulList: CaulPatient[]): Promise<TmpPatientModel[]> => {
  // 薬局の一覧データを取得（会社の施設コードグループIDを取得するため）
  logging('INF', '薬局の全レコードを取得します')
  const pharmacyList = (await loaderPrisma.pharmacy.findMany({
    include: { company: true },
  })) as PharmacyData[]
  // 施設の一覧を取得（施設IDを取得するため）
  logging('INF', '施設の全レコードを取得します')
  const facilityList = await loaderPrisma.healthFacility.findMany({
    include: { healthFacilityCodeManage: true },
  })

  // 入力ファイルのリストを取得
  const csvFileList = fs
    .readdirSync(csvPath)
    .filter((file) => {
      return fs.statSync(path.join(csvPath, file)).isFile() && file.endsWith('.csv')
    })
    .map((file) => path.join(csvPath, file))

  const tmpPatientList: TmpPatientModel[] = []
  let hasError = false
  csvFileList.forEach((csvFile) => {
    // CSVファイルを読み込み
    logging('INF', `入居者CSVファイルを読み込み一時情報を作成します ⇒ ${csvFile}`)
    const rawData = fs.readFileSync(csvFile)
    // 文字コード変換
    const csvData = iconv.decode(rawData, 'ms932')
    // パース
    const records = parse(csvData, { columns: true })
    // レコードから一時情報を作成
    for (const record of records) {
      // 患者コードが4桁以下の場合は無視する
      if (
        getVal('分類CD2', record) !== '1' ||
        getVal('施設名', record) === '外来' ||
        getVal('部門CD', record) === '999' ||
        getVal('得意先CD', record).length <= 4
      ) {
        // ・「1: 請求対象者, 2: 外来」のため1以外は管理対象外とする
        // ・施設名が「外来」の場合も管理対象外とする
        // ・部門CDが「999」も対象外とする
        // ・患者コードが4桁以下の場合も対象外とする
        const info = `患者=${getVal('得意先名', record)}(${getVal('得意先CD', record)}), 分類=${getVal(
          '分類名2',
          record,
        )}, 施設名=${getVal('施設名', record)}, 部門CD=${getVal('部門CD', record)}`
        logging('DBG', `対象外: ${info}`)
        continue
      }
      const caulPatient = createCaulPatient(record, csvFile)
      const existCode = caulList.find((c) => c.code === caulPatient.code)
      if (existCode) {
        if (removeSeparator(caulPatient.name) === removeSeparator(existCode.name)) {
          logging(
            'DEB',
            `別店舗のデータと同じものが存在するためスキップ データ=${caulPatient.fileName}, スキップ=${existCode.fileName}`,
          )
          continue
        }
        logging('ERR', '同じ患者コードが存在しています')
        logging('INF', JSON.stringify(existCode))
        logging('INF', JSON.stringify(caulPatient))
        hasError = true
      } else {
        caulList.push(caulPatient)
      }
      // 正しいデータが出来た場合のみデータを追加
      const tmpPatient = convertTmpPatientModel(record, pharmacyList, facilityList)
      if (tmpPatient) {
        tmpPatientList.push(tmpPatient)
      } else {
        logging('DBG', `患者データ生成不可: ${JSON.stringify(record)}`)
      }
    }
  })
  if (hasError) {
    throw new Error('同一患者コードを持つ入居者データが存在します')
  }
  return tmpPatientList
}

/**
 * レコード情報を一時データに変換します。
 * @param record CSVレコードデータ（JSON）
 * @param pharmacyList 薬局リスト
 * @param facilityList 施設リスト
 * @returns 一時データ
 */
const convertTmpPatientModel = (
  record: any,
  pharmacyList: PharmacyData[],
  facilityList: FaciltyData[],
): TmpPatientModel | null => {
  const patientName = getVal('得意先名', record).replace(/\s/g, '　') // 氏名の間にスペースが入っている場合は全角に統一
  const patientKana = getVal('得意先名カナ', record)
  // 名前に数字のみが設定されている場合、備考が未設定なら備考に内容を設定
  if (NUM_REG.test(patientKana) && getVal('備考', record) === '') {
    record['備考'] = patientKana
  }
  const address = getAddress(record)
  const comment = getVal('申し送り', record)
  const tempPatient: TmpPatientModel = {
    patientCode: getVal('得意先CD', record),
    patientName: patientName,
    patientKana: patientKana,
    billName: getVal('送付先宛名', record) !== '' ? getVal('送付先宛名', record) : patientName,
    trimName: removeSeparator(patientName) as string,
    postalCode: getVal('郵便番号', record),
    address1: address,
    address2: getVal('住所2', record),
    tel: getVal('TEL1', record),
    deptCode: getVal('部門CD', record),
    deptName: getVal('部門名', record),
    pharmacyId: '', // 後で設定
    healthFacilityCodeGroupId: '', // 後で設定
    healthFacilityCode: getVal('施設CD', record),
    healthFacilityName: getVal('施設名', record),
    healthFacilityId: '', // 後で設定
    paymentType: getPatientPaymentType(getVal('分類CD3', record)),
    accountConfirmStatus: getAccountStatus(getVal('分類CD4', record)),
    accountManageId: '', // 後で設定
    lastBillDate: convertDate(getVal('前回請求締年月日', record)),
    consentConfirm: getVal('同意書CD', record) === '1',
    insuranceConfirm: getVal('保険書CD', record) === '1',
    note: getVal('備考', record),
    comment: comment,
    notActive: comment.includes('逝去') || comment.includes('退居') || comment.includes('退去'),
    seqNo: getSeqNo(getVal('得意先CD', record)),
  }
  // 判明済みの特殊処理
  // 明らかに0を多く入力したミスだと考えられるので修正
  if (tempPatient.patientCode === '490033' && tempPatient.postalCode === '181-00014') {
    record['郵便番号'] = '181-0014'
    tempPatient.postalCode = '181-0014'
  }
  // 部門CDと初期登録マスタデータから店舗IDを取得して設定
  tempPatient.pharmacyId = findPharmacyId(tempPatient.deptCode, tempPatient.deptName)
  // 施設コードグループIDを取得して設定
  const pharmacy = pharmacyList.find((p) => p.id === tempPatient.pharmacyId)
  if (!pharmacy) {
    throw new Error(
      `薬局情報を取得できませんでした 部門CD=${getVal('部門CD', record)}, 部門名=${getVal('部門名', record)}, ID=${
        tempPatient.pharmacyId
      }`,
    )
  }
  tempPatient.healthFacilityCodeGroupId = pharmacy.company.healthFacilityCodeGroupId
  // 施設IDを取得して設定
  const code = getVal('施設CD', record)
  const simpleCode = Number(code).toString()
  const facility = facilityList.find(
    (f) =>
      (f.code === code || f.code === simpleCode) &&
      f.healthFacilityCodeManage.find((g) => g.healthFacilityCodeGroupId === tempPatient.healthFacilityCodeGroupId),
  )
  if (facility) {
    tempPatient.healthFacilityId = facility.id
  }
  // 振替口座管理IDを薬局から設定
  tempPatient.accountManageId = pharmacy.withdrawalAccountManageId
  // 不正なデータがあったらスキップする
  if (validateData(record, facility, tempPatient)) {
    return null
  }

  return tempPatient
}

/**
 * 住所を取得します。
 * <p><
 * 判明済みの同一患者は、同じ住所を設定することにより、
 * のちの処理で同一患者とみなされるようになる
 * /p>
 * @param record  CSVレコード
 */
const getAddress = (record: any): string => {
  // 基本変換
  const address = convertAlphaNumZenToHan(record['住所1'])
    .trim()
    .replace(/Ⅰ/g, 'I')
    .replace(/－/g, '-')
    .replace(/　/g, ' ')
    .replace(/ケ谷/g, 'ヶ谷')

  // 特殊処理を行い同じ住所を設定することにより、同一患者とみなすようにする
  const code = getVal('得意先CD', record)
  const name = removeSeparator(getVal('得意先名', record))
  // 嶋田キミ子(1630026, 1190013)（申し送り「施設本人宛からご家族へ送付先変更」）
  if (code === '1190013' && name === '嶋田キミ子') {
    record['送付先宛名'] = '嶋田　薫'
    // 同じ郵便番号
    return '埼玉県川口市戸塚東2-9-25'
  }
  // 市原徳子(1600052, 1220052)（申し送り「旧〒252-0318 神奈川県相模原市南区上鶴間本町9-27-9」）
  if ((code === '1220052' || code === '1600052') && name === '市原徳子') {
    record['送付先宛名'] = '行政書士　横山　正直'
    record['郵便番号'] = '252-0303'
    // 1600052 には県が記載されていないため県を付与した値を 1600052 にも設定
    return '神奈川県相模原市南区相模大野7-24-12-202'
  }
  // 横山きよ子(2020072, 880018)（送付先名が同じで住所の最後1桁の数字が異なるのみなので記載ミスと判断）
  if (code === '880018' && name === '横山きよ子') {
    // 同じ郵便番号
    return '東京都中野区若宮1-56-8'
  }
  // 伊澤隆(1980066, 2030025)（送付先名が同じで住所の最後1桁の数字が異なるのみなので記載ミスと判断）
  if (code === '2030025' && name === '伊澤隆') {
    // 同じ郵便番号
    return '東京都杉並区松庵1-15-26'
  }
  // 真嶋淑(1140002, 350080)（350080 の住所1と2を分離させた方が正解と思われるので統一する）
  if ((code === '350080' || code === '1140002') && name === '真嶋淑') {
    record['住所2'] = 'C-1501'
    return '埼玉県さいたま市南区沼影1-11-2'
  }
  // 若月啓子(2270091, 1120077), 若月敬一(2270092, 1120078)（夫婦で同じ住所から同じ住所になっているので同一人物と判断）
  if ((code === '1120077' && name === '若月啓子') || (code === '1120078' && name === '若月敬一')) {
    record['郵便番号'] = '181-0002'
    record['住所2'] = 'ソナーレアテリア久我山223号室'
    return '東京都三鷹市牟礼1-3-15'
  }
  // 髙橋孝太郎(770072, 7770185)（「旧）東京都練馬区東大泉1-12-4　セレ２Ｄ／髙橋瑠美子」とある）
  if (code === '770072' && name === '髙橋孝太郎') {
    record['送付先宛名'] = '髙橋　孝太郎'
    // 同じ郵便番号
    return '東京都練馬区東大泉1-12-3'
  }
  // 安井不二子(2020064, 2270016, 2020009)（転居の記述に整合性がある）
  if ((code === '2270016' || code === '2020009') && name === '安井不二子') {
    record['送付先宛名'] = '安井　俊一'
    record['郵便番号'] = '188-0013'
    return '東京都西東京市向台町5-4-22'
  }
  // 安井一雄(2020008, 2270041, 880074)（転居の記述に整合性がある）
  if ((code === '2020008' || code === '2270041') && name === '安井一雄') {
    record['送付先宛名'] = '安井　俊一'
    record['郵便番号'] = '188-0013'
    return '東京都西東京市向台町5-4-22'
  }
  // 正木昇(1830016, 1002823)1002823の備考に「所沢№1830016」の記載有
  if ((code === '1830016' || code === '1002823') && name === '正木昇') {
    record['送付先宛名'] = '正木　昇'
    record['郵便番号'] = '190-0021'
    return '東京都立川市羽衣町2-1-32'
  }
  return address
}

/**
 * データのバリデーションを行います。
 * @param record CSVレコードデータ
 * @param facility 施設
 * @param tempPatient 患者一時情報
 * @returns NGがある場合にtrue を返す
 */
const validateData = (record: any, facility: FaciltyData | undefined, tempPatient: TmpPatientModel) => {
  let invalid = false
  const patientInfo = `患者=${getVal('得意先名', record)}（${getVal('得意先CD', record)}）`
  const recordInfo = `一時情報=${JSON.stringify(tempPatient)}`
  if (!facility) {
    logging('WRN', `施設が見つからない ${patientInfo}, ${recordInfo}`)
    invalid = true
  }
  // サイズをチェック
  if (getVal('得意先CD', record).length > 8) {
    logging('WRN', `患者コードが8桁以上あります ${patientInfo}, ${recordInfo}`)
    invalid = true
  }
  if (getVal('得意先名', record).length > 64) {
    logging('WRN', `患者名が64桁以上あります ${patientInfo}, ${recordInfo}`)
    invalid = true
  }
  const post = getVal('郵便番号', record)
  if (post.length > 8) {
    logging('WRN', `郵便番号が8桁以上あります ${patientInfo}, 郵便番号=${post}, ${recordInfo}`)
    invalid = true
  }
  const adr1 = getVal('住所1', record)
  const adr2 = getVal('住所2', record)
  if (adr1.length > 128 || adr2.length > 128) {
    logging('WRN', `住所が128桁以上あります ${patientInfo}, 住所=<${adr1}, ${adr2}, ${recordInfo}>`)
    invalid = true
  }
  const tel = getVal('TEL1', record)
  if (tel.length > 16) {
    logging('WRN', `電話番号が16桁以上あります ${patientInfo}, 電話番号=${tel}, ${recordInfo}`)
    invalid = true
  }
  return invalid
}

/**
 * 日付に変換します。
 * @param val 日付文字列
 * @returns 日付またはnull
 */
const convertDate = (val: string) => {
  if (!val || val === '') {
    return null
  }
  return new Date(val)
}

/**
 * 患者番号から施設コードを除いたシーケンス番号を取得します。
 * @param code 患者番号
 * @returns シーケンス番号
 */
const getSeqNo = (code: string) => {
  const len = code.length
  const no = code.substring(len - 4)
  return Number.parseInt(no)
}

/**
 * 患者一時リストをソートします。
 * <p>
 * 患者データを作成する際に同一人物かどうかを連続するデータの前情報をもとに判断する。
 * 前回請求締年月日を最後に加えることで、同一人物だった場合はその変遷の順番が明確になる。
 * </p>
 * @param tmpPatientList 患者一時リスト
 * @returns ソートしたリスト
 */
const sortTempPatientList = (tmpPatientList: TmpPatientModel[]): TmpPatientModel[] => {
  logging('INF', '一時データを患者名・（生年月日）・住所・前回請求締年月日でソートします')
  return tmpPatientList.sort((p1, p2) => {
    // 氏名
    if (p1.trimName < p2.trimName) {
      return -1
    } else if (p1.trimName > p2.trimName) {
      return 1
    }
    // 生年月日が設定されている場合
    if (p1.birthDate && p2.birthDate) {
      if (p1.birthDate.getTime() < p2.birthDate.getTime()) {
        return -1
      } else if (p1.birthDate.getTime() > p2.birthDate.getTime()) {
        return 1
      }
    } else if (p1.birthDate) {
      return -1
    } else if (p2.birthDate) {
      return 1
    }
    // 住所
    if (p1.address1 < p2.address1) {
      return -1
    } else if (p1.address1 > p2.address1) {
      return 1
    }
    // 前回請求締年月日
    if (p1.lastBillDate !== null && p2.lastBillDate !== null) {
      if (p1.lastBillDate.getTime() < p2.lastBillDate.getTime()) {
        return -1
      } else if (p1.lastBillDate.getTime() > p2.lastBillDate.getTime()) {
        return 1
      }
    } else if (p1.lastBillDate !== null && p2.lastBillDate === null) {
      return -1
    } else if (p1.lastBillDate === null && p2.lastBillDate !== null) {
      return 1
    }
    return 0
  })
}

/**
 * 請求CSVから生年月日と性別を設定します。
 * @param csvPath 請求CSVパス
 * @param tempPatientList 患者一時情報リスト
 */
const addInformationByBillCsv = async (
  csvPath: string,
  tempPatientList: TmpPatientModel[],
  caulList: CaulPatient[],
) => {
  // 入力ファイルのリストを取得
  const csvFileList = getFileNames(csvPath)

  const doneCodeList: string[] = []
  csvFileList.forEach((csvFile) => {
    // CSVファイルを読み込み
    logging('INF', `請求CSVファイルを読み込み一時情報に値を設定します ⇒ ${csvFile}`)
    const rawData = fs.readFileSync(csvFile)
    // 文字コード変換
    let csvData = iconv.decode(rawData, 'ms932')
    // 一部データに項目数が異なるデータが紛れているので、そのデータは無視して処理をするようにする
    const lines = csvData.split('\r\n')
    const excludeInvalidLines: string[] = []
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const items = line.split(',')
      // 正しい項目数は 142 項目、何もない行はオプションで取り除くため 1 となったデータは正常として扱う
      if (items.length === 142 || items.length === 1) {
        excludeInvalidLines.push(line)
      } else {
        logging('WRN', `項目数が異なる行があったため取り除きます 行=${i + 1}, 項目数=${items.length}`)
      }
    }
    csvData = excludeInvalidLines.join('\r\n')
    // パース
    // 請求CSVは「合計」と「総合計」の間の行が改行だけの場合とカンマの羅列の場合の2パターンが存在している
    // 改行だけの場合はCSVとして解析できずにエラーとなってしまうため「skipEmptyLines」を設定
    let records: any = null
    try {
      records = parse(csvData, { columns: true, fromLine: 3, skipEmptyLines: true })
    } catch (e) {
      logging('WRN', 'パース失敗: ' + e)
      return
    }
    // レコードから情報を取得
    for (const record of records) {
      // データ部分が終わったらそのファイルは終了
      const comingDate = getVal('来局日', record)
      if (comingDate === '') {
        break
      }
      const code = getVal('患者番号', record)
      // すでに処理した患者はスキップ
      if (doneCodeList.includes(code)) {
        continue
      }
      doneCodeList.push(code)
      const tempPatient = tempPatientList.find((p) => p.patientCode === code)
      if (tempPatient) {
        // レセコンのデータの方が信頼できるのでコードが一致したら名前を上書
        tempPatient.patientName = getVal('氏名', record)
        tempPatient.patientKana = convertKanaHanToZen(getVal('カナ氏名', record))
        // CAULデータには存在しない生年月日と性別を設定
        tempPatient.birthDate = new Date(getVal('生年月日', record))
        tempPatient.gender = getGender(getVal('性別', record))
        logging(
          'TRC',
          `付加情報を設定しました ${tempPatient.patientName}(${tempPatient.patientCode}), ${format(
            tempPatient.birthDate,
            'yyyy/MM/dd',
          )}`,
        )
      }
      const caulPatient = caulList.find((c) => c.code === code)
      if (caulPatient) {
        caulPatient.nameKana = getVal('カナ氏名', record)
        caulPatient.birthday = new Date(getVal('生年月日', record))
        caulPatient.gender = getVal('性別', record)
      }
    }
  })
}

const createCaulPatient = (record: any, fileName: string): CaulPatient => {
  return {
    code: record['得意先CD'],
    name: record['得意先名'],
    nameKana: record['得意先名カナ'],
    gender: '',
    birthday: null,
    postalCode: record['郵便番号'],
    address1: record['住所1'],
    address2: record['住所2'],
    shopCd: record['部門CD'],
    shopName: record['部門名'],
    classCd1: record['分類CD1'],
    className1: record['分類名1'],
    classCd2: record['分類CD2'],
    className2: record['分類名2'],
    classCd3: record['分類CD3'],
    className3: record['分類名3'],
    classCd4: record['分類CD4'],
    className4: record['分類名4'],
    classCd5: record['分類CD5'],
    className5: record['分類名5'],
    billType: record['請求書種類'],
    billTypeName: record['請求書種類名'],
    lastBillDay: record['前回請求締年月日'] === '' ? null : new Date(record['前回請求締年月日']),
    note: record['備考'],
    facilityCd: record['施設CD'],
    facilityName: record['施設名'],
    deliverryName: record['送付先宛名'],
    consentCd: record['同意書CD'],
    consentName: record['同意書名'],
    insuranceCd: record['保険書CD'],
    insuranceName: record['保険書名'],
    billIssueCd: record['請求書発行CD'],
    billIssueName: record['請求書発行名'],
    comment: record['申し送り'],
    createdAt: new Date(record['登録日時']),
    updatedAt: new Date(record['更新日時']),
    fileName: fileName,
  }
}

const getFileNames = (dirPath: string) => {
  const allDirs = fs.readdirSync(dirPath, { withFileTypes: true })
  const files: string[] = []
  for (const dirent of allDirs) {
    if (dirent.isDirectory()) {
      const fp = path.join(dirPath, dirent.name)
      getFileNames(fp).forEach((f) => files.push(f))
    } else if (dirent.isFile() && ['.csv'].includes(path.extname(dirent.name))) {
      files.push(path.join(dirPath, dirent.name))
    }
  }
  return files.flat()
}

/**
 * 施設コード管理のシーケンス値を設定します。
 * @param tempPatient 患者一時情報
 * @param codeMangeList 施設コード管理リスト
 * @param manageList 施設コード管理更新用データ
 */
const setMaxSeq = (tempPatient: TmpPatientModel, codeMangeList: HealthFacilityCodeManage[], manageList: any[]) => {
  // 施設コード管理の特定
  const manageRef = codeMangeList.find(
    (m) =>
      m.healthFacilityCodeGroupId === tempPatient.healthFacilityCodeGroupId &&
      m.healthFacilityId === tempPatient.healthFacilityId,
  )
  if (manageRef) {
    let manageInput = manageList.find((m) => m.where.id === manageRef.id)
    if (!manageInput) {
      manageInput = {
        where: { id: manageRef.id },
        data: { sequenceNo: manageRef.sequenceNo },
      }
      manageList.push(manageInput)
    }
    // 処理対象のシーケンス番号の方が大きい場合は入れ替える
    const nowSeq = manageInput.data.sequenceNo
    if (nowSeq < tempPatient.seqNo) {
      manageInput.data.sequenceNo = tempPatient.seqNo
    }
  } else {
    throw new Error(
      `一致する施設コード管理が存在しませんでした グループID=${tempPatient.healthFacilityCodeGroupId}, 施設ID=${
        tempPatient.healthFacilityId
      }, 一時患者情報=${JSON.stringify(tempPatient)}`,
    )
  }
}

/**
 * 患者一時情報から患者情報を生成します。
 * @param tempPatient 患者一時情報
 * @param facilityRelateList 施設関連薬局リスト
 * @returns 患者情報
 */
const createPatientInput = (
  tempPatient: TmpPatientModel,
  facilityRelateList: FacilityRelateData[],
): PatientInputModel => {
  // カナは全角に変換
  const nameKana = convertKanaHanToZen(tempPatient.patientKana)
  const patient: PatientInputModel = {
    id: createId(),
    healthFacilityId: tempPatient.healthFacilityId,
    code: tempPatient.patientCode,
    status: PatientStatus.INRESIDENCE,
    // 氏名
    name: tempPatient.patientName,
    nameKana: nameKana,
    // 検索用氏名はスペースを取り除いた氏名とカナを連結したもの
    searchName: convertSearchName(tempPatient.trimName, nameKana),
    // 性別は請求CSVから設定されていなければ不明を設定
    gender: tempPatient.gender ? tempPatient.gender : PatientGender.UNCERTAIN,
    // 生年月日は請求CSVから設定されていなければ null
    birthday: tempPatient.birthDate ? tempPatient.birthDate : null,
    // 請求可否フラグは同意書と保険が確認済みであれば true とする
    billEnableFlag: tempPatient.consentConfirm && tempPatient.insuranceConfirm,
    // 保険系のチェック項目は保険書CDがありの場合は一律確認済み
    medicalInsuranceStatus: tempPatient.insuranceConfirm
      ? PatientMedicalInsuranceStatus.CONFIRMED
      : PatientMedicalInsuranceStatus.UNCONFIRMED,
    medicalShareConfirmDate: tempPatient.insuranceConfirm ? DEFAULT_START_DATE : null,
    nursingInsuranceStatus: tempPatient.insuranceConfirm
      ? PatientMedicalInsuranceStatus.CONFIRMED
      : PatientMedicalInsuranceStatus.UNCONFIRMED,
    nursingShareConfirmDate: tempPatient.insuranceConfirm ? DEFAULT_START_DATE : null,
    // 公費はデフォルトを設定（保険書CDと同意書CDがともに「あり」の場合に false、そうでない場合は null を設定）
    publicExpense: tempPatient.consentConfirm && tempPatient.insuranceConfirm ? false : null,
    // 同意書チェック項目は同意書CDがありの場合は回収済み
    consentStatus: tempPatient.consentConfirm ? PatientConsentStatus.COLLECTED : PatientConsentStatus.UNCOLLECTED,
    // 支払い種別
    paymentType: tempPatient.paymentType,
    // 口振
    accountConfirmStatus: tempPatient.accountConfirmStatus,
    accountManageId:
      tempPatient.accountConfirmStatus === PatientAccountConfirmStatus.AVAILABLE ? tempPatient.accountManageId : null,
    // 請求先情報
    deliveryName: tempPatient.billName,
    deliveryPostalCode: tempPatient.postalCode,
    deliveryAddress1: tempPatient.address1,
    deliveryAddress2: tempPatient.address2,
    deliveryTel: tempPatient.tel,
    // 備考
    healthFacilityInfo: getFacilityComment(tempPatient.note),
    note: getNote(tempPatient.note, tempPatient.comment),
    // レセコン同期フラグは請求CSVに一致する患者コードがあった場合（生年月日が設定されている）に立てる
    receiptSyncFlag: tempPatient.birthDate !== undefined,
    patientRelateHealthFacility: [],
    tempLastBillDate: tempPatient.lastBillDate,
  }
  setCommonColumns(patient)
  // 逝去されている場合はステータスを変更
  if (tempPatient.note.includes('逝去') || tempPatient.comment.includes('逝去')) {
    patient.status = PatientStatus.DECEASE
  }
  logging(
    'TRC',
    `患者を追加 (氏名=${patient.name}, コード=${patient.code}, 請求先=(${patient.deliveryName}, ${patient.deliveryPostalCode}, ${patient.deliveryAddress1}, ${patient.deliveryAddress2}, ${patient.deliveryTel}), 支払い種別=${patient.paymentType}, 振替口座管理ID=${patient.accountManageId}, 備考=${patient.note}`,
  )
  // 患者関連施設
  addPatientRelateHealthFacility(patient, tempPatient, facilityRelateList)
  return patient
}

/**
 * 備考に「階」「号」「室」「部屋」が含まれている場合、または数字のみの場合は施設情報と判定する
 * @param val 備考の値
 * @returns 施設情報と判定した場合にtrue
 */
const isFacilityComment = (val: string) => {
  return val !== '' && (val.includes('階') || val.includes('号') || val.includes('室') || NUM_REG.test(val))
}

const getFacilityComment = (val: string) => {
  return isFacilityComment(val) ? val : null
}

const getNote = (note: string, comment: string) => {
  const isFacility = isFacilityComment(note)
  let message = ''
  if (note !== '' && !isFacility) {
    message = `備考: ${note}`
  }
  if (comment !== '') {
    if (message !== '') {
      message = message + '\n'
    }
    message = message + `申し送り: ${comment}`
  }
  return message
}

/**
 * 患者関連施設情報を作成し患者情報に追加します。
 * @param patient 患者情報
 * @param tempPatient 患者一時情報
 * @param faciltyRelateList 施設関連薬局リスト
 */
const addPatientRelateHealthFacility = (
  patient: PatientInputModel,
  tempPatient: TmpPatientModel,
  faciltyRelateList: FacilityRelateData[],
) => {
  // 施設関連薬局を取得
  const facilityRelatePharmacy = faciltyRelateList.find(
    (r) => r.healthFacilityId === tempPatient.healthFacilityId && r.pharmacyId === tempPatient.pharmacyId,
  )
  if (!facilityRelatePharmacy) {
    const ph = `${tempPatient.deptName}(${tempPatient.pharmacyId})`
    const f = `${tempPatient.healthFacilityName}(${tempPatient.healthFacilityCode})`
    const p = `${tempPatient.patientName}(${tempPatient.patientCode})`
    logging('WRN', `施設関連薬局が見つからないため患者関連施設は作成しません\t${ph}\t${f}\t${p}`)
    return false
  }

  // デフォルトの開始・終了日を施設関連薬局より設定
  const relateFacility: PatientRelateHealthFacilityInputModel = {
    id: createId(),
    patientId: patient.id,
    healthFacilityId: tempPatient.healthFacilityId,
    patientCode: tempPatient.patientCode,
    startDate: facilityRelatePharmacy.startDate,
    endDate: facilityRelatePharmacy.endDate,
  }
  setCommonColumns(relateFacility)

  if (patient.patientRelateHealthFacility) {
    if (patient.patientRelateHealthFacility && patient.patientRelateHealthFacility.length > 0) {
      const beforeFacility = patient.patientRelateHealthFacility[patient.patientRelateHealthFacility.length - 1]
      // 前の関連に退居理由を設定（同じ施設IDだったら店舗が変わったということ）
      //（施設IDと患者コードの組み合わせが存在しない場合にこの関数に入ってくるので）
      beforeFacility.reason =
        beforeFacility.healthFacilityId === tempPatient.healthFacilityId
          ? PatientRelateHealthFacilityReason.CHANGE_PHARMACY
          : PatientRelateHealthFacilityReason.RELOCATION
      if (patient.tempLastBillDate) {
        // 前回請求締年月日がある場合、直前の終了日にその月末日付を、該当の開始日にその翌日を設定
        beforeFacility.endDate = endOfMonth(patient.tempLastBillDate)
        relateFacility.startDate = addDays(beforeFacility.endDate, 1)
      } else {
        // 前回請求締年月日がない場合、直前の終了日に開始日の月末を、該当の開始日にその翌日を設定
        beforeFacility.endDate = subDays(addMonths(beforeFacility.startDate, 1), 1)
        relateFacility.startDate = addDays(beforeFacility.endDate, 1)
      }
    }
    patient.patientRelateHealthFacility.push(relateFacility)
    patient.tempLastBillDate = tempPatient.lastBillDate
  }
  logging(
    'TRC',
    `関連施設を追加 (${facilityRelatePharmacy.healthFacility.name}(${
      facilityRelatePharmacy.healthFacility.code
    }), 開始日=${format(relateFacility.startDate, 'yyyy/MM/dd')}, 終了日=${format(
      relateFacility.endDate,
      'yyyy/MM/dd',
    )})`,
  )
  return true
}

/**
 * 患者が直前の患者と同じかどうかを判定します。
 * @param tempPatient 対象患者一時情報
 * @param lastTempPatient 直前患者一時情報
 * @returns 同じ場合に true を返す
 */
const checkSamePatient = (tempPatient: TmpPatientModel, lastTempPatient: TmpPatientModel): boolean => {
  // 生年月日と性別がそれぞれ設定されていて値が異なる場合は違う患者
  if (
    (tempPatient.birthDate &&
      lastTempPatient.birthDate &&
      tempPatient.birthDate.getTime() !== lastTempPatient.birthDate.getTime()) ||
    (tempPatient.gender && lastTempPatient.gender && tempPatient.gender !== lastTempPatient.gender)
  ) {
    return false
  }
  const patientInfo = `${tempPatient.patientName}(${tempPatient.patientCode})`
  // 患者コードが同じ場合
  if (tempPatient.patientCode === lastTempPatient.patientCode) {
    logging('DBG', `コードが同じ患者 ${patientInfo}`)
    return true
  }

  // 名前が同じでない場合は異なる患者
  const nameMatch = tempPatient.trimName === lastTempPatient.trimName
  const kanaMatch = removeSeparator(tempPatient.patientKana) === removeSeparator(lastTempPatient.patientKana)
  if (!nameMatch && !kanaMatch) {
    return false
  }

  // 生年月日と性別がそれぞれ設定されていて同じ値か
  const matchedBirthGender =
    tempPatient.birthDate &&
    lastTempPatient.birthDate &&
    tempPatient.birthDate.getTime() === lastTempPatient.birthDate.getTime() &&
    tempPatient.gender &&
    lastTempPatient.gender &&
    tempPatient.gender === lastTempPatient.gender
  // 住所は都道府県無しの場合が存在して一致しないというパターンが合ったので一方がもう一方にすべて含まれていれば一致
  const matchedAddress =
    tempPatient.address1 === lastTempPatient.address1 ||
    (tempPatient.address1 !== '' &&
      lastTempPatient.address1 !== '' &&
      (tempPatient.address1.includes(lastTempPatient.address1) ||
        lastTempPatient.address1.includes(tempPatient.address1)))
  // 住所が一致していれば長い方が都道府県ありの住所となるので患者一時情報に設定
  if (matchedAddress && tempPatient.address1.length < lastTempPatient.address1.length) {
    tempPatient.address1 = lastTempPatient.address1
  }
  // 生年月日、性別、住所が同じ患者は同一の患者
  if (matchedBirthGender && matchedAddress) {
    logging('DBG', `生年月日、性別、住所が同じ患者 ${patientInfo}`)
    return true
  }
  // 生年月日と性別が未設定のものがある場合は住所が一致すれば同一の患者と判定
  if (
    (!tempPatient.birthDate || !lastTempPatient.birthDate || !tempPatient.gender || !lastTempPatient.gender) &&
    matchedAddress
  ) {
    logging('DBG', `生年月日と性別が未設定のものがある場合は住所が一致すれば同一の患者 ${patientInfo}`)
    return true
  }
  // 生年月日と性別と（カナ）氏名が一致すれば同一の患者
  if (matchedBirthGender) {
    if (
      differentPatientDef.includes(tempPatient.patientCode) &&
      differentPatientDef.includes(lastTempPatient.patientCode)
    ) {
      logging('DBG', `生年月日と性別と（カナ）氏名が一致すしているが設定に定義があるため別患者とする ${patientInfo}`)
      return false
    }
    logging('DBG', `生年月日と性別と（カナ）氏名が一致すれば同一の患者`)
    logging(
      'INF',
      `${tempPatient.patientCode}\t${tempPatient.patientName}\t${tempPatient.patientKana}\t${tempPatient.healthFacilityName}\t${tempPatient.address1}`,
    )
    logging(
      'INF',
      `${lastTempPatient.patientCode}\t${lastTempPatient.patientName}\t${lastTempPatient.patientKana}\t${lastTempPatient.healthFacilityName}\t${lastTempPatient.address1}`,
    )
    return true
  }
  return false
}

/**
 * 同一患者の場合に行う処理を実行します。
 * @param tempPatient 対象の患者一時情報
 * @param lastPatient 患者
 * @param facilityRelateList 施設関連薬局リスト
 */
const doSamePatient = (
  tempPatient: TmpPatientModel,
  lastPatient: PatientInputModel,
  facilityRelateList: FacilityRelateData[],
) => {
  // 施設IDと患者コードの組み合わせが該当患者の関連施設にない場合は患者関連施設を追加
  let addResult = true
  if (
    lastPatient.patientRelateHealthFacility?.find(
      (r) => r.healthFacilityId === tempPatient.healthFacilityId && r.patientCode === tempPatient.patientCode,
    ) === undefined
  ) {
    addResult = addPatientRelateHealthFacility(lastPatient, tempPatient, facilityRelateList)
  }
  // 施設関連薬局が見つからない場合は患者関連施設は作成しないので情報を更新しない
  if (!addResult) {
    return
  }
  // 施設ID
  lastPatient.healthFacilityId = tempPatient.healthFacilityId
  // 施設情報（備考）
  if (isFacilityComment(tempPatient.note)) {
    lastPatient.healthFacilityInfo = tempPatient.note
  }
  // 最新の患者コードに変更（古いコードは患者コード履歴に存在）
  lastPatient.code = tempPatient.patientCode
  // 古い順にソートされているので更新すべき内容を置き換える
  // 氏名カナ（元が連携されていないか対象が連携されている場合）
  if (tempPatient.patientKana !== '' && (!lastPatient.receiptSyncFlag || tempPatient.birthDate)) {
    const nameKana = convertKanaHanToZen(tempPatient.patientKana)
    lastPatient.nameKana = nameKana
    lastPatient.searchName = convertSearchName(tempPatient.trimName, nameKana)
  }
  // 性別・生年月日
  if (
    lastPatient.gender === PatientGender.UNCERTAIN &&
    tempPatient.gender &&
    tempPatient.gender !== PatientGender.UNCERTAIN
  ) {
    lastPatient.gender = tempPatient.gender
  }
  if (lastPatient.birthday === null && tempPatient.birthDate) {
    lastPatient.birthday = tempPatient.birthDate
  }
  // 同意書系の設定
  lastPatient.medicalInsuranceStatus = tempPatient.insuranceConfirm
    ? PatientMedicalInsuranceStatus.CONFIRMED
    : PatientMedicalInsuranceStatus.UNCONFIRMED
  lastPatient.medicalShareConfirmDate = tempPatient.insuranceConfirm ? DEFAULT_START_DATE : null
  lastPatient.nursingInsuranceStatus = tempPatient.insuranceConfirm
    ? PatientMedicalInsuranceStatus.CONFIRMED
    : PatientMedicalInsuranceStatus.UNCONFIRMED
  lastPatient.nursingShareConfirmDate = tempPatient.insuranceConfirm ? DEFAULT_START_DATE : null
  lastPatient.consentStatus = tempPatient.consentConfirm
    ? PatientConsentStatus.COLLECTED
    : PatientConsentStatus.UNCOLLECTED
  lastPatient.paymentType = tempPatient.paymentType
  lastPatient.accountConfirmStatus = tempPatient.accountConfirmStatus
  lastPatient.accountManageId =
    tempPatient.accountConfirmStatus === PatientAccountConfirmStatus.AVAILABLE ? tempPatient.accountManageId : null
  // 送付先情報
  if (tempPatient.address1 !== '') {
    lastPatient.deliveryName = tempPatient.billName
    lastPatient.deliveryPostalCode = tempPatient.postalCode
    lastPatient.deliveryAddress1 = tempPatient.address1
    lastPatient.deliveryAddress2 = tempPatient.address2
    lastPatient.deliveryTel = tempPatient.tel
  }

  // 備考（申し送り）を連結
  const comment = getNote(tempPatient.note, tempPatient.comment)
  if (comment !== '' && lastPatient.note !== comment) {
    if (tempPatient.patientCode !== lastPatient.code) {
      lastPatient.note = `${lastPatient.note}(${lastPatient.code})\n${comment}`
    } else {
      lastPatient.note = `${lastPatient.note}\n${comment}`
    }
  }
  // 逝去されている場合はステータスを変更
  if (tempPatient.note.includes('逝去') || tempPatient.comment.includes('逝去')) {
    lastPatient.status = PatientStatus.DECEASE
  }
  // 逝去していなくて「退去」の有無でステータス変更
  if (lastPatient.status !== PatientStatus.DECEASE) {
    if (tempPatient.comment.includes('退居') || tempPatient.comment.includes('退去')) {
      lastPatient.status = PatientStatus.EXIT
    } else {
      lastPatient.status = PatientStatus.INRESIDENCE
    }
  }
}

/**
 * 患者が切り替わるときに
 * 直前の患者の患者関連施設の最後のデータに
 * 必要があれば退居理由を設定します
 * @param patient 患者
 * @param tempPatient 患者一時情報
 */
const setLastRelateFacilityReason = (patient: PatientInputModel | null, tempPatient: TmpPatientModel | null) => {
  if (
    patient !== null &&
    tempPatient !== null &&
    patient.patientRelateHealthFacility &&
    patient.patientRelateHealthFacility.length > 0
  ) {
    const relateFacility = patient.patientRelateHealthFacility[patient.patientRelateHealthFacility.length - 1]
    // 終了日には前回請求締年月日の前月末、または開始日の月末を設定
    const endDate = tempPatient.lastBillDate
      ? subDays(startOfMonth(tempPatient.lastBillDate), 1)
      : subDays(addMonths(relateFacility.startDate, 1), 1)
    // 患者のステータスに逝去や退居が設定されている場合は終了日を設定
    if (patient.status === PatientStatus.DECEASE) {
      relateFacility.reason = PatientRelateHealthFacilityReason.DECEASE
      relateFacility.endDate = endDate
    } else if (patient.status === PatientStatus.EXIT) {
      relateFacility.reason = PatientRelateHealthFacilityReason.EXIT
      relateFacility.endDate = endDate
    }
  }
}

/**
 * 共通カラムを設定します。
 * @param data データ
 */
const setCommonColumns = (data: CommonColumns) => {
  data.createdAt = REGIST_DATE
  data.createdBy = REGIST_USER
  data.updatedAt = REGIST_DATE
  data.updatedBy = REGIST_USER
}

/**
 * 作成したデータでDBに登録・更新します。
 * @param patientList 患者情報リスト
 * @param manageList 施設コード管理更新リスト
 */
const affectDB = async (patientList: PatientInputModel[], manageList: any[]) => {
  // 登録情報を用意
  const relateList: PatientRelateHealthFacilityInputModel[] = patientList.flatMap((p) =>
    p.patientRelateHealthFacility ? p.patientRelateHealthFacility : [],
  )
  const registerPatientList: PatientInputModel[] = []
  patientList.forEach((p) => {
    if (p.patientRelateHealthFacility && p.patientRelateHealthFacility.length > 0) {
      delete p.patientRelateHealthFacility
      delete p.tempLastBillDate
      // 空文字の場合は null を登録するようにする
      if (p.deliveryName === '') p.deliveryName = null
      if (p.deliveryPostalCode === '') p.deliveryPostalCode = null
      if (p.deliveryAddress1 === '') p.deliveryAddress1 = null
      if (p.deliveryAddress2 === '') p.deliveryAddress2 = null
      if (p.deliveryTel === '') p.deliveryTel = null
      if (p.healthFacilityInfo === '') p.healthFacilityInfo = null
      if (p.note === '') p.note = null
      registerPatientList.push(p)
    } else {
      logging('WRN', `施設に紐づきがない患者: ${p.code}\t${p.name}\t${p.note}`)
    }
  })
  // 患者を登録
  logging('INF', `患者データを登録します ${registerPatientList.length}件`)
  await loaderPrisma.patient.createMany({ data: registerPatientList })
  // 患者関連施設を登録
  logging('INF', `患者関連施設データを登録します ${relateList.length}件`)
  await loaderPrisma.patientRelateHealthFacility.createMany({ data: relateList })
  // 施設コード管理を更新
  logging('INF', `施設コード管理を更新します ${manageList.length}件`)
  await loaderPrisma.$transaction(manageList.map((data) => loaderPrisma.healthFacilityCodeManage.update(data)))
}

/**
 * ログを出力します。
 * @param level レベル
 * @param message メッセージ
 */
const logging = (level: string, message: string) => {
  const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')
  const record = `${date}\t[${level}]\t${message}`
  if (level === 'INF' || level === 'WRN' || level === 'ERR') {
    console.log(record)
  }
  if (level === 'TRC') {
    logger.trace(message)
  }
  if (level === 'DBG') {
    logger.debug(message)
  }
  if (level === 'INF') {
    logger.info(message)
  }
  if (level === 'WRN') {
    logger.warn(message)
  }
  if (level === 'ERR') {
    logger.error(message)
  }
}

//-----------------------------------------------------------------------------
// 処理の実行
//-----------------------------------------------------------------------------
// パラメーターの確認
const args = process.argv.slice(2)
if (args.length !== 3 && args.length !== 4) {
  console.log(
    '実行時の引数は以下の通り: \n\t1: 入居者CSVが格納されているパス\n\t2: 請求CSVが格納されているパス\n\t3: ログファイル名\n\t4: ログレベル(info|debug|trace)（未指定の場合は info）])',
  )
  process.exit(1)
}

// CSVのパスを起動パラメーターから設定
const CAUL_CSV_PATH = args[0]
const BILL_CSV_PATH = args[1]
const LOG_FILE = args[2]
const LOG_LEVEL = args.length === 4 ? args[3] : 'info'

// Prisma のログ設定
const logger = pino({
  level: LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      destination: LOG_FILE,
      mkdir: true,
    },
  },
})
loaderPrisma.$on(
  'query',
  createPrismaQueryEventHandler({
    logger: (query: string) => logger.trace(query),
  }),
)

// 処理の実行
console.log('患者データ移行処理を開始します')
execute()
  .catch((reason) => logger.error(reason))
  .finally(() => console.log('患者データ移行処理が終了しました'))
