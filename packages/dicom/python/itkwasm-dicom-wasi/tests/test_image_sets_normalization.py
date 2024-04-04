from itkwasm_dicom_wasi import image_sets_normalization

from .common import test_input_path, test_output_path


orientation_series = [
    test_input_path / "DicomImageOrientationTest" / "ImageOrientation.1.dcm",
    test_input_path / "DicomImageOrientationTest" / "ImageOrientation.2.dcm",
    test_input_path / "DicomImageOrientationTest" / "ImageOrientation.3.dcm",
]

mr_series = [
    test_input_path / "dicom-images" / "MR" / "1-001.dcm",
    test_input_path / "dicom-images" / "MR" / "1-002.dcm",
    test_input_path / "dicom-images" / "MR" / "1-003.dcm",
    test_input_path / "dicom-images" / "MR" / "1-004.dcm",
    test_input_path / "dicom-images" / "MR" / "1-005.dcm",
]

ct_series = [
    test_input_path / "dicom-images" / "CT" / "1-1.dcm",
    test_input_path / "dicom-images" / "CT" / "1-2.dcm",
]


def pick_files(image_set):
    instances = list(image_set["Study"]["Series"].values())[0]["Instances"].values()
    files = [instance["ImageFrames"][0]["ID"] for instance in instances]
    return files


def assert_equal(fileStrings, paths):
    assert all(file == str(path) for file, path in zip(fileStrings, paths))


def test_one_series():
    assert orientation_series[0].exists()
    out_of_order = [
        orientation_series[1],
        orientation_series[2],
        orientation_series[0],
    ]
    image_sets = image_sets_normalization(out_of_order)
    assert image_sets
    sorted_files = pick_files(image_sets[0])
    assert_equal(sorted_files, orientation_series)


def test_ct():
    image_sets = image_sets_normalization(ct_series)
    assert len(image_sets) == 1
    sorted_files = pick_files(image_sets[0])
    assert_equal(sorted_files, ct_series)

def test_mr():
    assert mr_series[0].exists()
    out_of_order = [
        mr_series[1],
        mr_series[2],
        mr_series[0],
        mr_series[3],
        mr_series[4],
    ]
    image_sets = image_sets_normalization(out_of_order)
    assert image_sets
    sorted_files = pick_files(image_sets[0])
    assert_equal(sorted_files, mr_series)


def test_two_series():
    files = [
        orientation_series[1],
        mr_series[4],
        mr_series[2],
        mr_series[1],
        orientation_series[2],
        orientation_series[0],
        mr_series[3],
        mr_series[0],
    ]
    assert files[0].exists()
    image_sets = image_sets_normalization(files)
    assert len(image_sets) == 2
    for image_set, paths in zip(image_sets, [mr_series, orientation_series]):
        sorted_files = pick_files(image_set)
        assert_equal(sorted_files, paths)


def test_three_series():
    files = [
        ct_series[0],
        orientation_series[1],
        mr_series[4],
        mr_series[2],
        mr_series[1],
        orientation_series[2],
        ct_series[1],
        orientation_series[0],
        mr_series[3],
        mr_series[0],
    ]
    assert files[0].exists()
    image_sets = image_sets_normalization(files)
    assert len(image_sets) == 3
    for image_set, paths in zip(image_sets, [mr_series, orientation_series, ct_series]):
        sorted_files = pick_files(image_set)
        assert_equal(sorted_files, paths)
