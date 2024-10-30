from pathlib import Path
import numpy as np
from test_helper import compare_json

testPathPrefix = '../../test/data/input/'
outputPathPrefix = '../../test/data/output/'
baselinePathPrefix = '../../test/data/baseline/'

def test_read_segmentation():
    from itkwasm_dicom_wasi import read_segmentation
    fileName = 'dicom-images/SEG/ReMIND-001/tumor_seg_MR_ref_3DSAGT2SPACE/1-1.dcm'
    testFilePath = Path(testPathPrefix, fileName)
    outputImage, outputJSON = read_segmentation(testFilePath)
    assert outputImage is not None
    assert outputImage.data is not None
    assert outputImage.imageType.dimension == 3
    assert outputImage.imageType.componentType == 'int16'
    assert outputImage.imageType.pixelType == 'Scalar'
    assert outputImage.imageType.components == 1

    assert outputJSON is not None
    baselineJsonFile = 'dicom-images/SEG/MR_ref_3DSAGT2SPACE_tumor_seg.json'
    baselineJsonFilePath = Path(baselinePathPrefix, baselineJsonFile)
    assert compare_json(baselineJsonFilePath, outputJSON)

def test_read_segmentation_idc1():
    from itkwasm_dicom_wasi import read_segmentation
    fileName = 'dicom-images/IDC/nlst/100010/1.2.840.113654.2.55.236467930500313421847662756581858562399/SEG_1.2.276.0.7230010.3.1.3.313263360.35955.1706319184.882151/0ec3f890-c11a-4b33-8a37-17a68a5c7545.dcm'
    testFilePath = Path(testPathPrefix, fileName)
    outputImage, outputJSON = read_segmentation(testFilePath)
    assert outputImage is not None
    assert outputImage.data is not None
    assert outputImage.imageType.dimension == 3
    assert outputImage.imageType.componentType == 'int16'
    assert outputImage.imageType.pixelType == 'Scalar'
    assert outputImage.imageType.components == 1

    assert np.array_equal(outputImage.origin, [ -174.5, 174.316528, 9.04000854 ])
    assert np.array_equal(outputImage.spacing, [ 0.683594, 0.683594, 2.5 ])
    assert np.array_equal(np.array(outputImage.direction).flatten(), [ 1, 0, 0, 0, -1, 0, 0, 0, -1 ])
    assert np.array_equal(outputImage.size, [ 512, 512, 137 ])
    assert (outputImage.data.size == 35913728)

    assert outputJSON is not None
    baselineJsonFile = 'dicom-images/IDC/nlst/100010/1.2.840.113654.2.55.236467930500313421847662756581858562399/SEG_1.2.276.0.7230010.3.1.3.313263360.35955.1706319184.882151/metaInfo.json'
    baselineJsonFilePath = Path(testPathPrefix, baselineJsonFile)
    assert compare_json(baselineJsonFilePath, outputJSON)
