import { readIwi, demoServer, pipelineBaseUrl, pipelineWorkerUrl } from "./common"
import compareImageToBaseline from "../support/compareImageToBaseline"

describe('WebWorkerPool', () => {
  beforeEach(() => {
    cy.visit(demoServer)
    cy.window().then(async (win) => {
      const itk = win.itk
      itk.setPipelineWorkerUrl(pipelineWorkerUrl)
      itk.setPipelinesBaseUrl(pipelineBaseUrl)
    })
  })

  it('runs and reports progress', () => {
    cy.window().then(async (win) => {
      const itk = win.itk
      const progressUpdates = []
      let reportedTotalSplits = null
      function progressLogger (split, totalSplits) {
        progressUpdates.push(split)
        reportedTotalSplits = totalSplits
      }

      const poolSize = 2
      const maxTotalSplits = 4
      const workerPool = new itk.WorkerPool(poolSize, itk.runPipeline)

      const cthead1BaseUrl = new URL('/data/cthead1.iwi/', demoServer).href
      const image = await readIwi(cthead1BaseUrl)

      const taskArgsArray = []
      for (let index = 0; index < maxTotalSplits; index++) {
        const pipelinePath = 'median-filter-test'
        const args = ['--memory-io', '0', '0', '--radius', '4', '-m', '' + maxTotalSplits, '-s', '' + index]
        const desiredOutputs = [
          { type: itk.InterfaceTypes.Image }
        ]
        const data = itk.imageSharedBufferOrCopy(image)
        const inputs = [
          { type: itk.InterfaceTypes.Image, data }
        ]
        taskArgsArray.push([pipelinePath, args, desiredOutputs, inputs, {}])
      }

      const results = await workerPool.runTasks(taskArgsArray, progressLogger).promise
      workerPool.terminateWorkers()

      expect(reportedTotalSplits, 'reported total splits', maxTotalSplits)
      const imageSplits = results.map(({ outputs }) => outputs[0].data)
      const stackedImage = itk.stackImages(imageSplits)

      const baselineBaseUrl = new URL('/data/web-worker-pool-baseline.iwi/', demoServer).href
      const baselineImage = await readIwi(baselineBaseUrl)

      compareImageToBaseline(itk, stackedImage, baselineImage)
    })
  })
})
