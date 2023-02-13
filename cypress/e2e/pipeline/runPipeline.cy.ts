describe('runPipeline', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('captures stdout and stderr', () => {
    cy.window().then(async (win) => {
      const itk = win.itk
      itk.itkConfig.pipelinesUrl = '/pipelines'

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { webWorker, returnValue, stdout, stderr } = await itk.runPipeline(null, stdoutStderrPath, args, outputs, inputs)
    })
  })

  it('fetches Wasm files from a custom config URL', () => {
    cy.window().then(async (win) => {
      const itk = win.itk
      const configPropertyPipelinesBaseUrl = 'customPipelinesUrl' 
      itk.itkConfig[configPropertyPipelinesBaseUrl] = '/pipelines'

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { webWorker, returnValue, stdout, stderr } = await itk.runPipeline(null, stdoutStderrPath, args, outputs, inputs, { pipelineBaseUrl: configPropertyPipelinesBaseUrl })
    })
  })

  it('fetches Wasm files from a custom pipelineBaseUrl URL', () => {
    cy.window().then(async (win) => {
      const itk = win.itk
      const pipelineBaseUrl = new URL('/pipelines', document.location.origin)

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { webWorker, returnValue, stdout, stderr } = await itk.runPipeline(null, stdoutStderrPath, args, outputs, inputs, { pipelineBaseUrl })
    })
  })

  it('fetches Wasm files from a custom pipelineBaseUrl string', () => {
    cy.window().then(async (win) => {
      const itk = win.itk
      const pipelineBaseUrl = '/pipelines'

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { webWorker, returnValue, stdout, stderr } = await itk.runPipeline(null, stdoutStderrPath, args, outputs, inputs, { pipelineBaseUrl })
    })
  })

  it('fetches Wasm files from a custom pipelineWorkerUrl string', () => {
    cy.window().then(async (win) => {
      const itk = win.itk
      const pipelineBaseUrl = '/pipelines'
      const pipelineWorkerUrl = '/web-workers/bundles/pipeline.worker.js'

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { webWorker, returnValue, stdout, stderr } = await itk.runPipeline(null, stdoutStderrPath, args, outputs, inputs, { pipelineBaseUrl, pipelineWorkerUrl })
    })
  })

  it('re-uses a WebWorker', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const args = []
      const outputs = null
      const inputs = null
      const stdoutStderrPath = 'stdout-stderr-test'
      const { webWorker } = await itk.runPipeline(null, stdoutStderrPath, args, outputs, inputs)
      const { returnValue, stdout, stderr } = await itk.runPipeline(webWorker, stdoutStderrPath, args, outputs, inputs)
      webWorker.terminate()
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


  it('runs a pipeline in a web worker with an absolute URL', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const args = []
      const outputs = null
      const inputs = null
      const absoluteURL = new URL('/pipelines/stdout-stderr-test', document.location)
      const { webWorker, returnValue, stdout, stderr } = await itk.runPipeline(null, absoluteURL, args, outputs, inputs)
      webWorker.terminate()
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
      const { returnValue, stdout, stderr } = await itk.runPipeline(false, absoluteURL, args, outputs, inputs)
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
      const { returnValue, stdout, stderr } = await itk.runPipeline(false, absoluteURL, args, outputs, inputs)
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
        '--output-text-stream', '0',
        '--output-binary-stream', '1'
      ]
      const desiredOutputs = [
        { type: itk.InterfaceTypes.TextStream },
        { type: itk.InterfaceTypes.BinaryStream }
      ]
      const inputs = [
        { type: itk.InterfaceTypes.TextStream, data: { data: 'The answer is 42.' } },
        { type: itk.InterfaceTypes.BinaryStream, data: { data: new Uint8Array([222, 173, 190, 239]) } }
      ]
      const { stdout, stderr, outputs, webWorker } = await itk.runPipeline(null, pipelinePath, args, desiredOutputs, inputs)
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


  it('runs on the main thread when first argument is false', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const pipelinePath = 'input-output-files-test'
      const args = ['--memory-io',
        '--input-text-stream', '0',
        '--input-binary-stream', '1',
        '--output-text-stream', '0',
        '--output-binary-stream', '1'
      ]
      const desiredOutputs = [
        { type: itk.InterfaceTypes.TextStream },
        { type: itk.InterfaceTypes.BinaryStream }
      ]
      const inputs = [
        { type: itk.InterfaceTypes.TextStream, data: { data: 'The answer is 42.' } },
        { type: itk.InterfaceTypes.BinaryStream, data: { data: new Uint8Array([222, 173, 190, 239]) } }
      ]
      const { stdout, stderr, outputs } = await itk.runPipeline(false, pipelinePath, args, desiredOutputs, inputs)
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


  it('writes and reads itk.Image\'s in the Emscripten filesystem', () => {
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

        const fileName = 'cthead1.png'
        const testFilePath = 'build-emscripten/ExternalData/test/Input/' + fileName
        cy.readFile(testFilePath, null).then(async (data) => {
          const jsFile = await new win.File([data.buffer], fileName)
          const { image, webWorker } = await itk.readImageFile(null, jsFile)
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
          const { stdout, stderr, outputs } = await itk.runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs)
          webWorker.terminate()
          verifyImage(outputs[0].data)
      })
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

      const fileName = 'cow.vtk'
      const testMeshInputFilePath = `build-emscripten/ExternalData/test/Input/${fileName}`
      cy.readFile(testMeshInputFilePath, null).then(async (data) => {
        const jsFile = await new win.File([data.buffer], fileName)
        const { mesh, webWorker } = await itk.readMeshFile(null, jsFile)
        const pipelinePath = 'mesh-read-write-test'
        const args = ['0', '0', '--memory-io']
        const desiredOutputs = [
          { type: itk.InterfaceTypes.Mesh }
        ]
        const inputs = [
          { type: itk.InterfaceTypes.Mesh, data: mesh }
        ]
        const { outputs } = await itk.runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs)
        webWorker.terminate()
        verifyMesh(outputs[0].data)
      })
    })
  })

})
