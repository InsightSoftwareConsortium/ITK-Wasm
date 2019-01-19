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

#include "itkOFFMeshIO.h"

#include "itkMeshIOBaseJSBinding.h"

typedef itk::MeshIOBaseJSBinding< itk::OFFMeshIO > OFFMeshIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_off_mesh_io_js_binding) {
  emscripten::enum_<OFFMeshIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<OFFMeshIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::enum_<OFFMeshIOJSBindingType::FileType>("FileType")
    .value("ASCII", itk::MeshIOBase::ASCII)
    .value("BINARY", itk::MeshIOBase::BINARY)
    .value("TYPENOTAPPLICABLE", itk::MeshIOBase::TYPENOTAPPLICABLE)
    ;
  emscripten::enum_<OFFMeshIOJSBindingType::ByteOrder>("ByteOrder")
    .value("BigEndian", itk::MeshIOBase::BigEndian)
    .value("LittleEndian", itk::MeshIOBase::LittleEndian)
    .value("OrderNotApplicable", itk::MeshIOBase::OrderNotApplicable)
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
