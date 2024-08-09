from pathlib import Path
import json
from os import remove
from os.path import isfile
from glob import glob
from test_helper import compare_json
from numpy import reshape
from itkwasm_dicom_wasi import write_multi_segmentation
from itkwasm_dicom_wasi import read_overlapping_segmentation

testPathPrefix = '../../test/data/input/'
outputPathPrefix = '../../test/data/output/'
baselinePathPrefix = '../../test/data/baseline/'
dcmqi_lib_SOURCE_DIR = '../../emscripten-build/_deps/dcmqi_lib-src'

def test_write_multi_segmentation():
    segImages = [
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/partial_overlaps-1.nrrd'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/partial_overlaps-2.nrrd'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/partial_overlaps-3.nrrd'),
    ]

    metaInfoFile = Path(dcmqi_lib_SOURCE_DIR, 'doc/examples/seg-example_partial_overlaps.json')
    jsonFileBuffer = open(metaInfoFile, 'r').read()
    jsonObject = json.loads(jsonFileBuffer)
    outputDicomFile = Path(outputPathPrefix, 'partial_overlaps-output.dcm')
    dcmSeries = [
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/ct-3slice/01.dcm'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/ct-3slice/02.dcm'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/ct-3slice/03.dcm'),
    ]
    write_multi_segmentation(jsonObject, outputDicomFile, dcmSeries, segImages, use_labelid_as_segmentnumber=True)

    # Now read back the liver-seg.dcm file and compare with original nrrd.
    print('Now read back the partial_overlaps-output.dcm file and compare with original nrrd')
    outputImage, outputJson = read_overlapping_segmentation(outputDicomFile)
    assert outputImage
    assert outputJson

def test_write_multi_segmentation2():
    """write-multi-segmentation_makeSEG_multiple_segment_files"""
    segImages = [
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/liver_seg.nrrd'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/spine_seg.nrrd'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/heart_seg.nrrd'),
    ]

    metaInfoFile = Path(dcmqi_lib_SOURCE_DIR, 'doc/examples/seg-example_multiple_segments.json')
    jsonFileBuffer = open(metaInfoFile, 'r').read()
    jsonObject = json.loads(jsonFileBuffer)

    outputDicomFile = Path(outputPathPrefix, 'liver_heart_seg.dcm')

    dcmSeries = [
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/ct-3slice/01.dcm'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/ct-3slice/02.dcm'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/ct-3slice/03.dcm'),
    ]
    write_multi_segmentation(jsonObject, outputDicomFile, dcmSeries, segImages, use_labelid_as_segmentnumber=True)
    # Now read back the liver-seg.dcm file and compare with original nrrd.
    outputImage, outputJson = read_overlapping_segmentation(outputDicomFile)
    assert outputImage
    assert outputJson

def test_write_multi_segmentation3():
    """testing write-multi-segmentation_makeSEG_multiple_segment_files_reordered"""
    segImages = [
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/heart_seg.nrrd'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/liver_seg.nrrd'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/spine_seg.nrrd'),
    ]

    metaInfoFile = Path(dcmqi_lib_SOURCE_DIR, 'doc/examples/seg-example_multiple_segments_reordered.json')
    jsonFileBuffer = open(metaInfoFile, 'r').read()
    jsonObject = json.loads(jsonFileBuffer)

    outputDicomFile = Path(outputPathPrefix, 'liver_heart_seg_reordered.dcm')

    dcmSeries = [
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/ct-3slice/01.dcm'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/ct-3slice/02.dcm'),
        Path(dcmqi_lib_SOURCE_DIR, 'data/segmentations/ct-3slice/03.dcm'),
    ]

    write_multi_segmentation(jsonObject, outputDicomFile, dcmSeries, segImages, use_labelid_as_segmentnumber=True)
    # Now read back the liver-seg.dcm file and compare with original nrrd.
    outputImage, outputJson = read_overlapping_segmentation(outputDicomFile)
    assert outputImage
    assert outputJson