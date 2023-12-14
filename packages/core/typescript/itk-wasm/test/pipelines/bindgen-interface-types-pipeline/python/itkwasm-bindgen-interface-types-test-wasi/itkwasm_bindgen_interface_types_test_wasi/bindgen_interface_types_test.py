# Generated file. To retain edits, remove this comment.

from pathlib import Path, PurePosixPath
import os
from typing import Dict, Tuple, Optional, List, Any

from importlib_resources import files as file_resources

_pipeline = None

from itkwasm import (
    InterfaceTypes,
    PipelineOutput,
    PipelineInput,
    Pipeline,
    TextFile,
    BinaryFile,
    TextStream,
    BinaryStream,
    Image,
    Mesh,
)

def bindgen_interface_types_test(
    input_text_file: os.PathLike,
    input_binary_file: os.PathLike,
    input_text_stream: str,
    input_binary_stream: bytes,
    input_json: Any,
    input_image: Image,
    input_mesh: Mesh,
    output_text_file: str,
    output_binary_file: str,
    integer_type: int = 3,
    floating_type: float = 2,
    floating_range: float = 2,
    floating_vector: float = [7],
    floating_type_size: List[float] = [7,8],
    floating_type_size_range: List[float] = [7,8,9],
) -> Tuple[str, bytes, Any, Image, Mesh]:
    """A test to exercise interface types for bindgen

    :param input_text_file: The input text file
    :type  input_text_file: os.PathLike

    :param input_binary_file: The input binary file
    :type  input_binary_file: os.PathLike

    :param input_text_stream: The input text stream
    :type  input_text_stream: str

    :param input_binary_stream: The input binary stream
    :type  input_binary_stream: bytes

    :param input_json: The input json
    :type  input_json: Any

    :param input_image: The input image
    :type  input_image: Image

    :param input_mesh: The input mesh
    :type  input_mesh: Mesh

    :param output_text_file: The output text file
    :type  output_text_file: str

    :param output_binary_file: The output binary file
    :type  output_binary_file: str

    :param integer_type: An integer type.
    :type  integer_type: int

    :param floating_type: A floating type.
    :type  floating_type: float

    :param floating_range: A floating type with a range check.
    :type  floating_range: float

    :param floating_vector: A floating vector.
    :type  floating_vector: float

    :param floating_type_size: A floating vector with a type size constraint.
    :type  floating_type_size: float

    :param floating_type_size_range: A floating vector with a type size range constraint.
    :type  floating_type_size_range: float

    :return: The output text stream
    :rtype:  str

    :return: The output binary stream
    :rtype:  bytes

    :return: The output json
    :rtype:  Any

    :return: The output image
    :rtype:  Image

    :return: The output mesh
    :rtype:  Mesh
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_bindgen_interface_types_test_wasi').joinpath(Path('wasm_modules') / Path('bindgen-interface-types-test.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.TextFile, TextFile(PurePosixPath(output_text_file))),
        PipelineOutput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(output_binary_file))),
        PipelineOutput(InterfaceTypes.TextStream),
        PipelineOutput(InterfaceTypes.BinaryStream),
        PipelineOutput(InterfaceTypes.JsonCompatible),
        PipelineOutput(InterfaceTypes.Image),
        PipelineOutput(InterfaceTypes.Mesh),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.TextFile, TextFile(PurePosixPath(input_text_file))),
        PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(input_binary_file))),
        PipelineInput(InterfaceTypes.TextStream, TextStream(input_text_stream)),
        PipelineInput(InterfaceTypes.BinaryStream, BinaryStream(input_binary_stream)),
        PipelineInput(InterfaceTypes.JsonCompatible, input_json),
        PipelineInput(InterfaceTypes.Image, input_image),
        PipelineInput(InterfaceTypes.Mesh, input_mesh),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    if not Path(input_text_file).exists():
        raise FileNotFoundError("input_text_file does not exist")
    args.append(str(PurePosixPath(input_text_file)))
    if not Path(input_binary_file).exists():
        raise FileNotFoundError("input_binary_file does not exist")
    args.append(str(PurePosixPath(input_binary_file)))
    args.append('2')
    args.append('3')
    args.append('4')
    args.append('5')
    args.append('6')
    # Outputs
    output_text_file_name = str(PurePosixPath(output_text_file))
    args.append(output_text_file_name)

    output_binary_file_name = str(PurePosixPath(output_binary_file))
    args.append(output_binary_file_name)

    output_text_stream_name = '2'
    args.append(output_text_stream_name)

    output_binary_stream_name = '3'
    args.append(output_binary_stream_name)

    output_json_name = '4'
    args.append(output_json_name)

    output_image_name = '5'
    args.append(output_image_name)

    output_mesh_name = '6'
    args.append(output_mesh_name)

    # Options
    input_count = len(pipeline_inputs)
    if integer_type:
        args.append('--integer-type')
        args.append(str(integer_type))

    if floating_type:
        args.append('--floating-type')
        args.append(str(floating_type))

    if floating_range:
        args.append('--floating-range')
        args.append(str(floating_range))

    if len(floating_vector) < 1:
       raise ValueError('"floating-vector" kwarg must have a length > 1')
    if len(floating_vector) > 0:
        args.append('--floating-vector')
        for value in floating_vector:
            args.append(str(value))

    if len(floating_type_size) < 2:
       raise ValueError('"floating-type-size" kwarg must have a length > 2')
    if len(floating_type_size) > 0:
        args.append('--floating-type-size')
        for value in floating_type_size:
            args.append(str(value))

    if len(floating_type_size_range) < 2:
       raise ValueError('"floating-type-size-range" kwarg must have a length > 2')
    if len(floating_type_size_range) > 0:
        args.append('--floating-type-size-range')
        for value in floating_type_size_range:
            args.append(str(value))


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = (
        outputs[2].data.data,
        outputs[3].data.data,
        outputs[4].data,
        outputs[5].data,
        outputs[6].data,
    )
    return result

