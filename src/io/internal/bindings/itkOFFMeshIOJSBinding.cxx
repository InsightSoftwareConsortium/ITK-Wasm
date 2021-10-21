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

#include "itkOFFMeshIO.h"

#include "itkMeshIOBaseJSBinding.h"

typedef itk::MeshIOBaseJSBinding< itk::OFFMeshIO > OFFMeshIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_off_mesh_io_js_binding) {
  emscripten::enum_<OFFMeshIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<OFFMeshIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::enum_<OFFMeshIOJSBindingType::FileType>("FileType")
    .value("ASCII", itk::CommonEnums::IOFile::ASCII)
    .value("BINARY", itk::CommonEnums::IOFile::BINARY)
    .value("TYPENOTAPPLICABLE", itk::CommonEnums::IOFile::TYPENOTAPPLICABLE)
    ;
  emscripten::enum_<OFFMeshIOJSBindingType::ByteOrder>("ByteOrder")
    .value("BigEndian", itk::CommonEnums::IOByteOrder::BigEndian)
    .value("LittleEndian", itk::CommonEnums::IOByteOrder::LittleEndian)
    .value("OrderNotApplicable", itk::CommonEnums::IOByteOrder::OrderNotApplicable)
    ;
  emscripten::class_<OFFMeshIOJSBindingType>("ITKMeshIO")
  .constructor<>()
  .function("SetFileName", &OFFMeshIOJSBindingType::SetFileName)
  .function("GetFileName", &OFFMeshIOJSBindingType::GetFileName)
  .function("CanReadFile", &OFFMeshIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &OFFMeshIOJSBindingType::CanWriteFile)
  .function("SetPointPixelType", &OFFMeshIOJSBindingType::SetPointPixelType)
  .function("GetPointPixelType", &OFFMeshIOJSBindingType::GetPointPixelType)
  .function("SetCellPixelType", &OFFMeshIOJSBindingType::SetCellPixelType)
  .function("GetCellPixelType", &OFFMeshIOJSBindingType::GetCellPixelType)
  .function("SetFileType", &OFFMeshIOJSBindingType::SetFileType)
  .function("GetFileType", &OFFMeshIOJSBindingType::GetFileType)
  .function("SetByteOrder", &OFFMeshIOJSBindingType::SetByteOrder)
  .function("GetByteOrder", &OFFMeshIOJSBindingType::GetByteOrder)
  .function("SetPointComponentType", &OFFMeshIOJSBindingType::SetPointComponentType)
  .function("GetPointComponentType", &OFFMeshIOJSBindingType::GetPointComponentType)
  .function("SetCellComponentType", &OFFMeshIOJSBindingType::SetCellComponentType)
  .function("GetCellComponentType", &OFFMeshIOJSBindingType::GetCellComponentType)
  .function("SetPointPixelComponentType", &OFFMeshIOJSBindingType::SetPointPixelComponentType)
  .function("GetPointPixelComponentType", &OFFMeshIOJSBindingType::GetPointPixelComponentType)
  .function("SetCellPixelComponentType", &OFFMeshIOJSBindingType::SetCellPixelComponentType)
  .function("GetCellPixelComponentType", &OFFMeshIOJSBindingType::GetCellPixelComponentType)
  .function("SetNumberOfPointPixelComponents", &OFFMeshIOJSBindingType::SetNumberOfPointPixelComponents)
  .function("GetNumberOfPointPixelComponents", &OFFMeshIOJSBindingType::GetNumberOfPointPixelComponents)
  .function("SetNumberOfCellPixelComponents", &OFFMeshIOJSBindingType::SetNumberOfCellPixelComponents)
  .function("GetNumberOfCellPixelComponents", &OFFMeshIOJSBindingType::GetNumberOfCellPixelComponents)
  .function("SetPointDimension", &OFFMeshIOJSBindingType::SetPointDimension)
  .function("GetPointDimension", &OFFMeshIOJSBindingType::GetPointDimension)
  .function("SetNumberOfPoints", &OFFMeshIOJSBindingType::SetNumberOfPoints)
  .function("GetNumberOfPoints", &OFFMeshIOJSBindingType::GetNumberOfPoints)
  .function("SetNumberOfCells", &OFFMeshIOJSBindingType::SetNumberOfCells)
  .function("GetNumberOfCells", &OFFMeshIOJSBindingType::GetNumberOfCells)
  .function("SetNumberOfPointPixels", &OFFMeshIOJSBindingType::SetNumberOfPointPixels)
  .function("GetNumberOfPointPixels", &OFFMeshIOJSBindingType::GetNumberOfPointPixels)
  .function("SetNumberOfCellPixels", &OFFMeshIOJSBindingType::SetNumberOfCellPixels)
  .function("GetNumberOfCellPixels", &OFFMeshIOJSBindingType::GetNumberOfCellPixels)
  .function("SetCellBufferSize", &OFFMeshIOJSBindingType::SetCellBufferSize)
  .function("GetCellBufferSize", &OFFMeshIOJSBindingType::GetCellBufferSize)
  .function("SetUpdatePoints", &OFFMeshIOJSBindingType::SetUpdatePoints)
  .function("SetUpdatePointData", &OFFMeshIOJSBindingType::SetUpdatePointData)
  .function("SetUpdateCells", &OFFMeshIOJSBindingType::SetUpdateCells)
  .function("SetUpdateCellData", &OFFMeshIOJSBindingType::SetUpdateCellData)
  .function("ReadMeshInformation", &OFFMeshIOJSBindingType::ReadMeshInformation)
  .function("WriteMeshInformation", &OFFMeshIOJSBindingType::WriteMeshInformation)
  .function("ReadPoints", &OFFMeshIOJSBindingType::ReadPoints)
  .function("ReadCells", &OFFMeshIOJSBindingType::ReadCells)
  .function("ReadPointData", &OFFMeshIOJSBindingType::ReadPointData)
  .function("ReadCellData", &OFFMeshIOJSBindingType::ReadCellData)
  .function("WritePoints", &OFFMeshIOJSBindingType::WritePoints)
  .function("WriteCells", &OFFMeshIOJSBindingType::WriteCells)
  .function("WritePointData", &OFFMeshIOJSBindingType::WritePointData)
  .function("WriteCellData", &OFFMeshIOJSBindingType::WriteCellData)
  .function("Write", &OFFMeshIOJSBindingType::Write)
  .function("SetUseCompression", &OFFMeshIOJSBindingType::SetUseCompression)
  ;
}
