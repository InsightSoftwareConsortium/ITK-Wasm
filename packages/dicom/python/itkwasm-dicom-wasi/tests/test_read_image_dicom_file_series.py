from itkwasm_dicom_wasi import read_image_dicom_file_series

from .common import test_input_path, test_output_path, compare_array_float

from pathlib import Path
import numpy as np
from glob import glob

testDataInputDirectory = Path("../../test/data/input").resolve()

def test_read_image_dicom_file_series():
    pass

def test_read_image_dicom_file_series_idc1():
    nmFileName = "dicom-images/IDC/acrin_nsclc_fdg_pet/ACRIN-NSCLC-FDG-PET-134/1.3.6.1.4.1.14519.5.2.1.7009.2403.154904565437993902842316547208/NM_1.3.6.1.4.1.14519.5.2.1.7009.2403.484725606860278331095617627781/0d6c2de3-168b-4ea5-a1c8-c7d7438faa15.dcm"
    testFilePath = Path(testDataInputDirectory, nmFileName)
    output = read_image_dicom_file_series([testFilePath])
    outputImage = output[0]
    assert outputImage is not None
    assert outputImage.data is not None
    assert outputImage.imageType.dimension == 3
    assert outputImage.imageType.componentType == 'uint16'
    assert outputImage.imageType.pixelType == 'Scalar'
    assert outputImage.imageType.components == 1

    assert compare_array_float(outputImage.origin, [-204.602, -399.602, 1759.7])
    assert compare_array_float(outputImage.spacing, [2.8125, 2.8125, 2])
    assert compare_array_float(np.array(outputImage.direction).flatten(), [1, 0, 0, 0, 1, 0, 0, 0, -1])
    assert np.array_equal(outputImage.size, [128, 128, 196])
    assert (outputImage.data.size == 3211264)

def test_read_image_dicom_file_series_idc2():
    dirPath = 'dicom-images/IDC/nsclc_radiomics_genomics/LUNG3-49/1.3.6.1.4.1.32722.99.99.278496019127563640059579120768864824043/CT_1.3.6.1.4.1.32722.99.99.239963936032720978832553442140518002510'
    testDicomSeriesFiles = glob(f"{Path(testDataInputDirectory, dirPath)}/*.dcm")
    output = read_image_dicom_file_series(testDicomSeriesFiles)
    outputImage = output[0]
    assert outputImage is not None
    assert outputImage.data is not None
    assert outputImage.imageType.dimension == 3
    assert outputImage.imageType.componentType == 'int16'
    assert outputImage.imageType.pixelType == 'Scalar'
    assert outputImage.imageType.components == 1

    assert compare_array_float(outputImage.origin, [ -171, -102, 673.3 ])
    assert compare_array_float(outputImage.spacing, [ 0.672, 0.672, 4.0])
    assert compare_array_float(np.array(outputImage.direction).flatten(), [ 1, 0, 0, 0, 1, 0, 0, 0, -1 ])
    assert np.array_equal(outputImage.size, [ 512, 512, 89 ])
    assert (outputImage.data.size == 23330816)
