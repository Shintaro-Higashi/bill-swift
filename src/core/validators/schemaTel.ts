import { z } from 'zod'

export const schemaTel = (required: boolean = false, errMessage: string = 'ハイフンを入力してください') => {
  const basicSchema = z.string().max(16)
  const validTel = (val: string) => val.includes('-')

  if (required) {
    return basicSchema.refine((val) => !!val, '必須項目を入力してください').refine((val) => validTel(val), errMessage)
  } else {
    return basicSchema
      .refine(
        (val) => {
          return !val ? true : validTel(val)
        },
        { message: errMessage },
      )
      .nullish()
  }
}
