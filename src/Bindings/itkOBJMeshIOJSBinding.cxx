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

#include "itkOBJMeshIO.h"

#include "itkMeshIOBaseJSBinding.h"

typedef itk::MeshIOBaseJSBinding< itk::OBJMeshIO > OBJMeshIOJSBindingType;
class OBJMeshIOJSBinding: public OBJMeshIOJSBindingType
{
public:
  using Superclass = OBJMeshIOJSBindingType;
  void ReadMeshInformation()
    {
    // itk::OBJMeshIO sets the default cell component type to LONG, but
    // JavaScript does not currently support 64 bit integers. So, use 32 bit
    // integers instead.
    Superclass::ReadMeshInformation();
    this->m_MeshIO->SetCellComponentType( itk::MeshIOBase::INT );
    }
};

EMSCRIPTEN_BINDINGS(itk_obj_mesh_io_js_binding) {
  emscripten::enum_<OBJMeshIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<OBJMeshIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::enum_<OBJMeshIOJSBindingType::FileType>("FileType")
    .value("ASCII", itk::MeshIOBase::ASCII)
    .value("BINARY", itk::MeshIOBase::BINARY)
    .value("TYPENOTAPPLICABLE", itk::MeshIOBase::TYPENOTAPPLICABLE)
    ;
  emscripten::enum_<OBJMeshIOJSBindingType::ByteOrder>("ByteOrder")
    .value("BigEndian", itk::MeshIOBase::BigEndian)
    .value("LittleEndian", itk::MeshIOBase::LittleEndian)
    .value("OrderNotApplicable", itk::MeshIOBase::OrderNotApplicable)
    ;
  emscripten::class_<OBJMeshIOJSBindingType>("ITKMeshIOBase")
  .constructor<>()
  .function("SetFileName", &OBJMeshIOJSBindingType::SetFileName)
  .function("GetFileName", &OBJMeshIOJSBindingType::GetFileName)
  .function("CanReadFile", &OBJMeshIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &OBJMeshIOJSBindingType::CanWriteFile)
  .function("SetPointPixelType", &OBJMeshIOJSBindingType::SetPointPixelType)
  .function("GetPointPixelType", &OBJMeshIOJSBindingType::GetPointPixelType)
  .function("SetCellPixelType", &OBJMeshIOJSBindingType::SetCellPixelType)
  .function("GetCellPixelType", &OBJMeshIOJSBindingType::GetCellPixelType)
  .function("SetFileType", &OBJMeshIOJSBindingType::SetFileType)
  .function("GetFileType", &OBJMeshIOJSBindingType::GetFileType)
  .function("SetByteOrder", &OBJMeshIOJSBindingType::SetByteOrder)
  .function("GetByteOrder", &OBJMeshIOJSBindingType::GetByteOrder)
  .function("SetPointComponentType", &OBJMeshIOJSBindingType::SetPointComponentType)
  .function("GetPointComponentType", &OBJMeshIOJSBindingType::GetPointComponentType)
  .function("SetCellComponentType", &OBJMeshIOJSBindingType::SetCellComponentType)
  .function("GetCellComponentType", &OBJMeshIOJSBindingType::GetCellComponentType)
  .function("SetPointPixelComponentType", &OBJMeshIOJSBindingType::SetPointPixelComponentType)
  .function("GetPointPixelComponentType", &OBJMeshIOJSBindingType::GetPointPixelComponentType)
  .function("SetCellPixelComponentType", &OBJMeshIOJSBindingType::SetCellPixelComponentType)
  .function("GetCellPixelComponentType", &OBJMeshIOJSBindingType::GetCellPixelComponentType)
  .function("SetNumberOfPointPixelComponents", &OBJMeshIOJSBindingType::SetNumberOfPointPixelComponents)
  .function("GetNumberOfPointPixelComponents", &OBJMeshIOJSBindingType::GetNumberOfPointPixelComponents)
  .function("SetNumberOfCellPixelComponents", &OBJMeshIOJSBindingType::SetNumberOfCellPixelComponents)
  .function("GetNumberOfCellPixelComponents", &OBJMeshIOJSBindingType::GetNumberOfCellPixelComponents)
  .function("SetPointDimension", &OBJMeshIOJSBindingType::SetPointDimension)
  .function("GetPointDimension", &OBJMeshIOJSBindingType::GetPointDimension)
  .function("SetNumberOfPoints", &OBJMeshIOJSBindingType::SetNumberOfPoints)
  .function("GetNumberOfPoints", &OBJMeshIOJSBindingType::GetNumberOfPoints)
  .function("SetNumberOfCells", &OBJMeshIOJSBindingType::SetNumberOfCells)
  .function("GetNumberOfCells", &OBJMeshIOJSBindingType::GetNumberOfCells)
  .function("SetNumberOfPointPixels", &OBJMeshIOJSBindingType::SetNumberOfPointPixels)
  .function("GetNumberOfPointPixels", &OBJMeshIOJSBindingType::GetNumberOfPointPixels)
  .function("SetNumberOfCellPixels", &OBJMeshIOJSBindingType::SetNumberOfCellPixels)
  .function("GetNumberOfCellPixels", &OBJMeshIOJSBindingType::GetNumberOfCellPixels)
  .function("SetCellBufferSize", &OBJMeshIOJSBindingType::SetCellBufferSize)
  .function("GetCellBufferSize", &OBJMeshIOJSBindingType::GetCellBufferSize)
  .function("SetUpdatePoints", &OBJMeshIOJSBindingType::SetUpdatePoints)
  .function("SetUpdatePointData", &OBJMeshIOJSBindingType::SetUpdatePointData)
  .function("SetUpdateCells", &OBJMeshIOJSBindingType::SetUpdateCells)
  .function("SetUpdateCellData", &OBJMeshIOJSBindingType::SetUpdateCellData)
  .function("WriteMeshInformation", &OBJMeshIOJSBindingType::WriteMeshInformation)
  .function("ReadPoints", &OBJMeshIOJSBindingType::ReadPoints)
  .function("ReadCells", &OBJMeshIOJSBindingType::ReadCells)
  .function("ReadPointData", &OBJMeshIOJSBindingType::ReadPointData)
  .function("ReadCellData", &OBJMeshIOJSBindingType::ReadCellData)
  .function("WritePoints", &OBJMeshIOJSBindingType::WritePoints)
  .function("WriteCells", &OBJMeshIOJSBindingType::WriteCells)
  .function("WritePointData", &OBJMeshIOJSBindingType::WritePointData)
  .function("WriteCellData", &OBJMeshIOJSBindingType::WriteCellData)
  .function("Write", &OBJMeshIOJSBindingType::Write)
  .function("SetUseCompression", &OBJMeshIOJSBindingType::SetUseCompression)
  ;
  emscripten::class_<OBJMeshIOJSBinding, emscripten::base<OBJMeshIOJSBindingType>>("ITKMeshIO")
  .constructor<>()
  .function("ReadMeshInformation", &OBJMeshIOJSBinding::ReadMeshInformation)
  ;
}
