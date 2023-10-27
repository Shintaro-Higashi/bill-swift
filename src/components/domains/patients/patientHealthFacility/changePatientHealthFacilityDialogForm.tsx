'use client'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import {
  PatientHealthFacilityDeceaseExitEditingSchema,
  PatientHealthFacilityEditingForm,
  PatientHealthFacilityEditingSchema,
  PatientHealthFacilityRelocationEditingSchema,
  PatientModel,
  PatientRelateHealthFacilityModel,
} from '@/types'
import { ControlAutocomplete } from '@components/core/form/controlAutocomplete'
import { useForm } from '@refinedev/react-hook-form'
import { BaseRecord, HttpError } from '@refinedev/core'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSubmitErrorNotification, getRefineRefreshButton } from '@/core/utils/refineUtil'
import useConfirm from '@/core/hooks/useConfirm'
import { ControlDatePicker } from '@components/core/form/controlDatePicker'
import { ControlItemAutocomplete } from '@components/core/form/controlItemAutocomplete'
import { PATIENT_HEALTH_FACILITY_CHANGE_REASON_LIST } from '@/shared/items/patientHealthFacilityChangeReason'
import { FieldErrors, useWatch } from 'react-hook-form'
import Typography from '@mui/material/Typography'
import { z } from 'zod'
import { isFutureChangedPatientHealthFacility } from '@/shared/services/patientRelateHealthFacilityService'

type Props = {
  // ダイアログ開閉状態
  open: boolean
  // ダイアログClose時のハンドラ(b: true時は更新完了時)
  onClose: (b: boolean) => void
  // 操作対象患者情報
  patient: PatientModel | undefined
  // 患者関連施設(予定の修正を操作,または履歴の備考修正)
  patientRelateHealthFacility?: PatientRelateHealthFacilityModel
}

const errorNotification = new FormSubmitErrorNotification<PatientHealthFacilityEditingForm>()

/**
 * 新規関連施設の変更か、既存予定関連施設の修正かに応じて実施するAPIリソースのsuffixを切り替えます。
 */
const getResourceSuffix = (patientRelateHealthFacility: PatientRelateHealthFacilityModel | undefined) => {
  if (patientRelateHealthFacility?.id) return `/${patientRelateHealthFacility.id}`
  return ''
}

/**
 * 施設の転居、退去を操作するFormダイアログです。
 * <pre>
 *  ・新たに施設の変更、または現在施設からの退出が可能です。(props.patientHealthFacilityEditingForm を未指定で利用)
 *  ・patientHealthFacilityEditingForm を指定すれば将来予定の転居、または転出予定の編集が可能です。(props.patientHealthFacilityEditingForm を指定して利用)
 * </pre>
 */
export const ChangePatientHealthFacilityDialogForm = (props: Props) => {
  const { open, onClose, patient, patientRelateHealthFacility } = props

  const {
    saveButtonProps,
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    setError,
  } = useForm<BaseRecord, HttpError, PatientHealthFacilityEditingForm>({
    resolver: zodResolver(PatientHealthFacilityEditingSchema),
    refineCoreProps: {
      errorNotification: errorNotification.notification,
      action: 'edit',
      id: '',
      resource: `patients/${patient?.id}/health-facilities${getResourceSuffix(patientRelateHealthFacility)}`,
      redirect: false,
      queryOptions: {
        enabled: false,
      },
      onMutationSuccess: (_data, _variables, _context, _isAutoSave) => {
        getRefineRefreshButton()?.click()
        onClose(true)
      },
      successNotification: (_data, _values, _resource) => {
        return {
          message: '関連施設情報の変更が完了しました',
          description: '操作完了',
          type: 'success',
        }
      },
    },
  })
  errorNotification.error = setError
  const { $confirm } = useConfirm()

  // 過去関連施設は備考のみ修正可能
  const isPastRelateHealthFacility = useMemo(() => {
    if (!patient || !patientRelateHealthFacility) return false
    return !isFutureChangedPatientHealthFacility(patientRelateHealthFacility)
  }, [patient, patientRelateHealthFacility])

  useEffect(() => {
    if (!open) return
    reset()
    if (patientRelateHealthFacility) {
      if (patientRelateHealthFacility.reason === 'CHANGE_PHARMACY') throw new Error('店舗変更理由は編集できません')

      setValue('reason', patientRelateHealthFacility.reason ?? 'RELOCATION')
      setValue('note', patientRelateHealthFacility.note)
      setValue('healthFacilityId', patientRelateHealthFacility.healthFacilityId)
      setValue('startDate', patientRelateHealthFacility.startDate)
      setValue('endDate', patientRelateHealthFacility.endDate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const deceaseExitErrors: FieldErrors<z.infer<typeof PatientHealthFacilityDeceaseExitEditingSchema>> = errors
  const relocationErrors: FieldErrors<z.infer<typeof PatientHealthFacilityRelocationEditingSchema>> = errors
  const reason = useWatch({ control: control, name: 'reason' })

  const handleEdit = (e: any) => {
    $confirm({
      message: '施設を変更します。操作を続けてもよろしいですか',
      onConfirm() {
        saveButtonProps.onClick(e)
      },
    })
  }

  const reasonOptions = PATIENT_HEALTH_FACILITY_CHANGE_REASON_LIST.filter(
    (keyValue) => keyValue.key !== 'CHANGE_PHARMACY',
  )

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>所属施設情報の変更</DialogTitle>
      <DialogContent>
        {reason === 'RELOCATION' && (
          <>
            <Typography>転出予定の場合は入居日に未来の日付を指定してください</Typography>
            <Typography>予定日深夜に患者番号が新しい施設の番号に切り替わります</Typography>
            <Typography>すでに転出済の場合は転出した過去日を指定すると患者番号はすぐに切り替わります</Typography>
          </>
        )}
        {(reason === 'DECEASE' || reason === 'EXIT') && (
          <>
            <Typography></Typography>
          </>
        )}
        <ControlItemAutocomplete
          required
          label='変更理由'
          name='reason'
          control={control}
          readOnly={!!patientRelateHealthFacility}
          error={!!errors.reason}
          helperText={errors.reason?.message}
          options={reasonOptions}
        />
        {reason && reason === 'RELOCATION' && (
          <>
            <ControlAutocomplete
              required
              resource='healthFacilities'
              label='施設'
              name='healthFacilityId'
              control={control}
              readOnly={isPastRelateHealthFacility}
              error={!!relocationErrors?.healthFacilityId}
              helperText={relocationErrors.healthFacilityId?.message}
            />
            <ControlDatePicker
              required
              label='入居(予定)日'
              name='startDate'
              control={control}
              readOnly={isPastRelateHealthFacility}
              error={!!relocationErrors.startDate}
              helperText={relocationErrors.startDate?.message}
            />
          </>
        )}
        {reason && reason !== 'RELOCATION' && (
          <>
            <ControlDatePicker
              required
              label='退出(予定)日'
              name='endDate'
              control={control}
              readOnly={isPastRelateHealthFacility}
              error={!!deceaseExitErrors.endDate}
              helperText={deceaseExitErrors?.endDate?.message}
            />
          </>
        )}
        <TextField
          {...register('note')}
          label='備考'
          placeholder=''
          multiline
          rows={1}
          error={!!errors.note}
          helperText={errors.note?.message}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>施設の変更をやめる</Button>
        <Button variant='contained' onClick={handleSubmit(handleEdit)}>
          施設を変更
        </Button>
      </DialogActions>
    </Dialog>
  )
}
