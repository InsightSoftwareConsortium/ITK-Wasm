import { test, expect } from '@playwright/test'
import { pipelineBaseUrl, pipelineWorkerUrl } from '../common.js'

test.describe('pthreadSupportAvailable', () => {
  test('reports whether pthread support is available', async ({
    page,
    browserName
  }) => {
    test.skip(browserName === 'webkit', 'Flaky on webkit')

    await page.goto('/')

    const pthreadSupportAvailable = await page.evaluate(
      async ({ pipelineWorkerUrl, pipelineBaseUrl }) => {
        const itk = window.itk
        itk.setPipelineWorkerUrl(pipelineWorkerUrl)
        itk.setPipelinesBaseUrl(pipelineBaseUrl)

        return itk.pthreadSupportAvailable()
      },
      { pipelineWorkerUrl, pipelineBaseUrl }
    )

    expect(pthreadSupportAvailable).toBe(true)
  })
})
