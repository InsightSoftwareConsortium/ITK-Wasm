import fs from 'fs'
import test from 'ava'
import { structuredReportToTextNode } from '../dist/itk-dicom.node.js'

test('structuredReportToText', async t => {

  const fileName = '88.33-comprehensive-SR.dcm'
  const testFilePath = `../../build-emscripten/ExternalData/test/Input/${fileName}`

  const dicomFileBuffer = fs.readFileSync(testFilePath)
  const dicomFile = new Uint8Array(dicomFileBuffer)

  const { outputText } = await structuredReportToTextNode(dicomFile)

  t.assert(outputText.includes('Comprehensive SR Document'))

  const { outputText: outputTextNoHeader } = await structuredReportToTextNode(dicomFile, { noDocumentHeader: true })
  t.assert(!outputTextNoHeader.includes('Comprehensive SR Document'))
  t.assert(outputTextNoHeader.includes('Breast Imaging Report'))
})