/**
 * https://github.com/frouriojs/velona
 * 関数型DIコンテナ velonaをnpmではなくコードベースで導入
 */
// ************************************************************** //

type Deps<T extends Record<string, any>> = {
  [P in keyof T]: T[P] extends { _velona: boolean } ? (...args: Parameters<T[P]>) => ReturnType<T[P]> : T[P]
}

const depend = <T extends Record<string, any>, U extends any[], V>(
  dependencies: T,
  cb: (deps: Deps<T>, ...args: U) => V,
) => {
  const fn = (...args: U) => cb(dependencies, ...args)
  fn._velona = true
  fn.inject =
    (deps: Deps<T>) =>
    (...args: U) =>
      cb(deps, ...args)

  return fn
}
export default depend
