import json

import numpy as np
import pytest

from itkwasm import (
    Image,
    ImageType,
    IntTypes,
    PixelTypes,
    Transform,
    TransformType,
    TransformParameterizations,
    FloatTypes,
)

from itkwasm_downsample_wasi import resample_bounding_box

from .common import test_output_path

# The resample-bounding-box pipeline reads ONLY image metadata (size, spacing, origin, direction); the pixel
# buffers are never dereferenced. These helpers therefore build "metadata-only" images whose data buffer is
# empty -- the payoff of the pipeline is that a caller can describe two images and a transform with a few numbers
# and learn exactly which region of the moving image to fetch, without ever holding pixels. There is no
# higher-level metadata-image helper in itkwasm, so (like the TypeScript test) we construct the Image directly.
# The helpers are dimension-generic so the same code covers the 2D and 3D cases; the case table below parametrizes
# the test body rather than copy-pasting a whole test per dimension/transform.


def metadata_only_image(size, spacing, origin):
    """A single-component, uint8 Image of arbitrary dimension with the given geometry and an EMPTY pixel buffer."""
    dimension = len(size)
    image_type = ImageType(
        dimension=dimension,
        componentType=IntTypes.UInt8,
        pixelType=PixelTypes.Scalar,
        components=1,
    )
    return Image(
        imageType=image_type,
        origin=origin,
        spacing=spacing,
        direction=np.eye(dimension, dtype=np.float64),  # identity
        size=size,
        data=np.empty((0,), dtype=np.uint8),  # no pixels -- exercise the metadata-only contract
    )


def translation_transform(offset):
    """A single-entry TransformList holding a float64 TranslationTransform (dimension inferred from the offset).

    itkwasm-transform has no create_translation_transform helper, so the minimal TransformList is built by hand:
    a Translation has no fixed parameters and its parameters are the per-axis offset.
    """
    dimension = len(offset)
    transform_type = TransformType(
        transformParameterization=TransformParameterizations.Translation,
        parametersValueType=FloatTypes.Float64,
        inputDimension=dimension,
        outputDimension=dimension,
    )
    transform = Transform(
        transformType=transform_type,
        numberOfFixedParameters=0,
        numberOfParameters=dimension,
        fixedParameters=np.empty((0,), dtype=np.float64),
        parameters=np.asarray(offset, dtype=np.float64),
        name="TranslationTransform",
    )
    return [transform]


def affine_transform(matrix_row_major, translation, center):
    """A single-entry TransformList holding a float64 AffineTransform.

    ITK's MatrixOffsetTransformBase packs its parameters as the row-major matrix followed by the translation, and
    its fixed parameters as the center of rotation -- so parameters = [*matrix_row_major, *translation],
    fixedParameters = center. This exactly mirrors how resample-bounding-box-generate-inputs builds the transform
    in C++, so the C++, TypeScript, and Python surfaces agree.
    """
    dimension = len(translation)
    transform_type = TransformType(
        transformParameterization=TransformParameterizations.Affine,
        parametersValueType=FloatTypes.Float64,
        inputDimension=dimension,
        outputDimension=dimension,
    )
    parameters = np.asarray(list(matrix_row_major) + list(translation), dtype=np.float64)
    transform = Transform(
        transformType=transform_type,
        numberOfFixedParameters=len(center),
        numberOfParameters=len(parameters),
        fixedParameters=np.asarray(center, dtype=np.float64),
        parameters=parameters,
        name="AffineTransform",
    )
    return [transform]


# Cross-surface case table. Every region here is asserted identically by the C++ unit test
# (resample-bounding-box-test.cxx) and the TypeScript suite, and is exercised end-to-end by the C++ CTests, so the
# C++, TypeScript, and Python results are provably identical for the same inputs.
#   2D translation: fixed 16x16 sp(2,2) o(10,20), translation (10,5)          -> corners [20,50] x [25,55]
#   3D translation: fixed 8^3 sp(2,2,2) o(10,20,30), translation (10,5,3)     -> corners [20,34]x[25,39]x[33,47]
#   2D rotation    : fixed 20x10 sp(1,1) o(0,0), affine rot(cos.8,sin.6)@(9.5,4.5)+t(10,10) -> [9.2,29.8]x[5.2,23.8]
# Moving image is spacing (1,1[,1]) origin 0 throughout, so continuous index == physical coordinate.
CASES = [
    dict(
        name="2d-translation",
        fixed=lambda: metadata_only_image([16, 16], [2, 2], [10, 20]),
        moving=lambda: metadata_only_image([64, 64], [1, 1], [0, 0]),
        transform=lambda: translation_transform([10, 5]),
        corners_min=[20, 25],
        corners_max=[50, 55],
        p1=dict(start=[19, 24], size=[33, 33], pmin=[19, 24], pmax=[51, 56]),
        p0=dict(start=[20, 25], size=[31, 31], pmin=[20, 25], pmax=[50, 55]),
    ),
    dict(
        name="3d-translation",
        fixed=lambda: metadata_only_image([8, 8, 8], [2, 2, 2], [10, 20, 30]),
        moving=lambda: metadata_only_image([64, 64, 64], [1, 1, 1], [0, 0, 0]),
        transform=lambda: translation_transform([10, 5, 3]),
        corners_min=[20, 25, 33],
        corners_max=[34, 39, 47],
        p1=dict(start=[19, 24, 32], size=[17, 17, 17], pmin=[19, 24, 32], pmax=[35, 40, 48]),
        p0=dict(start=[20, 25, 33], size=[15, 15, 15], pmin=[20, 25, 33], pmax=[34, 39, 47]),
    ),
    dict(
        name="2d-rotation",
        fixed=lambda: metadata_only_image([20, 10], [1, 1], [0, 0]),
        moving=lambda: metadata_only_image([64, 64], [1, 1], [0, 0]),
        transform=lambda: affine_transform([0.8, -0.6, 0.6, 0.8], [10, 10], [9.5, 4.5]),
        corners_min=[9.2, 5.2],
        corners_max=[29.8, 23.8],
        p1=dict(start=[8, 4], size=[24, 22], pmin=[8, 4], pmax=[31, 25]),
        p0=dict(start=[9, 5], size=[22, 20], pmin=[9, 5], pmax=[30, 24]),
    ),
]


@pytest.mark.parametrize("case", CASES, ids=[c["name"] for c in CASES])
def test_resample_bounding_box_region(case):
    """The reported region tightly bounds the transformed fixed grid, plus symmetric padding.

    Asserts identical regions to the C++ and TypeScript surfaces for the same inputs, across 2D/3D and
    translation/affine, with metadata-only (empty-buffer) images throughout.
    """
    # padding 1 (default): the region bounds the transformed fixed grid plus one pixel per side.
    padded = resample_bounding_box(case["transform"](), case["fixed"](), case["moving"](), padding=1)

    # Tight corners are padding-independent and match the analytic transformed-grid extremes.
    assert padded["corners"]["min"] == pytest.approx(case["corners_min"])
    assert padded["corners"]["max"] == pytest.approx(case["corners_max"])

    assert padded["paddedStartIndex"] == case["p1"]["start"]
    assert padded["paddedSize"] == case["p1"]["size"]
    assert padded["paddedCorners"]["min"] == pytest.approx(case["p1"]["pmin"])
    assert padded["paddedCorners"]["max"] == pytest.approx(case["p1"]["pmax"])

    # padding 0: the empty-data images are accepted (metadata-only contract) and 0 is forwarded (a falsy 0 must
    # not fall back to the C++ default of 1); the padded corners collapse to the integer-index bound of the tight
    # corners (equal to the tight corners only when they fall on grid lines -- the translation cases, not the
    # rotation); and the region is exactly one pixel smaller per side than the padding-1 region (symmetric).
    tight = resample_bounding_box(case["transform"](), case["fixed"](), case["moving"](), padding=0)
    assert tight["paddedStartIndex"] == case["p0"]["start"]
    assert tight["paddedSize"] == case["p0"]["size"]
    assert tight["paddedCorners"]["min"] == pytest.approx(case["p0"]["pmin"])
    assert tight["paddedCorners"]["max"] == pytest.approx(case["p0"]["pmax"])

    for axis in range(len(case["corners_min"])):
        assert tight["paddedStartIndex"][axis] == padded["paddedStartIndex"][axis] + 1
        assert tight["paddedSize"][axis] == padded["paddedSize"][axis] - 2

    # Persist each case's padded result next to the other Python test outputs for inspection.
    with open(test_output_path / f"resample-bounding-box-{case['name']}.json", "w") as fp:
        json.dump(padded, fp)
