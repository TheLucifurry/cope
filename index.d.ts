type FnNullary = () => any;
type FnAsyncNullary = () => Promise<any>;
export type CopeOk<T> = [T, undefined];
export type CopeErr<E extends Error> = [undefined, E];
export type CopeResult<T, E extends Error> = CopeOk<T> | CopeErr<E>;
export declare const ok: <T = void>(value: T) => CopeOk<T>;
export declare const err: <E extends Error>(error: E) => CopeErr<E>;
/**
 * Golang-like error handling util
 *
 * @example ```ts // Basic usage
 * const [result, error] = cope(() => JSON.parse('{"a": 1}'))
 * if (error) {
 *   // process error
 *   return
 * }
 * // process result
 * ```
 *
 * @example ```ts // With default value
 * const [result = 'default value', syncParseErr] = cope(...)
 * result // is always defined
 * ```
 *
 * @example ```ts // ignore insignificant error
 * // prepare executions
 * cope(()=>{ window.scrollTo(someElement.offsetHeight) })
 * // guaranteed executions
 * ```
 */
export declare function cope<Throws extends Error = Error, Executor extends FnNullary | FnAsyncNullary = FnNullary | FnAsyncNullary, Result extends ReturnType<Executor> = ReturnType<Executor>>(executor: Executor): Result extends Promise<any> ? Promise<CopeResult<Awaited<Result>, Throws>> : CopeResult<Result, Throws>;
export {};
