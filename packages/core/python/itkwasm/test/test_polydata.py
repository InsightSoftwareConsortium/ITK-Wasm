from dataclasses import asdict

from itkwasm import PolyData

def test_polydata():
    itkwasm_polydata = PolyData()
    itkwasm_polydata_dict = asdict(itkwasm_polydata)