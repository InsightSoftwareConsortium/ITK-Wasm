#!/usr/bin/env node

const program = require('commander')

const readImageLocalFile = require('itk/readImageLocalFile')
const writeImageLocalFile = require('itk/writeImageLocalFile')

program
  .description('Convert images files from one format to another.')
  .arguments('<inputFile> <outputFile>')
  .parse(process.argv)

if (program.args.length < 2) {
  console.error('Please pass in both the input and output image file paths.')
  process.exit(1)
}

const inputFile = program.args[0]
const outputFile = program.args[1]

readImageLocalFile(inputFile)
  .then((image) => {
    const useCompression = true
    writeImageLocalFile(useCompression, image, outputFile)
  })
  .catch((error) => {
    console.error('Error during conversion:\n')
    console.error(error)
  })
