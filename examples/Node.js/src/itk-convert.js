#!/usr/bin/env node

import { Command } from 'commander/esm.mjs'

const program = new Command()

import { readLocalFile, writeLocalFile } from 'itk-wasm'

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

try {
  const object = await readLocalFile(inputFile)
  const useCompression = true
  await writeLocalFile(useCompression, object, outputFile)
} catch (error) {
  console.error('Error during conversion:\n')
  console.error(error)
}
