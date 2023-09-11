// *****************************************************
// https://github.com/colinhacks/zod/issues/831
// 定義した疑似Enum Objectをzod の z.union([z.literal('xxx'),.... で利用できる形式に対応します。
//
// *****************************************************

import { Primitive, z, ZodLiteral } from 'zod'

const createUnion = <T extends Readonly<[Primitive, Primitive, ...Primitive[]]>>(values: T) => {
  const zodLiterals = values.map((value) => z.literal(value)) as unknown as [
    ZodLiteral<Primitive>,
    ZodLiteral<Primitive>,
    ...ZodLiteral<Primitive>[],
  ]
  return z.union(zodLiterals)
}

/**
 * z.union([z.literal('xxx').. に設定可能なスキーマ定義を作成します。
 * @param values リテラル入れ悦
 * @return Unionスキーマ
 */
function createUnionSchema<T extends readonly Primitive[]>(values: T) {
  if (values.length === 0) {
    return z.never()
  }

  if (values.length === 1) {
    return z.literal(values[0])
  }

  return createUnion(values as unknown as Readonly<[Primitive, Primitive, ...Primitive[]]>)
}

export default createUnionSchema
