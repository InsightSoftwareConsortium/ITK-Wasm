from dataclasses import asdict

from itkwasm import PolyData
import itkwasm


def test_polydata():
    itkwasm_polydata = PolyData()
    assert isinstance(itkwasm_polydata.metadata, dict)
    itkwasm_polydata_dict = asdict(itkwasm_polydata)
