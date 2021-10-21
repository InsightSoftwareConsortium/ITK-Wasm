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

#include "itkFreeSurferAsciiMeshIO.h"

#include "itkMeshIOBaseJSBinding.h"

typedef itk::MeshIOBaseJSBinding< itk::FreeSurferAsciiMeshIO > FreeSurferAsciiMeshIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_freesurferascii_mesh_io_js_binding) {
  emscripten::enum_<FreeSurferAsciiMeshIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<FreeSurferAsciiMeshIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::enum_<FreeSurferAsciiMeshIOJSBindingType::FileType>("FileType")
    .value("ASCII", itk::CommonEnums::IOFile::ASCII)
    .value("BINARY", itk::CommonEnums::IOFile::BINARY)
    .value("TYPENOTAPPLICABLE", itk::CommonEnums::IOFile::TYPENOTAPPLICABLE)
    ;
  emscripten::enum_<FreeSurferAsciiMeshIOJSBindingType::ByteOrder>("ByteOrder")
    .value("BigEndian", itk::CommonEnums::IOByteOrder::BigEndian)
    .value("LittleEndian", itk::CommonEnums::IOByteOrder::LittleEndian)
    .value("OrderNotApplicable", itk::CommonEnums::IOByteOrder::OrderNotApplicable)
    ;
  emscripten::class_<FreeSurferAsciiMeshIOJSBindingType>("ITKMeshIO")
  .constructor<>()
  .function("SetFileName", &FreeSurferAsciiMeshIOJSBindingType::SetFileName)
  .function("GetFileName", &FreeSurferAsciiMeshIOJSBindingType::GetFileName)
  .function("CanReadFile", &FreeSurferAsciiMeshIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &FreeSurferAsciiMeshIOJSBindingType::CanWriteFile)
  .function("SetPointPixelType", &FreeSurferAsciiMeshIOJSBindingType::SetPointPixelType)
  .function("GetPointPixelType", &FreeSurferAsciiMeshIOJSBindingType::GetPointPixelType)
  .function("SetCellPixelType", &FreeSurferAsciiMeshIOJSBindingType::SetCellPixelType)
  .function("GetCellPixelType", &FreeSurferAsciiMeshIOJSBindingType::GetCellPixelType)
  .function("SetFileType", &FreeSurferAsciiMeshIOJSBindingType::SetFileType)
  .function("GetFileType", &FreeSurferAsciiMeshIOJSBindingType::GetFileType)
  .function("SetByteOrder", &FreeSurferAsciiMeshIOJSBindingType::SetByteOrder)
  .function("GetByteOrder", &FreeSurferAsciiMeshIOJSBindingType::GetByteOrder)
  .function("SetPointComponentType", &FreeSurferAsciiMeshIOJSBindingType::SetPointComponentType)
  .function("GetPointComponentType", &FreeSurferAsciiMeshIOJSBindingType::GetPointComponentType)
  .function("SetCellComponentType", &FreeSurferAsciiMeshIOJSBindingType::SetCellComponentType)
  .function("GetCellComponentType", &FreeSurferAsciiMeshIOJSBindingType::GetCellComponentType)
  .function("SetPointPixelComponentType", &FreeSurferAsciiMeshIOJSBindingType::SetPointPixelComponentType)
  .function("GetPointPixelComponentType", &FreeSurferAsciiMeshIOJSBindingType::GetPointPixelComponentType)
  .function("SetCellPixelComponentType", &FreeSurferAsciiMeshIOJSBindingType::SetCellPixelComponentType)
  .function("GetCellPixelComponentType", &FreeSurferAsciiMeshIOJSBindingType::GetCellPixelComponentType)
  .function("SetNumberOfPointPixelComponents", &FreeSurferAsciiMeshIOJSBindingType::SetNumberOfPointPixelComponents)
  .function("GetNumberOfPointPixelComponents", &FreeSurferAsciiMeshIOJSBindingType::GetNumberOfPointPixelComponents)
  .function("SetNumberOfCellPixelComponents", &FreeSurferAsciiMeshIOJSBindingType::SetNumberOfCellPixelComponents)
  .function("GetNumberOfCellPixelComponents", &FreeSurferAsciiMeshIOJSBindingType::GetNumberOfCellPixelComponents)
  .function("SetPointDimension", &FreeSurferAsciiMeshIOJSBindingType::SetPointDimension)
  .function("GetPointDimension", &FreeSurferAsciiMeshIOJSBindingType::GetPointDimension)
  .function("SetNumberOfPoints", &FreeSurferAsciiMeshIOJSBindingType::SetNumberOfPoints)
  .function("GetNumberOfPoints", &FreeSurferAsciiMeshIOJSBindingType::GetNumberOfPoints)
  .function("SetNumberOfCells", &FreeSurferAsciiMeshIOJSBindingType::SetNumberOfCells)
  .function("GetNumberOfCells", &FreeSurferAsciiMeshIOJSBindingType::GetNumberOfCells)
  .function("SetNumberOfPointPixels", &FreeSurferAsciiMeshIOJSBindingType::SetNumberOfPointPixels)
  .function("GetNumberOfPointPixels", &FreeSurferAsciiMeshIOJSBindingType::GetNumberOfPointPixels)
  .function("SetNumberOfCellPixels", &FreeSurferAsciiMeshIOJSBindingType::SetNumberOfCellPixels)
  .function("GetNumberOfCellPixels", &FreeSurferAsciiMeshIOJSBindingType::GetNumberOfCellPixels)
  .function("SetCellBufferSize", &FreeSurferAsciiMeshIOJSBindingType::SetCellBufferSize)
  .function("GetCellBufferSize", &FreeSurferAsciiMeshIOJSBindingType::GetCellBufferSize)
  .function("SetUpdatePoints", &FreeSurferAsciiMeshIOJSBindingType::SetUpdatePoints)
  .function("SetUpdatePointData", &FreeSurferAsciiMeshIOJSBindingType::SetUpdatePointData)
  .function("SetUpdateCells", &FreeSurferAsciiMeshIOJSBindingType::SetUpdateCells)
  .function("SetUpdateCellData", &FreeSurferAsciiMeshIOJSBindingType::SetUpdateCellData)
  .function("ReadMeshInformation", &FreeSurferAsciiMeshIOJSBindingType::ReadMeshInformation)
  .function("WriteMeshInformation", &FreeSurferAsciiMeshIOJSBindingType::WriteMeshInformation)
  .function("ReadPoints", &FreeSurferAsciiMeshIOJSBindingType::ReadPoints)
  .function("ReadCells", &FreeSurferAsciiMeshIOJSBindingType::ReadCells)
  .function("ReadPointData", &FreeSurferAsciiMeshIOJSBindingType::ReadPointData)
  .function("ReadCellData", &FreeSurferAsciiMeshIOJSBindingType::ReadCellData)
  .function("WritePoints", &FreeSurferAsciiMeshIOJSBindingType::WritePoints)
  .function("WriteCells", &FreeSurferAsciiMeshIOJSBindingType::WriteCells)
  .function("WritePointData", &FreeSurferAsciiMeshIOJSBindingType::WritePointData)
  .function("WriteCellData", &FreeSurferAsciiMeshIOJSBindingType::WriteCellData)
  .function("Write", &FreeSurferAsciiMeshIOJSBindingType::Write)
  .function("SetUseCompression", &FreeSurferAsciiMeshIOJSBindingType::SetUseCompression)
  ;
}
