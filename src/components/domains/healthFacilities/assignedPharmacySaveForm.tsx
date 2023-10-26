import { FormSubmitErrorNotification, handleApiError } from '@/core/utils/refineUtil'
import { AssignedPharmacyEditingForm, AssignedPharmacyEditingSchema, HealthFacilityModel } from '@/types'
import { useForm } from '@refinedev/react-hook-form'
import { HttpError } from '@refinedev/core'
import { zodResolver } from '@hookform/resolvers/zod'
import useConfirm from '@/core/hooks/useConfirm'
import { ControlDatePicker } from '@/components/core/form/controlDatePicker'
import { ControlAutocomplete } from '@/components/core/form/controlAutocomplete'
import { useWatch } from 'react-hook-form'
import { ControlItemAutocomplete } from '@/components/core/form/controlItemAutocomplete'
import { BILLING_TYPE_LIST } from '@/shared/items/billingType'
import { HEALTH_FACILITY_PAYMENT_TYPE_LIST } from '@/shared/items/healthFacilityPaymentType'
import { PATIENT_SORT_TYPE_LIST } from '@/shared/items/patientSortType'
import { useEffect } from 'react'
import { fetchPharmacy } from '@/servers/repositories/pharmacyRepository'

/**
 * 担当店舗編集用のフォームです。
 */
export const AssignedPharmacySaveForm = () => {
  const errorNotification = new FormSubmitErrorNotification<AssignedPharmacyEditingForm>()
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<HealthFacilityModel, HttpError, AssignedPharmacyEditingForm>({
    resolver: zodResolver(AssignedPharmacyEditingSchema),
  })

  if (queryResult) {
    const { error } = queryResult
    handleApiError(error)
  }

  errorNotification.error = setError
  const { $confirm } = useConfirm()

  const handleEdit = (e: any) => {
    $confirm({
      message: '情報を編集します。操作を続けてもよろしいですか',
      onConfirm() {
        saveButtonProps.onClick(e)
      },
    })
  }

  const postsData = queryResult ? queryResult.data?.data : undefined
  console.log('postsData', postsData)

  // 選択した店舗により請求関連情報を変更
  const watchPharmacyId = useWatch({ control: control, name: 'pharmacyId' })
  // useEffect(() => {
  //   const pharmacy = fetchPharmacy(watchPharmacyId)
  //   // setValue('billingType', pharmacy?.accountManage.billingType)
  //   // setValue('paymentType', pharmacy?.billingType)
  //   // setValue('accountManageId', pharmacy?.billingType)
  // }, [watchPharmacyId])

  // 支払い種別表示制御
  const billingType = postsData?.billingType
  const watchBillingType = useWatch({ control: control, name: 'billingType' })
  const showPaymentType = (watchBillingType ? watchBillingType : billingType) === 'BATCH'

  // 振込口座の表示制御
  const paymentType = postsData?.paymentType
  const watchPaymentType = useWatch({ control: control, name: 'paymentType' })
  const showAccountManageId = showPaymentType && (watchPaymentType ? watchPaymentType : paymentType) === 'TRANSFER'

  return (
    <>
      <ControlDatePicker
        required
        label='対応開始日'
        name='startDate'
        control={control}
        error={!!errors.startDate}
        helperText={errors.startDate?.message}
        disablePast
      />
      <ControlAutocomplete
        required
        resource='pharmacies'
        label='店舗名'
        name='pharmacyId'
        control={control}
        error={!!errors.pharmacyId}
        helperText={
          '選択した新しい店舗に合わせて施設の請求関連情報を変更します。 ' + (errors.pharmacyId?.message || '')
        }
        optionLabel={(option: any) => {
          return option?.pharmacyGroup?.name + ' ' + option?.name ?? ''
        }}
      />
      <ControlItemAutocomplete
        label='請求種別'
        name='billingType'
        options={BILLING_TYPE_LIST}
        control={control}
        error={!!errors.billingType}
        helperText={errors.billingType?.message}
      />
      {showPaymentType && (
        <ControlItemAutocomplete
          label='支払い種別'
          name='paymentType'
          options={HEALTH_FACILITY_PAYMENT_TYPE_LIST}
          control={control}
          error={!!errors.paymentType}
          helperText={errors.paymentType?.message}
        />
      )}
      {showAccountManageId && (
        <ControlAutocomplete
          resource='accountManages'
          label='振込口座'
          name='accountManageId'
          defaultId={postsData?.accountManageId ? postsData?.accountManageId : undefined}
          control={control}
          error={!!errors.accountManageId}
          helperText={errors.accountManageId?.message}
        />
      )}
      <ControlItemAutocomplete
        required
        label='患者ソート種別'
        name='patientSortType'
        options={PATIENT_SORT_TYPE_LIST}
        control={control}
        error={!!errors.patientSortType}
        helperText={'施設へ一括請求する時の請求書の患者並び順を指定します ' + (errors.patientSortType?.message || '')}
      />
    </>
  )
}
