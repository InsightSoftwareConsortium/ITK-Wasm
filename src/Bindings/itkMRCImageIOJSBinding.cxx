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

#include "itkMRCImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::MRCImageIO > MRCImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_mrc_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<MRCImageIOJSBindingType::IOPixelType>("IOPixelType")
    .value("UNKNOWNPIXELTYPE", itk::CommonEnums::IOPixel::UNKNOWNPIXELTYPE)
    .value("SCALAR", itk::CommonEnums::IOPixel::SCALAR)
    .value("RGB", itk::CommonEnums::IOPixel::RGB)
    .value("RGBA", itk::CommonEnums::IOPixel::RGBA)
    .value("OFFSET", itk::CommonEnums::IOPixel::OFFSET)
    .value("VECTOR", itk::CommonEnums::IOPixel::VECTOR)
    .value("POINT", itk::CommonEnums::IOPixel::POINT)
    .value("COVARIANTVECTOR", itk::CommonEnums::IOPixel::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::CommonEnums::IOPixel::SYMMETRICSECONDRANKTENSOR)
    .value("POINT", itk::CommonEnums::IOPixel::POINT)
    .value("COVARIANTVECTOR", itk::CommonEnums::IOPixel::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::CommonEnums::IOPixel::SYMMETRICSECONDRANKTENSOR)
    .value("DIFFUSIONTENSOR3D", itk::CommonEnums::IOPixel::DIFFUSIONTENSOR3D)
    .value("COMPLEX", itk::CommonEnums::IOPixel::COMPLEX)
    .value("FIXEDARRAY", itk::CommonEnums::IOPixel::FIXEDARRAY)
    .value("MATRIX", itk::CommonEnums::IOPixel::MATRIX)
    ;
  emscripten::enum_<MRCImageIOJSBindingType::IOComponentType>("IOComponentType")
    .value("UNKNOWNCOMPONENTTYPE", itk::CommonEnums::IOComponent::UNKNOWNCOMPONENTTYPE)
    .value("UCHAR", itk::CommonEnums::IOComponent::UCHAR)
    .value("CHAR", itk::CommonEnums::IOComponent::CHAR)
    .value("USHORT", itk::CommonEnums::IOComponent::USHORT)
    .value("SHORT", itk::CommonEnums::IOComponent::SHORT)
    .value("UINT", itk::CommonEnums::IOComponent::UINT)
    .value("INT", itk::CommonEnums::IOComponent::INT)
    .value("ULONG", itk::CommonEnums::IOComponent::ULONG)
    .value("LONG", itk::CommonEnums::IOComponent::LONG)
    .value("FLOAT", itk::CommonEnums::IOComponent::FLOAT)
    .value("DOUBLE", itk::CommonEnums::IOComponent::DOUBLE)
    ;
  emscripten::class_<MRCImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &MRCImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &MRCImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &MRCImageIOJSBindingType::SetFileName)
  .function("GetFileName", &MRCImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &MRCImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &MRCImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &MRCImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &MRCImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &MRCImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &MRCImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &MRCImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &MRCImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &MRCImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &MRCImageIOJSBindingType::SetDirection)
  .function("GetDirection", &MRCImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &MRCImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &MRCImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &MRCImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &MRCImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &MRCImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &MRCImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &MRCImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &MRCImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &MRCImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &MRCImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &MRCImageIOJSBindingType::Read)
  ;
}
