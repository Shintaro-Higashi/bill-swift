import { useFormContext } from 'react-hook-form'
import { BoxEditProps, BoxEditStatus, PatientEditingForm, PatientModel } from '@/types'
import { Box, Button, Stack, SxProps, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { HttpError } from '@refinedev/core'
import { ArrowBackOutlined, HouseOutlined, LocalPhoneOutlined, SaveOutlined } from '@mui/icons-material'
import { FieldItem } from '@components/core/content/FieldItem'
import useConfirm from '@/core/hooks/useConfirm'
import { PaperToggleBox } from '@components/domains/patients/paperToggleBox'
import { joinString } from '@/core/utils/commonUtil'
import { Theme } from '@mui/system'

const BOX_NAME: BoxEditStatus = 'delivery'

type Props = {
  sx?: SxProps<Theme> | undefined
} & BoxEditProps

/**
 * 患者送付先表示,編集コンポーネントです。
 */
export const PatientDeliverySwitchForm = (props: Props) => {
  const {
    refineCore: { queryResult },
  } = useFormContext<PatientModel, HttpError, PatientEditingForm>()
  const patient = queryResult ? queryResult.data?.data : undefined
  const { sx, boxEditStatus, setBoxEditStatus } = props

  return (
    <PaperToggleBox
      title='送付先情報'
      icon={<HouseOutlined />}
      sx={sx}
      boxName={BOX_NAME}
      boxEditStatus={boxEditStatus}
      setBoxEditStatus={setBoxEditStatus}
    >
      {boxEditStatus !== BOX_NAME ? (
        <PatientDeliveryView record={patient} />
      ) : (
        <PatientDeliveryForm
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
 * 患者送付先表示コンポーネントです。
 */
const PatientDeliveryView = (props: ViewProps) => {
  const { record } = props
  return (
    <Stack alignItems='flex-start' spacing={1} sx={{ ml: 1 }}>
      <FieldItem
        label='住所'
        icon={<HouseOutlined />}
        value={joinString([
          record?.deliveryPostalCode,
          record?.deliveryAddress1,
          record?.deliveryAddress2,
          record?.deliveryName,
        ])}
      />
      <FieldItem label='電話番号' icon={<LocalPhoneOutlined />} value={record?.deliveryTel} />
    </Stack>
  )
}

type FormProps = {
  handleCancelButtonClick: () => void
} & BoxEditProps

/**
 * 患者送付先編集コンポーネントです。
 */
const PatientDeliveryForm = (props: FormProps) => {
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

  const targetFields = [
    register('deliveryName').name,
    register('deliveryPostalCode').name,
    register('deliveryAddress1').name,
    register('deliveryAddress2').name,
    register('deliveryTel').name,
  ]

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
      message: '患者の送付先情報を編集します。操作を続けてもよろしいですか',
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
        {...register('deliveryPostalCode')}
        label='郵便番号'
        placeholder='103-0027'
        error={!!errors.deliveryPostalCode}
        helperText={'ハイフン付きで入力 ' + (errors.deliveryPostalCode?.message || '')}
      />
      <TextField
        required
        {...register('deliveryAddress1')}
        label='住所1'
        placeholder='東京都中央区日本橋浜町2-6-1'
        error={!!errors.deliveryAddress1}
        helperText={'住所を入力 ' + (errors.deliveryAddress1?.message || '')}
      />
      <TextField
        {...register('deliveryAddress2')}
        label='住所2'
        placeholder='浜町パルクビル3階'
        error={!!errors.deliveryAddress2}
        helperText={'住所1に収まらない場合に入力 ' + (errors.deliveryAddress2?.message || '')}
      />
      <TextField
        required
        {...register('deliveryName')}
        label='送付先名'
        placeholder='山田 太郎'
        error={!!errors.deliveryName}
        helperText={errors.deliveryName?.message}
      />
      <TextField
        required
        {...register('deliveryTel')}
        label='電話番号'
        placeholder='03-6206-2657'
        error={!!errors.deliveryTel}
        helperText={'ハイフン付きで入力 ' + (errors.deliveryTel?.message || '')}
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
