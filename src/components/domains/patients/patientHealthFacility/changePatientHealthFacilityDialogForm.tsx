'use client'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, { MouseEventHandler, PropsWithChildren, useEffect, useMemo } from 'react'
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
import {
  getPatientHealthFacilityChangeReasonValue,
  PATIENT_HEALTH_FACILITY_CHANGE_REASON_LIST,
} from '@/shared/items/patientHealthFacilityChangeReason'
import { FieldErrors, useWatch } from 'react-hook-form'
import Typography from '@mui/material/Typography'
import { z } from 'zod'
import { isFutureChangedPatientHealthFacility } from '@/shared/services/patientRelateHealthFacilityService'
import { FieldItem } from '@components/core/content/FieldItem'
import { RubyItem } from '@components/core/content/rubyItem'
import { formatDate, formatDateTime } from '@/core/utils/dateUtil'

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

type DialogProps = {
  // ダイアログ開閉状態
  open: boolean
  // ダイアログClose時のハンドラ(b: true時は更新完了時)
  onClose: (b: boolean) => void
  // form submit
  onClick: MouseEventHandler<HTMLButtonElement>
}

const BaseDialog = (props: DialogProps & PropsWithChildren) => {
  const { open, onClose, onClick, children } = props

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>所属施設情報の変更</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>施設の変更をやめる</Button>
        <Button variant='contained' onClick={onClick}>
          施設を変更
        </Button>
      </DialogActions>
    </Dialog>
  )
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
  const isPastEditForm = useMemo(() => {
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

  // 店舗変更は自動化のみのため除外
  const reasonOptions = PATIENT_HEALTH_FACILITY_CHANGE_REASON_LIST.filter(
    (keyValue) => keyValue.key !== 'CHANGE_PHARMACY',
  )

  const NoteTextField = (
    <TextField
      {...register('note')}
      label='備考'
      placeholder=''
      error={!!errors.note}
      helperText={errors.note?.message}
    />
  )

  // 備考のみ編集可
  if (isPastEditForm) {
    return (
      <BaseDialog open={open} onClose={onClose} onClick={handleSubmit(handleEdit)}>
        <Typography>入居(予定)日が当日より前のため備考のみ修正可能です</Typography>
        <FieldItem
          label='変更理由'
          value={getPatientHealthFacilityChangeReasonValue(patientRelateHealthFacility?.reason)}
        />
        <FieldItem
          label='施設'
          value={
            <RubyItem
              value={patientRelateHealthFacility?.healthFacility?.name}
              ruby={patientRelateHealthFacility?.healthFacility?.nameKana}
            />
          }
        />
        <FieldItem label='患者番号' value={patientRelateHealthFacility?.patientCode} />
        <FieldItem label='入居(予定)日' value={formatDate(patientRelateHealthFacility?.startDate)} />
        <FieldItem label='退出(予定)日' value={formatDate(patientRelateHealthFacility?.endDate)} />
        {NoteTextField}
      </BaseDialog>
    )
  }

  return (
    <BaseDialog open={open} onClose={onClose} onClick={handleSubmit(handleEdit)}>
      {reason && (
        <>
          <Typography>[入居日、または退出日に未来を設定した場合]</Typography>
          <Typography>・変更予約扱いになります。変更予約は指定日深夜に変更が適用されます。</Typography>
          <Typography>・該当日を迎えるまでは予約内容の取消及び変更が可能です。</Typography>
          <Typography>[入居日、または退出日に過去を設定した場合]</Typography>
          <Typography>・変更は即時に反映されます</Typography>
        </>
      )}
      <ControlItemAutocomplete
        required
        label='変更理由'
        name='reason'
        control={control}
        disabled={!!patientRelateHealthFacility}
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
            disabled={isPastEditForm}
            error={!!relocationErrors?.healthFacilityId}
            helperText={relocationErrors.healthFacilityId?.message}
          />
          <ControlDatePicker
            required
            label='入居(予定)日'
            name='startDate'
            control={control}
            disabled={isPastEditForm}
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
            disabled={isPastEditForm}
            error={!!deceaseExitErrors.endDate}
            helperText={deceaseExitErrors?.endDate?.message}
          />
        </>
      )}
      {NoteTextField}
    </BaseDialog>
  )
}
