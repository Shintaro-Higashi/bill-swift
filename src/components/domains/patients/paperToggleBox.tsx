import { BoxEditProps, BoxEditStatus } from '@/types'
import React, { useState } from 'react'
import { PaperBox, PaperBoxProps } from '@components/core/content/paperBox'
import { PaperBoxEditButton } from '@components/domains/patients/paperBoxEditButton'

type Props = {
  boxName: BoxEditStatus
  handleShow?: () => void
  handleHide?: () => void
} & BoxEditProps &
  PaperBoxProps

/**
 * 表示用、編集に表示を切り替え可能な患者詳細画面用PaperBoxです。
 * <pre>
 *  Paperをマウスホバーで右下隅に編集ボタンが表示されます。
 *  ただし他のPaperBoxが編集中の時は表示されません。(同時編集不可)
 * </pre>
 */
export const PaperToggleBox = (props: Props) => {
  const { title, icon, sx, children, boxName, boxEditStatus, setBoxEditStatus, handleShow, handleHide } = props
  // 編集ボタン表示制御
  const [showEditButton, setShowEditButton] = useState(false)

  // 編集ボタンの表示制御
  const onMouseEnter = () => {
    if (boxEditStatus === null) {
      setShowEditButton(true)
      if (handleShow) handleShow()
    }
  }

  const onMouseLeave = () => {
    if (showEditButton) {
      setShowEditButton(false)
      if (handleHide) handleHide()
    }
  }

  const handleEditClick = () => {
    setBoxEditStatus(boxName)
    setShowEditButton(false)
    if (handleHide) handleHide()
  }

  return (
    <PaperBox title={title} icon={icon} sx={sx} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
      <PaperBoxEditButton showButton={showEditButton} handleClick={handleEditClick} />
    </PaperBox>
  )
}
