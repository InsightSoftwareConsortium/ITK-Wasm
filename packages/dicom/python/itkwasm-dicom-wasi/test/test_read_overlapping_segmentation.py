from pathlib import Path
from numpy import reshape
from test_helper import compare_json

testPathPrefix = '../../test/data/input/'
outputPathPrefix = '../../test/data/output/'
baselinePathPrefix = '../../test/data/baseline/'

def test_read_overlapping_segmentation():
  from itkwasm_dicom_wasi import read_overlapping_segmentation
  fileName = 'dicom-images/SEG/ABDLYMPH001-abdominal-lymph-seg.dcm'
  testFilePath = Path(testPathPrefix, fileName)
  outputImage, outputJSON = read_overlapping_segmentation(testFilePath, False)
  assert outputImage is not None
  assert outputImage.data is not None
  assert outputImage.imageType.dimension == 3
  assert outputImage.imageType.componentType == 'int16'
  assert outputImage.imageType.pixelType == 'VariableLengthVector'
  assert outputImage.imageType.components == 4
  assert outputImage.origin == [ -195.5, -72.5, -373.599976 ]
  assert outputImage.spacing == [ 0.7480469, 0.7480469, 1 ]

  dir = reshape(outputImage.direction,(9))
  expectedDir = [1, 0, 0, 0, 1, 0, 0, 0, 1]
  for idx in range(0, 9):
      assert dir[idx] == expectedDir[idx]

  assert outputImage.size == [ 512, 512, 69 ]
  assert outputImage.data.size == 72351744

  assert outputJSON is not None
  baselineJsonFile = 'dicom-images/SEG/ABDLYMPH001_abdominal_lymph_seg.json'
  baselineJsonFilePath = Path(baselinePathPrefix, baselineJsonFile)
  assert compare_json(baselineJsonFilePath, outputJSON)