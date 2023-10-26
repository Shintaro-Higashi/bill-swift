'use client'

/**
 * 施設の転居、退去を操作するFormダイアログを提供します。
 * <pre>
 *  UIはダイアログCallボタンを提供します。
 * </pre>
 */
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tooltip } from '@mui/material'
import { LowPriorityOutlined } from '@mui/icons-material'
import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import {
  PatientHealthFacilityDeceaseExitEditingSchema,
  PatientHealthFacilityEditingForm,
  PatientHealthFacilityEditingSchema,
  PatientHealthFacilityRelocationEditingSchema,
  PatientModel,
} from '@/types'
import { ControlAutocomplete } from '@components/core/form/controlAutocomplete'
import { useForm } from '@refinedev/react-hook-form'
import { BaseRecord, HttpError } from '@refinedev/core'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSubmitErrorNotification } from '@/core/utils/refineUtil'
import useConfirm from '@/core/hooks/useConfirm'
import { Loading } from '@components/core/content/loading'
import { ControlDatePicker } from '@components/core/form/controlDatePicker'
import { ControlItemAutocomplete } from '@components/core/form/controlItemAutocomplete'
import { PATIENT_HEALTH_FACILITY_CHANGE_REASON_LIST } from '@/shared/items/patientHealthFacilityChangeReason'
import { FieldErrors, useWatch } from 'react-hook-form'
import Typography from '@mui/material/Typography'
import { z } from 'zod'

type Props = {
  viewBoxEditButton: boolean
  patient: PatientModel | undefined
}

const errorNotification = new FormSubmitErrorNotification<PatientHealthFacilityEditingForm>()

export const ChangePatientHealthFacilityDialogForm = (props: Props) => {
  const { patient, viewBoxEditButton } = props

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<BaseRecord, HttpError, PatientHealthFacilityEditingForm>({
    resolver: zodResolver(PatientHealthFacilityEditingSchema),
    refineCoreProps: {
      errorNotification: errorNotification.notification,
      action: 'create',
      resource: `patients/${patient?.id}/health-facilities`,
      redirect: false,
      onMutationSuccess: (_data, _variables, _context, _isAutoSave) => {
        const buttons = document.querySelectorAll('.MuiCardHeader-action button') as NodeListOf<HTMLButtonElement>
        const refreshButton = buttons[buttons.length - 1]
        refreshButton.click()
        setOpen(false)
      },
      successNotification: (data, values, resource) => {
        return {
          message: '施設情報の変更が完了しました',
          description: '操作完了',
          type: 'success',
        }
      },
    },
  })
  const deceaseExitErrors: FieldErrors<z.infer<typeof PatientHealthFacilityDeceaseExitEditingSchema>> = errors
  const relocationErrors: FieldErrors<z.infer<typeof PatientHealthFacilityRelocationEditingSchema>> = errors
  const reason = useWatch({ control: control, name: 'reason' })

  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true)
    reset()
  }

  const handleClose = () => {
    setOpen(false)
  }

  errorNotification.error = setError
  const { $confirm } = useConfirm()

  const handleEdit = (e: any) => {
    $confirm({
      message: '施設を変更します。操作を続けてもよろしいですか',
      onConfirm() {
        saveButtonProps.onClick(e)
      },
    })
  }

  if (!patient) return <Loading />

  const reasonOptions = PATIENT_HEALTH_FACILITY_CHANGE_REASON_LIST.filter(
    (keyValue) => keyValue.key !== 'CHANGE_PHARMACY',
  )

  return (
    <Box
      flexDirection='row'
      justifyContent='flex-end'
      display='flex'
      sx={{ position: 'relative', width: '100%', marginTop: 0, display: viewBoxEditButton ? 'flex' : 'none' }}
    >
      <Tooltip title='施設の退去、転居を行う'>
        <IconButton
          color='primary'
          sx={{ position: 'absolute', right: '0px', bottom: 0, zIndex: 100 }}
          aria-label='change-health-facility'
          onClick={handleOpen}
        >
          <LowPriorityOutlined />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>所属施設情報の変更</DialogTitle>
        <DialogContent>
          {reason === 'RELOCATION' && (
            <>
              <Typography>転出予定の場合は入居日に未来の日付を指定してください</Typography>
              <Typography>予定日中に患者番号が新しい施設の番号に切り替わります</Typography>
              <Typography>現在入居中の退去日は転出先施設入居日の１日前になります</Typography>
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
                defaultId={patient?.healthFacilityId}
                control={control}
                error={!!relocationErrors?.healthFacilityId}
                helperText={relocationErrors.healthFacilityId?.message}
              />
              <ControlDatePicker
                required
                label='入居日'
                name='startDate'
                control={control}
                error={!!relocationErrors.startDate}
                helperText={relocationErrors.startDate?.message}
              />
            </>
          )}
          {reason && reason !== 'RELOCATION' && (
            <>
              <ControlDatePicker
                required
                label='退出日'
                name='endDate'
                control={control}
                error={!!deceaseExitErrors}
                helperText={deceaseExitErrors?.endDate?.message}
              />
            </>
          )}
          <TextField
            {...register('note')}
            label='備考'
            placeholder=''
            multiline
            rows={2}
            error={!!errors.note}
            helperText={errors.note?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>施設の変更をやめる</Button>
          <Button variant='contained' onClick={handleSubmit(handleEdit)}>
            施設を変更
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
