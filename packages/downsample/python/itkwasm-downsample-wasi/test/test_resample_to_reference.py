import numpy as np
import pytest

from itkwasm import (
    PixelTypes,
    Transform,
    TransformType,
    TransformParameterizations,
    FloatTypes,
)
from itkwasm_compare_images import compare_images
from itkwasm_image_io import read_image, write_image
from itkwasm_transform_io import transformread

from itkwasm_downsample_wasi import resample_to_reference

from .common import test_input_path, test_baseline_path, test_output_path


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


def affine_transform(matrix_row_major, translation, center):
    """A single-entry TransformList holding a float64 AffineTransform.

    ITK's MatrixOffsetTransformBase packs its parameters as the row-major matrix followed by the translation, and
    its fixed parameters as the center of rotation: parameters = [*matrix_row_major, *translation],
    fixedParameters = center.
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


def test_resample_to_reference():
    """Linear interpolation with a non-identity affine transform.

    Resample cthead1 onto a reference grid whose size/spacing/origin all differ
    from the moving image, applying the affine transform (rotation about the
    centre + translation) read from the packed ``.h5``. The baseline was produced
    independently with the native itk ``ResampleImageFilter`` (Phase 04), so the
    comparison is not self-referential.
    """
    test_moving_file_path = test_input_path / 'cthead1.png'
    test_reference_file_path = test_input_path / 'cthead1-resample-reference.nrrd'
    test_transform_file_path = test_input_path / 'cthead1-resample-transform.h5'
    test_output_file_path = test_output_path / 'resample-test-cthead1-linear.mha'
    test_baseline_file_path = test_baseline_path / 'cthead1-resample-linear.nrrd'

    moving = read_image(test_moving_file_path)
    reference = read_image(test_reference_file_path)
    transform = transformread(test_transform_file_path)

    output = resample_to_reference(moving, reference, transform=transform, interpolator='linear')
    write_image(output, test_output_file_path)

    baseline = read_image(test_baseline_file_path)
    metrics, _, _ = compare_images(output, [baseline,])
    assert metrics['almostEqual']


def test_resample_to_reference_nearest_neighbor():
    """Nearest-neighbor interpolation with the same affine transform."""
    test_moving_file_path = test_input_path / 'cthead1.png'
    test_reference_file_path = test_input_path / 'cthead1-resample-reference.nrrd'
    test_transform_file_path = test_input_path / 'cthead1-resample-transform.h5'
    test_output_file_path = test_output_path / 'resample-test-cthead1-nearest-neighbor.mha'
    test_baseline_file_path = test_baseline_path / 'cthead1-resample-nearest-neighbor.nrrd'

    moving = read_image(test_moving_file_path)
    reference = read_image(test_reference_file_path)
    transform = transformread(test_transform_file_path)

    output = resample_to_reference(moving, reference, transform=transform, interpolator='nearest_neighbor')
    write_image(output, test_output_file_path)

    baseline = read_image(test_baseline_file_path)
    metrics, _, _ = compare_images(output, [baseline,])
    assert metrics['almostEqual']


def test_resample_to_reference_label_image():
    """label_image interpolator.

    ITK's GenericLabelInterpolator (the ``label_image`` backend) is not in the
    ``itk`` Python wheel, so Phase 04 produced no independent baseline. Instead,
    mirror the C++ ``resample-to-reference-label-image`` ctest: resample the multi-label image
    ``2th_cthead1.png`` onto its own geometry with the identity transform. A
    grid-aligned identity resample samples each output point at an exact input
    pixel centre, so the label interpolator reproduces the input labels exactly --
    the input image is therefore its own trusted baseline.
    """
    test_label_file_path = test_input_path / '2th_cthead1.png'
    test_output_file_path = test_output_path / 'resample-test-2th_cthead1-label-image.mha'

    label_image = read_image(test_label_file_path)

    output = resample_to_reference(label_image, label_image, interpolator='label_image')
    write_image(output, test_output_file_path)

    baseline = read_image(test_label_file_path)
    metrics, _, _ = compare_images(output, [baseline,])
    assert metrics['almostEqual']


def test_resample_to_reference_vector_image():
    """VectorImage (multi-component) path.

    itkwasm reads apple.jpg as ``RGB`` and the reference ``.mha`` as ``Vector``,
    but resample's SupportInputImageTypes dispatch only matches
    ``VariableLengthVector``, so reassign the pixelType on both the moving and
    reference images before calling resample (as ``test_downsample_vector_image``
    does). The independent baseline uses the identity transform (grid change only).
    """
    test_moving_file_path = test_input_path / 'apple.jpg'
    test_reference_file_path = test_input_path / 'apple-resample-reference.mha'
    test_output_file_path = test_output_path / 'resample-test-apple-linear.mha'
    test_baseline_file_path = test_baseline_path / 'apple-resample-linear.mha'

    moving = read_image(test_moving_file_path)
    moving.imageType.pixelType = PixelTypes.VariableLengthVector
    reference = read_image(test_reference_file_path)
    reference.imageType.pixelType = PixelTypes.VariableLengthVector

    output = resample_to_reference(moving, reference, interpolator='linear')
    write_image(output, test_output_file_path)

    baseline = read_image(test_baseline_file_path)
    metrics, _, _ = compare_images(output, [baseline,])
    assert metrics['almostEqual']


def test_resample_to_reference_generic_translation():
    """Generic (non-affine) parameterization support.

    A Translation transform must be applied as a real translation, not coerced into an affine. It maps the output
    grid by x -> x + offset, identical to an affine with the identity matrix and the same translation -- so both
    resamples produce the same image. (The previous affine-only reader copied the two translation parameters into
    the affine's first two matrix slots, silently producing a shear.)
    """
    moving = read_image(test_input_path / 'cthead1.png')

    offset = [12, -7]
    via_translation = resample_to_reference(
        moving, moving, transform=translation_transform(offset), interpolator='linear')
    via_affine = resample_to_reference(
        moving, moving, transform=affine_transform([1, 0, 0, 1], offset, [0, 0]), interpolator='linear')

    metrics, _, _ = compare_images(via_translation, [via_affine,])
    assert metrics['almostEqual']


def composite_marker(dimension):
    """A single-entry TransformList holding the Composite marker itkwasm uses to serialize an
    itk::CompositeTransform: the marker carries no parameters of its own; the components follow it."""
    transform_type = TransformType(
        transformParameterization=TransformParameterizations.Composite,
        parametersValueType=FloatTypes.Float64,
        inputDimension=dimension,
        outputDimension=dimension,
    )
    transform = Transform(
        transformType=transform_type,
        numberOfFixedParameters=0,
        numberOfParameters=0,
        fixedParameters=np.empty((0,), dtype=np.float64),
        parameters=np.empty((0,), dtype=np.float64),
        name="CompositeTransform",
    )
    return [transform]


def test_resample_to_reference_composes_transform_chain():
    """Chained transforms: the list [A, B] is composed with itk::CompositeTransform semantics -- the LAST entry
    is applied to the point first, so the mapping is A(B(x)).

    Here A = scale-by-2 about the origin and B = translate(10, 6): A(B(x)) = 2*(x + (10, 6)) = 2x + (20, 12).
    Every value is exactly representable in floating point and the arithmetic is exact, so the chained resample
    is identical to the single equivalent affine (matrix [2,0;0,2], translation (20,12)). The wrong composition
    order, B(A(x)) = 2x + (10, 6), is a 10-pixel shift away -- asserting it does NOT match locks the order
    semantics."""
    moving = read_image(test_input_path / 'cthead1.png')

    chain = affine_transform([2, 0, 0, 2], [0, 0], [0, 0]) + translation_transform([10, 6])
    via_chain = resample_to_reference(moving, moving, transform=chain, interpolator='linear')

    via_single = resample_to_reference(
        moving, moving, transform=affine_transform([2, 0, 0, 2], [20, 12], [0, 0]), interpolator='linear')
    metrics, _, _ = compare_images(via_chain, [via_single,])
    assert metrics['almostEqual']

    via_wrong_order = resample_to_reference(
        moving, moving, transform=affine_transform([2, 0, 0, 2], [10, 6], [0, 0]), interpolator='linear')
    metrics_wrong, _, _ = compare_images(via_chain, [via_wrong_order,])
    assert not metrics_wrong['almostEqual']


def test_resample_to_reference_composite_marker_list():
    """The same chain serialized the way transform-io serializes an itk::CompositeTransform (a Composite marker
    entry followed by the component transforms) must compose identically to the bare chain."""
    moving = read_image(test_input_path / 'cthead1.png')

    composite = (composite_marker(2)
                 + affine_transform([2, 0, 0, 2], [0, 0], [0, 0])
                 + translation_transform([10, 6]))
    via_composite = resample_to_reference(moving, moving, transform=composite, interpolator='linear')

    via_single = resample_to_reference(
        moving, moving, transform=affine_transform([2, 0, 0, 2], [20, 12], [0, 0]), interpolator='linear')
    metrics, _, _ = compare_images(via_composite, [via_single,])
    assert metrics['almostEqual']


def test_resample_to_reference_composite_h5_round_trip():
    """End-to-end interop: write the composite chain to .h5 with transform-io, read it back, and resample.

    This validates the hand-built Composite marker convention against transform-io's real serialization -- the
    round-tripped TransformList must compose identically to the single equivalent affine."""
    from itkwasm_transform_io import transformwrite

    moving = read_image(test_input_path / 'cthead1.png')

    composite = (composite_marker(2)
                 + affine_transform([2, 0, 0, 2], [0, 0], [0, 0])
                 + translation_transform([10, 6]))
    composite_path = test_output_path / 'resample-to-reference-chain-composite.h5'
    transformwrite(composite, composite_path)
    round_tripped = transformread(composite_path)

    via_round_trip = resample_to_reference(moving, moving, transform=round_tripped, interpolator='linear')

    via_single = resample_to_reference(
        moving, moving, transform=affine_transform([2, 0, 0, 2], [20, 12], [0, 0]), interpolator='linear')
    metrics, _, _ = compare_images(via_round_trip, [via_single,])
    assert metrics['almostEqual']


def test_resample_to_reference_rejects_component_free_composite():
    """A Composite marker with no component transforms has no defined mapping; the reader raises (surfaced as a
    pipeline abort) rather than resampling with an empty composite."""
    moving = read_image(test_input_path / 'cthead1.png')

    with pytest.raises(Exception):
        resample_to_reference(moving, moving, transform=composite_marker(2), interpolator='linear')


def test_resample_to_reference_background_value():
    """Background value: output samples that map outside the moving image get the default pixel value.

    A large translation pushes the entire output grid outside the moving image, so with nearest-neighbor
    sampling every output pixel becomes exactly the background value -- 200 when set, and the ITK default of 0
    when unset."""
    import numpy as np

    moving = read_image(test_input_path / 'cthead1.png')
    far_outside = translation_transform([100000, 100000])

    background = resample_to_reference(
        moving, moving, transform=far_outside, interpolator='nearest_neighbor', default_value=200)
    assert np.all(background.data == 200)

    zeroed = resample_to_reference(moving, moving, transform=far_outside, interpolator='nearest_neighbor')
    assert np.all(zeroed.data == 0)
