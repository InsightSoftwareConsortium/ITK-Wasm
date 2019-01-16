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
  emscripten::enum_<BYUMeshIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::enum_<BYUMeshIOJSBindingType::FileType>("FileType")
    .value("ASCII", itk::MeshIOBase::ASCII)
    .value("BINARY", itk::MeshIOBase::BINARY)
    .value("TYPENOTAPPLICABLE", itk::MeshIOBase::TYPENOTAPPLICABLE)
    ;
  emscripten::enum_<BYUMeshIOJSBindingType::ByteOrder>("ByteOrder")
    .value("BigEndian", itk::MeshIOBase::BigEndian)
    .value("LittleEndian", itk::MeshIOBase::LittleEndian)
    .value("OrderNotApplicable", itk::MeshIOBase::OrderNotApplicable)
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
