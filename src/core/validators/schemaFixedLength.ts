import { z } from 'zod'

export const schemaFixedLength = (
  length: number,
  required: boolean = false,
  errMessage: string = `${length}文字で入力してください`,
) => {
  const basicSchema = z.string()
  const validFixedLength = (val: string) => val.trim().length === length

  if (required) {
    return basicSchema
      .refine((val) => !!val, '必須項目を入力してください')
      .refine((val) => validFixedLength(val), errMessage)
  } else {
    return basicSchema
      .refine(
        (val) => {
          if (!val) return true
          return validFixedLength(val)
        },
        { message: errMessage },
      )
      .nullish()
  }
}
