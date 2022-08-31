import path from 'path'
import { runPipelineNode, readImageLocalFile, writeImageLocalFile, InterfaceTypes } from 'itk-wasm'

// To switch from filesystem to WebAssembly memory IO, pass the `--memory-io` flag.
// This is supported by all itk::wasm::Pipeline's.
const args = ['--memory-io'].concat(process.argv.slice(2))

// Assume we have input and output images as the last arguments
const inputFile = args[args.length-2]
const inputImage = await readImageLocalFile(inputFile)
// '0' is the index of the first input corresponding to the `inputs` array below
args[args.length-2] = '0'

const outputFile = args[args.length-1]
// '0' is the index of the first output corresponding to the `desiredOutputs` below
args[args.length-1] = '0'

const desiredOutputs = [
  { type: InterfaceTypes.Image }
]
const inputs = [
  { type: InterfaceTypes.Image, data: inputImage }
]

// Path to the Emscripten WebAssembly module without extensions
const pipelinePath = path.resolve('web-build', 'inputs-outputs')
const { stdout, stderr, outputs } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)

await writeImageLocalFile(outputs[0].data, outputFile)