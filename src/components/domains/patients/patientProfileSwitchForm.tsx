import { useFormContext } from 'react-hook-form'
import { BoxEditProps, BoxEditStatus, PatientEditingForm, PatientEditingSchema, PatientModel } from '@/types'
import { Box, Button, Chip, Stack, SxProps, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { HttpError } from '@refinedev/core'
import {
  ArrowBackOutlined,
  CakeOutlined,
  FormatListNumberedOutlined,
  GroupRemoveOutlined,
  HowToRegOutlined,
  InfoOutlined,
  PersonOutlineOutlined,
  SaveOutlined,
  StoreOutlined,
  SyncProblemOutlined,
  WcOutlined,
} from '@mui/icons-material'
import { FieldItem } from '@components/core/content/FieldItem'
import { RubyItem } from '@components/core/content/rubyItem'
import ContactsIcon from '@mui/icons-material/Contacts'
import { GENDER_LIST, getGenderValue } from '@/shared/items/gender'
import { formatDate } from '@/core/utils/dateUtil'
import { ControlItemAutocomplete } from '@components/core/form/controlItemAutocomplete'
import useConfirm from '@/core/hooks/useConfirm'
import { PaperToggleBox } from '@components/domains/patients/paperToggleBox'
import { Theme } from '@mui/system'
import { ControlDatePicker } from '@components/core/form/controlDatePicker'
import { ChangePatientHealthFacilityButton } from '@components/domains/patients/patientHealthFacility/changePatientHealthFacilityButton'
import { getPatientStatusValue } from '@/shared/items/patientStatus'

const BOX_NAME: BoxEditStatus = 'profile'

type Props = {
  sx?: SxProps<Theme> | undefined
  // 施設の変更操作が可能か否か
  enabledChangedHealthFacility: boolean
} & BoxEditProps

/**
 * 患者基本情報表示,編集コンポーネントです。
 */
export const PatientProfileSwitchForm = (props: Props) => {
  const {
    refineCore: { queryResult },
  } = useFormContext<PatientModel, HttpError, PatientEditingForm>()
  const patient = queryResult ? queryResult.data?.data : undefined
  const { boxEditStatus, setBoxEditStatus, enabledChangedHealthFacility } = props
  const [viewBoxEditButton, setViewBoxEditButton] = useState<boolean>(false)
  const handleShowEditButton = () => {
    setViewBoxEditButton(true)
  }
  const handleHideEditButton = () => {
    setViewBoxEditButton(false)
  }
  return (
    <PaperToggleBox
      title='基本情報'
      icon={<PersonOutlineOutlined />}
      boxName={BOX_NAME}
      boxEditStatus={boxEditStatus}
      setBoxEditStatus={setBoxEditStatus}
      handleShow={handleShowEditButton}
      handleHide={handleHideEditButton}
    >
      {boxEditStatus !== BOX_NAME ? (
        <PatientProfileView
          record={patient}
          viewBoxEditButton={viewBoxEditButton}
          enabledChangedHealthFacility={enabledChangedHealthFacility}
        />
      ) : (
        <PatientProfileForm
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
  viewBoxEditButton: boolean
  // 施設の変更操作が可能か否か
  enabledChangedHealthFacility: boolean
}

/**
 * 患者基本情報表示コンポーネントです。
 */
const PatientProfileView = (props: ViewProps) => {
  const { record, viewBoxEditButton, enabledChangedHealthFacility } = props
  return (
    <Stack alignItems='flex-start' spacing={1} sx={{ ml: 1 }}>
      {record?.receiptSyncFlag ? (
        <Chip icon={<HowToRegOutlined />} color='success' label='レセコン同期済' size='small' />
      ) : (
        <Chip icon={<SyncProblemOutlined />} color='warning' label='レセコン同期未確認' size='small' />
      )}
      {record?.status && record.status !== 'INRESIDENCE' && (
        <Chip
          icon={<GroupRemoveOutlined />}
          color='warning'
          label={getPatientStatusValue(record?.status)}
          size='small'
        />
      )}
      <FieldItem
        label='施設'
        icon={<StoreOutlined />}
        value={<RubyItem value={record?.healthFacility?.name} ruby={record?.healthFacility?.nameKana} />}
      />
      {enabledChangedHealthFacility && (
        <ChangePatientHealthFacilityButton patient={record} viewBoxEditButton={viewBoxEditButton} />
      )}

      <FieldItem label='施設メモ' icon={<InfoOutlined />} value={record?.healthFacilityInfo} />
      <FieldItem label='患者番号' icon={<FormatListNumberedOutlined />} value={record?.code} />
      <FieldItem
        label='患者名'
        icon={<ContactsIcon />}
        value={<RubyItem value={record?.name} ruby={record?.nameKana} />}
      />
      <FieldItem label='性別' icon={<WcOutlined />} value={getGenderValue(record?.gender)} />
      <FieldItem label='生年月日' icon={<CakeOutlined />} value={formatDate(record?.birthday)} />
    </Stack>
  )
}

type FormProps = {
  handleCancelButtonClick: () => void
} & BoxEditProps

/**
 * 患者基本情報編集コンポーネントです。
 */
const PatientProfileForm = (props: FormProps) => {
  const {
    saveButtonProps,
    refineCore: { queryResult },
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    clearErrors,
  } = useFormContext<PatientModel, HttpError, PatientEditingForm>()

  const { handleCancelButtonClick } = props
  const { $confirm } = useConfirm()

  const patient = queryResult ? queryResult.data?.data : undefined

  const targetFields = [
    register('healthFacilityInfo').name,
    register('name').name,
    register('nameKana').name,
    register('gender').name,
    register('birthday').name,
  ]

  // フォーム画面破棄時にform状態をリセットする
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
      message: '患者の基本情報を編集します。操作を続けてもよろしいですか',
      onConfirm() {
        saveButtonProps.onClick(e)
      },
    })
    return false
  }

  return (
    <Box component='form' sx={{ display: 'flex', flexDirection: 'column', px: 1, pb: 1, mb: 1 }} autoComplete='off'>
      <FieldItem label='患者番号' icon={<FormatListNumberedOutlined />} value={patient?.code} />
      <FieldItem
        label='施設'
        icon={<StoreOutlined />}
        value={<RubyItem value={patient?.healthFacility?.name} ruby={patient?.healthFacility?.nameKana} />}
      />
      <TextField
        required
        {...register('healthFacilityInfo')}
        label='施設メモ'
        placeholder='401号室'
        error={!!errors.healthFacilityInfo}
        helperText={errors.healthFacilityInfo?.message}
      />

      <TextField
        required
        {...register('name')}
        label='名称'
        placeholder='山田 太郎'
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        required
        {...register('nameKana')}
        label='カナ名称'
        placeholder='ヤマダ タロウ'
        error={!!errors.nameKana}
        helperText={errors.nameKana?.message}
      />
      <ControlItemAutocomplete
        required
        label='性別'
        name='gender'
        control={control}
        error={!!errors.gender}
        helperText={errors.gender?.message}
        options={GENDER_LIST}
      />
      <ControlDatePicker
        required
        label='生年月日'
        name='birthday'
        control={control}
        error={!!errors.birthday}
        helperText={errors.birthday?.message}
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
