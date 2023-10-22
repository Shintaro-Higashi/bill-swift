/**
 * 半角カナの文字列を全角カナに変換します。
 * @param hanString 半角カナ文字列
 * @returns 全角カナ文字列
 */
export const convertKanaHanToZen = (hanString: string): string => {
  return hanString
    .replace(KANA_REG, (match) => KANA_MAP[match])
    .replace(/ﾞ/g, '゛')
    .replace(/ﾟ/g, '゜')
}

/**
 * 全角英数字の文字列を半角英数字に変換します。
 * @param zenString 全角英数字文字列
 * @returns 半角英数字文字列
 */
export const convertAlphaNumZenToHan = (zenString: string): string => {
  return zenString.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s: string) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
}

/**
 * 検索時にあいまいな表現となるスペース（半角・全角）と「・」を取り除きます。
 * @param target 対象文字列
 * @returns 取り除いた文字列
 */
export const removeSeparator = (target: string | null) => {
  if (!target) {
    return target
  }
  return target.replace(/[\s　・]/g, '')
}

/**
 * 検索用氏名を氏名とカナ氏名から作成します。
 * @param name 氏名
 * @param kana カナ
 * @returns 検索用氏名
 */
export const convertSearchName = (name: string, kana: string | null): string => {
  const convertName = removeSeparator(name.trim()) as string
  if (!kana) {
    return convertName
  }
  const convertKana = removeSeparator(kana.trim()) as string
  return convertName + convertKana
}

// キーを半角カナ、値を全角カナで定義した変換マップ
const KANA_MAP: { [key: string]: string } = {
  ｶﾞ: 'ガ',
  ｷﾞ: 'ギ',
  ｸﾞ: 'グ',
  ｹﾞ: 'ゲ',
  ｺﾞ: 'ゴ',
  ｻﾞ: 'ザ',
  ｼﾞ: 'ジ',
  ｽﾞ: 'ズ',
  ｾﾞ: 'ゼ',
  ｿﾞ: 'ゾ',
  ﾀﾞ: 'ダ',
  ﾁﾞ: 'ヂ',
  ﾂﾞ: 'ヅ',
  ﾃﾞ: 'デ',
  ﾄﾞ: 'ド',
  ﾊﾞ: 'バ',
  ﾋﾞ: 'ビ',
  ﾌﾞ: 'ブ',
  ﾍﾞ: 'ベ',
  ﾎﾞ: 'ボ',
  ﾊﾟ: 'パ',
  ﾋﾟ: 'ピ',
  ﾌﾟ: 'プ',
  ﾍﾟ: 'ペ',
  ﾎﾟ: 'ポ',
  ｳﾞ: 'ヴ',
  ﾜﾞ: 'ヷ',
  ｦﾞ: 'ヺ',
  ｱ: 'ア',
  ｲ: 'イ',
  ｳ: 'ウ',
  ｴ: 'エ',
  ｵ: 'オ',
  ｶ: 'カ',
  ｷ: 'キ',
  ｸ: 'ク',
  ｹ: 'ケ',
  ｺ: 'コ',
  ｻ: 'サ',
  ｼ: 'シ',
  ｽ: 'ス',
  ｾ: 'セ',
  ｿ: 'ソ',
  ﾀ: 'タ',
  ﾁ: 'チ',
  ﾂ: 'ツ',
  ﾃ: 'テ',
  ﾄ: 'ト',
  ﾅ: 'ナ',
  ﾆ: 'ニ',
  ﾇ: 'ヌ',
  ﾈ: 'ネ',
  ﾉ: 'ノ',
  ﾊ: 'ハ',
  ﾋ: 'ヒ',
  ﾌ: 'フ',
  ﾍ: 'ヘ',
  ﾎ: 'ホ',
  ﾏ: 'マ',
  ﾐ: 'ミ',
  ﾑ: 'ム',
  ﾒ: 'メ',
  ﾓ: 'モ',
  ﾔ: 'ヤ',
  ﾕ: 'ユ',
  ﾖ: 'ヨ',
  ﾗ: 'ラ',
  ﾘ: 'リ',
  ﾙ: 'ル',
  ﾚ: 'レ',
  ﾛ: 'ロ',
  ﾜ: 'ワ',
  ｦ: 'ヲ',
  ﾝ: 'ン',
  ｧ: 'ァ',
  ｨ: 'ィ',
  ｩ: 'ゥ',
  ｪ: 'ェ',
  ｫ: 'ォ',
  ｯ: 'ッ',
  ｬ: 'ャ',
  ｭ: 'ュ',
  ｮ: 'ョ',
  ｰ: 'ー',
}
// 半角カナを検索する正規表現
const KANA_REG = new RegExp('(' + Object.keys(KANA_MAP).join('|') + ')', 'g')
