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

#include "itkFreeSurferAsciiMeshIO.h"

#include "itkMeshIOBaseJSBinding.h"

typedef itk::MeshIOBaseJSBinding< itk::FreeSurferAsciiMeshIO > FreeSurferAsciiMeshIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_freesurferascii_mesh_io_js_binding) {
  emscripten::enum_<FreeSurferAsciiMeshIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<FreeSurferAsciiMeshIOJSBindingType::IOComponentType>("IOComponentType")
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
    .value("LDOUBLE", itk::MeshIOBase::LDOUBLE)
    ;
  emscripten::enum_<FreeSurferAsciiMeshIOJSBindingType::FileType>("FileType")
    .value("ASCII", itk::MeshIOBase::ASCII)
    .value("BINARY", itk::MeshIOBase::BINARY)
    .value("TYPENOTAPPLICABLE", itk::MeshIOBase::TYPENOTAPPLICABLE)
    ;
  emscripten::enum_<FreeSurferAsciiMeshIOJSBindingType::ByteOrder>("ByteOrder")
    .value("BigEndian", itk::MeshIOBase::BigEndian)
    .value("LittleEndian", itk::MeshIOBase::LittleEndian)
    .value("OrderNotApplicable", itk::MeshIOBase::OrderNotApplicable)
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
