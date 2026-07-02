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
# empty -- the payoff of the pipeline is that a caller can describe two images and a transform with a few
# numbers and learn exactly which region of the moving image to fetch, without ever holding pixels. There is no
# higher-level metadata-image helper in itkwasm, so (like the TypeScript test) we construct the Image directly.


def metadata_only_image(size, spacing, origin):
    """A 2D, single-component, uint8 Image with the given geometry and an EMPTY pixel buffer."""
    image_type = ImageType(
        dimension=2,
        componentType=IntTypes.UInt8,
        pixelType=PixelTypes.Scalar,
        components=1,
    )
    return Image(
        imageType=image_type,
        origin=origin,
        spacing=spacing,
        direction=np.eye(2, dtype=np.float64),  # identity
        size=size,
        data=np.empty((0,), dtype=np.uint8),  # no pixels -- exercise the metadata-only contract
    )


def translation_transform(offset):
    """A single-entry TransformList holding a 2D, float64 TranslationTransform with the given offset.

    itkwasm-transform has no create_translation_transform helper, so the minimal TransformList is built by hand:
    a Translation has no fixed parameters and its parameters are the per-axis offset.
    """
    transform_type = TransformType(
        transformParameterization=TransformParameterizations.Translation,
        parametersValueType=FloatTypes.Float64,
        inputDimension=2,
        outputDimension=2,
    )
    transform = Transform(
        transformType=transform_type,
        numberOfFixedParameters=0,
        numberOfParameters=2,
        fixedParameters=np.empty((0,), dtype=np.float64),
        parameters=np.asarray(offset, dtype=np.float64),
        name="TranslationTransform",
    )
    return [transform]


# Shared geometry (matches the self-contained C++ CTest inputs, whose output is independently verified, and the
# TypeScript node test):
#   fixed : 16x16, spacing (2,2), origin (10,20)  -> physical grid [10,40] x [20,50]
#   moving: 64x64, spacing (1,1), origin  (0, 0)  -> continuous index == physical coordinate
#   transform: translation (10,5)                 -> fixed grid maps to [20,50] x [25,55]
# The tight (unpadded) moving-image region is therefore start (20,25), inclusive-end (50,55).
def fixed_image():
    return metadata_only_image([16, 16], [2, 2], [10, 20])


def moving_image():
    return metadata_only_image([64, 64], [1, 1], [0, 0])


def transform():
    return translation_transform([10, 5])


def test_resample_bounding_box():
    """With one pixel of padding per side, the reported region bounds the translated fixed grid plus one pixel."""
    result = resample_bounding_box(transform(), fixed_image(), moving_image(), padding=1)

    # Tight corners are padding-independent: the translated fixed grid, [20,50] x [25,55].
    assert result["corners"]["min"] == pytest.approx([20, 25])
    assert result["corners"]["max"] == pytest.approx([50, 55])

    # With one pixel of padding per side the integer region grows outward by one on every side.
    assert result["paddedStartIndex"] == [19, 24]
    assert result["paddedSize"] == [33, 33]  # (50-20) + 1 tight, +2 for padding => 33

    # Padded corners are the physical location of the padded start and inclusive-end indices in the moving image.
    assert result["paddedCorners"]["min"] == pytest.approx([19, 24])
    assert result["paddedCorners"]["max"] == pytest.approx([51, 56])

    # Persist the result next to the other Python test outputs for inspection.
    with open(test_output_path / "resample-bounding-box.json", "w") as fp:
        json.dump(result, fp)


def test_resample_bounding_box_padding_zero_shrinks_by_one_per_side():
    """padding=0 shrinks the region by exactly one pixel per side and accepts an empty-data moving image.

    Cross-checks the C++, TypeScript, and Python results against one another: the padding=0 region here is the
    same one asserted in the TypeScript test, and the shrink relationship mirrors it exactly.
    """
    padded = resample_bounding_box(transform(), fixed_image(), moving_image(), padding=1)
    tight = resample_bounding_box(transform(), fixed_image(), moving_image(), padding=0)

    # The empty-data moving image was accepted without error (the metadata-only contract holds), and padding=0
    # was actually forwarded (a falsy 0 must not fall back to the C++ default of 1).
    assert tight["paddedStartIndex"] == [20, 25]
    assert tight["paddedSize"] == [31, 31]

    # With no padding the integer region is exactly the tight corners.
    assert tight["paddedCorners"]["min"] == pytest.approx(tight["corners"]["min"])
    assert tight["paddedCorners"]["max"] == pytest.approx(tight["corners"]["max"])

    # Compared with the default (padding 1), padding 0 shrinks the region by exactly one pixel on every side:
    # the start index moves in by one and the size shrinks by two (one per side) on each axis.
    for axis in range(2):
        assert tight["paddedStartIndex"][axis] == padded["paddedStartIndex"][axis] + 1
        assert tight["paddedSize"][axis] == padded["paddedSize"][axis] - 2
