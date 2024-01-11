import { readImageNode, writeImageNode } from '@itk-wasm/image-io'
import { inputsOutputsNode } from '../dist/index-node.js'

// Assume we have input and output images as the last arguments
const args = process.argv.slice()
const inputFile = args[args.length-2]
const outputFile = args[args.length-1]

const inputImage = await readImageNode(inputFile)
const { outputImage } = await inputsOutputsNode(inputImage)
await writeImageNode(outputImage, outputFile)