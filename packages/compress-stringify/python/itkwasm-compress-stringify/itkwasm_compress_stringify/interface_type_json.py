from dataclasses import asdict
import json

from itkwasm import Image, FloatTypes, Mesh, PolyData, array_like_to_bytes, buffer_to_numpy_array, JsonCompatible

from .compress_stringify import compress_stringify
from .parse_string_decompress import parse_string_decompress

def image_to_json(image: Image) -> JsonCompatible:
    """Convert an image to a JSON compatible dict

    :param image: Input image
    :type  image: itkwasm.Image

    :return: Image dict with binary data compressed and converted to a string
    :rtype:  JsonCompatible
    """
    image_dict = asdict(image)
    level = 5

    direction_bytes = array_like_to_bytes(image_dict["direction"])
    image_dict["direction"] = compress_stringify(direction_bytes, compression_level=level, stringify=True).decode()

    if image_dict["data"] is not None:
        data_bytes = array_like_to_bytes(image_dict["data"])
        image_dict["data"] = compress_stringify(data_bytes, compression_level=level, stringify=True).decode()

    return image_dict

def json_to_image(image_json: JsonCompatible) -> Image:
    """Convert a JSON compatible image dict to an image

    :param image_json: Input image dict with binary data compressed and converted to a string
    :type  image_json: JsonCompatible

    :return: Output image
    :rtype:  itkwasm.Image
    """
    image_dict = image_json
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

def mesh_to_json(mesh: Mesh) -> JsonCompatible:
    """Convert an mesh to a JSON compatible dict

    :param mesh: Input mesh
    :type  mesh: itkwasm.Mesh

    :return: Mesh dict with binary data compressed and converted to a string
    :rtype:  JsonCompatible
    """
    mesh_dict = asdict(mesh)
    level = 5

    for key in ["points", "pointData", "cells", "cellData"]:
        if mesh_dict[key] is not None:
            mesh_dict[key] = compress_stringify(array_like_to_bytes(mesh_dict[key]), compression_level=level, stringify=True).decode()

    return mesh_dict

def json_to_mesh(mesh_json: JsonCompatible) -> Mesh:
    """Convert a JSON compatible mesh dict to an mesh

    :param mesh_json: Input mesh dict with binary data compressed and converted to a string
    :type  mesh_json: JsonCompatible

    :return: Output mesh
    :rtype:  itkwasm.Mesh
    """
    mesh_dict = mesh_json

    for key in ["points", "pointData", "cells", "cellData"]:
        if mesh_dict[key] is not None:
            mesh_dict[key] = parse_string_decompress(mesh_dict[key].encode(), parse_string=True)

    mesh = Mesh(**mesh_dict)
    return mesh

def poly_data_to_json(poly_data: PolyData) -> JsonCompatible:
    """Convert an PolyData to a JSON compatible dict

    :param poly_data: Input PolyData
    :type  poly_data: itkwasm.PolyData

    :return: PolyData dict with binary data compressed and converted to a string
    :rtype:  JsonCompatible
    """
    poly_data_dict = asdict(poly_data)
    level = 5

    for key in ["points", "vertices", "lines", "polygons", "triangleStrips", "pointData", "cellData"]:
        if poly_data_dict[key] is not None:
            poly_data_dict[key] = compress_stringify(array_like_to_bytes(poly_data_dict[key]), compression_level=level, stringify=True).decode()

    return poly_data_dict

def json_to_poly_data(poly_data_json: str) -> PolyData:
    """Convert a JSON compatible PolyData dict to a PolyData

    :param poly_data_json: Input PolyData dict with binary data compressed and converted to a string
    :type  poly_data_json: JsonCompatible

    :return: Output poly_data
    :rtype:  itkwasm.PolyData
    """
    poly_data_dict = poly_data_json

    for key in ["points", "vertices", "lines", "polygons", "triangleStrips", "pointData", "cellData"]:
        if poly_data_dict[key] is not None:
            poly_data_dict[key] = parse_string_decompress(poly_data_dict[key].encode(), parse_string=True)

    poly_data = PolyData(**poly_data_dict)
    return poly_data
