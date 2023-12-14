# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    TextFile,
    BinaryFile,
    TextStream,
    BinaryStream,
    Image,
    Mesh,
)

async def bindgen_interface_types_test_async(
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
    func = environment_dispatch("itkwasm_bindgen_interface_types_test", "bindgen_interface_types_test_async")
    output = await func(input_text_file, input_binary_file, input_text_stream, input_binary_stream, input_json, input_image, input_mesh, output_text_file, output_binary_file, integer_type=integer_type, floating_type=floating_type, floating_range=floating_range, floating_vector=floating_vector, floating_type_size=floating_type_size, floating_type_size_range=floating_type_size_range)
    return output
