import { z } from 'zod'

export const schemaPostalCode = (required: boolean = false, errMessage: string = '3桁-4桁の形式で入力してください') => {
  const basicSchema = z.string()
  const validPostalCode = (val: string) => /^\d{3}-\d{4}$/.test(val)

  if (required) {
    return basicSchema
      .refine((val) => !!val, '必須項目を入力してください')
      .refine((val) => validPostalCode(val), errMessage)
  } else {
    return basicSchema
      .refine(
        (val) => {
          return !val ? true : validPostalCode(val)
        },
        { message: errMessage },
      )
      .nullish()
  }
}
