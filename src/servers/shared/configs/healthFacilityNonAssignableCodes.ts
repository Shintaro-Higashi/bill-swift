import { HealthFacilityCodeGroupFormatType } from '.prisma/client'

/**
 * 採番不可の施設コードを記載します。
 * 在宅の患者を扱うダミーの施設として用意されている番号は欠番として処理する必要があります。
 */

/** フォーマットタイプ'SIMPLE' */
const SIMPLE_NON_ASSIGNABLE_CODES: string[] = [
  '0555',
  '0666',
  '0777',
  '0887',
  '0888',
  '0993',
  '0994',
  '0995',
  '0996',
  '0997',
  '0998',
  '0999',
  '1000',
]

/** フォーマットタイプ'PADDING' */
const PADDING_NON_ASSIGNABLE_CODES: string[] = ['0888', '0999']

/**
 * 採番不可の施設コードを取得します。
 * @param formatType
 * @returns 採番不可の施設コードの配列
 */
export const getHealthFacilityNonAssignableCodes = (formatType: HealthFacilityCodeGroupFormatType): string[] => {
  switch (formatType) {
    case 'SIMPLE':
      return SIMPLE_NON_ASSIGNABLE_CODES
    case 'PADDING':
      return PADDING_NON_ASSIGNABLE_CODES
  }
}
