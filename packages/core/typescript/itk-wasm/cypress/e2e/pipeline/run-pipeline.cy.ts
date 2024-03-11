import { readIwi, readIwm, demoServer, pipelineBaseUrl, pipelineWorkerUrl } from "../common"

describe('runPipeline', () => {
  beforeEach(() => {
    cy.visit(demoServer)
    cy.window().then(async (win) => {
      const itk = win.itk
      itk.setPipelineWorkerUrl(pipelineWorkerUrl)
      itk.setPipelinesBaseUrl(pipelineBaseUrl)
    })
  })

  it('captures stdout and stderr', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { webWorker, returnValue, stdout, stderr } = await itk.runPipeline(stdoutStderrPath, args, outputs, inputs)
    })
  })

  it('fetches Wasm files from a custom URL', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { webWorker, returnValue, stdout, stderr } = await itk.runPipeline(stdoutStderrPath, args, outputs, inputs, { pipelineBaseUrl, pipelineWorkerUrl })
    })
  })

  it('fetches Wasm files from a custom URL and query params', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { webWorker, returnValue, stdout, stderr } = await itk.runPipeline(stdoutStderrPath, args, outputs, inputs, { pipelineBaseUrl, pipelineWorkerUrl, pipelineQueryParams: {key: 'value'} })
    })
  })

  it('fetches Wasm files from a custom pipelineBaseUrl string', () => {
    cy.window().then(async (win) => {
      const itk = win.itk
      const pipelineBaseUrl = new URL('/pipelines', demoServer).href

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { webWorker, returnValue, stdout, stderr } = await itk.runPipeline(stdoutStderrPath, args, outputs, inputs, { pipelineBaseUrl })
    })
  })

  it('fetches the pipeline web worker from a custom pipelineWorkerUrl string', () => {
    cy.window().then(async (win) => {
      const itk = win.itk
      const pipelineWorkerUrl = new URL('/itk-wasm-pipeline.worker.js', demoServer).href

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { webWorker, returnValue, stdout, stderr } = await itk.runPipeline(stdoutStderrPath, args, outputs, inputs, { pipelineWorkerUrl })
    })
  })

  it('uses a web worker created explicitly beforehand', () => {
    cy.window().then(async (win) => {
      const itk = win.itk
      const pipelineWorkerUrl = new URL('/itk-wasm-pipeline.worker.js', demoServer).href
      const webWorker = await itk.createWebWorker(pipelineWorkerUrl)

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { returnValue, stdout, stderr } = await itk.runPipeline(stdoutStderrPath, args, outputs, inputs, { webWorker })
    })
  })

  it('re-uses a WebWorker', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { webWorker } = await itk.runPipeline(stdoutStderrPath, args, outputs, inputs)
      const { returnValue, stdout, stderr } = await itk.runPipeline(stdoutStderrPath, args, outputs, inputs, { webWorker })
      expect(typeof webWorker.terminated).to.equal('boolean')
      expect(webWorker.terminated).to.equal(false)
      webWorker.terminate()
      expect(webWorker.terminated).to.equal(true)
      expect(returnValue, 'returnValue').to.equal(0)
      expect(stdout, 'stdout').to.equal(`I’m writing my code,
But I do not realize,
Hours have gone by.
`)
      expect(stderr, 'stderr').to.equal(`The modem humming
Code rapidly compiling.
Click. Perfect success.
`)
    })
  })


  it('runs a pipeline on the main thread with an absolute URL', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const args = []
      const outputs = null
      const inputs = null
      const absoluteURL = new URL('/pipelines/stdout-stderr-test', document.location)
      const { returnValue, stdout, stderr } = await itk.runPipeline(absoluteURL, args, outputs, inputs, { webWorker: false })
      expect(returnValue, 'returnValue').to.equal(0)
      expect(stdout, 'stdout').to.equal(`I’m writing my code,
But I do not realize,
Hours have gone by.
`)
      expect(stderr, 'stderr').to.equal(`The modem humming
Code rapidly compiling.
Click. Perfect success.
`)
      })
    })

  it('uses input and output text and binary data via memory io', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const pipelinePath = 'input-output-files-test'
      const args = ['--memory-io',
        '--input-text-stream', '0',
        '--input-binary-stream', '1',
        '0',
        '1'
      ]
      const desiredOutputs = [
        { type: itk.InterfaceTypes.TextStream },
        { type: itk.InterfaceTypes.BinaryStream }
      ]
      const inputs = [
        { type: itk.InterfaceTypes.TextStream, data: { data: 'The answer is 42.' } },
        { type: itk.InterfaceTypes.BinaryStream, data: { data: new Uint8Array([222, 173, 190, 239]) } }
      ]
      const { stdout, stderr, outputs, webWorker } = await itk.runPipeline(pipelinePath, args, desiredOutputs, inputs)
      webWorker.terminate()
      expect(outputs[0].type, 'text output type').to.equal(itk.InterfaceTypes.TextStream)
      expect(outputs[0].data.data, 'text output data').to.equal('The answer is 42.')
      expect(outputs[1].type, 'binary output type').to.equal(itk.InterfaceTypes.BinaryStream)
      expect(outputs[1].data.data[0], 'binary output data[0]').to.equal(222)
      expect(outputs[1].data.data[1], 'binary output data[1]').to.equal(173)
      expect(outputs[1].data.data[2], 'binary output data[2]').to.equal(190)
      expect(outputs[1].data.data[3], 'binary output data[3]').to.equal(239)
      expect(stdout, 'stdout').to.equal(`Input text: The answer is 42.
`)
      expect(stderr, 'stderr').to.equal(`Input binary: ffffffdeffffffadffffffbeffffffef
`)
      })
    })


  it('runs on the main thread when webWorker option is false', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const pipelinePath = 'input-output-files-test'
      const args = ['--memory-io',
        '--input-text-stream', '0',
        '--input-binary-stream', '1',
        '0',
        '1'
      ]
      const desiredOutputs = [
        { type: itk.InterfaceTypes.TextStream },
        { type: itk.InterfaceTypes.BinaryStream }
      ]
      const inputs = [
        { type: itk.InterfaceTypes.TextStream, data: { data: 'The answer is 42.' } },
        { type: itk.InterfaceTypes.BinaryStream, data: { data: new Uint8Array([222, 173, 190, 239]) } }
      ]
      const { stdout, stderr, outputs } = await itk.runPipeline(pipelinePath, args, desiredOutputs, inputs, { webWorker: false })
      expect(outputs[0].type, 'text output type').to.equal(itk.InterfaceTypes.TextStream)
      expect(outputs[0].data.data, 'text output data').to.equal('The answer is 42.')
      expect(outputs[1].type, 'binary output type').to.equal(itk.InterfaceTypes.BinaryStream)
      expect(outputs[1].data.data[0], 'binary output data[0]').to.equal(222)
      expect(outputs[1].data.data[1], 'binary output data[1]').to.equal(173)
      expect(outputs[1].data.data[2], 'binary output data[2]').to.equal(190)
      expect(outputs[1].data.data[3], 'binary output data[3]').to.equal(239)
      expect(stdout, 'stdout').to.equal(`Input text: The answer is 42.
`)
      expect(stderr, 'stderr').to.equal(`Input binary: ffffffdeffffffadffffffbeffffffef
`)
      })
    })

  it('writes and reads itk.Image\'s', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const verifyImage = (image) => {
        expect(image.imageType.dimension, 'dimension').to.equal(2)
        expect(image.imageType.componentType, 'componentType').to.equal(itk.IntTypes.UInt8)
        expect(image.imageType.pixelType, 'pixelType').to.equal(itk.PixelTypes.Scalar)
        expect(image.imageType.components, 'components').to.equal(1)
        expect(image.origin, 'origin').to.deep.equal([0.0, 0.0])
        expect(image.spacing, 'spacing').to.deep.equal([1.0, 1.0])
        expect(image.size, 'size').to.deep.equal([256, 256])
        expect(image.data.byteLength, 'data.byteLength').to.equal(65536)
      }

      const cthead1BaseUrl = new URL('/data/cthead1.iwi/', demoServer).href
      const image = await readIwi(cthead1BaseUrl)

      const pipelinePath = 'median-filter-test'
      const args = [
        '0',
        '0',
        '--radius', '4',
        '--memory-io']
      const desiredOutputs = [
        { type: itk.InterfaceTypes.Image }
      ]
      const inputs = [
        { type: itk.InterfaceTypes.Image, data: image }
      ]
      const { webWorker, outputs } = await itk.runPipeline(pipelinePath, args, desiredOutputs, inputs)
      webWorker.terminate()
      verifyImage(outputs[0].data)
    })
  })

  it('runs twice without a detached buffer', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const verifyImage = (image) => {
        expect(image.imageType.dimension, 'dimension').to.equal(2)
        expect(image.imageType.componentType, 'componentType').to.equal(itk.IntTypes.UInt8)
        expect(image.imageType.pixelType, 'pixelType').to.equal(itk.PixelTypes.Scalar)
        expect(image.imageType.components, 'components').to.equal(1)
        expect(image.origin, 'origin').to.deep.equal([0.0, 0.0])
        expect(image.spacing, 'spacing').to.deep.equal([1.0, 1.0])
        expect(image.size, 'size').to.deep.equal([256, 256])
        expect(image.data.byteLength, 'data.byteLength').to.equal(65536)
      }

      const cthead1BaseUrl = new URL('/data/cthead1.iwi/', demoServer).href
      const image = await readIwi(cthead1BaseUrl)

      const pipelinePath = 'median-filter-test'
      const args = [
        '0',
        '0',
        '--radius', '4',
        '--memory-io']
      const desiredOutputs = [
        { type: itk.InterfaceTypes.Image }
      ]
      const inputs = [
        { type: itk.InterfaceTypes.Image, data: image }
      ]
      // const options = { noCopy: true } // failure expected
      const options = { noCopy: false }
      const { webWorker } = await itk.runPipeline(pipelinePath, args, desiredOutputs, inputs, options)
      options.webWorker = webWorker
      const { outputs } = await itk.runPipeline(pipelinePath, args, desiredOutputs, inputs, options)
      webWorker.terminate()

      verifyImage(outputs[0].data)
    })
  })

  it('runPipeline writes and reads an itk.Mesh via memory io', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const verifyMesh = (mesh) => {
        expect(mesh.meshType.dimension, 'dimension').to.equal(3)
        expect(mesh.meshType.pointComponentType, 'pointComponentType').to.equal(itk.FloatTypes.Float32)
        expect(mesh.meshType.cellComponentType, 'cellComponentType').to.equal(itk.IntTypes.UInt32)
        expect(mesh.meshType.pointPixelType, 'pointPixelType').to.equal(itk.PixelTypes.Scalar)
        expect(mesh.meshType.cellPixelType, 'cellPixelType').to.equal(itk.PixelTypes.Scalar)
        expect(mesh.numberOfPoints, 'numberOfPoints').to.equal(2903)
        expect(mesh.numberOfCells, 'numberOfCells').to.equal(3263)
      }

      const cowBaseUrl = new URL('/data/cow.iwm/', demoServer).href
      const mesh = await readIwm(cowBaseUrl)

      const pipelinePath = 'mesh-read-write-test'
      const args = ['0', '0', '--memory-io']
      const desiredOutputs = [
        { type: itk.InterfaceTypes.Mesh }
      ]
      const inputs = [
        { type: itk.InterfaceTypes.Mesh, data: mesh }
      ]
      const { webWorker, outputs } = await itk.runPipeline(pipelinePath, args, desiredOutputs, inputs)
      webWorker.terminate()
      verifyMesh(outputs[0].data)
    })
  })

})
