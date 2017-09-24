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

#include "itkBioRadImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::BioRadImageIO > BioRadImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_biorad_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<BioRadImageIOJSBindingType::IOPixelType>("IOPixelType")
    .value("UNKNOWNPIXELTYPE", itk::ImageIOBase::UNKNOWNPIXELTYPE)
    .value("SCALAR", itk::ImageIOBase::SCALAR)
    .value("RGB", itk::ImageIOBase::RGB)
    .value("RGBA", itk::ImageIOBase::RGBA)
    .value("OFFSET", itk::ImageIOBase::OFFSET)
    .value("VECTOR", itk::ImageIOBase::VECTOR)
    .value("POINT", itk::ImageIOBase::POINT)
    .value("COVARIANTVECTOR", itk::ImageIOBase::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::ImageIOBase::SYMMETRICSECONDRANKTENSOR)
    .value("POINT", itk::ImageIOBase::POINT)
    .value("COVARIANTVECTOR", itk::ImageIOBase::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::ImageIOBase::SYMMETRICSECONDRANKTENSOR)
    .value("DIFFUSIONTENSOR3D", itk::ImageIOBase::DIFFUSIONTENSOR3D)
    .value("COMPLEX", itk::ImageIOBase::COMPLEX)
    .value("FIXEDARRAY", itk::ImageIOBase::FIXEDARRAY)
    .value("MATRIX", itk::ImageIOBase::MATRIX)
    ;
  emscripten::enum_<BioRadImageIOJSBindingType::IOComponentType>("IOComponentType")
    .value("UNKNOWNCOMPONENTTYPE", itk::ImageIOBase::UNKNOWNCOMPONENTTYPE)
    .value("UCHAR", itk::ImageIOBase::UCHAR)
    .value("CHAR", itk::ImageIOBase::CHAR)
    .value("USHORT", itk::ImageIOBase::USHORT)
    .value("SHORT", itk::ImageIOBase::SHORT)
    .value("UINT", itk::ImageIOBase::UINT)
    .value("INT", itk::ImageIOBase::INT)
    .value("ULONG", itk::ImageIOBase::ULONG)
    .value("LONG", itk::ImageIOBase::LONG)
    .value("FLOAT", itk::ImageIOBase::FLOAT)
    .value("DOUBLE", itk::ImageIOBase::DOUBLE)
    ;
  emscripten::class_<BioRadImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &BioRadImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &BioRadImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &BioRadImageIOJSBindingType::SetFileName)
  .function("GetFileName", &BioRadImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &BioRadImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &BioRadImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &BioRadImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &BioRadImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &BioRadImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &BioRadImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &BioRadImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &BioRadImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &BioRadImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &BioRadImageIOJSBindingType::SetDirection)
  .function("GetDirection", &BioRadImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &BioRadImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &BioRadImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &BioRadImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &BioRadImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &BioRadImageIOJSBindingType::GetComponentType)
  .class_function("GetPixelTypeAsString", &BioRadImageIOJSBindingType::GetPixelTypeAsString)
  .class_function("GetComponentTypeAsString", &BioRadImageIOJSBindingType::GetComponentTypeAsString)
  .function("GetImageSizeInPixels", &BioRadImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &BioRadImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &BioRadImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &BioRadImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &BioRadImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &BioRadImageIOJSBindingType::Read)
  .function("Write", &BioRadImageIOJSBindingType::Write)
  .function("SetUseCompression", &BioRadImageIOJSBindingType::SetUseCompression)
  ;
}
