// index.ts
var ok = (value) => [value, undefined];
var err = (error) => [undefined, error];
function cope(executor) {
  try {
    const result = executor();
    return result instanceof Promise ? result.then(ok, err) : ok(result);
  } catch (error) {
    return err(error);
  }
}
export {
  ok,
  err,
  cope
};
