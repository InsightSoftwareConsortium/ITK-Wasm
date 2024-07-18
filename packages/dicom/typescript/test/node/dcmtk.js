import fs from 'fs'
import test from 'ava'
import path from 'path'
import {
  structuredReportToTextNode,
  structuredReportToHtmlNode ,
  readDicomEncapsulatedPdfNode,
  applyPresentationStateToImageNode,
  readOverlappingSegmentationNode,
  readSegmentationNode,
  writeOverlappingSegmentationNode,
  writeSegmentationNode,
  writeMultiSegmentationNode,
} from '../../dist/index-node.js'
import { readImageNode, writeImageNode } from '@itk-wasm/image-io'
import { compareImagesNode, vectorMagnitudeNode, toScalarDouble  } from '@itk-wasm/compare-images'
//import toScalarDouble from '@itk-wasm/compare-images/toScalarDouble';

function arrayEquals(a, b) {
  return (a.length === b.length && a.every((val, idx) => val === b[idx]))
}

function floatCompare(a, b, places = 2) {
  function roundToDecimal(n) {
    const p = Math.pow(10, places)
    return Math.round(n * p) / p;
  }
  return (a.length === b.length && a.every((val, idx) => roundToDecimal(val) === roundToDecimal(b[idx])))
}

function compareImageToBaseline(t, testImage, baselineImage) {
  t.deepEqual(testImage.imageType, baselineImage.imageType)
  t.assert(floatCompare(testImage.origin, baselineImage.origin))
  t.assert(floatCompare([1.10, 1.20], [1.10, 1.21]))
  /*
  t.deepEqual(testImage.spacing, baselineImage.spacing)
  t.deepEqual(testImage.size, baselineImage.size)
  t.deepEqual(testImage.data, baselineImage.data)

  t.expect(testImage.imageType, 'imageType').to.deep.equal(baselineImage.imageType)
  t.expect(testImage.origin, 'origin').to.deep.equal(baselineImage.origin)
  t.expect(testImage.spacing, 'spacing').to.deep.equal(baselineImage.spacing)
  t.expect(testImage.size, 'size').to.deep.equal(baselineImage.size)
  t.expect(testImage.data, 'data').to.deep.equal(baselineImage.data)
  */
}


const testPathPrefix = '../test/data/input/';
const outputPathPrefix = '../test/data/output/';
const baselinePathPrefix = '../test/data/baseline/';

/*
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
*/

/*
test('DCMQI read DICOM segmentation object: scalar image', async t => {
  const fileName = 'dicom-images/SEG/ReMIND-001/tumor_seg_MR_ref_3DSAGT2SPACE/1-1.dcm'
  const testFilePath = path.join(testPathPrefix, fileName)
  const output = await readSegmentationNode(testFilePath)
  //console.log(output)

  t.assert(output.segImage != null)
  t.assert(output.segImage.data != null)
  t.assert(output.segImage.imageType.dimension === 3)

  t.deepEqual(output.segImage.imageType, {
    dimension: 3,
    componentType: 'int16',
    pixelType: 'Scalar',
    components: 1
  })

  const baselineJsonFile = '/dicom-images/SEG/MR_ref_3DSAGT2SPACE_tumor_seg.json'
  const baselineJsonFilePath = path.join(baselinePathPrefix, baselineJsonFile)
  const baselineJsonFileBuffer = fs.readFileSync(baselineJsonFilePath)
  const baselineJsonObject = JSON.parse(baselineJsonFileBuffer)
  t.assert(JSON.stringify(baselineJsonObject) === JSON.stringify(output.metaInfo))
})
*/

test('DCMQI read DICOM segmentation object (read-overlapping-segmentation)', async t => {
  const fileName = 'dicom-images/SEG/ABDLYMPH001-abdominal-lymph-seg.dcm'
  const testFilePath = path.join(testPathPrefix, fileName)
  const output = await readOverlappingSegmentationNode(testFilePath)
  //console.log(output)

  t.assert(output.segImage != null)
  t.assert(output.segImage.data != null)
  t.assert(output.segImage.imageType.dimension === 3)
  t.deepEqual(output.segImage.origin, [ -195.5, -72.5, -373.599976 ])
  t.deepEqual(output.segImage.spacing, [ 0.7480469, 0.7480469, 1 ])
  t.assert(arrayEquals(output.segImage.direction, [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]))
  t.deepEqual(output.segImage.size, [ 512, 512, 69 ])
  t.deepEqual(output.segImage.data.length, 72351744)
/*
  t.deepEqual(output.segImage.imageType, {
    dimension: 3,
    componentType: 'int16',
    pixelType: 'VariableLengthVector',
    components: 4
  })

  const baselineJsonFile = '/dicom-images/SEG/ABDLYMPH001_abdominal_lymph_seg.json'
  const baselineJsonFilePath = path.join(baselinePathPrefix, baselineJsonFile)
  const baselineJsonFileBuffer = fs.readFileSync(baselineJsonFilePath)
  const baselineJsonObject = JSON.parse(baselineJsonFileBuffer)
  t.assert(JSON.stringify(baselineJsonObject) === JSON.stringify(output.metaInfo))
  //await writeImageNode(output.segImage, outputPathPrefix + 'segVectorImage.nrrd');
*/
})

/*
test('DCMQI write DICOM segmentation object: non-overlapping labels', async t => {

  const inputSegImageFile = path.join(testPathPrefix, 'dicom-images/SEG/ReMIND-001/tumor_seg_MR_ref_3DSAGT2SPACE.nrrd')
  const inputSegImage = await readImageNode(inputSegImageFile)
  //console.log('inputSegImage: ', inputSegImage)

  const metaInfoFile = path.join(baselinePathPrefix, 'dicom-images/SEG/MR_ref_3DSAGT2SPACE_tumor_seg.json')
  const jsonFileBuffer = fs.readFileSync(metaInfoFile)
  const jsonObject = JSON.parse(jsonFileBuffer)
  //console.log('metaInfoJSON: ', jsonObject)

  const inputRefDicomSeriesPath = path.join(testPathPrefix, 'dicom-images/SEG/ReMIND-001/3DSAGT2SPACE')
  const refDicomSeries = fs.readdirSync(inputRefDicomSeriesPath).map(x => path.join(testPathPrefix, 'dicom-images/SEG/ReMIND-001/3DSAGT2SPACE', x))
  //console.log('refDicomSeries: ', refDicomSeries)

  const outputDicomFile = path.join(outputPathPrefix, 'writeSegmentationNode-output-seg.dcm')
  //console.log('outputDicomFile :', outputDicomFile)

  try {
    const output = await writeSegmentationNode(inputSegImage, jsonObject, outputDicomFile, {refDicomSeries})
    t.assert(output != null)
  }
  catch (error) {
    console.log('Exception while calling  writeSegmentationNode: ', error) 
  }
})

test('DCMQI write DICOM segmentation object: overlapping labels', async t => {

  const testFilePath = path.join(testPathPrefix, 'dicom-images/SEG/ABDLYMPH001-abdominal-lymph-seg.dcm')
  const output = await readOverlappingSegmentationNode(testFilePath)
  const inputSegImage = output.segImage;
  t.assert(inputSegImage)

  const metaInfoFile = path.join(baselinePathPrefix, 'dicom-images/SEG/ABDLYMPH001_abdominal_lymph_seg.json')
  const jsonFileBuffer = fs.readFileSync(metaInfoFile)
  const jsonObject = JSON.parse(jsonFileBuffer)

  const inputRefDicomSeriesPath = path.join(testPathPrefix, 'dicom-images/SEG/abdominallymphnodes')
  const refDicom = fs.readdirSync(inputRefDicomSeriesPath).map(x => path.join(testPathPrefix, 'dicom-images/SEG/abdominallymphnodes', x))
  const dcmSeries = [refDicom[0], refDicom[1]];

  const outputDicomFile = path.join(outputPathPrefix, 'writeOverlappingSegmentationNode-output-seg.dcm')

  try {
    const output = await writeOverlappingSegmentationNode(inputSegImage, jsonObject, outputDicomFile, {refDicomSeries: dcmSeries})
    t.assert(output != null)
  }
  catch (error) {
    console.log('Exception while calling  writeOverlappingSegmentationNode: ', error) 
  }
})

  /*
  async function writeDoubleImage(image, filepath) {
    const testImageDouble = await toScalarDouble(vectorMagnitudeNode, image);
    await writeImageNode(testImageDouble, filepath);
  }
  await writeDoubleImage(output.segImage, outputPathPrefix + '/output_makeSeg_double.nrrd');
  * /
// dcmqi native tests migrated to TypeScript:
// Path to test data from dcmqi is in its source dir
const dcmqi_lib_SOURCE_DIR = '../emscripten-build/_deps/dcmqi_lib-src'

test('write-segmentation_makeSEG', async t => {
  const inputSegImageFile = path.join(dcmqi_lib_SOURCE_DIR, 'data/segmentations/liver_seg.nrrd')
  const inputSegImage = await readImageNode(inputSegImageFile)
  t.assert(inputSegImage)

  const metaInfoFile = path.join(dcmqi_lib_SOURCE_DIR, 'doc/examples/seg-example.json')
  const jsonFileBuffer = fs.readFileSync(metaInfoFile)
  const jsonObject = JSON.parse(jsonFileBuffer)
  const outputDicomFile = path.join(outputPathPrefix,'liver-seg.dcm')
  const dcmSeries = [
    path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/ct-3slice/01.dcm'),
    path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/ct-3slice/02.dcm'),
    path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/ct-3slice/03.dcm'),
  ]
  try {
    const output = await writeSegmentationNode(inputSegImage, jsonObject, outputDicomFile, {refDicomSeries: dcmSeries})
    t.assert(output != null)
  }
  catch (error) {
    console.log('Exception while calling  writeSegmentationNode: ', error) 
  }

  console.log('now read back the liver-seg.dcm')
  // Now read back the liver-seg.dcm file and compare with original nrrd.
  const output = await readSegmentationNode(outputDicomFile)
  t.assert(output.segImage)
  t.assert(output.metaInfo)
  try {
    const r1 = await compareImagesNode(
      inputSegImage, {
        baselineImages: [output.segImage],
        spatialTolerance: 0.0001,
    })
    t.assert(r1)
    t.assert(r1 && r1.metrics)
    t.assert(r1.metrics.almostEqual)
    t.assert(r1.metrics.maximumDifference < 1e-8)
  }
  catch (error) {
    console.log('Exception while calling compareImagesNode: ', error) 
  }
})

test('write-multi-segmentation_makeSEG_merged', async t => {
  const segImages = [
  path.join(dcmqi_lib_SOURCE_DIR, 'data/segmentations/partial_overlaps-1.nrrd'),
  path.join(dcmqi_lib_SOURCE_DIR, 'data/segmentations/partial_overlaps-2.nrrd'),
  path.join(dcmqi_lib_SOURCE_DIR, 'data/segmentations/partial_overlaps-3.nrrd'),
  ]

  const metaInfoFile = path.join(dcmqi_lib_SOURCE_DIR, 'doc/examples/seg-example_partial_overlaps.json')
  const jsonFileBuffer = fs.readFileSync(metaInfoFile)
  const jsonObject = JSON.parse(jsonFileBuffer)
  const outputDicomFile = path.join(outputPathPrefix,'partial_overlaps-output.dcm')
  const dcmSeries = [
    path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/ct-3slice/01.dcm'),
    path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/ct-3slice/02.dcm'),
    path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/ct-3slice/03.dcm'),
  ]
  try{
    const writeOutput = await writeMultiSegmentationNode(jsonObject, outputDicomFile, {
      refDicomSeries: dcmSeries,
      segImages,
      useLabelidAsSegmentnumber: true
    })
    t.assert(writeOutput != null)
  }
  catch (error) {
    console.log('Exception while calling writeMultiSegmentationNode: ', error) 
  }

  // Now read back the liver-seg.dcm file and compare with original nrrd.
  console.log('Now read back the partial_overlaps-output.dcm file and compare with original nrrd')
  const readOutput = await readOverlappingSegmentationNode(outputDicomFile)
  t.assert(readOutput.segImage)
  t.assert(readOutput.metaInfo)
  /*
  console.log('JSON.stringify(readOutput.metaInfo) = ', JSON.stringify(readOutput.metaInfo))
  console.log('JSON.stringify(jsonObject)) = ', JSON.stringify(jsonObject))
  t.deepEqual(JSON.stringify(readOutput.metaInfo) === JSON.stringify(jsonObject))
  t.assert(JSON.stringify(readOutput.metaInfo) === JSON.stringify(jsonObject))
  const r1 = await compareImagesNode(
    inputSegImage, {
      baselineImages: [readOutput.segImage],
      spatialTolerance: 0.000001,
  })
  t.assert(r1)
  t.assert(r1 && r1.metrics)
  t.assert(r1.metrics.almostEqual)
  t.assert(r1.metrics.maximumDifference < 1e-8)
  * /
})

test('write-multi-segmentation_makeSEG_multiple_segment_files', async t => {
  const segImages = [
  path.join(dcmqi_lib_SOURCE_DIR, 'data/segmentations/liver_seg.nrrd'),
  path.join(dcmqi_lib_SOURCE_DIR, 'data/segmentations/spine_seg.nrrd'),
  path.join(dcmqi_lib_SOURCE_DIR, 'data/segmentations/heart_seg.nrrd'),
  ]

  const metaInfoFile = path.join(dcmqi_lib_SOURCE_DIR, 'doc/examples/seg-example_multiple_segments.json')
  const jsonFileBuffer = fs.readFileSync(metaInfoFile)
  const jsonObject = JSON.parse(jsonFileBuffer)

  const outputDicomFile = path.join(outputPathPrefix,'liver_heart_seg.dcm')

  const dcmSeries = [
    path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/ct-3slice/01.dcm'),
    path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/ct-3slice/02.dcm'),
    path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/ct-3slice/03.dcm'),
  ]
  try {
    const writeOutput = await writeMultiSegmentationNode(jsonObject, outputDicomFile, {
      refDicomSeries: dcmSeries,
      segImages,
      //useLabelidAsSegmentnumber: true
    })
    t.assert(writeOutput != null)
  }
  catch (error) {
    console.log('Exception while calling writeMultiSegmentationNode: ', error) 
  }

  // Now read back the liver-seg.dcm file and compare with original nrrd.
  const readOutput = await readOverlappingSegmentationNode(outputDicomFile)
  t.assert(readOutput.segImage)
  t.assert(readOutput.metaInfo)
  /*
  const r1 = await compareImagesNode(
    readOutput.segImage, {
      baselineImages: [readOutput.segImage],
      spatialTolerance: 0.000001,
  })
  t.assert(r1)
  t.assert(r1 && r1.metrics)
  t.assert(r1.metrics.almostEqual)
  t.assert(r1.metrics.maximumDifference < 1e-8)
  * /
})

test('write-multi-segmentation_makeSEG_multiple_segment_files_reordered', async t => {
  const segImages = [
  path.join(dcmqi_lib_SOURCE_DIR, 'data/segmentations/heart_seg.nrrd'),
  path.join(dcmqi_lib_SOURCE_DIR, 'data/segmentations/liver_seg.nrrd'),
  path.join(dcmqi_lib_SOURCE_DIR, 'data/segmentations/spine_seg.nrrd'),
  ]

  const metaInfoFile = path.join(dcmqi_lib_SOURCE_DIR, 'doc/examples/seg-example_multiple_segments_reordered.json')
  const jsonFileBuffer = fs.readFileSync(metaInfoFile)
  const jsonObject = JSON.parse(jsonFileBuffer)

  const outputDicomFile = path.join(outputPathPrefix,'liver_heart_seg_reordered.dcm')

  const dcmSeries = [
    path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/ct-3slice/01.dcm'),
    path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/ct-3slice/02.dcm'),
    path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/ct-3slice/03.dcm'),
  ]
  try {
    const writeOutput = await writeMultiSegmentationNode(jsonObject, outputDicomFile, {
      refDicomSeries: dcmSeries,
      segImages,
      useLabelidAsSegmentnumber: true
    })
    t.assert(writeOutput != null)
  } catch (error) {
    console.log('Exception while calling writeMultiSegmentationNode: ', error) 
  }

  // Now read back the liver-seg.dcm file and compare with original nrrd.
  const readOutput = await readOverlappingSegmentationNode(outputDicomFile)
  t.assert(readOutput.segImage)
  t.assert(readOutput.metaInfo)
  //const r1 = await compareImagesNode(
  //  inputSegImage, {
  //    baselineImages: [readOutput.segImage],
  //    spatialTolerance: 0.000001,
  //})
  //t.assert(r1)
  //t.assert(r1 && r1.metrics)
  //t.assert(r1.metrics.almostEqual)
  //t.assert(r1.metrics.maximumDifference < 1e-8)
})

test('itk2dcm_makeSEG_seg_size', async t => {
  //['24x38x3', '23x38x3'].forEach(async (seg_size) => 
  for (const seg_size of ['24x38x3', '23x38x3']) {
    const jsonObject = JSON.parse(fs.readFileSync(path.join(dcmqi_lib_SOURCE_DIR, 'doc/examples/seg-example.json')))
    const inputSegImageFile = path.join(dcmqi_lib_SOURCE_DIR, 'data/segmentations', `${seg_size}/nrrd/label.nrrd`)
    const inputSegImage = await readImageNode(inputSegImageFile)
    const dcmSeries = [
      path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/',`${seg_size}/image/IMG0001.dcm`),
      path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/',`${seg_size}/image/IMG0002.dcm`),
      path.join(dcmqi_lib_SOURCE_DIR, '/data/segmentations/',`${seg_size}/image/IMG0003.dcm`),
    ]
    const outputDicomFile = path.join(outputPathPrefix, `${seg_size}_seg.dcm`)
    const writeOutput = await writeSegmentationNode(inputSegImage, jsonObject, outputDicomFile, {
      refDicomSeries: dcmSeries,
      skipEmptySlices: false,
      useLabelidAsSegmentnumber: true
    })
    t.assert(writeOutput != null)

    // Now read back the liver-seg.dcm file and compare with original nrrd.
    const readOutput = await readSegmentationNode(outputDicomFile)
    t.assert(readOutput.segImage)
    t.assert(readOutput.metaInfo)
    // console.log('inputSegImage: ', inputSegImage)
    // console.log('readOutput.segImage: ', readOutput.segImage)
    const r1 = await compareImagesNode(
      inputSegImage, {
        baselineImages: [readOutput.segImage],
        spatialTolerance: 0.00001,
    })
    t.assert(r1)
    t.assert(r1 && r1.metrics)
    t.assert(r1.metrics.almostEqual)
    t.assert(r1.metrics.maximumDifference < 1e-8)
  }
})
*/
