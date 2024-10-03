import fs from 'fs'
import test from 'ava'
import path from 'path'
import {
  readSegmentationNode,
  readOverlappingSegmentationNode,
  writeSegmentationNode,
  writeOverlappingSegmentationNode,
  writeMultiSegmentationNode,
} from '../../dist/index-node.js'
import { readImageNode, writeImageNode } from '@itk-wasm/image-io'
import { compareImagesNode, vectorMagnitudeNode, toScalarDouble  } from '@itk-wasm/compare-images'

const testPathPrefix = '../test/data/input/';
const outputPathPrefix = '../test/data/output/';
const baselinePathPrefix = '../test/data/baseline/';

function arrayEquals(a, b) {
  return (a.length === b.length && a.every((val, idx) => val === b[idx]))
}

test('DCMQI read DICOM segmentation object: scalar image', async t => {
  const fileName = 'dicom-images/SEG/ReMIND-001/tumor_seg_MR_ref_3DSAGT2SPACE/1-1.dcm'
  const testFilePath = path.join(testPathPrefix, fileName)
  const output = await readSegmentationNode(testFilePath)

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

test('DCMQI read DICOM segmentation object (read-overlapping-segmentation)', async t => {
  const fileName = 'dicom-images/SEG/ABDLYMPH001-abdominal-lymph-seg.dcm'
  const testFilePath = path.join(testPathPrefix, fileName)
  const output = await readOverlappingSegmentationNode(testFilePath)

  t.assert(output.segImage != null)
  t.assert(output.segImage.data != null)
  t.assert(output.segImage.imageType.dimension === 3)
  t.deepEqual(output.segImage.origin, [ -195.5, -72.5, -373.599976 ])
  t.deepEqual(output.segImage.spacing, [ 0.7480469, 0.7480469, 1 ])
  t.assert(arrayEquals(output.segImage.direction, [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]))
  t.deepEqual(output.segImage.size, [ 512, 512, 69 ])
  t.deepEqual(output.segImage.data.length, 72351744)

  t.deepEqual(output.segImage.imageType, {
    dimension: 3,
    componentType: 'int16',
    pixelType: 'VariableLengthVector',
    components: 4
  })

  /*
  const baselineJsonFile = '/dicom-images/SEG/ABDLYMPH001_abdominal_lymph_seg.json'
  const baselineJsonFilePath = path.join(baselinePathPrefix, baselineJsonFile)
  const baselineJsonFileBuffer = fs.readFileSync(baselineJsonFilePath)
  const baselineJsonObject = JSON.parse(baselineJsonFileBuffer)
  t.assert(JSON.stringify(baselineJsonObject) === JSON.stringify(output.metaInfo))
  //await writeImageNode(output.segImage, outputPathPrefix + 'segVectorImage.nrrd');
  */
})

test('DCMQI write DICOM segmentation object: non-overlapping labels', async t => {

  const inputSegImageFile = path.join(testPathPrefix, 'dicom-images/SEG/ReMIND-001/tumor_seg_MR_ref_3DSAGT2SPACE.nrrd')
  const inputSegImage = await readImageNode(inputSegImageFile)

  const metaInfoFile = path.join(baselinePathPrefix, 'dicom-images/SEG/MR_ref_3DSAGT2SPACE_tumor_seg.json')
  const jsonFileBuffer = fs.readFileSync(metaInfoFile)
  const jsonObject = JSON.parse(jsonFileBuffer)

  const inputRefDicomSeriesPath = path.join(testPathPrefix, 'dicom-images/SEG/ReMIND-001/3DSAGT2SPACE')
  const refDicomSeries = fs.readdirSync(inputRefDicomSeriesPath).map(x => path.join(testPathPrefix, 'dicom-images/SEG/ReMIND-001/3DSAGT2SPACE', x))
  const outputDicomFile = path.join(outputPathPrefix, 'writeSegmentationNode-output-seg.dcm')

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
    const output = await writeOverlappingSegmentationNode(inputSegImage, jsonObject, outputDicomFile, {refDicomSeries: refDicom})
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
  */
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
  */
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
  */
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

// ========= IDC data tests =============
test('IDC: DICOM segmentation', async t => {
  const segFileName = 'dicom-images/IDC/nlst/100010/1.2.840.113654.2.55.236467930500313421847662756581858562399/SEG_1.2.276.0.7230010.3.1.3.313263360.35955.1706319184.882151/0ec3f890-c11a-4b33-8a37-17a68a5c7545.dcm'
  const testFilePath = path.join(testPathPrefix, segFileName)
  const output = await readSegmentationNode(testFilePath)
  console.log(output)
  console.log(output.segImage.imageType)
  console.log(output.segImage.data)
  console.log(JSON.stringify(output.metaInfo))

  t.assert(output.segImage != null)
  t.assert(output.segImage.data != null)
  t.deepEqual(output.segImage.imageType, {
    dimension: 3,
    componentType: 'int16',
    pixelType: 'Scalar',
    components: 1
  })
  t.deepEqual(output.segImage.origin, [ -174.5, 174.316528, 9.04000854 ])
  t.deepEqual(output.segImage.spacing, [ 0.683594, 0.683594, 2.5 ])
  t.assert(arrayEquals(output.segImage.direction, [ 1, 0, 0, 0, -1, 0, 0, 0, -1 ]))
  t.deepEqual(output.segImage.size, [ 512, 512, 137 ])
  t.deepEqual(output.segImage.data.length, 35913728)

  // The json file is simply generated from a previous call to readSegmentationNode. It is therefore, simply testing for regressions.
  const baselineJsonFile = '/dicom-images/IDC/nlst/100010/1.2.840.113654.2.55.236467930500313421847662756581858562399/SEG_1.2.276.0.7230010.3.1.3.313263360.35955.1706319184.882151/metaInfo.json'
  const baselineJsonFilePath = path.join(testPathPrefix, baselineJsonFile)
  const baselineJsonFileBuffer = fs.readFileSync(baselineJsonFilePath)
  const baselineJsonObject = JSON.parse(baselineJsonFileBuffer)
  t.assert(JSON.stringify(baselineJsonObject) === JSON.stringify(output.metaInfo))
})
