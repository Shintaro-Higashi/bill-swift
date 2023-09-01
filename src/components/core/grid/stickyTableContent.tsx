'use client'

import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'

/**
 * mui x-data-girdをヘッダ固定で利用する場合,データ部の高さを画面いっぱいの高さまで表示するためのコンポーネントです。
 * @param children 子ノード
 */
const StickyTableContent: React.FC<PropsWithChildren> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | null>(null)

  useEffect(() => {
    const updateContentHeight = () => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight
        setContentHeight(height)
      }
    }

    updateContentHeight()
    window.addEventListener('resize', updateContentHeight)

    // アンマウントされる時にイベントリスナー削除
    return () => {
      window.removeEventListener('resize', updateContentHeight)
    }
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <div
        className='stickey-table-content'
        ref={contentRef}
        style={{ height: contentHeight ?? '70vh', width: '100%' }}
      >
        {children}
      </div>
    </div>
  )
}

export default StickyTableContent
