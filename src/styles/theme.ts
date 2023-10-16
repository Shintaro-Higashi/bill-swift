import CustomPagination from '@components/core/pagination/customPagination'
import { jaJP } from '@mui/x-data-grid'
import { ThemeOptions } from '@mui/material'
// eslint-disable-next-line
import type {} from '@mui/x-data-grid/themeAugmentation'
import React from 'react'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    label: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    label: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    label: true
  }
}

/**
 * デフォルトのMUIテーマをカスタマイズします。
 * <pre>
 *  一部コンポーネントのデフォルトprop及びスタイルを定義します。
 * </pre>
 */
const theme: ThemeOptions = {
  // テーマ作成ツールで確認しながら作成可 https://zenoo.github.io/mui-theme-creator/
  components: {
    // データグリッド(一覧画面系で利用するテーブル)デフォルト定義
    MuiDataGrid: {
      defaultProps: {
        localeText: jaJP.components.MuiDataGrid.defaultProps.localeText,
        pageSizeOptions: [25, 50, 100],
        // この定義がないと2回検索が実地されるかつ2回目の検索にフィルタ条件が適用されない(原因は不明) ※共通適用困難なので個別定義中
        // filterModel: undefined,
        slots: {
          pagination: CustomPagination,
        },
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiMenuItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiList: {
      defaultProps: {
        dense: true,
      },
    },
    // 定義しても上書きされてしまう。やり方がわかれば対応
    // MuiBreadcrumbs: {
    //   styleOverrides: {
    //     root: {
    //       paddingTop: '8px',
    //       paddingBottom: '8px',
    //       paddingLeft: '8px',
    //       paddingRight: '8px',
    //     },
    //   },
    // },
    // refine 各ページの機能名上下余白が広すぎるので削除
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 8,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },

    // テキスト入力デフォルトスタイルを定義
    MuiTextField: {
      defaultProps: { margin: 'normal', size: 'small', fullWidth: true, InputLabelProps: { shrink: true } },
    },
  },
  // ヘッダToolBar高さを最小に
  mixins: {
    toolbar: {
      minHeight: 42,
    },
  },
  // デフォルトサイズがあまりに大きいので縮小
  // Default https://v5-0-6.mui.com/customization/default-theme/?expand-path=$.typography
  typography: {
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 700,

    h1: { fontSize: '2.5rem' },
    h2: { fontSize: '2rem' },
    h3: { fontSize: '1.75rem' },
    h4: { fontSize: '1.5rem' },
    h5: { fontSize: '1.25rem' },
    h6: { fontSize: '1rem' },
    subtitle1: { fontSize: 18 },
    // 独自のvariant(詳細画面系の項目名に利用) borderColorはDarkモード切替がきかないのでコンポーネント側で指定(FieldItem専用なので影響なし)
    label: { fontSize: '0.8rem', fontWeight: 300, paddingLeft: '2px', borderLeft: '4px solid' },
    body1: { fontSize: 16 },
    // 英字の先頭自動大文字化を防止
    button: { textTransform: 'none' },
  },
}

export default theme
