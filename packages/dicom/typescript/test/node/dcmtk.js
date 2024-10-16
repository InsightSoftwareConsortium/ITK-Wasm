import fs from 'fs'
import test from 'ava'
import path from 'path'
import {
  structuredReportToTextNode,
  structuredReportToHtmlNode ,
  readDicomEncapsulatedPdfNode,
  applyPresentationStateToImageNode,
} from '../../dist/index-node.js'

function arrayEquals(a, b) {
  return (a.length === b.length && a.every((val, idx) => val === b[idx]))
}

const testPathPrefix = '../test/data/input/';
//const outputPathPrefix = '../test/data/output/';
const baselinePathPrefix = '../test/data/baseline/';

test('structuredReportToText', async t => {
  const fileName = '88.33-comprehensive-SR.dcm'
  const testFilePath = path.join(testPathPrefix, fileName)

  const { outputText } = await structuredReportToTextNode(testFilePath)

  t.assert(outputText.includes('Comprehensive SR Document'))

  const { outputText: outputTextNoHeader } = await structuredReportToTextNode(testFilePath, { noDocumentHeader: true })
  t.assert(!outputTextNoHeader.includes('Comprehensive SR Document'))
  t.assert(outputTextNoHeader.includes('Breast Imaging Report'))
})

test('structuredReportToHtml', async t => {

  const fileName = '88.33-comprehensive-SR.dcm'
  const testFilePath = path.join(testPathPrefix, fileName)

  const { outputText } = await structuredReportToHtmlNode(testFilePath)

  t.assert(outputText.includes('Comprehensive SR Document'))
  t.assert(outputText.includes('Breast Diagnosis 010001 (female, #BreastDx-01-0001)'))
  t.assert(outputText.includes('PixelMed (XSLT from di3data csv extract)'))

  const { outputText: outputTextNoHeader } = await structuredReportToHtmlNode(testFilePath, { noDocumentHeader: true })

  t.assert(!outputTextNoHeader.includes('Breast Diagnosis 010001 (female, #BreastDx-01-0001)'))
  t.assert(!outputTextNoHeader.includes('PixelMed (XSLT from di3data csv extract)'))

  const { outputText: outputTextRenderAllCodes } = await structuredReportToHtmlNode(testFilePath, { renderAllCodes: true })

  t.assert(outputTextRenderAllCodes.includes('Overall Assessment (111413, DCM)'))

})

test('read Radiation Dose SR', async t => {

  const fileName = '88.67-radiation-dose-SR.dcm'
  const testFilePath = path.join(testPathPrefix, fileName)

  const { outputText } = await structuredReportToHtmlNode(testFilePath)

  t.assert(outputText.includes('<title>X-Ray Radiation Dose SR Document</title>'))
  t.assert(outputText.includes('<h2>CT Accumulated Dose Data</h2>'))
})

test('readDicomEncapsulatedPdfNode', async t => {

  const fileName = '104.1-SR-printed-to-pdf.dcm'
  const testFilePath = path.join(testPathPrefix, fileName)

  const { pdfBinaryOutput: outputBinaryStream } = await readDicomEncapsulatedPdfNode(testFilePath)
  t.assert(outputBinaryStream != null)
  t.assert(outputBinaryStream.length === 91731)
})

test('read Key Object Selection SR', async t => {

  const fileName = '88.59-KeyObjectSelection-SR.dcm'
  const testFilePath = path.join(testPathPrefix, fileName)

  const { outputText } = await structuredReportToHtmlNode(
    testFilePath, {
      urlPrefix: 'http://my-custom-dicom-server/dicom.cgi',
      cssReference: "https://css-host/dir/subdir/my-first-style.css",
    }
  )

  t.assert(outputText.includes('http://my-custom-dicom-server/dicom.cgi'))
  t.assert(!outputText.includes('http://localhost/dicom.cgi'))
  t.assert(outputText.includes(`<link rel="stylesheet" type="text/css" href="https://css-host/dir/subdir/my-first-style.css">`))

  const cssfileName = 'test-style.css'
  const testCssFilePath = path.join(testPathPrefix, cssfileName)

  const { outputText: outputWithCSSFile } = await structuredReportToHtmlNode(
    testFilePath, { cssFile: testCssFilePath })

  t.assert(outputWithCSSFile.includes('<style type="text/css">'))
  t.assert(outputWithCSSFile.includes('background-color: lightblue;'))
  t.assert(outputWithCSSFile.includes('margin-left: 20px;'))
  t.assert(outputWithCSSFile.includes('</style>'))
  t.assert(!outputWithCSSFile.includes('http://my-custom-dicom-server/dicom.cgi'))
  t.assert(outputWithCSSFile.includes('http://localhost/dicom.cgi'))
})

test('Apply presentation state to a dicom image.', async t => {
  // Read the input image file
  const inputFile = 'gsps-pstate-test-input-image.dcm'
  const inputFilePath = path.join(testPathPrefix, inputFile)

  // Read the presentation state file (that references the above image internally using its SOPInstanceUID).
  const pstateFile = 'gsps-pstate-test-input-pstate.dcm'
  const pstateFilePath = path.join(testPathPrefix, pstateFile)

  console.log(inputFilePath, pstateFilePath)
  const { presentationStateOutStream: pstateJsonOut, outputImage } = await applyPresentationStateToImageNode(
    inputFilePath,
    pstateFilePath,
  )

  t.assert(pstateJsonOut != null)
  t.assert(outputImage != null)

  t.assert(outputImage.imageType.dimension === 2)
  t.assert(outputImage.imageType.componentType === 'uint8')
  t.assert(outputImage.imageType.pixelType === 'Scalar')
  t.assert(outputImage.imageType.components === 1)

  t.assert(arrayEquals(outputImage.origin, [0, 0]))
  t.assert(arrayEquals(outputImage.spacing, [0.683, 0.683]))
  t.assert(arrayEquals(outputImage.direction, [1, 0, 0, 1]))
  t.assert(arrayEquals(outputImage.size, [512, 512]))

  const baselineJsonFile = 'gsps-pstate-baseline.json'
  const baselineJsonFilePath = path.join(baselinePathPrefix, baselineJsonFile)
  const baselineJsonFileBuffer = fs.readFileSync(baselineJsonFilePath)
  // the slice operation removes the last EOF char from the baseline file.
  const baselineJsonString = baselineJsonFileBuffer.toString().slice(0, -1)
  const baselineJsonObject = JSON.parse(baselineJsonString)

  t.assert(baselineJsonObject.PresentationLabel === pstateJsonOut.PresentationLabel)
  t.assert(baselineJsonObject.PresentationSizeMode === pstateJsonOut.PresentationSizeMode)
  t.assert(JSON.stringify(baselineJsonObject) === JSON.stringify(pstateJsonOut))

  const baselineImage = 'gsps-pstate-image-baseline.pgm'
  const baselineImageFilePath = baselinePathPrefix + baselineImage
  const baselineImageFileBuffer = fs.readFileSync(baselineImageFilePath)
  // slice to get only the pixel buffer from the baseline image (pgm file)
  const baselinePixels = baselineImageFileBuffer.slice(15)
  t.assert(baselinePixels.length === outputImage.data.length)
  t.assert(Buffer.compare(baselinePixels, outputImage.data) === 0)
})

//test('Apply color presentation state (CSPS) to a color dicom image.', async t => {
  //// Read the input image file
  //const inputFile = 'csps-input-image.dcm'
  //const inputFilePath = path.join(testPathPrefix, inputFile)

  //// Read the presentation state file (that references the above image internally using its SOPInstanceUID).
  //const pstateFile = 'csps-input-pstate.dcm'
  //const pstateFilePath = path.join(testPathPrefix, pstateFile)

  //const { presentationStateOutStream: pstateJsonOut, outputImage } = await applyPresentationStateToImageNode(
    //inputFilePath, pstateFilePath,
    //{ frame: 1, colorOutput: true }
  //)

  //t.assert(pstateJsonOut != null)
  //t.assert(outputImage != null)
  //t.assert(outputImage.imageType.dimension === 2)
  //t.assert(outputImage.imageType.componentType === 'uint8')
  //t.assert(outputImage.imageType.pixelType === 'RGB')
  //t.assert(outputImage.imageType.components === 3)

  //t.assert(arrayEquals(outputImage.origin, [0, 0]))
  //t.assert(arrayEquals(outputImage.spacing, [0.683, 0.683]))
  //t.assert(arrayEquals(outputImage.direction, [1, 0, 0, 1]))
  //t.assert(arrayEquals(outputImage.size, [768, 1024]))

  //const baselineJsonFile = 'csps-pstate-baseline.json'
  //const baselineJsonFilePath = baselinePathPrefix + baselineJsonFile
  //const baselineJsonFileBuffer = fs.readFileSync(baselineJsonFilePath)
  //// the slice operation removes the last EOF char from the baseline file.
  //const baselineJsonString = baselineJsonFileBuffer.toString().slice(0, -1)
  //const baselineJsonObject = JSON.parse(baselineJsonString)

  //t.assert(baselineJsonObject.PresentationLabel === pstateJsonOut.PresentationLabel)
  //t.assert(baselineJsonObject.PresentationSizeMode === pstateJsonOut.PresentationSizeMode)
  //t.assert(JSON.stringify(baselineJsonObject) === JSON.stringify(pstateJsonOut))

  //const baselineImage = 'csps-output-image-baseline.bmp'
  //const baselineImageFilePath = baselinePathPrefix + baselineImage
  //const baselinePixels = await readImageNode(baselineImageFilePath)
  //t.assert(baselinePixels.data.length === outputImage.data.length)
  //t.assert(Buffer.compare(baselinePixels.data, outputImage.data) === 0)
//})