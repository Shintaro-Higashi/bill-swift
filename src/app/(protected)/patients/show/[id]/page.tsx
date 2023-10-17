'use client'

import { Box, Chip, Paper, Stack } from '@mui/material'
import { useShow } from '@refinedev/core'
import { Show } from '@refinedev/mui'
import React from 'react'
import { handleApiError, setTitle } from '@/core/utils/refineUtil'
import { PatientModel } from '@/types'
import { FieldItem } from '@components/core/content/FieldItem'
import { formatDate } from '@/core/utils/dateUtil'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {
  AttachmentOutlined,
  CakeOutlined,
  ChecklistRtlOutlined,
  ConnectWithoutContactOutlined,
  FormatListNumberedOutlined,
  HistoryOutlined,
  HouseOutlined,
  HowToRegOutlined,
  InfoOutlined,
  LocalPhoneOutlined,
  MessageOutlined,
  PersonOutlineOutlined,
  StoreOutlined,
  SyncProblemOutlined,
  WcOutlined,
} from '@mui/icons-material'
import ContactsIcon from '@mui/icons-material/Contacts'
import Divider from '@mui/material/Divider'
import { getGenderValue } from '@/shared/items/gender'
import { joinString } from '@/core/utils/commonUtil'
import { getInsuranceStatusValue } from '@/shared/items/medicalInsuranceStatus'
import { getMedicalNursingShareValue } from '@/shared/items/medicalNursingShare'
import { getConsentStatusValue } from '@/shared/items/consentStatus'
import { getPatientPaymentTypeValue } from '@/shared/items/patientPaymentType'
import { getAccountConfirmStatusValue } from '@/shared/items/accountConfirmStatus'
import { RubyItem } from '@components/core/content/rubyItem'

// 各ボックスのヘッダープロパティ
type PaperHeaderProps = {
  // アイコン
  icon: React.ReactNode
  // ヘッダタイトル
  title: string
}

/**
 * 各ボックスのヘッダーです
 * @param props プロパティ
 * @constructor
 */
const PaperHeader = (props: PaperHeaderProps) => {
  const { icon, title } = props
  return (
    <>
      <Typography
        variant='h5'
        color='white'
        sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'primary.main', borderRadius: 1, mb: 1, mt: 0 }}
      >
        {icon}
        <Box sx={{ ml: 1 }} component='span'>
          {title}
        </Box>
      </Typography>
      {/*<Divider variant='fullWidth' sx={{ mb: 2 }} />*/}
    </>
  )
}

const publicExpenseValue = (flag: boolean | null | undefined) => {
  if (flag == null) {
    return ''
  }
  return flag ? 'はい' : 'いいえ'
}

const ShowPage: React.FC = () => {
  setTitle()
  const { queryResult } = useShow<PatientModel>({ errorNotification: false })
  const { data, isLoading, error } = queryResult
  const record = data?.data
  // const Link = useLink()
  handleApiError(error)

  return (
    <Show isLoading={isLoading && !record}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 0 }}>
            <PaperHeader title='基本情報' icon={<PersonOutlineOutlined />} />
            <Stack alignItems='flex-start' spacing={1} sx={{ ml: 1 }}>
              {record?.receptSyncFlag ? (
                <Chip icon={<HowToRegOutlined />} color='success' label='レセコン同期済' size='small' />
              ) : (
                <Chip icon={<SyncProblemOutlined />} color='warning' label='レセコン同期未確認' size='small' />
              )}
              <FieldItem
                label='施設'
                icon={<StoreOutlined />}
                value={<RubyItem value={record?.healthFacility?.name} ruby={record?.healthFacility?.nameKana} />}
              />
              <FieldItem label='施設メモ' icon={<InfoOutlined />} value={record?.healthFacilityInfo} />
              <FieldItem label='患者番号' icon={<FormatListNumberedOutlined />} value={record?.code} />
              <FieldItem
                label='患者名'
                icon={<ContactsIcon />}
                value={<RubyItem value={record?.name} ruby={record?.nameKana} />}
              />
              <FieldItem label='性別' icon={<WcOutlined />} value={getGenderValue(record?.gender)} />
              <FieldItem label='生年月日' icon={<CakeOutlined />} value={formatDate(record?.birthday)} />
            </Stack>
          </Paper>
          <Paper sx={{ p: 0, mt: 2 }}>
            <PaperHeader title='送付先情報' icon={<HouseOutlined />} />
            <Stack alignItems='flex-start' spacing={1} sx={{ ml: 1 }}>
              <FieldItem
                label='住所'
                icon={<HouseOutlined />}
                value={joinString([
                  record?.deliveryPostalCode,
                  record?.deliveryAddress1,
                  record?.deliveryAddress2,
                  record?.deliveryName,
                ])}
              />
              <FieldItem label='電話番号' icon={<LocalPhoneOutlined />} value={record?.deliveryTel} />
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ p: 0 }}>
            <PaperHeader title='請求ステータス' icon={<ChecklistRtlOutlined />} />
            <Stack
              direction='row'
              divider={<Divider orientation='vertical' flexItem />}
              justifyContent='flex-start'
              spacing={1}
              sx={{ px: 1 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FieldItem
                  label='同意書'
                  value={joinString([
                    getConsentStatusValue(record?.consentStatus),
                    record?.consentStatus ? formatDate(record?.consentConfirmDate) : null,
                  ])}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FieldItem
                  label='医療保険'
                  value={joinString([
                    getInsuranceStatusValue(record?.medicalInsuranceStatus),
                    record?.medicalInsuranceStartDate
                      ? formatDate(record?.medicalInsuranceStartDate) +
                        ' ～ ' +
                        formatDate(record?.medicalInsuranceEndDate)
                      : null,
                  ])}
                />
                <FieldItem
                  label='医療負担割合'
                  value={joinString([
                    record?.medicalShareConfirmDate ? formatDate(record?.medicalShareConfirmDate) : null,
                    getMedicalNursingShareValue(record?.medicalShare),
                  ])}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FieldItem
                  label='介護保険'
                  value={joinString([
                    getInsuranceStatusValue(record?.nursingInsuranceStatus),
                    record?.nursingInsuranceStartDate
                      ? formatDate(record?.nursingInsuranceStartDate) +
                        ' ～ ' +
                        formatDate(record?.nursingInsuranceEndDate)
                      : null,
                  ])}
                />
                <FieldItem
                  label='介護負担割合'
                  value={joinString([
                    record?.nursingShareConfirmDate ? formatDate(record?.nursingShareConfirmDate) : null,
                    getMedicalNursingShareValue(record?.nursingShare),
                  ])}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FieldItem label='支払い方法' value={getPatientPaymentTypeValue(record?.paymentType)} />
                <FieldItem
                  label='口座振替確認状態'
                  value={getAccountConfirmStatusValue(record?.accountConfirmStatus)}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FieldItem label='公費' value={publicExpenseValue(record?.publicExpense)} />
              </Box>
            </Stack>
          </Paper>
          <Paper sx={{ p: 0, mt: 2 }}>
            <PaperHeader title='備考' icon={<InfoOutlined />} />
            <Box sx={{ px: 1 }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{record?.note || 'なし'}</pre>
              {/*<Stack direction='column' spacing={2}>*/}
              {/*  <List headerProps={{ title: t('orders.orders') }} canCreate={false}>*/}
              {/*    <DataGrid*/}
              {/*      {...dataGridProps}*/}
              {/*      columns={columns}*/}
              {/*      autoHeight*/}
              {/*      rowHeight={80}*/}
              {/*      pageSizeOptions={[4, 10, 20, 100]}*/}
              {/*    />*/}
              {/*  </List>*/}
              {/*</Stack>*/}
            </Box>
          </Paper>
          <Paper sx={{ p: 0, mt: 2 }}>
            <PaperHeader title='添付資料' icon={<AttachmentOutlined />} />
            <Box sx={{ px: 1 }}>添付したファイル名とメモのリストを表示予定</Box>
          </Paper>
          <Paper sx={{ p: 0, mt: 2 }}>
            <PaperHeader title='患者情報変更履歴' icon={<HistoryOutlined />} />
            <Box sx={{ px: 1, mt: 2 }}>
              以下の変更内容を表示予定
              <br />
              ・施設の変更
              <br />
              ・患者番号の変更(店舗の移動 or 施設の移動 or 会社グループの移動 で発生)
              <br />
              ・患者情報の変更(患者情報変更画面で変更した内容を自動で記録)
            </Box>
          </Paper>
          <Paper sx={{ p: 0, mt: 2 }}>
            <PaperHeader title='申し送り' icon={<ConnectWithoutContactOutlined />} />
            <Box sx={{ px: 1 }}>未確認の(未完了のステータスも必要?)店舗⇔業務課 の連絡情報を表示予定</Box>
          </Paper>
          <Paper sx={{ p: 0, mt: 2 }}>
            <PaperHeader title='お問い合わせ' icon={<MessageOutlined />} />
            <Box sx={{ px: 1 }}>未完了の患者様からのお問い合わせを表示予定(※全てのお問合せ一覧画面も別途作成)</Box>
          </Paper>
        </Grid>
      </Grid>
    </Show>
  )
}

export default ShowPage
