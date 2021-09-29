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

#include "itkFreeSurferBinaryMeshIO.h"

#include "itkMeshIOBaseJSBinding.h"

typedef itk::MeshIOBaseJSBinding< itk::FreeSurferBinaryMeshIO > FreeSurferBinaryMeshIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_freesurferbinary_mesh_io_js_binding) {
  emscripten::enum_<FreeSurferBinaryMeshIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<FreeSurferBinaryMeshIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::enum_<FreeSurferBinaryMeshIOJSBindingType::FileType>("FileType")
    .value("ASCII", itk::CommonEnums::IOFile::ASCII)
    .value("BINARY", itk::CommonEnums::IOFile::BINARY)
    .value("TYPENOTAPPLICABLE", itk::CommonEnums::IOFile::TYPENOTAPPLICABLE)
    ;
  emscripten::enum_<FreeSurferBinaryMeshIOJSBindingType::ByteOrder>("ByteOrder")
    .value("BigEndian", itk::CommonEnums::IOByteOrder::BigEndian)
    .value("LittleEndian", itk::CommonEnums::IOByteOrder::LittleEndian)
    .value("OrderNotApplicable", itk::CommonEnums::IOByteOrder::OrderNotApplicable)
    ;
  emscripten::class_<FreeSurferBinaryMeshIOJSBindingType>("ITKMeshIO")
  .constructor<>()
  .function("SetFileName", &FreeSurferBinaryMeshIOJSBindingType::SetFileName)
  .function("GetFileName", &FreeSurferBinaryMeshIOJSBindingType::GetFileName)
  .function("CanReadFile", &FreeSurferBinaryMeshIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &FreeSurferBinaryMeshIOJSBindingType::CanWriteFile)
  .function("SetPointPixelType", &FreeSurferBinaryMeshIOJSBindingType::SetPointPixelType)
  .function("GetPointPixelType", &FreeSurferBinaryMeshIOJSBindingType::GetPointPixelType)
  .function("SetCellPixelType", &FreeSurferBinaryMeshIOJSBindingType::SetCellPixelType)
  .function("GetCellPixelType", &FreeSurferBinaryMeshIOJSBindingType::GetCellPixelType)
  .function("SetFileType", &FreeSurferBinaryMeshIOJSBindingType::SetFileType)
  .function("GetFileType", &FreeSurferBinaryMeshIOJSBindingType::GetFileType)
  .function("SetByteOrder", &FreeSurferBinaryMeshIOJSBindingType::SetByteOrder)
  .function("GetByteOrder", &FreeSurferBinaryMeshIOJSBindingType::GetByteOrder)
  .function("SetPointComponentType", &FreeSurferBinaryMeshIOJSBindingType::SetPointComponentType)
  .function("GetPointComponentType", &FreeSurferBinaryMeshIOJSBindingType::GetPointComponentType)
  .function("SetCellComponentType", &FreeSurferBinaryMeshIOJSBindingType::SetCellComponentType)
  .function("GetCellComponentType", &FreeSurferBinaryMeshIOJSBindingType::GetCellComponentType)
  .function("SetPointPixelComponentType", &FreeSurferBinaryMeshIOJSBindingType::SetPointPixelComponentType)
  .function("GetPointPixelComponentType", &FreeSurferBinaryMeshIOJSBindingType::GetPointPixelComponentType)
  .function("SetCellPixelComponentType", &FreeSurferBinaryMeshIOJSBindingType::SetCellPixelComponentType)
  .function("GetCellPixelComponentType", &FreeSurferBinaryMeshIOJSBindingType::GetCellPixelComponentType)
  .function("SetNumberOfPointPixelComponents", &FreeSurferBinaryMeshIOJSBindingType::SetNumberOfPointPixelComponents)
  .function("GetNumberOfPointPixelComponents", &FreeSurferBinaryMeshIOJSBindingType::GetNumberOfPointPixelComponents)
  .function("SetNumberOfCellPixelComponents", &FreeSurferBinaryMeshIOJSBindingType::SetNumberOfCellPixelComponents)
  .function("GetNumberOfCellPixelComponents", &FreeSurferBinaryMeshIOJSBindingType::GetNumberOfCellPixelComponents)
  .function("SetPointDimension", &FreeSurferBinaryMeshIOJSBindingType::SetPointDimension)
  .function("GetPointDimension", &FreeSurferBinaryMeshIOJSBindingType::GetPointDimension)
  .function("SetNumberOfPoints", &FreeSurferBinaryMeshIOJSBindingType::SetNumberOfPoints)
  .function("GetNumberOfPoints", &FreeSurferBinaryMeshIOJSBindingType::GetNumberOfPoints)
  .function("SetNumberOfCells", &FreeSurferBinaryMeshIOJSBindingType::SetNumberOfCells)
  .function("GetNumberOfCells", &FreeSurferBinaryMeshIOJSBindingType::GetNumberOfCells)
  .function("SetNumberOfPointPixels", &FreeSurferBinaryMeshIOJSBindingType::SetNumberOfPointPixels)
  .function("GetNumberOfPointPixels", &FreeSurferBinaryMeshIOJSBindingType::GetNumberOfPointPixels)
  .function("SetNumberOfCellPixels", &FreeSurferBinaryMeshIOJSBindingType::SetNumberOfCellPixels)
  .function("GetNumberOfCellPixels", &FreeSurferBinaryMeshIOJSBindingType::GetNumberOfCellPixels)
  .function("SetCellBufferSize", &FreeSurferBinaryMeshIOJSBindingType::SetCellBufferSize)
  .function("GetCellBufferSize", &FreeSurferBinaryMeshIOJSBindingType::GetCellBufferSize)
  .function("SetUpdatePoints", &FreeSurferBinaryMeshIOJSBindingType::SetUpdatePoints)
  .function("SetUpdatePointData", &FreeSurferBinaryMeshIOJSBindingType::SetUpdatePointData)
  .function("SetUpdateCells", &FreeSurferBinaryMeshIOJSBindingType::SetUpdateCells)
  .function("SetUpdateCellData", &FreeSurferBinaryMeshIOJSBindingType::SetUpdateCellData)
  .function("ReadMeshInformation", &FreeSurferBinaryMeshIOJSBindingType::ReadMeshInformation)
  .function("WriteMeshInformation", &FreeSurferBinaryMeshIOJSBindingType::WriteMeshInformation)
  .function("ReadPoints", &FreeSurferBinaryMeshIOJSBindingType::ReadPoints)
  .function("ReadCells", &FreeSurferBinaryMeshIOJSBindingType::ReadCells)
  .function("ReadPointData", &FreeSurferBinaryMeshIOJSBindingType::ReadPointData)
  .function("ReadCellData", &FreeSurferBinaryMeshIOJSBindingType::ReadCellData)
  .function("WritePoints", &FreeSurferBinaryMeshIOJSBindingType::WritePoints)
  .function("WriteCells", &FreeSurferBinaryMeshIOJSBindingType::WriteCells)
  .function("WritePointData", &FreeSurferBinaryMeshIOJSBindingType::WritePointData)
  .function("WriteCellData", &FreeSurferBinaryMeshIOJSBindingType::WriteCellData)
  .function("Write", &FreeSurferBinaryMeshIOJSBindingType::Write)
  .function("SetUseCompression", &FreeSurferBinaryMeshIOJSBindingType::SetUseCompression)
  ;
}
