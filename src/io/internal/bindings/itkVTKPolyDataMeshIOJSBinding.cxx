/*=========================================================================
 *
 *  Copyright NumFOCUS
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
    .value("UNKNOWNPIXELTYPE", itk::CommonEnums::IOPixel::UNKNOWNPIXELTYPE)
    .value("SCALAR", itk::CommonEnums::IOPixel::SCALAR)
    .value("RGB", itk::CommonEnums::IOPixel::RGB)
    .value("RGBA", itk::CommonEnums::IOPixel::RGBA)
    .value("OFFSET", itk::CommonEnums::IOPixel::OFFSET)
    .value("VECTOR", itk::CommonEnums::IOPixel::VECTOR)
    .value("POINT", itk::CommonEnums::IOPixel::POINT)
    .value("COVARIANTVECTOR", itk::CommonEnums::IOPixel::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::CommonEnums::IOPixel::SYMMETRICSECONDRANKTENSOR)
    .value("DIFFUSIONTENSOR3D", itk::CommonEnums::IOPixel::DIFFUSIONTENSOR3D)
    .value("COMPLEX", itk::CommonEnums::IOPixel::COMPLEX)
    .value("FIXEDARRAY", itk::CommonEnums::IOPixel::FIXEDARRAY)
    .value("ARRAY", itk::CommonEnums::IOPixel::ARRAY)
    .value("MATRIX", itk::CommonEnums::IOPixel::MATRIX)
    .value("VARIABLELENGTHVECTOR", itk::CommonEnums::IOPixel::VARIABLELENGTHVECTOR)
    .value("VARIABLESIZEMATRIX", itk::CommonEnums::IOPixel::VARIABLESIZEMATRIX)
    ;
  emscripten::enum_<VTKPolyDataMeshIOJSBindingType::IOComponentType>("IOComponentType")
    .value("UNKNOWNCOMPONENTTYPE", itk::CommonEnums::IOComponent::UNKNOWNCOMPONENTTYPE)
    .value("UCHAR", itk::CommonEnums::IOComponent::UCHAR)
    .value("CHAR", itk::CommonEnums::IOComponent::CHAR)
    .value("USHORT", itk::CommonEnums::IOComponent::USHORT)
    .value("SHORT", itk::CommonEnums::IOComponent::SHORT)
    .value("UINT", itk::CommonEnums::IOComponent::UINT)
    .value("INT", itk::CommonEnums::IOComponent::INT)
    .value("ULONG", itk::CommonEnums::IOComponent::ULONG)
    .value("LONG", itk::CommonEnums::IOComponent::LONG)
    .value("ULONGLONG", itk::CommonEnums::IOComponent::ULONGLONG)
    .value("LONGLONG", itk::CommonEnums::IOComponent::LONGLONG)
    .value("FLOAT", itk::CommonEnums::IOComponent::FLOAT)
    .value("DOUBLE", itk::CommonEnums::IOComponent::DOUBLE)
    .value("LDOUBLE", itk::CommonEnums::IOComponent::LDOUBLE)
    ;
  emscripten::enum_<VTKPolyDataMeshIOJSBindingType::FileType>("FileType")
    .value("ASCII", itk::CommonEnums::IOFile::ASCII)
    .value("BINARY", itk::CommonEnums::IOFile::BINARY)
    .value("TYPENOTAPPLICABLE", itk::CommonEnums::IOFile::TYPENOTAPPLICABLE)
    ;
  emscripten::enum_<VTKPolyDataMeshIOJSBindingType::ByteOrder>("ByteOrder")
    .value("BigEndian", itk::CommonEnums::IOByteOrder::BigEndian)
    .value("LittleEndian", itk::CommonEnums::IOByteOrder::LittleEndian)
    .value("OrderNotApplicable", itk::CommonEnums::IOByteOrder::OrderNotApplicable)
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
  .function("SetUpdatePoints", &VTKPolyDataMeshIOJSBindingType::SetUpdatePoints)
  .function("SetUpdatePointData", &VTKPolyDataMeshIOJSBindingType::SetUpdatePointData)
  .function("SetUpdateCells", &VTKPolyDataMeshIOJSBindingType::SetUpdateCells)
  .function("SetUpdateCellData", &VTKPolyDataMeshIOJSBindingType::SetUpdateCellData)
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
  .function("Write", &VTKPolyDataMeshIOJSBindingType::Write)
  .function("SetUseCompression", &VTKPolyDataMeshIOJSBindingType::SetUseCompression)
  ;
}
