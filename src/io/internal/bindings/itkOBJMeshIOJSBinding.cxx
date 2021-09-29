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
    this->m_MeshIO->SetCellComponentType( itk::CommonEnums::IOComponent::INT );
    }
};

EMSCRIPTEN_BINDINGS(itk_obj_mesh_io_js_binding) {
  emscripten::enum_<OBJMeshIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<OBJMeshIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::enum_<OBJMeshIOJSBindingType::FileType>("FileType")
    .value("ASCII", itk::CommonEnums::IOFile::ASCII)
    .value("BINARY", itk::CommonEnums::IOFile::BINARY)
    .value("TYPENOTAPPLICABLE", itk::CommonEnums::IOFile::TYPENOTAPPLICABLE)
    ;
  emscripten::enum_<OBJMeshIOJSBindingType::ByteOrder>("ByteOrder")
    .value("BigEndian", itk::CommonEnums::IOByteOrder::BigEndian)
    .value("LittleEndian", itk::CommonEnums::IOByteOrder::LittleEndian)
    .value("OrderNotApplicable", itk::CommonEnums::IOByteOrder::OrderNotApplicable)
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
