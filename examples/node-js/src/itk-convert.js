#!/usr/bin/env node

import { Command } from 'commander/esm.mjs'

const program = new Command()

import { readImageNode, writeImageNode } from '@itk-wasm/image-io'
import { readMeshNode, writeMeshNode, extensionToMeshIo } from '@itk-wasm/mesh-io'
import { getFileExtension } from 'itk-wasm'

program
  .description('Convert images or meshes files from one format to another.')
  .arguments('<inputFile> <outputFile>')
  .parse(process.argv)

if (program.args.length < 2) {
  console.error('Please pass in both the input and output file paths.')
  process.exit(1)
}

const inputFile = program.args[0]
const outputFile = program.args[1]

const extension = getFileExtension(inputFile).toLowerCase()
const isMesh = extensionToMeshIo.has(extension)

try {
  if (isMesh) {
    const mesh = await readMeshNode(inputFile)
    await writeMeshNode(mesh, outputFile)
  } else {
    const image = await readImageNode(inputFile)
    await writeImageNode(image, outputFile)
  }
} catch (error) {
  console.error('Error during conversion:\n')
  console.error(error)
}
