import { Control, FieldErrors, UseFormRegister, useWatch } from 'react-hook-form'
import { HealthFacilityCreationForm, HealthFacilityEditingForm, HealthFacilityModel } from '@/types'
import { Box, TextField } from '@mui/material'
import { GetOneResponse } from '@refinedev/core'
import { QueryObserverResult } from '@tanstack/query-core'
import { ControlAutocomplete } from '@/components/core/form/controlAutocomplete'
import { ControlDatePicker } from '@/components/core/form/controlDatePicker'
import { ControlItemAutocomplete } from '@/components/core/form/controlItemAutocomplete'
import { BILLING_TYPE_LIST } from '@/shared/items/billingType'
import { HEALTH_FACILITY_PAYMENT_TYPE_LIST } from '@/shared/items/healthFacilityPaymentType'
import { PATIENT_SORT_TYPE_LIST } from '@/shared/items/patientSortType'
import { FieldItem } from '@/components/core/content/FieldItem'
import { RubyItem } from '@/components/core/content/rubyItem'
import { formatDate } from '@/core/utils/dateUtil'

// 施設作成、編集フォームプロパティ
type Props = {
  /** 施設作成、編集入力フィールド情報 */
  register: UseFormRegister<HealthFacilityCreationForm | HealthFacilityEditingForm>
  /** クエリ結果情報 */
  queryResult?: QueryObserverResult<GetOneResponse<HealthFacilityModel>> | undefined
  /** コントローラー情報 */
  control: Control<HealthFacilityCreationForm | HealthFacilityEditingForm>
  /** フォーム入力エラー情報 */
  errors: FieldErrors<HealthFacilityCreationForm | HealthFacilityEditingForm>
}

/**
 * 施設作成、編集フォームです。
 */
export const HealthFacilitySaveForm = (props: Props) => {
  const { register, queryResult, control, errors } = props
  const postsData = queryResult ? queryResult.data?.data : undefined
  const startDate = postsData?.healthFacilityRelatePharmacy
    ? new Date(postsData?.healthFacilityRelatePharmacy[0].startDate)
    : null

  // 新規作成時のみ表示する条件
  const isCreateAction = !postsData

  // 支払い種別表示制御
  const billingType = postsData?.billingType
  const watchBillingType = useWatch({ control: control, name: 'billingType' })
  const showPaymentType = (watchBillingType ? watchBillingType : billingType) === 'BATCH'

  // 振込口座の表示制御
  const paymentType = postsData?.paymentType
  const watchPaymentType = useWatch({ control: control, name: 'paymentType' })
  const showAccountManageId = showPaymentType && (watchPaymentType ? watchPaymentType : paymentType) === 'TRANSFER'

  return (
    <Box component='form' sx={{ display: 'flex', flexDirection: 'column' }} autoComplete='off'>
      {isCreateAction ? (
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
            helperText={errors.pharmacyId?.message}
            optionLabel={(option: any) => {
              return option?.pharmacyGroup?.name + ' ' + option?.name ?? ''
            }}
          />
        </>
      ) : (
        <>
          <FieldItem label='対応開始日' value={formatDate(startDate)} />
          <FieldItem
            label='担当店舗'
            value={
              <Box>
                {postsData?.pharmacy?.pharmacyGroup?.name + ' ' ?? ''}
                <RubyItem value={postsData?.pharmacy?.name} ruby={postsData?.pharmacy?.nameKana} />
              </Box>
            }
          />
        </>
      )}
      <TextField
        required
        {...register('name')}
        label='名称'
        placeholder='XXX施設'
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        required
        {...register('nameKana')}
        label='カナ名称'
        placeholder='XXXシセツ'
        error={!!errors.nameKana}
        helperText={errors.nameKana?.message}
      />
      <TextField
        required
        {...register('postalCode')}
        label='郵便番号'
        placeholder='103-0027'
        error={!!errors.postalCode}
        helperText={'ハイフン付きで入力 ' + (errors.postalCode?.message || '')}
      />
      <TextField
        required
        {...register('address1')}
        label='住所1'
        placeholder='東京都中央区日本橋浜町2-6-1'
        error={!!errors.address1}
        helperText={'住所を入力 ' + (errors.address1?.message || '')}
      />
      <TextField
        {...register('address2')}
        label='住所2'
        placeholder='浜町パルクビル3階'
        error={!!errors.address2}
        helperText={'住所1に収まらない場合に入力 ' + (errors.address2?.message || '')}
      />
      <TextField
        {...register('tel')}
        label='電話番号'
        placeholder='03-6206-2657'
        error={!!errors.tel}
        helperText={'ハイフン付きで入力 ' + (errors.tel?.message || '')}
      />
      <TextField
        {...register('fax')}
        label='FAX番号'
        placeholder='03-6231-0529'
        error={!!errors.fax}
        helperText={'ハイフン付きで入力 ' + (errors.fax?.message || '')}
      />
      <TextField
        {...register('mail')}
        label='メールアドレス'
        placeholder='XXX@XXX.XX'
        error={!!errors.mail}
        helperText={errors.mail?.message}
      />
      <TextField
        {...register('url')}
        label='URL'
        placeholder='https://XXX.XXX.XXX'
        error={!!errors.url}
        helperText={errors.url?.message}
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
      <TextField
        {...register('note')}
        label='備考'
        placeholder=''
        multiline
        rows={5}
        error={!!errors.note}
        helperText={errors.note?.message}
      />
    </Box>
  )
}
