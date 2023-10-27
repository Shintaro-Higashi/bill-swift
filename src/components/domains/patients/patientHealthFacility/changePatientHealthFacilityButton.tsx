'use client'

import { Box, Button, Tooltip } from '@mui/material'
import { LowPriorityOutlined } from '@mui/icons-material'
import React, { useState } from 'react'
import { PatientModel } from '@/types'
import { ChangePatientHealthFacilityDialogForm } from '@components/domains/patients/patientHealthFacility/changePatientHealthFacilityDialogForm'

type Props = {
  // ボタン配置対象Boxが編集可能か(呼び出しボタンもこのステータスに連動)
  viewBoxEditButton: boolean
  // 患者情報
  patient: PatientModel | undefined
}

/**
 * 施設の転居、退去を操作するFormダイアログを呼び出すボタン定義です。
 */
export const ChangePatientHealthFacilityButton = (props: Props) => {
  const { patient, viewBoxEditButton } = props
  const [open, setOpen] = useState(false)
  const onClick = () => {
    setOpen(true)
  }
  const onClose = (_isSuccess: boolean) => {
    setOpen(false)
  }

  if (!patient) return null

  return (
    <Box
      flexDirection='row'
      justifyContent='flex-end'
      display='flex'
      sx={{
        position: 'relative',
        width: '100%',
        marginTop: 0,
        display: 'flex',
        visibility: viewBoxEditButton ? 'visible' : 'hidden',
      }}
    >
      <Tooltip title='施設の変更、または退出を行う'>
        <Button
          aria-label='change-health-facility'
          variant='contained'
          onClick={onClick}
          sx={{ position: 'absolute', right: '0px', bottom: 0, zIndex: 100, paddingX: 0 }}
          size='small'
        >
          <LowPriorityOutlined />
        </Button>
      </Tooltip>
      <ChangePatientHealthFacilityDialogForm open={open} onClose={onClose} patient={patient} />
    </Box>
  )
}
