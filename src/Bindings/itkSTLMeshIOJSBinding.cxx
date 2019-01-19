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

#include "itkSTLMeshIO.h"

#include "itkMeshIOBaseJSBinding.h"

typedef itk::MeshIOBaseJSBinding< itk::STLMeshIO > STLMeshIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_stl_mesh_io_js_binding) {
  emscripten::enum_<STLMeshIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<STLMeshIOJSBindingType::IOComponentType>("IOComponentType")
    .value("UNKNOWNCOMPONENTTYPE", itk::MeshIOBase::UNKNOWNCOMPONENTTYPE)
    .value("UCHAR", itk::MeshIOBase::UCHAR)
    .value("CHAR", itk::MeshIOBase::CHAR)
    .value("USHORT", itk::MeshIOBase::USHORT)
    .value("SHORT", itk::MeshIOBase::SHORT)
    .value("UINT", itk::MeshIOBase::UINT)
    .value("INT", itk::MeshIOBase::INT)
    .value("ULONG", itk::MeshIOBase::ULONG)
    .value("LONG", itk::MeshIOBase::LONG)
    .value("ULONGLONG", itk::MeshIOBase::ULONGLONG)
    .value("LONGLONG", itk::MeshIOBase::LONGLONG)
    .value("FLOAT", itk::MeshIOBase::FLOAT)
    .value("DOUBLE", itk::MeshIOBase::DOUBLE)
    .value("LDOUBLE", itk::MeshIOBase::LDOUBLE)
    ;
  emscripten::enum_<STLMeshIOJSBindingType::FileType>("FileType")
    .value("ASCII", itk::MeshIOBase::ASCII)
    .value("BINARY", itk::MeshIOBase::BINARY)
    .value("TYPENOTAPPLICABLE", itk::MeshIOBase::TYPENOTAPPLICABLE)
    ;
  emscripten::enum_<STLMeshIOJSBindingType::ByteOrder>("ByteOrder")
    .value("BigEndian", itk::MeshIOBase::BigEndian)
    .value("LittleEndian", itk::MeshIOBase::LittleEndian)
    .value("OrderNotApplicable", itk::MeshIOBase::OrderNotApplicable)
    ;
  emscripten::class_<STLMeshIOJSBindingType>("ITKMeshIO")
  .constructor<>()
  .function("SetFileName", &STLMeshIOJSBindingType::SetFileName)
  .function("GetFileName", &STLMeshIOJSBindingType::GetFileName)
  .function("CanReadFile", &STLMeshIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &STLMeshIOJSBindingType::CanWriteFile)
  .function("SetPointPixelType", &STLMeshIOJSBindingType::SetPointPixelType)
  .function("GetPointPixelType", &STLMeshIOJSBindingType::GetPointPixelType)
  .function("SetCellPixelType", &STLMeshIOJSBindingType::SetCellPixelType)
  .function("GetCellPixelType", &STLMeshIOJSBindingType::GetCellPixelType)
  .function("SetFileType", &STLMeshIOJSBindingType::SetFileType)
  .function("GetFileType", &STLMeshIOJSBindingType::GetFileType)
  .function("SetByteOrder", &STLMeshIOJSBindingType::SetByteOrder)
  .function("GetByteOrder", &STLMeshIOJSBindingType::GetByteOrder)
  .function("SetPointComponentType", &STLMeshIOJSBindingType::SetPointComponentType)
  .function("GetPointComponentType", &STLMeshIOJSBindingType::GetPointComponentType)
  .function("SetCellComponentType", &STLMeshIOJSBindingType::SetCellComponentType)
  .function("GetCellComponentType", &STLMeshIOJSBindingType::GetCellComponentType)
  .function("SetPointPixelComponentType", &STLMeshIOJSBindingType::SetPointPixelComponentType)
  .function("GetPointPixelComponentType", &STLMeshIOJSBindingType::GetPointPixelComponentType)
  .function("SetCellPixelComponentType", &STLMeshIOJSBindingType::SetCellPixelComponentType)
  .function("GetCellPixelComponentType", &STLMeshIOJSBindingType::GetCellPixelComponentType)
  .function("SetNumberOfPointPixelComponents", &STLMeshIOJSBindingType::SetNumberOfPointPixelComponents)
  .function("GetNumberOfPointPixelComponents", &STLMeshIOJSBindingType::GetNumberOfPointPixelComponents)
  .function("SetNumberOfCellPixelComponents", &STLMeshIOJSBindingType::SetNumberOfCellPixelComponents)
  .function("GetNumberOfCellPixelComponents", &STLMeshIOJSBindingType::GetNumberOfCellPixelComponents)
  .function("SetPointDimension", &STLMeshIOJSBindingType::SetPointDimension)
  .function("GetPointDimension", &STLMeshIOJSBindingType::GetPointDimension)
  .function("SetNumberOfPoints", &STLMeshIOJSBindingType::SetNumberOfPoints)
  .function("GetNumberOfPoints", &STLMeshIOJSBindingType::GetNumberOfPoints)
  .function("SetNumberOfCells", &STLMeshIOJSBindingType::SetNumberOfCells)
  .function("GetNumberOfCells", &STLMeshIOJSBindingType::GetNumberOfCells)
  .function("SetNumberOfPointPixels", &STLMeshIOJSBindingType::SetNumberOfPointPixels)
  .function("GetNumberOfPointPixels", &STLMeshIOJSBindingType::GetNumberOfPointPixels)
  .function("SetNumberOfCellPixels", &STLMeshIOJSBindingType::SetNumberOfCellPixels)
  .function("GetNumberOfCellPixels", &STLMeshIOJSBindingType::GetNumberOfCellPixels)
  .function("SetCellBufferSize", &STLMeshIOJSBindingType::SetCellBufferSize)
  .function("GetCellBufferSize", &STLMeshIOJSBindingType::GetCellBufferSize)
  .function("SetUpdatePoints", &STLMeshIOJSBindingType::SetUpdatePoints)
  .function("SetUpdatePointData", &STLMeshIOJSBindingType::SetUpdatePointData)
  .function("SetUpdateCells", &STLMeshIOJSBindingType::SetUpdateCells)
  .function("SetUpdateCellData", &STLMeshIOJSBindingType::SetUpdateCellData)
  .function("ReadMeshInformation", &STLMeshIOJSBindingType::ReadMeshInformation)
  .function("WriteMeshInformation", &STLMeshIOJSBindingType::WriteMeshInformation)
  .function("ReadPoints", &STLMeshIOJSBindingType::ReadPoints)
  .function("ReadCells", &STLMeshIOJSBindingType::ReadCells)
  .function("ReadPointData", &STLMeshIOJSBindingType::ReadPointData)
  .function("ReadCellData", &STLMeshIOJSBindingType::ReadCellData)
  .function("WritePoints", &STLMeshIOJSBindingType::WritePoints)
  .function("WriteCells", &STLMeshIOJSBindingType::WriteCells)
  .function("WritePointData", &STLMeshIOJSBindingType::WritePointData)
  .function("WriteCellData", &STLMeshIOJSBindingType::WriteCellData)
  .function("Write", &STLMeshIOJSBindingType::Write)
  .function("SetUseCompression", &STLMeshIOJSBindingType::SetUseCompression)
  ;
}
