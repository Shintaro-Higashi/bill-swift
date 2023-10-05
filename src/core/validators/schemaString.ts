import { z } from 'zod'

export const schemaString = (
  maxLength: number,
  required: boolean = false,
  errMessage: string = '必須項目を入力してください',
) => {
  const basicSchema = z.string().max(maxLength)

  if (required) {
    return basicSchema.nullable().refine(
      (val: string | null) => {
        if (val) {
          return !!val.trim().length
        } else {
          return false
        }
      },
      { message: errMessage },
    )
  } else {
    return basicSchema.nullish()
  }
}

export const schemaStringSelectMessage = '必須項目を選択してください'
