import { register } from 'node:module'
import assert from 'node:assert/strict'

await register('./alias-loader.mjs', import.meta.url)

const { runAnalyticsBehaviorTests } = await import(
  '../src/vendor/flycham/lib/analytics.behavior.test.js'
)

const failures = []
await runAnalyticsBehaviorTests({
  assert,
  test(name, fn) {
    return Promise.resolve()
      .then(fn)
      .then(() => {
        console.log(`ok ${name}`)
      })
      .catch((error) => {
        failures.push({ name, error })
        console.error(`fail ${name}`)
        console.error(error)
      })
  },
})

if (failures.length) {
  console.error(`${failures.length} analytics test(s) failed`)
  process.exitCode = 1
} else {
  console.log('analytics behavior tests passed')
}
