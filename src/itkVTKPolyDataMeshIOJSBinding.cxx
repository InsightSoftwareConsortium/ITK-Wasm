/*=========================================================================
 *
 *  Copyright Insight Software Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/

#include <emscripten.h>
#include <emscripten/bind.h>

#include "itkVTKPolyDataMeshIO.h"

#include "itkMeshIOBaseJSBinding.h"

typedef itk::MeshIOBaseJSBinding< itk::VTKPolyDataMeshIO > VTKPolyDataMeshIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_vtk_polydata_mesh_io_js_binding) {
  emscripten::enum_<VTKPolyDataMeshIOJSBindingType::IOPixelType>("IOPixelType")
    .value("UNKNOWNPIXELTYPE", itk::MeshIOBase::UNKNOWNPIXELTYPE)
    .value("SCALAR", itk::MeshIOBase::SCALAR)
    .value("RGB", itk::MeshIOBase::RGB)
    .value("RGBA", itk::MeshIOBase::RGBA)
    .value("OFFSET", itk::MeshIOBase::OFFSET)
    .value("VECTOR", itk::MeshIOBase::VECTOR)
    .value("POINT", itk::MeshIOBase::POINT)
    .value("COVARIANTVECTOR", itk::MeshIOBase::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::MeshIOBase::SYMMETRICSECONDRANKTENSOR)
    .value("DIFFUSIONTENSOR3D", itk::MeshIOBase::DIFFUSIONTENSOR3D)
    .value("COMPLEX", itk::MeshIOBase::COMPLEX)
    .value("FIXEDARRAY", itk::MeshIOBase::FIXEDARRAY)
    .value("ARRAY", itk::MeshIOBase::ARRAY)
    .value("MATRIX", itk::MeshIOBase::MATRIX)
    .value("VARIABLELENGTHVECTOR", itk::MeshIOBase::VARIABLELENGTHVECTOR)
    .value("VARIABLESIZEMATRIX", itk::MeshIOBase::VARIABLESIZEMATRIX)
    ;
  emscripten::enum_<VTKPolyDataMeshIOJSBindingType::IOComponentType>("IOComponentType")
    .value("UNKNOWNCOMPONENTTYPE", itk::MeshIOBase::UNKNOWNCOMPONENTTYPE)
    .value("UCHAR", itk::MeshIOBase::UCHAR)
    .value("CHAR", itk::MeshIOBase::CHAR)
    .value("USHORT", itk::MeshIOBase::USHORT)
    .value("SHORT", itk::MeshIOBase::SHORT)
    .value("UINT", itk::MeshIOBase::UINT)
    .value("INT", itk::MeshIOBase::INT)
    .value("ULONG", itk::MeshIOBase::ULONG)
    .value("LONG", itk::MeshIOBase::LONG)
    .value("ULONG", itk::MeshIOBase::ULONGLONG)
    .value("LONG", itk::MeshIOBase::LONGLONG)
    .value("FLOAT", itk::MeshIOBase::FLOAT)
    .value("DOUBLE", itk::MeshIOBase::DOUBLE)
    .value("DOUBLE", itk::MeshIOBase::LDOUBLE)
    ;
  emscripten::enum_<VTKPolyDataMeshIOJSBindingType::FileType>("FileType")
    .value("ASCII", itk::MeshIOBase::ASCII)
    .value("BINARY", itk::MeshIOBase::BINARY)
    .value("TYPENOTAPPLICABLE", itk::MeshIOBase::TYPENOTAPPLICABLE)
    ;
  emscripten::enum_<VTKPolyDataMeshIOJSBindingType::ByteOrder>("ByteOrder")
    .value("BigEndian", itk::MeshIOBase::BigEndian)
    .value("LittleEndian", itk::MeshIOBase::LittleEndian)
    .value("OrderNotApplicable", itk::MeshIOBase::OrderNotApplicable)
    ;
  emscripten::class_<VTKPolyDataMeshIOJSBindingType>("ITKMeshIO")
  .constructor<>()
  .function("SetFileName", &VTKPolyDataMeshIOJSBindingType::SetFileName)
  .function("GetFileName", &VTKPolyDataMeshIOJSBindingType::GetFileName)
  .function("CanReadFile", &VTKPolyDataMeshIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &VTKPolyDataMeshIOJSBindingType::CanWriteFile)
  .function("SetPointPixelType", &VTKPolyDataMeshIOJSBindingType::SetPointPixelType)
  .function("GetPointPixelType", &VTKPolyDataMeshIOJSBindingType::GetPointPixelType)
  .function("SetCellPixelType", &VTKPolyDataMeshIOJSBindingType::SetCellPixelType)
  .function("GetCellPixelType", &VTKPolyDataMeshIOJSBindingType::GetCellPixelType)
  .function("SetFileType", &VTKPolyDataMeshIOJSBindingType::SetFileType)
  .function("GetFileType", &VTKPolyDataMeshIOJSBindingType::GetFileType)
  .function("SetByteOrder", &VTKPolyDataMeshIOJSBindingType::SetByteOrder)
  .function("GetByteOrder", &VTKPolyDataMeshIOJSBindingType::GetByteOrder)
  .function("SetPointComponentType", &VTKPolyDataMeshIOJSBindingType::SetPointComponentType)
  .function("GetPointComponentType", &VTKPolyDataMeshIOJSBindingType::GetPointComponentType)
  .function("SetCellComponentType", &VTKPolyDataMeshIOJSBindingType::SetCellComponentType)
  .function("GetCellComponentType", &VTKPolyDataMeshIOJSBindingType::GetCellComponentType)
  .function("SetPointPixelComponentType", &VTKPolyDataMeshIOJSBindingType::SetPointPixelComponentType)
  .function("GetPointPixelComponentType", &VTKPolyDataMeshIOJSBindingType::GetPointPixelComponentType)
  .function("SetCellPixelComponentType", &VTKPolyDataMeshIOJSBindingType::SetCellPixelComponentType)
  .function("GetCellPixelComponentType", &VTKPolyDataMeshIOJSBindingType::GetCellPixelComponentType)
  .function("SetNumberOfPointPixelComponents", &VTKPolyDataMeshIOJSBindingType::SetNumberOfPointPixelComponents)
  .function("GetNumberOfPointPixelComponents", &VTKPolyDataMeshIOJSBindingType::GetNumberOfPointPixelComponents)
  .function("SetNumberOfCellPixelComponents", &VTKPolyDataMeshIOJSBindingType::SetNumberOfCellPixelComponents)
  .function("GetNumberOfCellPixelComponents", &VTKPolyDataMeshIOJSBindingType::GetNumberOfCellPixelComponents)
  .function("SetPointDimension", &VTKPolyDataMeshIOJSBindingType::SetPointDimension)
  .function("GetPointDimension", &VTKPolyDataMeshIOJSBindingType::GetPointDimension)
  .function("SetNumberOfPoints", &VTKPolyDataMeshIOJSBindingType::SetNumberOfPoints)
  .function("GetNumberOfPoints", &VTKPolyDataMeshIOJSBindingType::GetNumberOfPoints)
  .function("SetNumberOfCells", &VTKPolyDataMeshIOJSBindingType::SetNumberOfCells)
  .function("GetNumberOfCells", &VTKPolyDataMeshIOJSBindingType::GetNumberOfCells)
  .function("SetNumberOfPointPixels", &VTKPolyDataMeshIOJSBindingType::SetNumberOfPointPixels)
  .function("GetNumberOfPointPixels", &VTKPolyDataMeshIOJSBindingType::GetNumberOfPointPixels)
  .function("SetNumberOfCellPixels", &VTKPolyDataMeshIOJSBindingType::SetNumberOfCellPixels)
  .function("GetNumberOfCellPixels", &VTKPolyDataMeshIOJSBindingType::GetNumberOfCellPixels)
  .function("SetCellBufferSize", &VTKPolyDataMeshIOJSBindingType::SetCellBufferSize)
  .function("GetCellBufferSize", &VTKPolyDataMeshIOJSBindingType::GetCellBufferSize)
  .function("ReadMeshInformation", &VTKPolyDataMeshIOJSBindingType::ReadMeshInformation)
  .function("WriteMeshInformation", &VTKPolyDataMeshIOJSBindingType::WriteMeshInformation)
  .function("ReadPoints", &VTKPolyDataMeshIOJSBindingType::ReadPoints)
  .function("ReadCells", &VTKPolyDataMeshIOJSBindingType::ReadCells)
  .function("ReadPointData", &VTKPolyDataMeshIOJSBindingType::ReadPointData)
  .function("ReadCellData", &VTKPolyDataMeshIOJSBindingType::ReadCellData)
  .function("WritePoints", &VTKPolyDataMeshIOJSBindingType::WritePoints)
  .function("WriteCells", &VTKPolyDataMeshIOJSBindingType::WriteCells)
  .function("WritePointData", &VTKPolyDataMeshIOJSBindingType::WritePointData)
  .function("WriteCellData", &VTKPolyDataMeshIOJSBindingType::WriteCellData)
  .function("SetUseCompression", &VTKPolyDataMeshIOJSBindingType::SetUseCompression)
  ;
}
