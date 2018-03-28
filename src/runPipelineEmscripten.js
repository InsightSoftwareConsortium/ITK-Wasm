const IOTypes = require('./IOTypes.js')

const runPipelineEmscripten = (module, args, outputs, inputs) => {
  if (inputs) {
    inputs.forEach(function (input) {
      switch (input.type) {
        case IOTypes.Text:
          module.writeFile(input.path, input.data)
          break
        case IOTypes.Binary:
          module.writeFile(input.path, input.data)
          break
        case IOTypes.Image:
          let imageJSON = {}
          for (let key in input.data) {
            if (input.data.hasOwnProperty(key) && key !== 'data') {
              imageJSON[key] = input.data[key]
            }
          }
          imageJSON['data'] = input.path + '.data'
          module.writeFile(input.path, JSON.stringify(imageJSON))
          module.writeFile(imageJSON.data, input.data.data)
          break
        default:
          throw Error('Unsupported input IOType')
      }
    })
  }

  module.resetModuleStdout()
  module.resetModuleStderr()
  module.callMain(args)
  const stdout = module.getModuleStdout()
  const stderr = module.getModuleStderr()

  let populatedOutputs = []
  if (outputs) {
    outputs.forEach(function (output) {
      let populatedOutput = {}
      Object.assign(populatedOutput, output)
      switch (output.type) {
        case IOTypes.Text:
          populatedOutput['data'] = module.readFile(output.path, { encoding: 'utf8' })
          break
        case IOTypes.Binary:
          populatedOutput['data'] = module.readFile(output.path, { encoding: 'binary' })
          break
        case IOTypes.Image:
          const imageJSON = module.readFile(output.path, { encoding: 'utf8' })
          let image = JSON.parse(imageJSON)
          const dataUint8 = module.readFile(image.data, { encoding: 'binary' })
          image['data'] = dataUint8.buffer
          populatedOutput['data'] = image
          break
        default:
          throw Error('Unsupported output IOType')
      }
      populatedOutputs.push(populatedOutput)
    })
  }

  return { stdout, stderr, outputs: populatedOutputs }
}

module.exports = runPipelineEmscripten
