import { z } from 'zod'

export const schemaInvoiceNo = (required: boolean = false, errMessage: string = 'T+13桁の形式で入力して下さい') => {
  const basicSchema = z.string()
  const regex = /^T\d{13}$/

  if (required) {
    return basicSchema.refine((val) => !!val, '必須項目を入力してください').refine((val) => regex.test(val), errMessage)
  } else {
    return basicSchema
      .refine(
        (val) => {
          return !val ? true : regex.test(val)
        },
        { message: errMessage },
      )
      .nullish()
  }
}
