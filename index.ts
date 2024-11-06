type FnMaybeAsync = (...params: any[]) => any | Promise<any>

export type CopeOk<T> = [T, undefined]
export type CopeErr<E extends Error> = [undefined, E]
export type CopeResult<T, E extends Error> = CopeOk<T> | CopeErr<E>

export const ok = <T = void>(value: T): CopeOk<T> => [value, undefined]
export const err = <E extends Error>(error: E): CopeErr<E> => [undefined, error]

/**
 * Golang-like error handling util
 * @see Docs https://github.com/TheLucifurry/cope
 * @example ```ts
 * const [result = 'default', error] = cope(() => JSON.parse('{"a": 1}'))
 * if (error) {
 *   // process error
 *   return
 * }
 * // process result
 * ```
 */
export function cope<
  Throws extends Error = Error,
  Executor extends FnMaybeAsync = FnMaybeAsync,
  Result extends ReturnType<Executor> = ReturnType<Executor>,
>(
  executor: Executor,
): (
  Result extends Promise<any>
    ? Promise<CopeResult<Awaited<Result>, Throws>>
    : CopeResult<Result, Throws>
) {
  try {
    const result = executor()
    // @ts-expect-error TCS can't separate two result cases
    return result instanceof Promise ? result.then(ok, err) : ok(result)
  }
  catch (error) {
    // @ts-expect-error TCS can't separate two result cases
    return err(error as Throws)
  }
}
