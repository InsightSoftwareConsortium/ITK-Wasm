import numpy as np

from itkwasm import (
    Image,
    PixelTypes,
    Transform,
    TransformType,
    TransformParameterizations,
    FloatTypes,
)
from itkwasm_compare_images import compare_images
from itkwasm_image_io import read_image, write_image

from itkwasm_downsample_wasi import resample, resample_to_reference

from .common import test_input_path, test_output_path


def translation_transform(offset):
    """A single-entry TransformList holding a float64 TranslationTransform.

    A Translation is a distinct parameterization from Affine, with only ``dimension`` parameters (the offset)
    and no fixed parameters; the pipeline reconstructs it generically rather than coercing it into an affine.
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


def test_resample_auto_size_from_spacing():
    """Spacing-only convenience: given ``output_spacing`` but no ``size``, the pipeline auto-computes the size so
    the output covers the same physical extent as the input.

    cthead1 is 256x256 with unit spacing, so doubling the spacing to 2 halves the size to 128 (256 * 1 == 128 * 2);
    origin and direction are inherited unchanged.
    """
    moving = read_image(test_input_path / 'cthead1.png')

    # Precondition: the input geometry the auto-size derivation depends on.
    assert list(moving.size) == [256, 256]
    assert list(moving.spacing) == [1.0, 1.0]

    output = resample(moving, output_spacing=[2, 2])
    write_image(output, test_output_path / 'resample-test-cthead1-spacing-only.mha')

    assert list(output.size) == [128, 128]
    assert list(output.spacing) == [2.0, 2.0]
    assert list(output.origin) == list(moving.origin)
    assert np.array_equal(output.direction, moving.direction)


def test_resample_explicit_full_grid_equals_resample_to_reference():
    """Explicit full grid equals resample-to-reference: describing the output grid with the four parameters
    (size, spacing, origin, direction) must produce the same image as pointing resample-to-reference at a
    reference image carrying that same grid.

    A non-trivial grid (origin, spacing, and size all differ from the moving image) exercises all four
    parameters. resample-to-reference reads only the reference's geometry, so a zero-filled buffer of the
    matching length is sufficient.
    """
    moving = read_image(test_input_path / 'cthead1.png')

    size = [100, 120]
    output_spacing = [1.5, 2.5]
    output_origin = [3.0, -4.0]
    output_direction = list(np.asarray(moving.direction).ravel())  # identity, passed explicitly

    dimension = moving.imageType.dimension
    data_shape = tuple(reversed(size))
    if moving.imageType.components > 1:
        data_shape = data_shape + (moving.imageType.components,)
    reference = Image(
        moving.imageType,
        size=size,
        spacing=output_spacing,
        origin=output_origin,
        direction=np.asarray(output_direction, dtype=np.float64).reshape(dimension, dimension),
        data=np.zeros(data_shape, dtype=moving.data.dtype),
    )

    via_parameters = resample(
        moving,
        size=size,
        output_spacing=output_spacing,
        output_origin=output_origin,
        output_direction=output_direction,
    )
    write_image(via_parameters, test_output_path / 'resample-test-cthead1-full-grid.mha')
    via_reference = resample_to_reference(moving, reference)

    metrics, _, _ = compare_images(via_parameters, [via_reference,])
    assert metrics['almostEqual']


def test_resample_defaults_reproduce_input():
    """Full defaulting is an identity reproduction: with no grid options the output grid defaults to the input
    grid, and the identity transform with linear interpolation samples each output pixel centre at the exact
    input pixel centre -- so the output reproduces the input (and matches resample-to-reference onto the same
    grid).
    """
    moving = read_image(test_input_path / 'cthead1.png')

    output = resample(moving, interpolator='linear')
    write_image(output, test_output_path / 'resample-test-cthead1-identity.mha')

    metrics, _, _ = compare_images(output, [moving,])
    assert metrics['almostEqual']

    via_reference = resample_to_reference(moving, moving, interpolator='linear')
    metrics_ref, _, _ = compare_images(output, [via_reference,])
    assert metrics_ref['almostEqual']


def test_resample_vector_image_defaults_reproduce_input():
    """VectorImage (multi-component) path.

    itkwasm reads apple.jpg as ``RGB``, but resample's SupportInputImageTypes dispatch only matches
    ``VariableLengthVector``, so reassign the pixelType before calling resample (as ``test_downsample_vector_image``
    does). With defaults (identity transform, linear) resample reproduces the input across all components.

    apple.jpg carries a fractional spacing (~0.353); identity reproduction is only bit-exact when the output
    pixel-centre -> physical -> input-index round-trip is exact, which it is on a unit grid. A fractional spacing
    leaves sub-ULP index error that the linear interpolator turns into off-by-one uint8 rounding in a few percent
    of pixels, so normalise the grid to unit spacing -- the pixel data, which is what the VariableLengthVector
    path is being exercised on, is untouched.
    """
    moving = read_image(test_input_path / 'apple.jpg')
    moving.imageType.pixelType = PixelTypes.VariableLengthVector
    moving.spacing = [1.0] * moving.imageType.dimension
    moving.origin = [0.0] * moving.imageType.dimension

    output = resample(moving, interpolator='linear')
    write_image(output, test_output_path / 'resample-test-apple-identity.mha')

    metrics, _, _ = compare_images(output, [moving,])
    assert metrics['almostEqual']


def test_resample_background_value():
    """Background value: output samples that map outside the moving image get the default pixel value.

    A large translation pushes the entire output grid outside the moving image, so with nearest-neighbor
    sampling every output pixel becomes exactly the background value -- 200 when set, and the ITK default of 0
    when unset.
    """
    moving = read_image(test_input_path / 'cthead1.png')
    far_outside = translation_transform([100000, 100000])

    background = resample(
        moving, transform=far_outside, interpolator='nearest_neighbor', default_value=200)
    assert np.all(background.data == 200)

    zeroed = resample(moving, transform=far_outside, interpolator='nearest_neighbor')
    assert np.all(zeroed.data == 0)
