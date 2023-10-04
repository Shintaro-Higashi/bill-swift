export const validTel = (val: string | undefined) => {
  if (!val) return true
  return val.includes('-')
}
export const validTelMessage = { message: 'ハイフンを入力してください' }
