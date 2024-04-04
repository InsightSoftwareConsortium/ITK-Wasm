from pathlib import Path

from itkwasm_compress_stringify import (
    image_to_json,
    json_to_image,
    mesh_to_json,
    json_to_mesh,
    poly_data_to_json,
    json_to_poly_data,
)


def test_image_to_json():
    from itkwasm_image_io import read_image
    from itkwasm_compare_images import compare_images

    image_filepath = (
        Path(__file__).parent
        / ".."
        / ".."
        / ".."
        / "test"
        / "data"
        / "input"
        / "cthead1.png"
    )
    image = read_image(image_filepath)

    image_json = image_to_json(image)
    json_image = json_to_image(image_json)
    almost_equal, _, _ = compare_images(image,
        [
            json_image,
        ],
    )
    assert almost_equal


def test_mesh_to_json():
    from itkwasm_mesh_io import read_mesh
    from itkwasm_compare_meshes import compare_meshes

    mesh_filepath = (
        Path(__file__).parent
        / ".."
        / ".."
        / ".."
        / "test"
        / "data"
        / "input"
        / "cow.vtk"
    )
    mesh = read_mesh(mesh_filepath)

    mesh_json = mesh_to_json(mesh)
    json_mesh = json_to_mesh(mesh_json)

    metrics, _, _, _ = compare_meshes(mesh,
        [
            json_mesh,
        ],
    )
    assert metrics['almostEqual']

def test_poly_data_to_json():
    from itkwasm_mesh_io import read_mesh
    from itkwasm_compare_meshes import compare_meshes
    from itkwasm_mesh_to_poly_data import poly_data_to_mesh, mesh_to_poly_data

    mesh_filepath = (
        Path(__file__).parent
        / ".."
        / ".."
        / ".."
        / "test"
        / "data"
        / "input"
        / "cow.vtk"
    )
    mesh = read_mesh(mesh_filepath)
    poly_data = mesh_to_poly_data(mesh)
    poly_data_mesh = poly_data_to_mesh(poly_data)

    poly_data_json = poly_data_to_json(poly_data)
    json_poly_data = json_to_poly_data(poly_data_json)

    json_mesh = poly_data_to_mesh(json_poly_data)
    metrics, _, _, _ = compare_meshes(poly_data_mesh,
        [
            json_mesh,
        ],
    )
    assert metrics['almostEqual']
