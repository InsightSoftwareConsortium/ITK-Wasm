from pathlib import Path
import json
from os import remove
from os.path import isfile
from glob import glob
from test_helper import compare_json
from numpy import reshape

testPathPrefix = '../../test/data/input/'
outputPathPrefix = '../../test/data/output/'
baselinePathPrefix = '../../test/data/baseline/'


def test_write_overlapping_segmentation():
    """
    DCMQI write DICOM segmentation object: overlapping labels
    """
    from itkwasm_dicom_wasi import read_overlapping_segmentation, write_overlapping_segmentation
    testFilePath = Path(testPathPrefix, 'dicom-images/SEG/ABDLYMPH001-abdominal-lymph-seg.dcm')
    inputSegImage, inputSegJson = read_overlapping_segmentation(testFilePath)
    assert inputSegImage
    assert inputSegJson
    metaInfoFile = Path(baselinePathPrefix, 'dicom-images/SEG/ABDLYMPH001_abdominal_lymph_seg.json')
    jsonFileBuffer = open(metaInfoFile, 'r').read()
    jsonObject = json.loads(jsonFileBuffer)

    inputRefDicomSeriesPath = Path(testPathPrefix, 'dicom-images/SEG/abdominallymphnodes')
    dcmSeries = sorted(inputRefDicomSeriesPath.glob('*.dcm'))
    outputDicomFile = Path(outputPathPrefix, 'writeOverlappingSegmentationNode-output-seg.dcm')

    if isfile(outputDicomFile):
      remove(outputDicomFile)

    write_overlapping_segmentation(inputSegImage, jsonObject, outputDicomFile, dcmSeries)
    assert isfile(outputDicomFile)
    outputDCMImage,_ = read_overlapping_segmentation(outputDicomFile)
    #print('outputDCMImage: ', outputDCMImage)
    assert outputDCMImage is not None
    assert outputDCMImage.data is not None
    assert outputDCMImage.imageType.dimension == 3
    assert outputDCMImage.imageType.componentType == 'int16'
    assert outputDCMImage.imageType.pixelType == 'VariableLengthVector'
    assert outputDCMImage.imageType.components == 4
    assert outputDCMImage.origin == [-195.5, -72.5, -373.599976]
    assert outputDCMImage.spacing == [0.7480469, 0.7480469, 1]
    dir = reshape(outputDCMImage.direction,(9))
    expectedDir = [1, 0, 0, 0, 1, 0, 0, 0, 1]
    for idx in range(0, 9):
        assert round(dir[idx], 4) == round(expectedDir[idx], 4)
    assert outputDCMImage.size == [512, 512, 69]