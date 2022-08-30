import compareImageToBaseline from "../../support/compareImageToBaseline"

describe('WebWorkerPool', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('runs and reports progress', () => {
    cy.window().then((win) => {
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

      const fileName = 'cthead1.png'
      const testFilePath = 'build-emscripten/ExternalData/test/Input/' + fileName
      cy.readFile(testFilePath, null).then(async (data) => {
        const jsFile = await new win.File([data.buffer], fileName)

        const { image, webWorker } = await itk.readImageFile(null, jsFile)

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
          taskArgsArray.push([pipelinePath, args, desiredOutputs, inputs])
        }

        const results = await workerPool.runTasks(taskArgsArray, progressLogger).promise
        workerPool.terminateWorkers()

        expect(reportedTotalSplits, 'reported total splits', maxTotalSplits)
        const imageSplits = results.map(({ outputs }) => outputs[0].data)
        const stackedImage = itk.stackImages(imageSplits)

        // const { arrayBuffer, webWorker: ww } = await itk.writeImageArrayBuffer(null, stackedImage, 'median.png')
        // ww.terminate()
        // const buf = Cypress.Buffer.from(Array.from(new Uint8Array(arrayBuffer)))
        // cy.writeFile('median.png', buf, null)
        const baselineFileName = 'web_worker_pool.cy.png'
        cy.readFile(`build-emscripten/ExternalData/test/Baseline/${baselineFileName}`, null).then(async (baselineArrayBuffer) => {
          const { image: baseline } = await itk.readImageArrayBuffer(webWorker, baselineArrayBuffer.buffer, baselineFileName)
          webWorker.terminate()

          compareImageToBaseline(itk, stackedImage, baseline)
        })

      })
    })
  })
})
