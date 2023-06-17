import fs from 'fs'
import test from 'ava'
import {
  structuredReportToTextNode,
  structuredReportToHtmlNode ,
  readDicomEncapsulatedPdfNode,
  applyPresentationStateToImageNode,
} from '../dist/bundles/dicom-node.js'
import { readImageLocalFile, readImageLocalDICOMFileSeries, readDICOMTagsLocalFile } from '../../../../dist/index.js'

  function arrayEquals(a, b) {
    return (a.length === b.length && a.every((val, idx) => val === b[idx]))
  }

const testPathPrefix = '../test/data/input/';
const baselinePathPrefix = '../test/data/baseline/';

test('structuredReportToText', async t => {

  const fileName = '88.33-comprehensive-SR.dcm'
  const testFilePath = testPathPrefix + fileName

  const dicomFileBuffer = fs.readFileSync(testFilePath)
  const dicomFile = new Uint8Array(dicomFileBuffer)

  const { outputText } = await structuredReportToTextNode({ data: dicomFile, path: fileName })

  t.assert(outputText.includes('Comprehensive SR Document'))

  const { outputText: outputTextNoHeader } = await structuredReportToTextNode({ data: dicomFile, path: fileName }, { noDocumentHeader: true })
  t.assert(!outputTextNoHeader.includes('Comprehensive SR Document'))
  t.assert(outputTextNoHeader.includes('Breast Imaging Report'))
})

test('structuredReportToHtml', async t => {

  const fileName = '88.33-comprehensive-SR.dcm'
  const testFilePath = testPathPrefix + fileName

  const dicomFileBuffer = fs.readFileSync(testFilePath)
  const dicomFile = new Uint8Array(dicomFileBuffer)
  const dicomBinaryFile = { data: dicomFile, path: fileName }

  const { outputText } = await structuredReportToHtmlNode(dicomBinaryFile)

  t.assert(outputText.includes('Comprehensive SR Document'))
  t.assert(outputText.includes('Breast Diagnosis 010001 (female, #BreastDx-01-0001)'))
  t.assert(outputText.includes('PixelMed (XSLT from di3data csv extract)'))

  const { outputText: outputTextNoHeader } = await structuredReportToHtmlNode(dicomBinaryFile, { noDocumentHeader: true })

  t.assert(!outputTextNoHeader.includes('Breast Diagnosis 010001 (female, #BreastDx-01-0001)'))
  t.assert(!outputTextNoHeader.includes('PixelMed (XSLT from di3data csv extract)'))

  const { outputText: outputTextRenderAllCodes } = await structuredReportToHtmlNode(dicomBinaryFile, { renderAllCodes: true })

  t.assert(outputTextRenderAllCodes.includes('Overall Assessment (111413, DCM)'))

})

test('read Radiation Dose SR', async t => {

  const fileName = '88.67-radiation-dose-SR.dcm'
  const testFilePath = testPathPrefix + fileName

  const dicomFileBuffer = fs.readFileSync(testFilePath)
  const dicomFile = new Uint8Array(dicomFileBuffer)

  const { outputText } = await structuredReportToHtmlNode({ data: dicomFile, path: fileName })

  t.assert(outputText.includes('<title>X-Ray Radiation Dose SR Document</title>'))
  t.assert(outputText.includes('<h2>CT Accumulated Dose Data</h2>'))
})

test('readDicomEncapsulatedPdfNode', async t => {

  const fileName = '104.1-SR-printed-to-pdf.dcm'
  const testFilePath = testPathPrefix + fileName
  const dicomFileBuffer = fs.readFileSync(testFilePath)
  const dicomFile = new Uint8Array(dicomFileBuffer)
  const { pdfBinaryOutput: outputBinaryStream } = await readDicomEncapsulatedPdfNode({ data: dicomFile, path: fileName })
  t.assert(outputBinaryStream != null)
  t.assert(outputBinaryStream.length === 91731)
})

test('read Key Object Selection SR', async t => {

  const fileName = '88.59-KeyObjectSelection-SR.dcm'
  const testFilePath = testPathPrefix + fileName
  const dicomFileBuffer = fs.readFileSync(testFilePath)
  const dicomFile = new Uint8Array(dicomFileBuffer)

  const { outputText } = await structuredReportToHtmlNode(
    { data: dicomFile, path: fileName }, {
      urlPrefix: 'http://my-custom-dicom-server/dicom.cgi',
      cssReference: "https://css-host/dir/subdir/my-first-style.css",
    }
  )

  t.assert(outputText.includes('http://my-custom-dicom-server/dicom.cgi'))
  t.assert(!outputText.includes('http://localhost/dicom.cgi'))
  t.assert(outputText.includes(`<link rel="stylesheet" type="text/css" href="https://css-host/dir/subdir/my-first-style.css">`))

  const cssfileName = 'test-style.css'
  const testCssFilePath = testPathPrefix + cssfileName
  const cssFileBuffer = fs.readFileSync(testCssFilePath)

  const { outputText: outputWithCSSFile } = await structuredReportToHtmlNode(
    { data: dicomFile, path: fileName }, { cssFile: { data: cssFileBuffer, path: cssfileName }})

  t.assert(outputWithCSSFile.includes('<style type="text/css">'))
  t.assert(outputWithCSSFile.includes('background-color: lightblue;'))
  t.assert(outputWithCSSFile.includes('margin-left: 20px;'))
  t.assert(outputWithCSSFile.includes('</style>'))
  t.assert(!outputWithCSSFile.includes('http://my-custom-dicom-server/dicom.cgi'))
  t.assert(outputWithCSSFile.includes('http://localhost/dicom.cgi'))
})

test('Apply presentation state to dicom image.', async t => {

  // Read the input image file
  const inputFile = 'gsps-pstate-test-input-image.dcm'
  const inputFilePath = testPathPrefix + inputFile
  const dicomFileBuffer = fs.readFileSync(inputFilePath)
  const inputImage = new Uint8Array(dicomFileBuffer)

  // Read the presentation state file (that references the above image internally using its SOPInstanceUID).
  const pstateFile = 'gsps-pstate-test-input-pstate.dcm'
  const pstateFilePath = testPathPrefix + pstateFile
  const pstateFileBuffer = fs.readFileSync(pstateFilePath)
  const inputPState = new Uint8Array(pstateFileBuffer)

  const { presentationStateOutStream: pstateJsonOut, outputImage } = await applyPresentationStateToImageNode(
    { data: inputImage, path: inputFile },
    { data: inputPState, path: pstateFile }
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
  const baselineJsonFilePath = baselinePathPrefix + baselineJsonFile
  const baselineJsonFileBuffer = fs.readFileSync(baselineJsonFilePath)
  // the slice operation removes the last EOF char from the baseline file.
  const baselineJsonString = baselineJsonFileBuffer.toString().slice(0, -1)
  const baselineJsonObject = JSON.parse(baselineJsonString)

  t.assert(baselineJsonObject.PresentationLabel === pstateJsonOut.PresentationLabel)
  t.assert(baselineJsonObject.PresentationSizeMode === pstateJsonOut.PresentationSizeMode)
  t.deepEqual(JSON.stringify(baselineJsonObject), JSON.stringify(pstateJsonOut), 'JSON not equal')

  const baselineImage = 'gsps-pstate-image-baseline.pgm'
  const baselineImageFilePath = baselinePathPrefix + baselineImage
  const baselineImageFileBuffer = fs.readFileSync(baselineImageFilePath)
  // slice to get only the pixel buffer from the baseline image (pgm file)
  const baselinePixels = baselineImageFileBuffer.slice(15)
  t.assert(baselinePixels.length === outputImage.data.length)
  t.assert(Buffer.compare(baselinePixels, outputImage.data) === 0)

})

test('Apply color presentation state (CSPS) to a color dicom image.', async t => {

  // Read the input image file
  const inputFile = 'csps-input-image.dcm'
  const inputFilePath = testPathPrefix + inputFile
  const dicomFileBuffer = fs.readFileSync(inputFilePath)
  const inputImage = new Uint8Array(dicomFileBuffer)

  // Read the presentation state file (that references the above image internally using its SOPInstanceUID).
  const pstateFile = 'csps-input-pstate.dcm'
  const pstateFilePath = testPathPrefix + pstateFile
  const pstateFileBuffer = fs.readFileSync(pstateFilePath)
  const inputPState = new Uint8Array(pstateFileBuffer)

  const { presentationStateOutStream: pstateJsonOut, outputImage } = await applyPresentationStateToImageNode(
    { data: inputImage, path: inputFile }, { data: inputPState, path: pstateFile },
    { frame: 1, colorOutput: true }
  )

  t.assert(pstateJsonOut != null)
  t.assert(outputImage != null)
  t.assert(outputImage.imageType.dimension === 2)
  t.assert(outputImage.imageType.componentType === 'uint8')
  t.assert(outputImage.imageType.pixelType === 'RGB')
  t.assert(outputImage.imageType.components === 3)

  t.assert(arrayEquals(outputImage.origin, [0, 0]))
  t.assert(arrayEquals(outputImage.spacing, [0.683, 0.683]))
  t.assert(arrayEquals(outputImage.direction, [1, 0, 0, 1]))
  t.assert(arrayEquals(outputImage.size, [768, 1024]))

  const baselineJsonFile = 'csps-pstate-baseline.json'
  const baselineJsonFilePath = baselinePathPrefix + baselineJsonFile
  const baselineJsonFileBuffer = fs.readFileSync(baselineJsonFilePath)
  // the slice operation removes the last EOF char from the baseline file.
  const baselineJsonString = baselineJsonFileBuffer.toString().slice(0, -1)
  const baselineJsonObject = JSON.parse(baselineJsonString)

  t.assert(baselineJsonObject.PresentationLabel === pstateJsonOut.PresentationLabel)
  t.assert(baselineJsonObject.PresentationSizeMode === pstateJsonOut.PresentationSizeMode)
  t.assert(JSON.stringify(baselineJsonObject) === JSON.stringify(pstateJsonOut))

  const baselineImage = 'csps-output-image-baseline.bmp'
  const baselineImageFilePath = baselinePathPrefix + baselineImage
  const baselinePixels = await readImageLocalFile(baselineImageFilePath)
  t.assert(baselinePixels.data.length === outputImage.data.length)
  t.assert(Buffer.compare(baselinePixels.data, outputImage.data) === 0)
})

// ------------------------------------
// Test DICOM SOP Classes
// ------------------------------------

test('DICOM SOP: Ultrasound Image Storage.', async t => {
  const inputFilePath = testPathPrefix + 'dicom-images/ultrasound.dcm'

  const outputTags = await readDICOMTagsLocalFile(inputFilePath)
  // console.log(outputTags)
  t.assert(outputTags.get('0008|0016') === '1.2.840.10008.5.1.4.1.1.6.1')

  const outputImage = await readImageLocalDICOMFileSeries([inputFilePath])
  // console.log('US outputImage: ', outputImage)
  t.assert(outputImage != null)
  t.assert(outputImage.imageType.componentType === 'uint8')
  t.assert(outputImage.imageType.pixelType === 'Vector')
  t.assert(outputImage.imageType.components === 3)
  t.assert(arrayEquals(outputImage.origin, [0, 0, 0]))
  t.assert(arrayEquals(outputImage.spacing, [0.220751, 0.220751, 1]))
  t.assert(arrayEquals(outputImage.direction, [1, 0, 0, 0, 1, 0, 0, 0, 1]))
  t.assert(arrayEquals(outputImage.size, [1024, 768, 1]))
})

test('DICOM SOP: Secondary Image Storage.', async t => {
  const inputFilePath = testPathPrefix + 'dicom-images/secondary-capture.dcm'

  const outputTags = await readDICOMTagsLocalFile(inputFilePath)
  // console.log(outputTags)
  t.assert(outputTags.get('0008|0016') === '1.2.840.10008.5.1.4.1.1.7')

  const outputImage = await readImageLocalDICOMFileSeries([inputFilePath])
  // console.log('Secondary Capture outputImage: ', outputImage)
  t.assert(outputImage != null)
  t.assert(outputImage.imageType.componentType === 'uint8')
  t.assert(outputImage.imageType.pixelType === 'Scalar')
  t.assert(outputImage.imageType.components === 1)
  t.assert(arrayEquals(outputImage.origin, [0, 0, 0]))
  t.assert(arrayEquals(outputImage.spacing, [1, 1, 1]))
  t.assert(arrayEquals(outputImage.direction, [1, 0, 0, 0, 1, 0, 0, 0, 1]))
  t.assert(arrayEquals(outputImage.size, [960, 720, 1]))
})

test('DICOM SOP: Segmentation Storage.', async t => {
  const inputFilePath = testPathPrefix + 'dicom-images/segmentation-storage.dcm'

  const outputTags = await readDICOMTagsLocalFile(inputFilePath)
  // console.log(outputTags)
  t.assert(outputTags.get('0008|0016') === '1.2.840.10008.5.1.4.1.1.66.4')

  const outputImage = await readImageLocalDICOMFileSeries([inputFilePath])
  // console.log('Secondary Capture outputImage: ', outputImage)
  t.assert(outputImage != null)
  t.assert(outputImage.imageType.componentType === 'uint8')
  t.assert(outputImage.imageType.pixelType === 'Scalar')
  t.assert(outputImage.imageType.components === 1)
  t.assert(arrayEquals(outputImage.origin, [14.043, 101.425, -73.0513]))
  t.assert(arrayEquals(outputImage.spacing, [0.6055, 0.6055, 2]))
  t.assert(arrayEquals(outputImage.direction, [-1, 0, 0, 0, -1, 0, 0, 0, 1]))
  t.assert(arrayEquals(outputImage.size, [256, 256, 80]))
})

test('DICOM SOP: Computed Radiography.', async t => {
  const inputFilePath = testPathPrefix + 'dicom-images/computed-radiography.dcm'

  const outputTags = await readDICOMTagsLocalFile(inputFilePath)
  // console.log(outputTags)
  t.assert(outputTags.get('0008|0016') === '1.2.840.10008.5.1.4.1.1.1')

  const outputImage = await readImageLocalDICOMFileSeries([inputFilePath])
  // console.log('Secondary Capture outputImage: ', outputImage)
  t.assert(outputImage != null)
  t.deepEqual(outputImage.imageType.componentType, 'uint16')
  t.deepEqual(outputImage.imageType.pixelType , 'Scalar')
  t.deepEqual(outputImage.imageType.components, 1)
  t.deepEqual(outputImage.origin, [0, 0, 0])
  t.deepEqual(outputImage.spacing, [0.139, 0.139, 1])
  t.deepEqual(outputImage.direction, Float64Array.from([1, 0, 0, 0, 1, 0, 0, 0, 1]))
  t.deepEqual(outputImage.size, [2366, 2194, 1])
})

test('DICOM SOP: Digital X-Ray Image.', async t => {
  const inputFilePath = testPathPrefix + 'dicom-images/digital-chest-xray.dcm'

  const outputTags = await readDICOMTagsLocalFile(inputFilePath)
  // console.log(outputTags)
  t.assert(outputTags.get('0008|0016') === '1.2.840.10008.5.1.4.1.1.1.1')

  const outputImage = await readImageLocalDICOMFileSeries([inputFilePath])
  // console.log('Secondary Capture outputImage: ', outputImage)
  t.assert(outputImage != null)
  t.deepEqual(outputImage.imageType.componentType, 'uint16')
  t.deepEqual(outputImage.imageType.pixelType , 'Scalar')
  t.deepEqual(outputImage.imageType.components, 1)
  t.deepEqual(outputImage.origin, [0, 0, 0])
  t.deepEqual(outputImage.spacing, [0.148, 0.148, 1])
  t.deepEqual(outputImage.direction, Float64Array.from([1, 0, 0, 0, 1, 0, 0, 0, 1]))
  t.deepEqual(outputImage.size, [2656, 2330, 1])
})

test('DICOM SOP: Digital Mammography X-Ray Image Storage.', async t => {
  const inputFilePath = testPathPrefix + 'dicom-images/digital-mammography-xray.dcm'

  const outputTags = await readDICOMTagsLocalFile(inputFilePath)
  // console.log(outputTags)
  t.assert(outputTags.get('0008|0016') === '1.2.840.10008.5.1.4.1.1.1.2')

  const outputImage = await readImageLocalDICOMFileSeries([inputFilePath])
  // console.log('Secondary Capture outputImage: ', outputImage)
  t.assert(outputImage != null)
  t.deepEqual(outputImage.imageType.componentType, 'uint16')
  t.deepEqual(outputImage.imageType.pixelType , 'Scalar')
  t.deepEqual(outputImage.imageType.components, 1)
  t.deepEqual(outputImage.origin, [0, 0, 0])
  t.deepEqual(outputImage.spacing, [0.07, 0.07, 1])
  t.deepEqual(outputImage.direction, Float64Array.from([1, 0, 0, 0, 1, 0, 0, 0, 1]))
  t.deepEqual(outputImage.size, [2560, 3328, 1])
})

test('DICOM SOP: RT Dose Storage.', async t => {
  const inputFilePath = testPathPrefix + 'dicom-images/RT-dose.dcm'

  const outputTags = await readDICOMTagsLocalFile(inputFilePath)
  // console.log(outputTags)
  t.assert(outputTags.get('0008|0016') === '1.2.840.10008.5.1.4.1.1.481.2')

  const outputImage = await readImageLocalDICOMFileSeries([inputFilePath])
  // console.log('Secondary Capture outputImage: ', outputImage)
  t.assert(outputImage != null)
  t.deepEqual(outputImage.imageType.dimension, 3)
  t.deepEqual(outputImage.imageType.componentType, 'uint16')
  t.deepEqual(outputImage.imageType.pixelType , 'Scalar')
  t.deepEqual(outputImage.imageType.components, 1)
  t.deepEqual(outputImage.origin, [-87.4346184, -122.593791, 93.125896])
  t.deepEqual(outputImage.spacing, [1, 1, 1])
  t.deepEqual(outputImage.direction, Float64Array.from([
    1, 2.05103388e-10, -3.5609435582144703e-28,
    -2.05103388e-10, 1, -1.73617002e-18,
    -2.575419273602761e-36, -1.73617002e-18, -1
  ]))
  t.deepEqual(outputImage.size, [163, 203, 200])
})

test('DICOM SOP: Ultrasound Multi-frame Image Storage.', async t => {
  const inputFilePath = testPathPrefix + 'dicom-images/multiframe-ultrasound.dcm'

  const outputTags = await readDICOMTagsLocalFile(inputFilePath)
  // console.log(outputTags)
  t.assert(outputTags.get('0008|0016') === '1.2.840.10008.5.1.4.1.1.3.1')

  const outputImage = await readImageLocalDICOMFileSeries([inputFilePath])
  // console.log('Secondary Capture outputImage: ', outputImage)
  t.assert(outputImage != null)
  t.deepEqual(outputImage.imageType.dimension, 3)
  t.deepEqual(outputImage.imageType.componentType, 'uint8')
  t.deepEqual(outputImage.imageType.pixelType , 'Scalar')
  t.deepEqual(outputImage.imageType.components, 1)
  t.deepEqual(outputImage.origin, [0, 0, 0])
  t.deepEqual(outputImage.spacing, [0.356, 0.356, 1])
  t.deepEqual(outputImage.direction, Float64Array.from([1, 0, 0, 0, 1, 0, 0, 0, 1]))
  t.deepEqual(outputImage.size, [352, 352, 227])
})

test('DICOM SOP: Positron Emission Tomography Image Storage.', async t => {
  const inputFilePath = testPathPrefix + 'dicom-images/PET'
  const files = fs.readdirSync(inputFilePath).map(fileName => inputFilePath + '/' + fileName)

  const outputTags = await readDICOMTagsLocalFile(files[0])
  // console.log(outputTags)
  t.assert(outputTags.get('0008|0016') === '1.2.840.10008.5.1.4.1.1.128')

  const outputImage = await readImageLocalDICOMFileSeries(files)
  // console.log('Secondary Capture outputImage: ', outputImage)
  t.assert(outputImage != null)
  t.deepEqual(outputImage.imageType.dimension, 3)
  t.deepEqual(outputImage.imageType.componentType, 'float64')
  t.deepEqual(outputImage.imageType.pixelType , 'Scalar')
  t.deepEqual(outputImage.imageType.components, 1)
  t.deepEqual(outputImage.origin, [-342.402, -553.182, -676])
  t.deepEqual(outputImage.spacing, [ 4.07283, 4.07283, 3])
  t.deepEqual(outputImage.direction, Float64Array.from([1, 0, 0, 0, 1, 0, 0, 0, 1]))
  t.deepEqual(outputImage.size, [168, 168, 251])
})

test('DICOM SOP: CT Image.', async t => {
  const inputFilePath = testPathPrefix + 'dicom-images/CT'
  const files = fs.readdirSync(inputFilePath).map(fileName => inputFilePath + '/' + fileName)

  const outputTags = await readDICOMTagsLocalFile(files[0])
  // console.log(outputTags)
  t.assert(outputTags.get('0008|0016') === '1.2.840.10008.5.1.4.1.1.2')

  const outputImage = await readImageLocalDICOMFileSeries(files)
  // console.log('Secondary Capture outputImage: ', outputImage)
  t.assert(outputImage != null)
  t.deepEqual(outputImage.imageType.dimension, 3)
  t.deepEqual(outputImage.imageType.componentType, 'int16')
  t.deepEqual(outputImage.imageType.pixelType , 'Scalar')
  t.deepEqual(outputImage.imageType.components, 1)
  t.deepEqual(outputImage.origin, [-511, -181, -2])
  t.deepEqual(outputImage.spacing, [2, 2, 223.66743882476638])
  t.deepEqual(outputImage.direction, Float64Array.from([1, 0, -6.123031769e-17, 6.123031769e-17, 0, 1, 0, -1, 0]))
  t.deepEqual(outputImage.size, [512, 512, 2])
})

test('DICOM SOP: MR Image.', async t => {
  const inputFilePath = testPathPrefix + 'dicom-images/MR'
  const files = fs.readdirSync(inputFilePath).map(fileName => inputFilePath + '/' + fileName)

  const outputTags = await readDICOMTagsLocalFile(files[0])
  // console.log(outputTags)
  t.assert(outputTags.get('0008|0016') === '1.2.840.10008.5.1.4.1.1.4')

  const outputImage = await readImageLocalDICOMFileSeries(files)
  // console.log('Secondary Capture outputImage: ', outputImage)
  t.assert(outputImage != null)
  t.deepEqual(outputImage.imageType.dimension, 3)
  t.deepEqual(outputImage.imageType.componentType, 'uint16')
  t.deepEqual(outputImage.imageType.pixelType , 'Scalar')
  t.deepEqual(outputImage.imageType.components, 1)
  t.deepEqual(outputImage.origin, [-156.46333984047, -142.7302360186, -54.341191112995])
  t.deepEqual(outputImage.spacing, [1.0625, 1.0625, 1.399999976158])
  t.deepEqual(outputImage.direction, Float64Array.from([ 1, 2.051034e-10, 0, -2.051034e-10, 1, 0, 0, 0, 1 ]))
  t.deepEqual(outputImage.size, [320, 320, 5])
})

test('DICOM SOP: Nuclear Medicine Image.', async t => {
  const inputFilePath = testPathPrefix + 'dicom-images/nuclear-medicine.dcm'
  const outputTags = await readDICOMTagsLocalFile(inputFilePath)
  // console.log(outputTags)
  t.assert(outputTags.get('0008|0016') === '1.2.840.10008.5.1.4.1.1.20')

  const outputImage = await readImageLocalDICOMFileSeries([inputFilePath])
  // console.log('Secondary Capture outputImage: ', outputImage)
  t.assert(outputImage != null)
  t.deepEqual(outputImage.imageType.dimension, 3)
  t.deepEqual(outputImage.imageType.componentType, 'uint16')
  t.deepEqual(outputImage.imageType.pixelType , 'Scalar')
  t.deepEqual(outputImage.imageType.components, 1)
  t.deepEqual(outputImage.origin, [-304.64869833601, -459.38798370462, 1437.200400138])
  t.deepEqual(outputImage.spacing, [4.7951998710632, 4.7951998710632, 4.7951998710632])
  t.deepEqual(outputImage.direction, Float64Array.from([
      0.999984923263527,
      -0.00024031414620000064,
      0.005485936086894437,
      0.0003446298565238277,
      0.9998190041416027,
      -0.019022097349032426,
      -0.005480371876099911,
      0.019023701175250058,
      0.9998040129533861
  ]))
  t.deepEqual(outputImage.size, [128, 128, 69])
})
