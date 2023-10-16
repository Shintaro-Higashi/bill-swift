'use client'

import React from 'react'

type Props = {
  // 表示する文字列
  value: string | null | undefined
  // 文字列にふるルビ
  ruby: string | null | undefined
}
/**
 * ルビをふって文字列を表示します。
 */
export const RubyItem = (props: Props) => {
  const { value, ruby } = props
  if (!ruby) return <>{value}</>
  return (
    <ruby>
      {value}
      <rt>{ruby}</rt>
    </ruby>
  )
}
