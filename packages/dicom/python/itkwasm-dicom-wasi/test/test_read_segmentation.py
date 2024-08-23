from pathlib import Path
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