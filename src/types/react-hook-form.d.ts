import { FieldValues, UseFormReturn } from 'react-hook-form/dist/types'
import React from 'react'
import { UseFormReturnType as UseFormReturnTypeCore } from '@refinedev/core/dist/hooks/form/useForm'

/**
 * refine dev独自の props(refineCoreとsaveButtonProps) を useFormContext経由でも取得できるようにType拡張
 * ※共有自体は問題なく動作しているのでカスタマイズはTypeの拡張のみ
 */
declare module 'react-hook-form' {
  export declare const useFormContext: <
    TFieldValues extends FieldValues,
    TContext = any,
    TransformedValues extends FieldValues | undefined = undefined,
  >() => UseFormReturn<TFieldValues, TContext, TransformedValues> & {
    refineCore: UseFormReturnTypeCore<TQueryFnData, TError, TVariables, TData, TResponse, TResponseError>
    saveButtonProps: {
      disabled: boolean
      onClick: (e: React.BaseSyntheticEvent) => void
    }
  }
}
