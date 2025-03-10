from dataclasses import asdict

from itkwasm import PolyData


def test_polydata():
    itkwasm_polydata = PolyData()
    assert isinstance(itkwasm_polydata.metadata, dict)
    itkwasm_polydata_dict = asdict(itkwasm_polydata)
