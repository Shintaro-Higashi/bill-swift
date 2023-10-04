export const validPostalCode = (val: string | undefined) => {
  if (!val) return true
  return /^\d{3}-\d{4}$/.test(val)
}
export const validPostalCodeMessage = { message: '郵便番号は3桁-4桁の形式で入力してください' }
