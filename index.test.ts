import { expect, test } from "bun:test";
import { cope } from '.'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const positiveExecution = () => JSON.parse('{"asd": 123}') as Record<string, number>
const failingExecution = () => JSON.parse('_broken_"asd"__: 123}__') as Record<string, number>

test('basic success', () => {
  const [syncParse, syncParseErr] = cope(positiveExecution)

  expect(syncParse).toEqual({ asd: 123 })
  expect(syncParseErr).toBeUndefined()
})

test('basic fail', () => {
  const [syncParse, syncParseErr] = cope(failingExecution)

  expect(syncParse).toBeUndefined()
  expect(syncParseErr).toBeInstanceOf(SyntaxError)
})

test('basic with default', () => {
  const [syncParse = { qwe: 789 }, syncParseErr] = cope(failingExecution)

  expect(syncParse).toEqual({ qwe: 789 })
  expect(syncParseErr).toBeInstanceOf(SyntaxError)
})

test('async success', async () => {
  const [syncParse, syncParseErr] = await cope(async () => {
    await sleep(20) // simulate async work
    return positiveExecution()
  })

  expect(syncParse).toEqual({ asd: 123 })
  expect(syncParseErr).toBeUndefined()
})

test('async fail', async () => {
  const [syncParse, syncParseErr] = await cope(async () => {
    await sleep(20) // simulate async work
    return failingExecution()
  })

  expect(syncParse).toBeUndefined()
  expect(syncParseErr).toBeInstanceOf(SyntaxError)
})
