import json
import numpy as np
from pathlib import Path

from itkwasm import (
    InterfaceTypes,
    PipelineInput,
    PipelineOutput,
    Pipeline,
    Transform,
    TransformParameterizations,
    FloatTypes,
)

test_input_dir = Path(__file__).resolve().parent / "input"


def read_linear_transform():
    """Read the LinearTransform.iwt test data."""
    test_input_transform_dir = test_input_dir / "LinearTransform.iwt"

    # Read the JSON metadata
    with open(test_input_transform_dir / "index.json", "r") as f:
        transform_list_json = json.load(f)

    # Read binary data for each transform
    for i, transform_json in enumerate(transform_list_json):
        # Read fixed parameters
        fixed_params_path = test_input_transform_dir / "data" / "0" / "fixed-parameters.raw"
        with open(fixed_params_path, "rb") as f:
            fixed_params_bytes = f.read()
        fixed_parameters = np.frombuffer(fixed_params_bytes, dtype=np.float64)
        transform_json["fixedParameters"] = fixed_parameters

        # Read parameters
        params_path = test_input_transform_dir / "data" / "0" / "parameters.raw"
        with open(params_path, "rb") as f:
            params_bytes = f.read()
        parameters = np.frombuffer(params_bytes, dtype=np.float64)
        transform_json["parameters"] = parameters

    # Convert to Transform objects
    transform_list = [Transform(**t) for t in transform_list_json]
    return transform_list


def read_composite_transform():
    """Read the CompositeTransform.iwt test data."""
    test_input_transform_dir = test_input_dir / "CompositeTransform.iwt"

    # Read the JSON metadata
    with open(test_input_transform_dir / "index.json", "r") as f:
        transform_list_json = json.load(f)

    # Process each transform that has actual data files
    for i, transform_json in enumerate(transform_list_json):
        # Skip the composite transform (index 0) as it doesn't have separate data files
        if transform_json["transformType"]["transformParameterization"] == "Composite":
            continue

        # Determine the data directory index (1 for Rigid2D, 2 for Affine)
        data_index = "1" if transform_json["transformType"]["transformParameterization"] == "Rigid2D" else "2"

        # Read fixed parameters
        fixed_params_path = test_input_transform_dir / "data" / data_index / "fixed-parameters.raw"
        with open(fixed_params_path, "rb") as f:
            fixed_params_bytes = f.read()
        fixed_parameters = np.frombuffer(fixed_params_bytes, dtype=np.float32)
        transform_json["fixedParameters"] = fixed_parameters

        # Read parameters
        params_path = test_input_transform_dir / "data" / data_index / "parameters.raw"
        with open(params_path, "rb") as f:
            params_bytes = f.read()
        parameters = np.frombuffer(params_bytes, dtype=np.float32)
        transform_json["parameters"] = parameters

    # Convert to Transform objects
    transform_list = [Transform(**t) for t in transform_list_json]
    return transform_list


def test_pipeline_write_read_linear_transform():
    """Test writing and reading a single linear transform via memory io."""
    pipeline = Pipeline(test_input_dir / "transform-read-write-test.wasi.wasm")

    transform_list = read_linear_transform()

    def verify_transform(transform_list):
        assert len(transform_list) == 1
        transform = transform_list[0]
        assert transform.transformType.transformParameterization == TransformParameterizations.Affine
        assert transform.transformType.parametersValueType == FloatTypes.Float64
        assert transform.transformType.inputDimension == 3
        assert transform.transformType.outputDimension == 3
        assert transform.numberOfFixedParameters == 3
        assert len(transform.fixedParameters) == 3
        assert transform.numberOfParameters == 12
        assert len(transform.parameters) == 12

    pipeline_inputs = [
        PipelineInput(InterfaceTypes.TransformList, transform_list),
    ]

    pipeline_outputs = [
        PipelineOutput(InterfaceTypes.TransformList),
    ]

    args = ["--memory-io", "0", "0"]

    outputs = pipeline.run(args, pipeline_outputs, pipeline_inputs)
    verify_transform(outputs[0].data)


def test_pipeline_write_read_composite_transform():
    """Test writing and reading a composite transform via memory io."""
    pipeline = Pipeline(test_input_dir / "transform-read-write-composite-test.wasi.wasm")

    transform_list = read_composite_transform()

    def verify_transform(transform_list):
        assert len(transform_list) == 3, "should have composite + 2 component transforms"

        # First transform should be the composite
        composite_transform = transform_list[0]
        assert composite_transform.transformType.transformParameterization == TransformParameterizations.Composite
        assert composite_transform.transformType.parametersValueType == FloatTypes.Float32
        assert composite_transform.transformType.inputDimension == 2
        assert composite_transform.transformType.outputDimension == 2
        assert composite_transform.numberOfFixedParameters == 4
        assert composite_transform.numberOfParameters == 9

        # Second transform should be Rigid2D
        rigid_transform = transform_list[1]
        assert rigid_transform.transformType.transformParameterization == TransformParameterizations.Rigid2D
        assert rigid_transform.transformType.parametersValueType == FloatTypes.Float32
        assert rigid_transform.transformType.inputDimension == 2
        assert rigid_transform.transformType.outputDimension == 2
        assert rigid_transform.numberOfFixedParameters == 2
        assert rigid_transform.numberOfParameters == 3
        assert len(rigid_transform.fixedParameters) == 2
        assert len(rigid_transform.parameters) == 3

        # Third transform should be Affine
        affine_transform = transform_list[2]
        assert affine_transform.transformType.transformParameterization == TransformParameterizations.Affine
        assert affine_transform.transformType.parametersValueType == FloatTypes.Float32
        assert affine_transform.transformType.inputDimension == 2
        assert affine_transform.transformType.outputDimension == 2
        assert affine_transform.numberOfFixedParameters == 2
        assert affine_transform.numberOfParameters == 6
        assert len(affine_transform.fixedParameters) == 2
        assert len(affine_transform.parameters) == 6

    pipeline_inputs = [
        PipelineInput(InterfaceTypes.TransformList, transform_list),
    ]

    pipeline_outputs = [
        PipelineOutput(InterfaceTypes.TransformList),
    ]

    args = ["--memory-io", "0", "0"]

    outputs = pipeline.run(args, pipeline_outputs, pipeline_inputs)
    verify_transform(outputs[0].data)