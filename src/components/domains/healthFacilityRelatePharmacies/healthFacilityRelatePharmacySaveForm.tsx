import { FormSubmitErrorNotification, handleApiError } from '@/core/utils/refineUtil'
import {
  HealthFacilityRelatePharmacyEditingForm,
  HealthFacilityRelatePharmacyEditingSchema,
  PharmacyModel,
  HealthFacilityRelatePharmacyModel,
} from '@/types'
import { useForm } from '@refinedev/react-hook-form'
import { HttpError, useCustom, useOne } from '@refinedev/core'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlDatePicker } from '@/components/core/form/controlDatePicker'
import { ControlAutocomplete } from '@/components/core/form/controlAutocomplete'
import { useWatch } from 'react-hook-form'
import { ControlItemAutocomplete } from '@/components/core/form/controlItemAutocomplete'
import { BILLING_TYPE_LIST } from '@/shared/items/billingType'
import { HEALTH_FACILITY_PAYMENT_TYPE_LIST } from '@/shared/items/healthFacilityPaymentType'
import { PATIENT_SORT_TYPE_LIST } from '@/shared/items/patientSortType'
import { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import { Box } from '@mui/material'

// 施設関連薬局作成、編集フォームプロパティ
type Props = {
  /** 施設関連薬局ID  ※編集時に利用 */
  healthFacilityRelatePharmacyId?: String
  /** 過去の対応開始日かどうか */
  isPastStartDate?: boolean
}

/**
 * 施設関連薬局作成、編集フォームです。
 */
export const HealthFacilityRelatePharmacySaveForm = (props: Props) => {
  const { healthFacilityRelatePharmacyId, isPastStartDate } = props

  const errorNotification = new FormSubmitErrorNotification<HealthFacilityRelatePharmacyEditingForm>()
  const {
    refineCore: { queryResult },
    register,
    setValue,
    control,
    formState: { errors },
    setError,
  } = useForm<HealthFacilityRelatePharmacyModel, HttpError, HealthFacilityRelatePharmacyEditingForm>({
    resolver: zodResolver(HealthFacilityRelatePharmacyEditingSchema),
  })

  if (queryResult) {
    const { error } = queryResult
    handleApiError(error)
  }
  errorNotification.error = setError
  const postsData = queryResult ? queryResult.data?.data : undefined

  // 編集画面での初期値を設定
  const [editSetValue, setEditSetValue] = useState(false)
  const resourceUrl = healthFacilityRelatePharmacyId
    ? `/api/healthFacilities/${postsData?.id}/pharmacies/${healthFacilityRelatePharmacyId}`
    : ''
  const { data: relatePharmacy } = useCustom<HealthFacilityRelatePharmacyModel, HttpError>({
    method: 'get',
    url: resourceUrl,
  })
  useEffect(() => {
    if (relatePharmacy?.data && !editSetValue && healthFacilityRelatePharmacyId) {
      setValue('pharmacyId', relatePharmacy.data.pharmacyId)
      setValue('startDate', new Date(relatePharmacy.data.startDate))
      setValue('billingType', relatePharmacy.data.billingType)
      setValue('paymentType', relatePharmacy.data.paymentType)
      setValue('accountManageId', relatePharmacy.data.accountManageId)
      setValue('patientSortType', relatePharmacy.data.patientSortType)
      setValue('note', relatePharmacy?.data?.note)
      setEditSetValue(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relatePharmacy?.data, setValue])

  // 選択した店舗により請求関連情報を変更
  const watchPharmacyId = useWatch({ control: control, name: 'pharmacyId' })
  const { data: pharmacy } = useOne<PharmacyModel>({
    resource: 'pharmacies',
    id: watchPharmacyId || '',
    queryOptions: {
      enabled: !!watchPharmacyId,
    },
  })
  // 作成フォームでは、最初から店舗選択時のロジックを発動させる
  useEffect(() => {
    if (!healthFacilityRelatePharmacyId) {
      setEditSetValue(true)
    }
  }, [healthFacilityRelatePharmacyId])
  useEffect(() => {
    // 編集フォームの初期値設定では請求関連項目の制御が発動しないようにする
    if (editSetValue) {
      const accountManage = pharmacy?.data?.transferAccountManage
      if (accountManage) {
        setValue('accountManageId', accountManage.id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchPharmacyId])

  // 支払い種別表示制御
  const billingType = healthFacilityRelatePharmacyId
    ? relatePharmacy?.data.billingType // 編集時
    : postsData?.billingType // 作成時
  const watchBillingType = useWatch({ control: control, name: 'billingType' })
  const showPaymentType = (watchBillingType ? watchBillingType : billingType) === 'BATCH'

  // 振込口座の表示制御
  const paymentType = healthFacilityRelatePharmacyId
    ? relatePharmacy?.data.paymentType // 編集時
    : postsData?.paymentType // 作成時
  const watchPaymentType = useWatch({ control: control, name: 'paymentType' })
  const showAccountManageId = (watchPaymentType ? watchPaymentType : paymentType) === 'TRANSFER'

  // フォーム表示制御
  const showForm = healthFacilityRelatePharmacyId ? !!relatePharmacy : !!postsData

  return (
    <Box sx={{ minWidth: 470 }}>
      {showForm && (
        <>
          {!isPastStartDate && (
            <>
              <ControlDatePicker
                required
                label='対応開始日'
                name='startDate'
                control={control}
                error={!!errors.startDate}
                helperText={
                  '変更予約を設定します。指定日深夜に変更が適用されます。該当日を迎えるまでは予約内容の取消及び変更が可能です。 ' +
                  (errors.startDate?.message || '')
                }
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
                  '選択した新しい店舗に合わせて施設の振込口座を変更します。 ' + (errors.pharmacyId?.message || '')
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
                helperText={
                  '施設へ一括請求する時の請求書の患者並び順を指定します ' + (errors.patientSortType?.message || '')
                }
              />
            </>
          )}
          <TextField
            required
            {...register('note')}
            label='備考'
            placeholder=''
            error={!!errors.note}
            helperText={errors.note?.message}
          />
        </>
      )}
    </Box>
  )
}
