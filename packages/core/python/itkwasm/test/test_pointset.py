import itk

from itkwasm import PointSet
from dataclasses import asdict
import numpy as np

def test_pointset():
    n_points = 5
    dimension = 3

    PointSetType = itk.PointSet[itk.F, dimension]
    pointset = PointSetType.New()

    points = np.random.random((n_points, dimension)).astype(np.float32)
    pointset.SetPoints(itk.vector_container_from_array(points.ravel()))

    point_data = np.random.random((n_points,)).astype(np.float32)
    pointset.SetPointData(itk.vector_container_from_array(point_data.ravel()))

    itk_pointset_dict = itk.dict_from_pointset(pointset)
    # Bug, to be fixed by 5.3.0
    itk_pointset_dict.pop('dimension', None)
    itkwasm_pointset = PointSet(**itk_pointset_dict)
    itkwasm_pointset_dict = asdict(itkwasm_pointset)
    itk_pointset_roundtrip = itk.pointset_from_dict(itkwasm_pointset_dict)
    itk_pointset_roundtrip_dict = itk.dict_from_pointset(itk_pointset_roundtrip)

    pointSetType = itk_pointset_dict["pointSetType"]
    pointSetType_roundtrip = itk_pointset_roundtrip_dict["pointSetType"]
    assert pointSetType["dimension"] == pointSetType_roundtrip["dimension"]

    assert pointSetType["pointComponentType"] == pointSetType_roundtrip["pointComponentType"]
    assert pointSetType["pointPixelComponentType"] == pointSetType_roundtrip["pointPixelComponentType"]
    assert pointSetType["pointPixelType"] == pointSetType_roundtrip["pointPixelType"]
    assert pointSetType["pointPixelComponents"] == pointSetType_roundtrip["pointPixelComponents"]

    assert itk_pointset_dict["name"] == itk_pointset_roundtrip_dict["name"]

    assert itk_pointset_dict["numberOfPoints"] == itk_pointset_roundtrip_dict["numberOfPoints"]
    assert np.array_equal(itk_pointset_dict["points"], itk_pointset_roundtrip_dict["points"])

    assert itk_pointset_dict["numberOfPointPixels"] == itk_pointset_roundtrip_dict["numberOfPointPixels"]
    assert np.array_equal(itk_pointset_dict["pointData"], itk_pointset_roundtrip_dict["pointData"])