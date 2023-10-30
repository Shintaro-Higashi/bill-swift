import { useFormContext, useWatch } from 'react-hook-form'
import { BoxEditProps, BoxEditStatus, PatientEditingForm, PatientEditingSchema, PatientModel } from '@/types'
import { Alert, Box, Button, Stack, SxProps } from '@mui/material'
import React, { useEffect } from 'react'
import { HttpError } from '@refinedev/core'
import { ArrowBackOutlined, ChecklistRtlOutlined, SaveOutlined } from '@mui/icons-material'
import { FieldItem } from '@components/core/content/FieldItem'
import useConfirm from '@/core/hooks/useConfirm'
import { PaperToggleBox } from '@components/domains/patients/paperToggleBox'
import { joinString } from '@/core/utils/commonUtil'
import { Theme } from '@mui/system'
import Divider from '@mui/material/Divider'
import { CONSENT_STATUS_LIST, getConsentStatusValue } from '@/shared/items/consentStatus'
import { formatDate, getCurrentDate } from '@/core/utils/dateUtil'
import { getInsuranceStatusValue, INSURANCE_STATUS_LIST } from '@/shared/items/medicalInsuranceStatus'
import { getMedicalNursingShareValue, MEDICAL_NURSING_SHARE_LIST } from '@/shared/items/medicalNursingShare'
import {
  getPatientPaymentTypeValue,
  PATIENT_PAYMENT_TYPE_LIST,
  PatientPaymentTypeKey,
} from '@/shared/items/patientPaymentType'
import {
  ACCOUNT_CONFIRM_STATUS_LIST,
  AccountConfirmStatusKey,
  getAccountConfirmStatusValue,
} from '@/shared/items/accountConfirmStatus'
import { ControlDatePicker } from '@components/core/form/controlDatePicker'
import { ControlItemAutocomplete } from '@components/core/form/controlItemAutocomplete'
import { ControlAutocomplete } from '@components/core/form/controlAutocomplete'

const BOX_NAME: BoxEditStatus = 'checkList'

type Props = {
  sx?: SxProps<Theme> | undefined
} & BoxEditProps

/**
 * 患者請求ステータス(チェックリスト)表示,編集コンポーネントです。
 */
export const PatientCheckListSwitchForm = (props: Props) => {
  const {
    refineCore: { queryResult },
  } = useFormContext<PatientModel, HttpError, PatientEditingForm>()
  const patient = queryResult ? queryResult.data?.data : undefined
  const { sx, boxEditStatus, setBoxEditStatus } = props

  return (
    <PaperToggleBox
      title='請求ステータス'
      icon={<ChecklistRtlOutlined />}
      sx={sx}
      boxName={BOX_NAME}
      boxEditStatus={boxEditStatus}
      setBoxEditStatus={setBoxEditStatus}
    >
      {boxEditStatus !== BOX_NAME ? (
        <PatientCheckListView record={patient} />
      ) : (
        <PatientCheckListForm
          handleCancelButtonClick={() => setBoxEditStatus(null)}
          boxEditStatus={boxEditStatus}
          setBoxEditStatus={setBoxEditStatus}
        />
      )}
    </PaperToggleBox>
  )
}

type ViewProps = {
  record: PatientModel | undefined
}

// 公費フラグの表示
const publicExpenseValue = (flag: boolean | null | undefined) => {
  if (flag == null) {
    return '未確認'
  }
  return flag ? 'はい' : 'いいえ'
}

const PatientCheckListView = (props: ViewProps) => {
  const { record } = props
  return (
    <>
      {record?.billEnableFlag === false && (
        <Box sx={{ p: 1, pt: 0 }}>
          <Alert severity='warning'>請求に必要な情報が揃っていません</Alert>
        </Box>
      )}
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
                ? formatDate(record?.medicalInsuranceStartDate) + ' ～ ' + formatDate(record?.medicalInsuranceEndDate)
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
                ? formatDate(record?.nursingInsuranceStartDate) + ' ～ ' + formatDate(record?.nursingInsuranceEndDate)
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
          <FieldItem label='口座振替確認状態' value={getAccountConfirmStatusValue(record?.accountConfirmStatus)} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FieldItem label='公費' value={publicExpenseValue(record?.publicExpense)} />
        </Box>
      </Stack>
    </>
  )
}

type FormProps = {
  handleCancelButtonClick: () => void
} & BoxEditProps

// 振替情報が必要な支払種別(フォーム禁則制御に利用)
const NECESSARY_ACCOUNT_PAYMENT_TYPE: PatientPaymentTypeKey[] = ['WITHDRAWAL', 'WITHDRAWAL_STOP', 'WITHDRAWAL_CONTINUE']
// 振替口座情報設定可能な口座振替確認
const NECESSARY_ACCOUNT_MANAGE_ACCOUNT_CONFIRM_STATUS: (AccountConfirmStatusKey | null)[] = ['AVAILABLE', 'INVALID']
// 公費有無選択リスト
const PUBLIC_EXPENSE_LIST = [
  { value: '未確認', key: null },
  { value: 'いいえ', key: false },
  { value: 'はい', key: true },
]

const PatientCheckListForm = (props: FormProps) => {
  const {
    saveButtonProps,
    refineCore: { queryResult },
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    clearErrors,
  } = useFormContext<PatientModel, HttpError, PatientEditingForm>()

  const { handleCancelButtonClick } = props
  const { $confirm } = useConfirm()

  const patient = queryResult ? queryResult.data?.data : undefined

  const targetFields = [
    // 同意書
    register('consentStatus').name,
    register('consentConfirmDate').name,
    // 医療保険情報
    register('medicalInsuranceStatus').name,
    register('medicalInsuranceStartDate').name,
    register('medicalInsuranceEndDate').name,
    register('medicalShareConfirmDate').name,
    register('medicalShare').name,
    // 医療負担割合

    // 介護保険情報
    register('nursingInsuranceStatus').name,
    register('nursingInsuranceStartDate').name,
    register('nursingInsuranceEndDate').name,
    register('nursingShareConfirmDate').name,
    register('nursingShare').name,
    // 支払い方法
    register('paymentType').name,
    register('accountConfirmStatus').name,
    register('accountManageId').name,
    // 公費
    register('publicExpense').name,
  ]

  // 同意書フォーム制御
  const consentStatus = useWatch({ control: control, name: 'consentStatus' })
  useEffect(
    () => setValue('consentConfirmDate', consentStatus === 'COLLECTED' ? getCurrentDate() : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [consentStatus],
  )

  // 医療保険フォーム制御
  const medicalInsuranceStatus = useWatch({ control: control, name: 'medicalInsuranceStatus' })
  const medicalShare = useWatch({ control: control, name: 'medicalShare' })
  useEffect(() => {
    if (medicalInsuranceStatus !== 'CONFIRMED') {
      setValue('medicalInsuranceStartDate', null)
      setValue('medicalInsuranceEndDate', null)
      setValue('medicalShare', null)
      setValue('medicalShareConfirmDate', null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicalInsuranceStatus])
  useEffect(() => {
    if (medicalShare && medicalShare !== 'NONE' && getValues('medicalShareConfirmDate') === null) {
      setValue('medicalShareConfirmDate', getCurrentDate())
    } else if (!medicalShare || medicalShare === 'NONE') {
      setValue('medicalShareConfirmDate', null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicalShare, setValue])
  // 介護保険フォーム制御
  const nursingInsuranceStatus = useWatch({ control: control, name: 'nursingInsuranceStatus' })
  const nursingShare = useWatch({ control: control, name: 'nursingShare' })
  useEffect(() => {
    if (nursingInsuranceStatus !== 'CONFIRMED') {
      setValue('nursingInsuranceStartDate', null)
      setValue('nursingInsuranceEndDate', null)
      setValue('nursingShare', null)
      setValue('nursingShareConfirmDate', null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nursingInsuranceStatus])
  useEffect(() => {
    if (nursingShare && nursingShare !== 'NONE' && getValues('nursingShareConfirmDate') === null) {
      setValue('nursingShareConfirmDate', getCurrentDate())
    } else if (!nursingShare || nursingShare === 'NONE') {
      setValue('nursingShareConfirmDate', null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nursingShare])
  // 口座振替フォーム制御
  const paymentType = useWatch({ control: control, name: 'paymentType' })
  const accountConfirmStatus = useWatch({ control: control, name: 'accountConfirmStatus' })
  useEffect(() => {
    if (!NECESSARY_ACCOUNT_PAYMENT_TYPE.includes(paymentType)) {
      setValue('accountConfirmStatus', null)
      setValue('accountManageId', null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentType])
  useEffect(() => {
    if (!NECESSARY_ACCOUNT_MANAGE_ACCOUNT_CONFIRM_STATUS.includes(accountConfirmStatus)) {
      setValue('accountManageId', null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountConfirmStatus])

  // フォーム画面破棄時にform状態をリセット
  useEffect(() => {
    return () => {
      const parsePatient = PatientEditingSchema.parse(patient)
      for (const field of targetFields) {
        setValue(field, parsePatient[field] ?? null)
      }
      clearErrors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEdit = async (e: any) => {
    $confirm({
      message: '患者の請求ステータスを編集します。操作を続けてもよろしいですか',
      onConfirm() {
        saveButtonProps.onClick(e)
      },
    })
    return false
  }

  return (
    <Box component='form' sx={{ px: 1, pb: 1, mb: 1 }} autoComplete='off'>
      <Stack
        direction='row'
        divider={<Divider orientation='vertical' flexItem />}
        justifyContent='flex-start'
        spacing={1}
        sx={{ px: 1 }}
      >
        {/* 同意書 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 200 }}>
          <ControlItemAutocomplete
            required
            label='同意書'
            name='consentStatus'
            control={control}
            error={!!errors.consentStatus}
            helperText={errors.consentStatus?.message}
            options={CONSENT_STATUS_LIST}
          />
          <ControlDatePicker
            required
            label='同意書確認日'
            name='consentConfirmDate'
            control={control}
            disabled={consentStatus !== 'COLLECTED'}
            error={!!errors.consentConfirmDate}
            helperText={errors.consentConfirmDate?.message}
          />
        </Box>
        {/* 医療保険 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 200 }}>
          <ControlItemAutocomplete
            required
            label='医療保険'
            name='medicalInsuranceStatus'
            control={control}
            error={!!errors.medicalInsuranceStatus}
            helperText={errors.medicalInsuranceStatus?.message}
            options={INSURANCE_STATUS_LIST}
          />
          <ControlDatePicker
            required
            label='適用開始日'
            name='medicalInsuranceStartDate'
            control={control}
            disabled={medicalInsuranceStatus !== 'CONFIRMED'}
            error={!!errors.medicalInsuranceStartDate}
            helperText={errors.medicalInsuranceStartDate?.message}
          />
          <ControlDatePicker
            required
            label='適用終了日'
            name='medicalInsuranceEndDate'
            control={control}
            disabled={medicalInsuranceStatus !== 'CONFIRMED'}
            error={!!errors.medicalInsuranceEndDate}
            helperText={errors.medicalInsuranceEndDate?.message}
          />
          <Divider />
          <ControlItemAutocomplete
            required
            label='医療負担割合'
            name='medicalShare'
            control={control}
            disabled={medicalInsuranceStatus !== 'CONFIRMED'}
            error={!!errors.medicalShare}
            helperText={errors.medicalShare?.message}
            options={MEDICAL_NURSING_SHARE_LIST}
          />
          <ControlDatePicker
            required
            label='医療負担割合確認日'
            name='medicalShareConfirmDate'
            control={control}
            disabled={!medicalShare || medicalShare === 'NONE'}
            error={!!errors.medicalShareConfirmDate}
            helperText={errors.medicalShareConfirmDate?.message}
          />
        </Box>
        {/* 介護保険 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 200 }}>
          <ControlItemAutocomplete
            required
            label='介護保険'
            name='nursingInsuranceStatus'
            control={control}
            error={!!errors.nursingInsuranceStatus}
            helperText={errors.nursingInsuranceStatus?.message}
            options={INSURANCE_STATUS_LIST}
          />

          <ControlDatePicker
            required
            label='適用開始日'
            name='nursingInsuranceStartDate'
            control={control}
            disabled={nursingInsuranceStatus !== 'CONFIRMED'}
            error={!!errors.nursingInsuranceStartDate}
            helperText={errors.nursingInsuranceStartDate?.message}
          />
          <ControlDatePicker
            required
            label='適用終了日'
            name='nursingInsuranceEndDate'
            control={control}
            disabled={nursingInsuranceStatus !== 'CONFIRMED'}
            error={!!errors.nursingInsuranceEndDate}
            helperText={errors.nursingInsuranceEndDate?.message}
          />
          <Divider />
          <ControlItemAutocomplete
            required
            label='介護負担割合'
            name='nursingShare'
            control={control}
            disabled={nursingInsuranceStatus !== 'CONFIRMED'}
            error={!!errors.nursingShare}
            helperText={errors.nursingShare?.message}
            options={MEDICAL_NURSING_SHARE_LIST}
          />
          <ControlDatePicker
            required
            label='介護負担割合確認日'
            name='nursingShareConfirmDate'
            control={control}
            disabled={!nursingShare || nursingShare === 'NONE'}
            error={!!errors.nursingShareConfirmDate}
            helperText={errors.nursingShareConfirmDate?.message}
          />
        </Box>
        {/* 支払方法 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 200, maxWidth: 300 }}>
          <ControlItemAutocomplete
            required
            label='支払方法'
            name='paymentType'
            control={control}
            error={!!errors.paymentType}
            helperText={errors.paymentType?.message}
            options={PATIENT_PAYMENT_TYPE_LIST}
          />
          <ControlItemAutocomplete
            required
            label='口座振替確認'
            name='accountConfirmStatus'
            control={control}
            disabled={!NECESSARY_ACCOUNT_PAYMENT_TYPE.includes(paymentType)}
            error={!!errors.accountConfirmStatus}
            helperText={errors.accountConfirmStatus?.message}
            options={ACCOUNT_CONFIRM_STATUS_LIST}
          />
          <ControlAutocomplete
            required
            resource='accountManages'
            label='振替口座'
            name='accountManageId'
            defaultId={patient?.accountManageId}
            control={control}
            disabled={!NECESSARY_ACCOUNT_MANAGE_ACCOUNT_CONFIRM_STATUS.includes(accountConfirmStatus)}
            error={!!errors.accountManageId}
            helperText={errors.accountManageId?.message}
          />
        </Box>
        {/* 公費 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 150 }}>
          <ControlItemAutocomplete
            required
            label='公費'
            name='publicExpense'
            control={control}
            error={!!errors.publicExpense}
            helperText={errors.publicExpense?.message}
            options={PUBLIC_EXPENSE_LIST}
          />
        </Box>
      </Stack>
      <Stack my={2} direction='row' justifyContent='end' spacing={1}>
        <Button variant='contained' startIcon={<ArrowBackOutlined />} size='small' onClick={handleCancelButtonClick}>
          キャンセル
        </Button>
        <Button variant='contained' startIcon={<SaveOutlined />} size='small' onClick={handleSubmit(handleEdit)}>
          確定
        </Button>
      </Stack>
    </Box>
  )
}
