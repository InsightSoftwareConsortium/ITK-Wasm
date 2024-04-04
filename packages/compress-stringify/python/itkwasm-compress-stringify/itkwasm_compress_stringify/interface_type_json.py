from dataclasses import asdict
import json

from itkwasm import Image, FloatTypes, Mesh, PolyData, array_like_to_bytes, buffer_to_numpy_array

from .compress_stringify import compress_stringify
from .parse_string_decompress import parse_string_decompress

def image_to_json(image: Image) -> str:
    """Convert an image to a JSON string

    :param image: Input image
    :type  image: itkwasm.Image

    :return: JSON string
    :rtype:  str
    """
    image_dict = asdict(image)
    level = 5

    direction_bytes = array_like_to_bytes(image_dict["direction"])
    image_dict["direction"] = compress_stringify(direction_bytes, compression_level=level, stringify=True).decode()

    if image_dict["data"] is not None:
        data_bytes = array_like_to_bytes(image_dict["data"])
        image_dict["data"] = compress_stringify(data_bytes, compression_level=level, stringify=True).decode()

    json_str = json.dumps(image_dict)
    return json_str

def json_to_image(image_json: str) -> Image:
    """Convert a JSON string to an image

    :param image_json: Input JSON string
    :type  image_json: str

    :return: Output image
    :rtype:  itkwasm.Image
    """
    image_dict = json.loads(image_json)
    image_type = image_dict["imageType"]
    dimension = image_type["dimension"]

    direction_bytes = parse_string_decompress(image_dict["direction"].encode(), parse_string=True)
    image_dict["direction"] = buffer_to_numpy_array(FloatTypes.Float64, direction_bytes).reshape((dimension, dimension))

    if image_dict["data"] is not None:
        data_bytes = parse_string_decompress(image_dict["data"].encode(), parse_string=True)
        data_array = buffer_to_numpy_array(image_type["componentType"], data_bytes)
        shape = list(image_dict["size"])[::-1]
        if image_type["components"] > 1:
            shape.append(image_type["components"])
        image_dict["data"] = data_array.reshape(tuple(shape))

    image = Image(**image_dict)

    return image

def mesh_to_json(mesh: Mesh) -> str:
    """Convert an mesh to a JSON string

    :param mesh: Input mesh
    :type  mesh: itkwasm.Mesh

    :return: JSON string
    :rtype:  str
    """
    mesh_dict = asdict(mesh)
    level = 5

    for key in ["points", "pointData", "cells", "cellData"]:
        if mesh_dict[key] is not None:
            mesh_dict[key] = compress_stringify(array_like_to_bytes(mesh_dict[key]), compression_level=level, stringify=True).decode()

    json_str = json.dumps(mesh_dict)
    return json_str

def json_to_mesh(mesh_json: str) -> Mesh:
    """Convert a JSON string to a mesh

    :param mesh_json: Input JSON string
    :type  mesh_json: str

    :return: Output mesh
    :rtype:  itkwasm.Mesh
    """
    mesh_dict = json.loads(mesh_json)

    for key in ["points", "pointData", "cells", "cellData"]:
        if mesh_dict[key] is not None:
            mesh_dict[key] = parse_string_decompress(mesh_dict[key].encode(), parse_string=True)

    mesh = Mesh(**mesh_dict)
    return mesh

def poly_data_to_json(poly_data: PolyData) -> str:
    """Convert an poly_data to a JSON string

    :param poly_data: Input poly_data
    :type  poly_data: itkwasm.PolyData

    :return: JSON string
    :rtype:  str
    """
    poly_data_dict = asdict(poly_data)
    level = 5

    for key in ["points", "vertices", "lines", "polygons", "triangleStrips", "pointData", "cellData"]:
        if poly_data_dict[key] is not None:
            poly_data_dict[key] = compress_stringify(array_like_to_bytes(poly_data_dict[key]), compression_level=level, stringify=True).decode()

    json_str = json.dumps(poly_data_dict)
    return json_str

def json_to_poly_data(poly_data_json: str) -> PolyData:
    """Convert a JSON string to an poly_data

    :param poly_data_json: Input JSON string
    :type  poly_data_json: str

    :return: Output poly_data
    :rtype:  itkwasm.PolyData
    """
    poly_data_dict = json.loads(poly_data_json)

    for key in ["points", "vertices", "lines", "polygons", "triangleStrips", "pointData", "cellData"]:
        if poly_data_dict[key] is not None:
            poly_data_dict[key] = parse_string_decompress(poly_data_dict[key].encode(), parse_string=True)

    poly_data = PolyData(**poly_data_dict)
    return poly_data
