export const validFixedLength = (val: string | null | undefined, length: number) => {
  if (!val) return true
  return val.length === length
}

export const validFixedLengthMessage = (length: number) => ({ message: `${length}文字で入力してください` })
