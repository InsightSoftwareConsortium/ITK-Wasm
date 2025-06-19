import { test, expect } from '@playwright/test'
import { pipelineBaseUrl, pipelineWorkerUrl } from '../common.js'

test.describe('runPipeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(
      ({ pipelineWorkerUrl, pipelineBaseUrl }) => {
        const itk = window.itk
        itk.setPipelineWorkerUrl(pipelineWorkerUrl)
        itk.setPipelinesBaseUrl(pipelineBaseUrl)
      },
      { pipelineWorkerUrl, pipelineBaseUrl }
    )
  })

  test('captures stdout and stderr', async ({ page }) => {
    await page.evaluate(async () => {
      const itk = window.itk

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      await itk.runPipeline(stdoutStderrPath, args, outputs, inputs)
    })
  })

  test('fetches Wasm files from a custom URL', async ({ page }) => {
    await page.evaluate(
      async ({ pipelineBaseUrl, pipelineWorkerUrl }) => {
        const itk = window.itk

        const args = []
        const outputs = null
        const inputs = null
        const stdoutStderrPath = 'stdout-stderr-test'
        await itk.runPipeline(stdoutStderrPath, args, outputs, inputs, {
          pipelineBaseUrl,
          pipelineWorkerUrl
        })
      },
      { pipelineBaseUrl, pipelineWorkerUrl }
    )
  })

  test('fetches Wasm files from a custom URL and query params', async ({
    page
  }) => {
    await page.evaluate(
      async ({ pipelineBaseUrl, pipelineWorkerUrl }) => {
        const itk = window.itk

        const args = []
        const outputs = null
        const inputs = null
        const stdoutStderrPath = 'stdout-stderr-test'
        await itk.runPipeline(stdoutStderrPath, args, outputs, inputs, {
          pipelineBaseUrl,
          pipelineWorkerUrl,
          pipelineQueryParams: { key: 'value' }
        })
      },
      { pipelineBaseUrl, pipelineWorkerUrl }
    )
  })

  test('fetches Wasm files from a custom pipelineBaseUrl string', async ({
    page
  }) => {
    await page.evaluate(async () => {
      const itk = window.itk
      const pipelineBaseUrl = '/pipelines'

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      await itk.runPipeline(stdoutStderrPath, args, outputs, inputs, {
        pipelineBaseUrl
      })
    })
  })

  test('fetches the pipeline web worker from a custom pipelineWorkerUrl string', async ({
    page
  }) => {
    await page.evaluate(async () => {
      const itk = window.itk
      const pipelineWorkerUrl = '/itk-wasm-pipeline.worker.js'

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      await itk.runPipeline(stdoutStderrPath, args, outputs, inputs, {
        pipelineWorkerUrl
      })
    })
  })

  test('uses a web worker created explicitly beforehand', async ({ page }) => {
    await page.evaluate(async () => {
      const itk = window.itk
      const pipelineWorkerUrl = '/itk-wasm-pipeline.worker.js'
      const webWorker = await itk.createWebWorker(pipelineWorkerUrl)

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      await itk.runPipeline(stdoutStderrPath, args, outputs, inputs, {
        webWorker
      })
    })
  })

  test('re-uses a WebWorker', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const itk = window.itk

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { webWorker } = await itk.runPipeline(
        stdoutStderrPath,
        args,
        outputs,
        inputs
      )
      const { returnValue, stdout, stderr } = await itk.runPipeline(
        stdoutStderrPath,
        args,
        outputs,
        inputs,
        { webWorker }
      )

      const terminatedBefore = webWorker.terminated
      webWorker.terminate()
      const terminatedAfter = webWorker.terminated

      return {
        terminatedBefore,
        terminatedAfter,
        returnValue,
        stdout,
        stderr
      }
    })

    expect(typeof result.terminatedBefore).toBe('boolean')
    expect(result.terminatedBefore).toBe(false)
    expect(result.terminatedAfter).toBe(true)
    expect(result.returnValue).toBe(0)
    expect(result.stdout).toBe(`I’m writing my code,
But I do not realize,
Hours have gone by.
`)
    expect(result.stderr).toBe(`The modem humming
Code rapidly compiling.
Click. Perfect success.
`)
  })

  test('runs a pipeline on the main thread with an absolute URL', async ({
    page
  }) => {
    const result = await page.evaluate(async () => {
      const itk = window.itk

      const args = []
      const outputs = null
      const inputs = null
      const absoluteURL = new URL(
        '/pipelines/stdout-stderr-test',
        document.location
      )
      const { returnValue, stdout, stderr } = await itk.runPipeline(
        absoluteURL,
        args,
        outputs,
        inputs,
        { webWorker: false }
      )

      return { returnValue, stdout, stderr }
    })

    expect(result.returnValue).toBe(0)
    expect(result.stdout).toBe(`I’m writing my code,
But I do not realize,
Hours have gone by.
`)
    expect(result.stderr).toBe(`The modem humming
Code rapidly compiling.
Click. Perfect success.
`)
  })

  test('uses input and output text and binary data via memory io', async ({
    page
  }) => {
    const result = await page.evaluate(async () => {
      const itk = window.itk

      const pipelinePath = 'input-output-files-test'
      const args = [
        '--memory-io',
        '--input-text-stream',
        '0',
        '--input-binary-stream',
        '1',
        '0',
        '1'
      ]
      const desiredOutputs = [
        { type: itk.InterfaceTypes.TextStream },
        { type: itk.InterfaceTypes.BinaryStream }
      ]
      const inputs = [
        {
          type: itk.InterfaceTypes.TextStream,
          data: { data: 'The answer is 42.' }
        },
        {
          type: itk.InterfaceTypes.BinaryStream,
          data: { data: new Uint8Array([222, 173, 190, 239]) }
        }
      ]
      const { stdout, stderr, outputs, webWorker } = await itk.runPipeline(
        pipelinePath,
        args,
        desiredOutputs,
        inputs
      )
      webWorker.terminate()

      return {
        outputs: outputs.map((output) => ({
          type: output.type,
          data: output.data
        })),
        stdout,
        stderr
      }
    })

    expect(result.outputs[0].type).toBe('TextStream')
    expect(result.outputs[0].data.data).toBe('The answer is 42.')
    expect(result.outputs[1].type).toBe('BinaryStream')
    expect(result.outputs[1].data.data[0]).toBe(222)
    expect(result.outputs[1].data.data[1]).toBe(173)
    expect(result.outputs[1].data.data[2]).toBe(190)
    expect(result.outputs[1].data.data[3]).toBe(239)
    expect(result.stdout).toBe(`Input text: The answer is 42.
`)
    expect(result.stderr).toBe(`Input binary: ffffffdeffffffadffffffbeffffffef
`)
  })

  test('runs on the main thread when webWorker option is false', async ({
    page
  }) => {
    const result = await page.evaluate(async () => {
      const itk = window.itk

      const pipelinePath = 'input-output-files-test'
      const args = [
        '--memory-io',
        '--input-text-stream',
        '0',
        '--input-binary-stream',
        '1',
        '0',
        '1'
      ]
      const desiredOutputs = [
        { type: itk.InterfaceTypes.TextStream },
        { type: itk.InterfaceTypes.BinaryStream }
      ]
      const inputs = [
        {
          type: itk.InterfaceTypes.TextStream,
          data: { data: 'The answer is 42.' }
        },
        {
          type: itk.InterfaceTypes.BinaryStream,
          data: { data: new Uint8Array([222, 173, 190, 239]) }
        }
      ]
      const { stdout, stderr, outputs } = await itk.runPipeline(
        pipelinePath,
        args,
        desiredOutputs,
        inputs,
        { webWorker: false }
      )

      return {
        outputs: outputs.map((output) => ({
          type: output.type,
          data: output.data
        })),
        stdout,
        stderr
      }
    })

    expect(result.outputs[0].type).toBe('TextStream')
    expect(result.outputs[0].data.data).toBe('The answer is 42.')
    expect(result.outputs[1].type).toBe('BinaryStream')
    expect(result.outputs[1].data.data[0]).toBe(222)
    expect(result.outputs[1].data.data[1]).toBe(173)
    expect(result.outputs[1].data.data[2]).toBe(190)
    expect(result.outputs[1].data.data[3]).toBe(239)
    expect(result.stdout).toBe(`Input text: The answer is 42.
`)
    expect(result.stderr).toBe(`Input binary: ffffffdeffffffadffffffbeffffffef
`)
  })

  test("writes and reads itk.Image's", async ({ page }) => {
    await page.evaluate(async () => {
      const itk = window.itk

      const verifyImage = (image) => {
        if (image.imageType.dimension !== 2)
          throw new Error('dimension mismatch')
        if (image.imageType.componentType !== itk.IntTypes.UInt8)
          throw new Error('componentType mismatch')
        if (image.imageType.pixelType !== itk.PixelTypes.Scalar)
          throw new Error('pixelType mismatch')
        if (image.imageType.components !== 1)
          throw new Error('components mismatch')
        if (JSON.stringify(image.origin) !== JSON.stringify([0.0, 0.0]))
          throw new Error('origin mismatch')
        if (JSON.stringify(image.spacing) !== JSON.stringify([1.0, 1.0]))
          throw new Error('spacing mismatch')
        if (JSON.stringify(image.size) !== JSON.stringify([256, 256]))
          throw new Error('size mismatch')
        if (image.data.byteLength !== 65536)
          throw new Error('data.byteLength mismatch')
      }

      const readIwi = async (baseUrl) => {
        const imageResponse = await fetch(`${baseUrl}index.json`)
        const image = await imageResponse.json()
        const directionResponse = await fetch(`${baseUrl}data/direction.raw`)
        const directionBuffer = await directionResponse.arrayBuffer()
        const directionData = new Float64Array(directionBuffer)
        image.direction = directionData
        const dataResponse = await fetch(`${baseUrl}data/data.raw`)
        const dataBuffer = await dataResponse.arrayBuffer()
        const pixelData = new Uint8Array(dataBuffer)
        image.data = pixelData
        return image
      }

      const cthead1BaseUrl = '/data/cthead1.iwi/'
      const image = await readIwi(cthead1BaseUrl)

      const pipelinePath = 'median-filter-test'
      const args = ['0', '0', '--radius', '4', '--memory-io']
      const desiredOutputs = [{ type: itk.InterfaceTypes.Image }]
      const inputs = [{ type: itk.InterfaceTypes.Image, data: image }]
      const { webWorker, outputs } = await itk.runPipeline(
        pipelinePath,
        args,
        desiredOutputs,
        inputs
      )
      webWorker.terminate()
      verifyImage(outputs[0].data)
    })
  })

  test('runs twice without a detached buffer', async ({ page }) => {
    await page.evaluate(async () => {
      const itk = window.itk

      const verifyImage = (image) => {
        if (image.imageType.dimension !== 2)
          throw new Error('dimension mismatch')
        if (image.imageType.componentType !== itk.IntTypes.UInt8)
          throw new Error('componentType mismatch')
        if (image.imageType.pixelType !== itk.PixelTypes.Scalar)
          throw new Error('pixelType mismatch')
        if (image.imageType.components !== 1)
          throw new Error('components mismatch')
        if (JSON.stringify(image.origin) !== JSON.stringify([0.0, 0.0]))
          throw new Error('origin mismatch')
        if (JSON.stringify(image.spacing) !== JSON.stringify([1.0, 1.0]))
          throw new Error('spacing mismatch')
        if (JSON.stringify(image.size) !== JSON.stringify([256, 256]))
          throw new Error('size mismatch')
        if (image.data.byteLength !== 65536)
          throw new Error('data.byteLength mismatch')
      }

      const readIwi = async (baseUrl) => {
        const imageResponse = await fetch(`${baseUrl}index.json`)
        const image = await imageResponse.json()
        const directionResponse = await fetch(`${baseUrl}data/direction.raw`)
        const directionBuffer = await directionResponse.arrayBuffer()
        const directionData = new Float64Array(directionBuffer)
        image.direction = directionData
        const dataResponse = await fetch(`${baseUrl}data/data.raw`)
        const dataBuffer = await dataResponse.arrayBuffer()
        const pixelData = new Uint8Array(dataBuffer)
        image.data = pixelData
        return image
      }

      const cthead1BaseUrl = '/data/cthead1.iwi/'
      const image = await readIwi(cthead1BaseUrl)

      const pipelinePath = 'median-filter-test'
      const args = ['0', '0', '--radius', '4', '--memory-io']
      const desiredOutputs = [{ type: itk.InterfaceTypes.Image }]
      const inputs = [{ type: itk.InterfaceTypes.Image, data: image }]
      // const options = { noCopy: true } // failure expected
      const options = { noCopy: false }
      const { webWorker } = await itk.runPipeline(
        pipelinePath,
        args,
        desiredOutputs,
        inputs,
        options
      )
      options.webWorker = webWorker
      const { outputs } = await itk.runPipeline(
        pipelinePath,
        args,
        desiredOutputs,
        inputs,
        options
      )
      webWorker.terminate()

      verifyImage(outputs[0].data)
    })
  })

  test('runPipeline writes and reads an itk.Mesh via memory io', async ({
    page
  }) => {
    await page.evaluate(async () => {
      const itk = window.itk

      const verifyMesh = (mesh) => {
        if (mesh.meshType.dimension !== 3) throw new Error('dimension mismatch')
        if (mesh.meshType.pointComponentType !== itk.FloatTypes.Float32)
          throw new Error('pointComponentType mismatch')
        if (mesh.meshType.cellComponentType !== itk.IntTypes.UInt32)
          throw new Error('cellComponentType mismatch')
        if (mesh.meshType.pointPixelType !== itk.PixelTypes.Scalar)
          throw new Error('pointPixelType mismatch')
        if (mesh.meshType.cellPixelType !== itk.PixelTypes.Scalar)
          throw new Error('cellPixelType mismatch')
        if (mesh.numberOfPoints !== 2903)
          throw new Error('numberOfPoints mismatch')
        if (mesh.numberOfCells !== 3263)
          throw new Error('numberOfCells mismatch')
      }

      const readIwm = async (baseUrl) => {
        const meshResponse = await fetch(`${baseUrl}index.json`)
        const mesh = await meshResponse.json()
        const pointsResponse = await fetch(`${baseUrl}data/points.raw`)
        const pointsBuffer = await pointsResponse.arrayBuffer()
        const points = new Float32Array(pointsBuffer)
        mesh.points = points
        const cellsResponse = await fetch(`${baseUrl}data/cells.raw`)
        const cellsBuffer = await cellsResponse.arrayBuffer()
        const cells = new Float32Array(cellsBuffer)
        mesh.cells = cells
        // todo
        mesh.pointData = null
        mesh.cellData = null
        return mesh
      }

      const cowBaseUrl = '/data/cow.iwm/'
      const mesh = await readIwm(cowBaseUrl)

      const pipelinePath = 'mesh-read-write-test'
      const args = ['0', '0', '--memory-io']
      const desiredOutputs = [{ type: itk.InterfaceTypes.Mesh }]
      const inputs = [{ type: itk.InterfaceTypes.Mesh, data: mesh }]
      const { webWorker, outputs } = await itk.runPipeline(
        pipelinePath,
        args,
        desiredOutputs,
        inputs
      )
      webWorker.terminate()
      verifyMesh(outputs[0].data)
    })
  })
})
