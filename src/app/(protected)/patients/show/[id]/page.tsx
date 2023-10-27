'use client'

import { Box, Stack } from '@mui/material'
import { HttpError, useResource } from '@refinedev/core'
import { Show } from '@refinedev/mui'
import React, { useEffect, useState } from 'react'
import { FormSubmitErrorNotification, handleApiError, setTitle } from '@/core/utils/refineUtil'
import {
  BoxEditStatus,
  PatientEditingForm,
  PatientEditingFormFieldName,
  PatientEditingSchema,
  PatientModel,
} from '@/types'
import { FieldItem } from '@components/core/content/FieldItem'
import { formatDateTime } from '@/core/utils/dateUtil'
import Grid from '@mui/material/Grid'
import { AttachmentOutlined, ConnectWithoutContactOutlined, InfoOutlined, MessageOutlined } from '@mui/icons-material'
import Divider from '@mui/material/Divider'
import { PaperBox } from '@components/core/content/paperBox'
import { PatientProfileSwitchForm } from '@components/domains/patients/patientProfileSwitchForm'
import { useForm } from '@refinedev/react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PatientNoteSwitchForm } from '@components/domains/patients/patientNoteSwitchForm'
import { FormProvider } from 'react-hook-form'
import { PatientDeliverySwitchForm } from '@components/domains/patients/patientDeliverySwitchForm'
import { PatientCheckListSwitchForm } from '@components/domains/patients/patientCheckListSwitchForm'
import { PatientChangeHistory } from '@components/domains/patients/patientChangeHistory'
import { PatientRelateHealthFacility } from '@components/domains/patients/patientHealthFacility/patientRelateHealthFacility'
import { Loading } from '@components/core/content/loading'

const ShowPage = () => {
  setTitle()
  const [boxEditStatus, setBoxEditStatus] = useState<BoxEditStatus>(null)
  const errorNotification = new FormSubmitErrorNotification<PatientEditingForm>()
  const { id } = useResource()
  if (!id) throw new Error('id is undefined')

  const methods = useForm<PatientModel, HttpError, PatientEditingForm>({
    resolver: zodResolver(PatientEditingSchema),
    refineCoreProps: {
      action: 'edit',
      redirect: false,
      onMutationSuccess: (_data, _variables, _context, _isAutoSave) => {
        setBoxEditStatus(null)
      },
      successNotification: (data, values, resource) => {
        if ((data?.data as any) === '') {
          return {
            description: `更新処理をスキップ`,
            message: '編集内容に変更がありませんでした',
            type: 'error',
          }
        }
        return {
          message: `操作の完了`,
          description: '患者情報の変更が完了しました',
          type: 'success',
        }
      },
    },
  })
  const {
    refineCore: { queryResult, formLoading },
    setValue,
    setError,
  } = methods

  if (queryResult?.error) {
    const { error } = queryResult
    handleApiError(error)
  }
  errorNotification.error = setError

  const record = queryResult?.data?.data

  useEffect(() => {
    if (record) {
      // 入力フォームが画面上に存在しないとuseFormはRHFに値を設定してくれないため明示的に初期値を設定かつ型も変換(DatePicker初期値対応)
      const editingFields = Object.keys(PatientEditingSchema.shape) as PatientEditingFormFieldName[]
      const parseRecord = PatientEditingSchema.parse(record)
      for (const field of editingFields) {
        setValue(field, parseRecord[field])
      }
    }
  }, [record, setValue])

  if (!record) {
    return <Loading />
  }

  return (
    <Show isLoading={formLoading} canEdit={false}>
      <FormProvider {...methods}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} lg={3}>
            <PatientProfileSwitchForm boxEditStatus={boxEditStatus} setBoxEditStatus={setBoxEditStatus} />
            <PatientDeliverySwitchForm
              sx={{ p: 0, mt: 2 }}
              boxEditStatus={boxEditStatus}
              setBoxEditStatus={setBoxEditStatus}
            />
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <PatientCheckListSwitchForm
              sx={{ p: 0 }}
              boxEditStatus={boxEditStatus}
              setBoxEditStatus={setBoxEditStatus}
            />
            <PatientRelateHealthFacility patient={record} />
            <PatientNoteSwitchForm boxEditStatus={boxEditStatus} setBoxEditStatus={setBoxEditStatus} />
            <PaperBox title='添付資料' icon={<AttachmentOutlined />} sx={{ p: 0, mt: 2 }}>
              <Box sx={{ px: 1 }}>添付したファイル名とメモのリストを表示予定</Box>
            </PaperBox>
            <PaperBox title='更新者情報' icon={<InfoOutlined />} sx={{ p: 0, mt: 2 }}>
              <Box sx={{ px: 1 }}>
                <Stack
                  direction='row'
                  divider={<Divider orientation='vertical' flexItem />}
                  justifyContent='flex-start'
                  spacing={1}
                  sx={{ px: 1 }}
                >
                  <FieldItem
                    label='作成者'
                    value={`${record?.createdUser?.name} (${formatDateTime(record?.createdAt)})`}
                  />
                  <FieldItem
                    label='更新者'
                    value={`${record?.updatedUser?.name} (${formatDateTime(record?.updatedAt)})`}
                  />
                </Stack>
              </Box>
            </PaperBox>
            <PatientChangeHistory patientId={id?.toString()} updatedAt={record?.updatedAt} />
            <PaperBox title='申し送り' icon={<ConnectWithoutContactOutlined />} sx={{ p: 0, mt: 2 }}>
              <Box sx={{ px: 1 }}>未確認の(未完了のステータスも必要?)店舗⇔業務課 の連絡情報を表示予定</Box>
            </PaperBox>
            <PaperBox title='お問い合わせ' icon={<MessageOutlined />} sx={{ p: 0, mt: 2 }}>
              <Box sx={{ px: 1 }}>未完了の患者様からのお問い合わせを表示予定(※全てのお問合せ一覧画面も別途作成)</Box>
            </PaperBox>
          </Grid>
        </Grid>
      </FormProvider>
    </Show>
  )
}

export default ShowPage
