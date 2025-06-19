import { test, expect } from '@playwright/test'
import { readIwi, pipelineBaseUrl, pipelineWorkerUrl } from './common.js'
import compareImageToBaseline from './compare-image-to-baseline.js'

test.describe('WebWorkerPool', () => {
  test('runs and reports progress', async ({ page }) => {
    await page.goto('/')

    const result = await page.evaluate(
      async ({ pipelineWorkerUrl, pipelineBaseUrl, readIwi }) => {
        const itk = window.itk
        itk.setPipelineWorkerUrl(pipelineWorkerUrl)
        itk.setPipelinesBaseUrl(pipelineBaseUrl)

        const progressUpdates = []
        let reportedTotalSplits = null
        function progressLogger(split, totalSplits) {
          progressUpdates.push(split)
          reportedTotalSplits = totalSplits
        }

        const poolSize = 2
        const maxTotalSplits = 4
        const workerPool = new itk.WorkerPool(poolSize, itk.runPipeline)

        // Use the readIwi function passed from Node.js context
        const readIwiInBrowser = new Function('return ' + readIwi)()

        const cthead1BaseUrl = '/data/cthead1.iwi/'
        const image = await readIwiInBrowser(cthead1BaseUrl)

        const taskArgsArray = []
        for (let index = 0; index < maxTotalSplits; index++) {
          const pipelinePath = 'median-filter-test'
          const args = [
            '--memory-io',
            '0',
            '0',
            '--radius',
            '4',
            '-m',
            '' + maxTotalSplits,
            '-s',
            '' + index
          ]
          const desiredOutputs = [{ type: itk.InterfaceTypes.Image }]
          const data = itk.imageSharedBufferOrCopy(image)
          const inputs = [{ type: itk.InterfaceTypes.Image, data }]
          taskArgsArray.push([pipelinePath, args, desiredOutputs, inputs, {}])
        }

        const results = await workerPool.runTasks(taskArgsArray, progressLogger)
          .promise
        workerPool.terminateWorkers()

        const imageSplits = results.map(({ outputs }) => outputs[0].data)
        const stackedImage = itk.stackImages(imageSplits)

        const baselineBaseUrl = '/data/web-worker-pool-baseline.iwi/'
        const baselineImage = await readIwiInBrowser(baselineBaseUrl)

        return {
          reportedTotalSplits,
          maxTotalSplits,
          stackedImage: JSON.parse(JSON.stringify(stackedImage)),
          baselineImage: JSON.parse(JSON.stringify(baselineImage))
        }
      },
      {
        pipelineWorkerUrl,
        pipelineBaseUrl,
        readIwi: readIwi.toString() // Pass function as string to be reconstructed in browser
      }
    )

    expect(result.reportedTotalSplits).toBe(result.maxTotalSplits)

    // Reconstruct the images for comparison
    const stackedImage = result.stackedImage
    const baselineImage = result.baselineImage

    compareImageToBaseline(stackedImage, baselineImage)
  })
})
