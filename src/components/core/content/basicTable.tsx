import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'

/**
 * プロパティ型定義
 */
type Props = {
  /** タイトル */
  title?: string
  /** テーブルヘッダーデータ */
  tableHeadRow: string[]
  /** テーブルボディデータ */
  tableBodyRows: any[]
  /** 列の幅 */
  columnWidth?: string[]
  /** アイコンコンポーネント */
  icon?: any
  /** ハイライトする行 */
  highLightRows?: number[]
}

/**
 * MUIのTableを利用したシンプルなテーブルコンポーネントです。
 * テーブルヘッダー、ボディの各データを配列で受け取り、テーブルを生成します。
 *
 * @param title タイトルテキスト
 * @param tableHeadRow テーブルヘッダーデータ
 * @param tableBodyRows テーブルボディデータ
 * @param columnWidth 列の幅：指定しない場合は自動調整
 * @param icon タイトル横のアイコン
 * @param highLightRows ハイライトする行
 */

export const BasicTable = (props: Props) => {
  const { title, tableHeadRow, tableBodyRows, columnWidth, icon, highLightRows } = props

  return (
    <Paper>
      {title ? (
        <Typography sx={{ pt: 2, pl: 2, pb: 1 }} variant='h6' component='div'>
          {icon ? <Box sx={{ display: 'inline', verticalAlign: '-4px', mr: '10px' }}>{icon}</Box> : null}
          {title}
        </Typography>
      ) : null}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeadRow.map((row, i) => (
                <TableCell key={i} style={columnWidth ? { width: columnWidth[i] } : {}}>
                  {row}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableBodyRows.map((row: string[], i: number) => (
              <TableRow
                key={i}
                sx={{
                  bgcolor: highLightRows && highLightRows.includes(i + 1) ? '#e7fad6' : '',
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {row.map((cell: string, j: number) => (
                  <TableCell key={j}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
