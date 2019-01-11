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
  emscripten::enum_<FreeSurferBinaryMeshIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::enum_<FreeSurferBinaryMeshIOJSBindingType::FileType>("FileType")
    .value("ASCII", itk::MeshIOBase::ASCII)
    .value("BINARY", itk::MeshIOBase::BINARY)
    .value("TYPENOTAPPLICABLE", itk::MeshIOBase::TYPENOTAPPLICABLE)
    ;
  emscripten::enum_<FreeSurferBinaryMeshIOJSBindingType::ByteOrder>("ByteOrder")
    .value("BigEndian", itk::MeshIOBase::BigEndian)
    .value("LittleEndian", itk::MeshIOBase::LittleEndian)
    .value("OrderNotApplicable", itk::MeshIOBase::OrderNotApplicable)
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
