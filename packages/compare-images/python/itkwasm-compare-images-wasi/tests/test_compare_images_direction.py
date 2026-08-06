import numpy as np
import pytest
from itkwasm import FloatTypes, Image, ImageType, PixelTypes
from itkwasm_compare_images_wasi import compare_double_images

# A non-identity direction is the normal case for a 3D medical image. Collapsing
# it to a sub-matrix for the 2D preview slice fails when that sub-matrix is
# singular, which it is for an axis permutation.
DIRECTIONS = {
    "identity": [1, 0, 0, 0, 1, 0, 0, 0, 1],
    # NRRD space directions (0,1,0) (0,0,-1) (-1,0,0): the 2x2 sub-matrix is singular.
    "permuted": [0, 0, -1, 1, 0, 0, 0, -1, 0],
    "flipped": [-1, 0, 0, 0, -1, 0, 0, 0, 1],
}


def _image(direction, spike=None):
    size = [8, 8, 8]
    data = np.arange(np.prod(size), dtype=np.float64).reshape(size[::-1])
    if spike is not None:
        data[4, 4, 4] += spike
    return Image(
        imageType=ImageType(
            dimension=3,
            componentType=FloatTypes.Float64,
            pixelType=PixelTypes.Scalar,
            components=1,
        ),
        name="image",
        origin=[0.0, 0.0, 0.0],
        spacing=[1.0, 1.0, 1.0],
        direction=np.asarray(direction, dtype=np.float64).reshape(3, 3),
        size=size,
        data=data,
    )


@pytest.mark.parametrize("name", list(DIRECTIONS))
def test_compare_double_images_direction(name):
    """An image compared against itself is equal, whatever its direction."""
    image = _image(DIRECTIONS[name])
    metrics, _difference, _preview = compare_double_images(
        image,
        baseline_images=[image],
        difference_threshold=0.0,
        radius_tolerance=0,
        number_of_pixels_tolerance=0,
    )
    assert metrics["almostEqual"]
    assert metrics["numberOfPixelsWithDifferences"] == 0


@pytest.mark.parametrize("name", list(DIRECTIONS))
def test_compare_double_images_detects_differences(name):
    """Differences are still found, so the fix does not just silence the path."""
    direction = DIRECTIONS[name]
    metrics, _difference, preview = compare_double_images(
        _image(direction, spike=50.0),
        baseline_images=[_image(direction)],
        difference_threshold=0.0,
        radius_tolerance=0,
        number_of_pixels_tolerance=0,
    )
    assert not metrics["almostEqual"]
    assert metrics["numberOfPixelsWithDifferences"] == 1
    assert metrics["maximumDifference"] == 50.0
    # The 2D preview is the slice whose direction collapse used to throw.
    assert preview is not None
