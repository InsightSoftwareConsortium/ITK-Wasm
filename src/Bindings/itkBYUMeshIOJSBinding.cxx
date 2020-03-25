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

#include "itkBYUMeshIO.h"

#include "itkMeshIOBaseJSBinding.h"

typedef itk::MeshIOBaseJSBinding< itk::BYUMeshIO > BYUMeshIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_byu_mesh_io_js_binding) {
  emscripten::enum_<BYUMeshIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<BYUMeshIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::enum_<BYUMeshIOJSBindingType::FileType>("FileType")
    .value("ASCII", itk::CommonEnums::IOFile::ASCII)
    .value("BINARY", itk::CommonEnums::IOFile::BINARY)
    .value("TYPENOTAPPLICABLE", itk::CommonEnums::IOFile::TYPENOTAPPLICABLE)
    ;
  emscripten::enum_<BYUMeshIOJSBindingType::ByteOrder>("ByteOrder")
    .value("BigEndian", itk::CommonEnums::IOByteOrder::BigEndian)
    .value("LittleEndian", itk::CommonEnums::IOByteOrder::LittleEndian)
    .value("OrderNotApplicable", itk::CommonEnums::IOByteOrder::OrderNotApplicable)
    ;
  emscripten::class_<BYUMeshIOJSBindingType>("ITKMeshIO")
  .constructor<>()
  .function("SetFileName", &BYUMeshIOJSBindingType::SetFileName)
  .function("GetFileName", &BYUMeshIOJSBindingType::GetFileName)
  .function("CanReadFile", &BYUMeshIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &BYUMeshIOJSBindingType::CanWriteFile)
  .function("SetPointPixelType", &BYUMeshIOJSBindingType::SetPointPixelType)
  .function("GetPointPixelType", &BYUMeshIOJSBindingType::GetPointPixelType)
  .function("SetCellPixelType", &BYUMeshIOJSBindingType::SetCellPixelType)
  .function("GetCellPixelType", &BYUMeshIOJSBindingType::GetCellPixelType)
  .function("SetFileType", &BYUMeshIOJSBindingType::SetFileType)
  .function("GetFileType", &BYUMeshIOJSBindingType::GetFileType)
  .function("SetByteOrder", &BYUMeshIOJSBindingType::SetByteOrder)
  .function("GetByteOrder", &BYUMeshIOJSBindingType::GetByteOrder)
  .function("SetPointComponentType", &BYUMeshIOJSBindingType::SetPointComponentType)
  .function("GetPointComponentType", &BYUMeshIOJSBindingType::GetPointComponentType)
  .function("SetCellComponentType", &BYUMeshIOJSBindingType::SetCellComponentType)
  .function("GetCellComponentType", &BYUMeshIOJSBindingType::GetCellComponentType)
  .function("SetPointPixelComponentType", &BYUMeshIOJSBindingType::SetPointPixelComponentType)
  .function("GetPointPixelComponentType", &BYUMeshIOJSBindingType::GetPointPixelComponentType)
  .function("SetCellPixelComponentType", &BYUMeshIOJSBindingType::SetCellPixelComponentType)
  .function("GetCellPixelComponentType", &BYUMeshIOJSBindingType::GetCellPixelComponentType)
  .function("SetNumberOfPointPixelComponents", &BYUMeshIOJSBindingType::SetNumberOfPointPixelComponents)
  .function("GetNumberOfPointPixelComponents", &BYUMeshIOJSBindingType::GetNumberOfPointPixelComponents)
  .function("SetNumberOfCellPixelComponents", &BYUMeshIOJSBindingType::SetNumberOfCellPixelComponents)
  .function("GetNumberOfCellPixelComponents", &BYUMeshIOJSBindingType::GetNumberOfCellPixelComponents)
  .function("SetPointDimension", &BYUMeshIOJSBindingType::SetPointDimension)
  .function("GetPointDimension", &BYUMeshIOJSBindingType::GetPointDimension)
  .function("SetNumberOfPoints", &BYUMeshIOJSBindingType::SetNumberOfPoints)
  .function("GetNumberOfPoints", &BYUMeshIOJSBindingType::GetNumberOfPoints)
  .function("SetNumberOfCells", &BYUMeshIOJSBindingType::SetNumberOfCells)
  .function("GetNumberOfCells", &BYUMeshIOJSBindingType::GetNumberOfCells)
  .function("SetNumberOfPointPixels", &BYUMeshIOJSBindingType::SetNumberOfPointPixels)
  .function("GetNumberOfPointPixels", &BYUMeshIOJSBindingType::GetNumberOfPointPixels)
  .function("SetNumberOfCellPixels", &BYUMeshIOJSBindingType::SetNumberOfCellPixels)
  .function("GetNumberOfCellPixels", &BYUMeshIOJSBindingType::GetNumberOfCellPixels)
  .function("SetCellBufferSize", &BYUMeshIOJSBindingType::SetCellBufferSize)
  .function("GetCellBufferSize", &BYUMeshIOJSBindingType::GetCellBufferSize)
  .function("SetUpdatePoints", &BYUMeshIOJSBindingType::SetUpdatePoints)
  .function("SetUpdatePointData", &BYUMeshIOJSBindingType::SetUpdatePointData)
  .function("SetUpdateCells", &BYUMeshIOJSBindingType::SetUpdateCells)
  .function("SetUpdateCellData", &BYUMeshIOJSBindingType::SetUpdateCellData)
  .function("ReadMeshInformation", &BYUMeshIOJSBindingType::ReadMeshInformation)
  .function("WriteMeshInformation", &BYUMeshIOJSBindingType::WriteMeshInformation)
  .function("ReadPoints", &BYUMeshIOJSBindingType::ReadPoints)
  .function("ReadCells", &BYUMeshIOJSBindingType::ReadCells)
  .function("ReadPointData", &BYUMeshIOJSBindingType::ReadPointData)
  .function("ReadCellData", &BYUMeshIOJSBindingType::ReadCellData)
  .function("WritePoints", &BYUMeshIOJSBindingType::WritePoints)
  .function("WriteCells", &BYUMeshIOJSBindingType::WriteCells)
  .function("WritePointData", &BYUMeshIOJSBindingType::WritePointData)
  .function("WriteCellData", &BYUMeshIOJSBindingType::WriteCellData)
  .function("Write", &BYUMeshIOJSBindingType::Write)
  .function("SetUseCompression", &BYUMeshIOJSBindingType::SetUseCompression)
  ;
}
