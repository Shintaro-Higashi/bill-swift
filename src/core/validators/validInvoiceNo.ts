export const validInvoiceNo = (val: string | undefined) => {
  if (!val) return true
  const regex = /^T\d{13}$/
  return regex.test(val)
}
export const validInvoiceNoMessage = { message: 'インボイス番号はT+13桁の形式で入力して下さい' }
