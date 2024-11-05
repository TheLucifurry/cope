# 👐 cope
> Simple helper to handle errors, inspired by Golang solution


### 💿 Installation
```bash
pnpm i cope
```
<details><summary>Other package managers</summary>

```bash
npm i cope
```
```bash
yarn add cope
```
</details>

### ❓ Why
- **Simplicity:** Avoid try/catch blocks scattered across your code
- **Type Safety:** You know exactly what types to expect in success and failure cases
- **Consistency:** Standardized structure for handling errors in sync and async code

### 💡 Examples

#### Basic usage:
```ts
import { cope } from 'cope';

const [result, error] = cope(() => JSON.parse('{"a": 123}'));

if (error)
  // process error
else
  // process result
```

#### Usage with default:
```ts
const [result = {count: 0}, error] = cope(() => JSON.parse('_broken_"count": 123}'));
if (error)
  console.warn('fail')

// result is always defined
```
> [!NOTE]  
> This is why, the util returns undefined instead of null

#### Usage with optional execution:
```ts
cope(() => window.querySelector('#dynamic-element').scrollTo(123, 0))
// ...guaranteed executions
```

#### Asynchronous usage:
Stepwise
```ts
const [fetchResult, fetchingError] = await cope(() => fetch('https://example.com'));
if (fetchingError) {
  console.error('Request failed')
  return
}

const [result = null, parsingError] = await cope(() => fetchResult.json());
if (parsingError)
  console.warn('Cannot parse response data')

// process result
```
Or just
```ts
const [result = null, error] = await cope(
  () => fetch('https://example.com')).then(d=>d.json())
);
if (error) {
  console.error('Somewhere failed 🌚')
  return
}

// process result
```


### 🛠️ API
```ts
cope<Throws, Executor, Result>(executor: Executor): CopeResult<Result, Throws>
```
- Generics
  - `Throws` - You can define types of errors, that can be thrown by `executor`. Default is `Error`
  - `Executor` - Private, don't change it!
  - `Result` - Private, don't change it!

- Parameters
  - `executor` (Function): The function to be executed. It can be either a synchronous or asynchronous function.

- Returns
  - If sync `executor` - [`Result`, undefined] | [undefined, `Throws`]
  - If async `executor` - Promise<[`Result`, undefined] | [undefined, `Throws`]>