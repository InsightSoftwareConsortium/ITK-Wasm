from itkwasm_image_io_wasi import gdcm_read_image, gdcm_write_image

from .common import test_input_path, test_output_path

# Issue #1470: itk::GDCMImageIO regenerates the StudyInstanceUID (0020|000d) and
# SeriesInstanceUID (0020|000e) on write unless KeepOriginalUID is set. The fix in
# write-image.cxx enables SetKeepOriginalUID(true) when the input metadata already
# carries these tags, so the original Study/Series UIDs survive a write instead of
# being regenerated. This is the Python/WASI mirror of the authoritative Node test
# (gdcm-preserve-uid-test.js from Phase 03).
# Refs: https://github.com/InsightSoftwareConsortium/ITK-Wasm/issues/1470

test_input_file_path = test_input_path / '1.3.6.1.4.1.5962.99.1.3814087073.479799962.1489872804257.100.0.dcm'
test_output_file_path = test_output_path / 'test_gdcm_preserve_uid.dcm'

study_instance_uid_tag = '0020|000d'
series_instance_uid_tag = '0020|000e'


def test_gdcm_preserve_uid_read_precondition():
    # The fix keys off the presence of Study/Series Instance UIDs in the input
    # metadata, so first confirm the sample actually carries non-empty values for
    # both tags. Without this precondition the round-trip test below could pass
    # vacuously.
    could_read, image = gdcm_read_image(test_input_file_path)
    assert could_read
    assert image.metadata.get(study_instance_uid_tag), \
        'sample DICOM must carry a non-empty StudyInstanceUID (0020|000d)'
    assert image.metadata.get(series_instance_uid_tag), \
        'sample DICOM must carry a non-empty SeriesInstanceUID (0020|000e)'


def test_gdcm_preserve_uid_round_trip():
    # Read the sample, write it back out through the fixed gdcm-write wasm
    # (uncompressed), read the written file back, and assert the Study/Series UIDs
    # are byte-for-byte identical across the round-trip. A mismatch means GDCM
    # regenerated the UID on write instead of preserving it (the pre-fix bug #1470).
    could_read, image = gdcm_read_image(test_input_file_path)
    assert could_read

    original_study = image.metadata[study_instance_uid_tag]
    original_series = image.metadata[series_instance_uid_tag]

    could_write = gdcm_write_image(image, str(test_output_file_path), use_compression=False)
    assert could_write

    could_read_back, image_back = gdcm_read_image(test_output_file_path)
    assert could_read_back

    assert image_back.metadata[study_instance_uid_tag] == original_study, \
        'StudyInstanceUID (0020|000d) changed on write — GDCM regenerated it ' \
        'instead of preserving the original (regression of the issue #1470 fix)'
    assert image_back.metadata[series_instance_uid_tag] == original_series, \
        'SeriesInstanceUID (0020|000e) changed on write — GDCM regenerated it ' \
        'instead of preserving the original (regression of the issue #1470 fix)'
