import { useFormContext } from 'react-hook-form'
import { BoxEditProps, BoxEditStatus, PatientEditingForm, PatientModel } from '@/types'
import { Box, Button, Stack, SxProps, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { HttpError } from '@refinedev/core'
import { ArrowBackOutlined, InfoOutlined, SaveOutlined } from '@mui/icons-material'
import useConfirm from '@/core/hooks/useConfirm'
import { PaperToggleBox } from '@components/domains/patients/paperToggleBox'
import { Theme } from '@mui/system'

const BOX_NAME: BoxEditStatus = 'note'

type Props = {
  sx?: SxProps<Theme> | undefined
} & BoxEditProps

/**
 * 患者備考表示,編集コンポーネントです。
 */
export const PatientNoteSwitchForm = (props: Props) => {
  const {
    refineCore: { queryResult },
  } = useFormContext<PatientModel, HttpError, PatientEditingForm>()
  const patient = queryResult ? queryResult.data?.data : undefined
  const { boxEditStatus, setBoxEditStatus } = props
  return (
    <PaperToggleBox
      title='備考'
      icon={<InfoOutlined />}
      boxName={BOX_NAME}
      sx={{ p: 0, mt: 2 }}
      boxEditStatus={boxEditStatus}
      setBoxEditStatus={setBoxEditStatus}
    >
      {boxEditStatus !== BOX_NAME ? (
        <PatientNoteView record={patient} />
      ) : (
        <PatientNoteForm
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

/**
 * 患者備考表示コンポーネントです。
 */
const PatientNoteView = (props: ViewProps) => {
  const { record } = props
  return (
    <Box sx={{ px: 1, maxHeight: 400, overflowY: 'auto' }}>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{record?.note || 'なし'}</pre>
    </Box>
  )
}

type FormProps = {
  handleCancelButtonClick: () => void
} & BoxEditProps

/**
 * 患者備考編集コンポーネントです。
 */
const PatientNoteForm = (props: FormProps) => {
  const {
    saveButtonProps,
    refineCore: { queryResult },
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
  } = useFormContext<PatientModel, HttpError, PatientEditingForm>()

  const { handleCancelButtonClick } = props
  const { $confirm } = useConfirm()

  const patient = queryResult ? queryResult.data?.data : undefined

  const targetFields = [register('note').name]

  // フォーム画面破棄時にform状態をリセットする
  useEffect(() => {
    return () => {
      for (const field of targetFields) {
        setValue(field, patient[field])
      }
      clearErrors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEdit = async (e: any) => {
    $confirm({
      message: '患者備考情報を編集します。操作を続けてもよろしいですか',
      onConfirm() {
        saveButtonProps.onClick(e)
      },
    })
    return false
  }

  return (
    <Box component='form' sx={{ display: 'flex', flexDirection: 'column', px: 1, pb: 1, mb: 1 }} autoComplete='off'>
      <TextField
        required
        {...register('note')}
        label='備考'
        placeholder='患者様の特記事項を記入'
        error={!!errors.note}
        helperText={errors.note?.message}
        multiline
        rows={5}
      />
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
