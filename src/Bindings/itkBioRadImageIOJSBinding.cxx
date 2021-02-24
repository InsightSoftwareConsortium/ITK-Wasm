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
    .value("FIXEDARRAY", itk::CommonEnums::IOPixel::ARRAY)
    .value("COMPLEX", itk::CommonEnums::IOPixel::COMPLEX)
    .value("FIXEDARRAY", itk::CommonEnums::IOPixel::FIXEDARRAY)
    .value("MATRIX", itk::CommonEnums::IOPixel::MATRIX)
    .value("VARIABLELENGTHVECTOR", itk::CommonEnums::IOPixel::VARIABLELENGTHVECTOR)
    .value("VARIABLESIZEMATRIX", itk::CommonEnums::IOPixel::VARIABLESIZEMATRIX)
    ;
  emscripten::enum_<BioRadImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  .function("WriteImageInformation", &BioRadImageIOJSBindingType::WriteImageInformation)
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
