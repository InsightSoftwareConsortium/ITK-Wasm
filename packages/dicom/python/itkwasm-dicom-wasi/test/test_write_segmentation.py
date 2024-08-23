from pathlib import Path
import json
from os import remove
from os.path import isfile
from glob import glob
from test_helper import compare_json
from numpy import reshape
from itkwasm_image_io import read_image
from itkwasm_dicom_wasi import write_segmentation, read_segmentation
from itkwasm_compare_images import compare_images

testPathPrefix = '../../test/data/input/'
outputPathPrefix = '../../test/data/output/'
baselinePathPrefix = '../../test/data/baseline/'
dcmqi_lib_SOURCE_DIR = '../../emscripten-build/_deps/dcmqi_lib-src'

def test_write_segmentation():
    inputSegImageFile = Path(testPathPrefix, 'dicom-images/SEG/ReMIND-001/tumor_seg_MR_ref_3DSAGT2SPACE.nrrd')
    inputSegImage = read_image(inputSegImageFile)
    #print('inputSegImage: ', inputSegImage)
    metaInfoFile = Path(baselinePathPrefix, 'dicom-images/SEG/MR_ref_3DSAGT2SPACE_tumor_seg.json')
    jsonFileBuffer = open(metaInfoFile, 'r').read()
    jsonObject = json.loads(jsonFileBuffer)
    #print('metaInfoJSON: ', jsonObject)

    inputRefDicomSeriesPath = Path(testPathPrefix, 'dicom-images/SEG/ReMIND-001/3DSAGT2SPACE')
    #print('inputRefDicomSeriesPath: ', inputRefDicomSeriesPath)
    dcmSeries = sorted(inputRefDicomSeriesPath.glob('*.dcm'))
    #print('dcmFiles = ', dcmSeries)

    outputDicomFile = Path(outputPathPrefix, 'writeSegmentationNode-output-seg.dcm')
    #print('outputDicomFile :', outputDicomFile)
    if isfile(outputDicomFile):
        remove(outputDicomFile)
    write_segmentation(inputSegImage, jsonObject, outputDicomFile, dcmSeries)
    assert isfile(outputDicomFile)
    outputDCMImage, outputJSON = read_segmentation(outputDicomFile)
    assert compare_json(metaInfoFile, outputJSON)
    #print('outputDCMImage: ', outputDCMImage)
    assert outputDCMImage is not None
    assert outputDCMImage.data is not None
    assert outputDCMImage.imageType.dimension == 3
    assert outputDCMImage.imageType.componentType == 'int16'
    assert outputDCMImage.imageType.pixelType == 'Scalar'
    assert outputDCMImage.imageType.components == 1
    assert outputDCMImage.origin == [-15.0286255, -131.630859, 0.10256958]
    dir = reshape(outputDCMImage.direction,(9))
    expectedDir = [-0.7521953 , -0.64890099, -0.11458491, -0.65218765,  0.75797546, -0.01115839, 0.09409324,  0.06633757, -0.99335079]
    for idx in range(0, 9):
        assert round(dir[idx], 4) == round(expectedDir[idx], 4)
    assert outputDCMImage.size == [61, 63, 59]

def test_write_segmentation_makeSEG():
    print("test write_segmentation_makeSEG: ")
    inputSegImageFile = Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/liver_seg.nrrd')
    inputSegImage = read_image(inputSegImageFile)
    print('liver_seg.nrrd: ', inputSegImage)
    metaInfoFile = Path(dcmqi_lib_SOURCE_DIR, 'doc/examples/seg-example.json')
    jsonFileBuffer = open(metaInfoFile, 'r').read()
    jsonObject = json.loads(jsonFileBuffer)
    outputDicomFile = Path(outputPathPrefix, 'liver-seg.dcm')
    dcmSeries = [
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/ct-3slice/01.dcm'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/ct-3slice/02.dcm'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/ct-3slice/03.dcm'),
    ]
    write_segmentation(inputSegImage, jsonObject, outputDicomFile, dcmSeries)
    # Now read back the liver-seg.dcm file and compare with original nrrd.
    print("now read back the liver-seg.dcm")
    outputImage, outputJson = read_segmentation(outputDicomFile)
    assert outputImage
    assert outputJson
    #almost_equal, _, _ = compare_images(inputSegImage,
    #    [
    #        outputImage,
    #    ],
    #    spatial_tolerance = 0.0001
    #)
    #assert almost_equal

def test_write_segmentation_makeSEG_seg_size():
    for seg_size in ['24x38x3', '23x38x3']:
        metaInfoFile = Path(dcmqi_lib_SOURCE_DIR, 'doc/examples/seg-example.json')
        jsonFileBuffer = open(metaInfoFile, 'r').read()
        jsonObject = json.loads(jsonFileBuffer)
        inputSegImageFile = Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/', seg_size + '/nrrd/label.nrrd')
        print(inputSegImageFile )
        inputSegImage = read_image(inputSegImageFile)
        dcmSeries = [
            Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/', seg_size + '/image/IMG0001.dcm'),
            Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/', seg_size + '/image/IMG0002.dcm'),
            Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/', seg_size + '/image/IMG0003.dcm'),
        ]
        outputDicomFile = Path(outputPathPrefix, seg_size + '_seg.dcm')
        write_segmentation(inputSegImage, jsonObject, outputDicomFile, dcmSeries, skip_empty_slices=False, use_labelid_as_segmentnumber=True)
        # Now read back the liver-seg.dcm file and compare with original nrrd.
        outputImage, outputJson = read_segmentation(outputDicomFile)
        assert outputImage
        assert outputJson
        #almost_equal, _, _ = compare_images(inputSegImage,
        #    [
        #        outputImage,
        #    ],
        #    spatial_tolerance = 0.0001
        #)
        #assert almost_equal
