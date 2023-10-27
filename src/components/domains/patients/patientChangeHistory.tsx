'use client'

/**
 * 患者情報変更履歴を表示するコンポーネント定義です。
 * <pre>
 * </pre>
 */
import React, { Fragment, useState } from 'react'
import { PatientChangeContentModel, PatientChangeHistoryModel } from '@/types'
import { Alert, Box, Divider, List, ListItem, ListItemText, SxProps } from '@mui/material'
import { HttpError, useList } from '@refinedev/core'
import { Loading } from '@components/core/content/loading'
import { formatDateTime } from '@/core/utils/dateUtil'
import { Theme } from '@mui/system'
import useDiffContentDialog, { DiffContentDialogProvider } from '@components/domains/patients/diffContentDialog'
import { HistoryOutlined } from '@mui/icons-material'
import { PaperBox } from '@/components/core/content/paperBox'

// 差分値のスタイル
const DIFF_VALUE_SX: SxProps<Theme> = {
  fontWeight: 'bold',
}

// 差分内容表示コンポーネントProps
type ContentProps = {
  patientChangeContent: PatientChangeContentModel
}

/**
 * viewTypeがsimpleの時の患者変更内容の差分情報を表示します。
 * @param props
 */
const PatientChangeSimpleContent = (props: ContentProps) => {
  const {
    patientChangeContent: { diffType, beforeValue, afterValue },
  } = props
  switch (diffType) {
    case 'added':
      return (
        <>
          <Box component='span' sx={DIFF_VALUE_SX}>
            {afterValue}
          </Box>{' '}
          を追加しました
        </>
      )
    case 'changed':
      return (
        <>
          を&nbsp;
          <Box component='span' sx={DIFF_VALUE_SX}>
            {beforeValue}
          </Box>{' '}
          から{' '}
          <Box component='span' sx={DIFF_VALUE_SX}>
            {afterValue}
          </Box>{' '}
          に変更しました
        </>
      )
    case 'deleted':
      return (
        <>
          <Box component='span' sx={DIFF_VALUE_SX}>
            {beforeValue}
          </Box>{' '}
          を削除しました
        </>
      )
    default:
      return null
  }
}

/**
 * viewTypeがdiffの時の患者変更内容の差分情報を表示します。
 * @param props
 */
const PatientChangeDiffContent = (props: ContentProps) => {
  const {
    patientChangeContent: { diffType, beforeValue, afterValue },
  } = props

  const { $openDiffDialog } = useDiffContentDialog()

  const handleOnClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    $openDiffDialog({ content: { old: beforeValue, new: afterValue } })
  }

  switch (diffType) {
    case 'added':
      return (
        <>
          を追加しました
          <a href='#' onClick={handleOnClick}>
            (追加内容)
          </a>
        </>
      )
    case 'changed':
      return (
        <>
          を変更しました
          <a href='#' onClick={handleOnClick}>
            (変更内容)
          </a>
        </>
      )

    case 'deleted':
      return (
        <>
          を削除しました
          <a href='#' onClick={handleOnClick}>
            (削除内容)
          </a>
        </>
      )
    default:
      return null
  }
}

/**
 * 患者変更内容を表示します。
 * @param props
 */
const PatientChangeContent = (props: ContentProps) => {
  const {
    patientChangeContent: { itemName, childItemName, viewType },
  } = props

  const changeContent =
    viewType === 'simple' ? (
      <PatientChangeSimpleContent patientChangeContent={props.patientChangeContent} />
    ) : (
      <PatientChangeDiffContent patientChangeContent={props.patientChangeContent} />
    )

  return (
    <Box component='span'>
      `{`${itemName}${childItemName ? ' ' + childItemName : ''}`}`&nbsp;{changeContent}
    </Box>
  )
}

type Props = {
  // 変更履歴取得対象の患者ID
  patientId: string
  // 該当患者IDの最終更新日時(変更が発生したら履歴の再取得を行う判定に利用)
  updatedAt: Date | null | undefined
}

/**
 * 患者情報変更履歴を表示します。
 */
export const PatientChangeHistory = (props: Props) => {
  const { patientId } = props

  const { data, isLoading, isError } = useList<PatientChangeHistoryModel, HttpError>({
    resource: `patients/${patientId}/changed-histories`,
    pagination: {
      // TODO 猶予ができれば無限スクロール化を推奨
      pageSize: 300,
    },
    filters: [{ field: 'uid', operator: 'eq', value: props.updatedAt }],
  })

  if (isLoading || isError) {
    return <Loading />
  }
  const records = data.data

  return (
    <PaperBox title='患者情報変更履歴' icon={<HistoryOutlined />} sx={{ p: 0, mt: 2 }}>
      <List sx={{ width: '100%', py: 0, maxHeight: 200, overflowY: 'auto' }}>
        <Alert severity='info'>施設、患者番号の変更履歴は`施設変更履歴`から確認します</Alert>
        {records.length === 0 && <Box sx={{ pl: 3 }}>変更はありません</Box>}
        <DiffContentDialogProvider>
          {records.map((record) => {
            return (
              <Fragment key={record.id}>
                <ListItem alignItems='flex-start'>
                  <ListItemText
                    primary={
                      <Box component='ul' sx={{ paddingLeft: 1 }}>
                        {record?.patientChangeContent?.map((content) => {
                          return (
                            <Fragment key={content.id}>
                              <li>
                                <PatientChangeContent patientChangeContent={content} />
                              </li>
                            </Fragment>
                          )
                        })}
                      </Box>
                    }
                    secondary={`${record?.createdUser?.name} が ${formatDateTime(record?.updatedAt)} に更新`}
                  />
                </ListItem>
                <Divider component='li' />{' '}
              </Fragment>
            )
          })}
        </DiffContentDialogProvider>
      </List>
    </PaperBox>
  )
}
