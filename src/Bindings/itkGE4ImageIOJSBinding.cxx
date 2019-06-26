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

#include "itkGE4ImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::GE4ImageIO > GE4ImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_ge4_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<GE4ImageIOJSBindingType::IOPixelType>("IOPixelType")
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
    .value("MATRIX", itk::CommonEnums::IOPixel::MATRIX)
    ;
  emscripten::enum_<GE4ImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<GE4ImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &GE4ImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &GE4ImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &GE4ImageIOJSBindingType::SetFileName)
  .function("GetFileName", &GE4ImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &GE4ImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &GE4ImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &GE4ImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &GE4ImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &GE4ImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &GE4ImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &GE4ImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &GE4ImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &GE4ImageIOJSBindingType::SetDirection)
  .function("GetDirection", &GE4ImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &GE4ImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &GE4ImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &GE4ImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &GE4ImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &GE4ImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &GE4ImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &GE4ImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &GE4ImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &GE4ImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &GE4ImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &GE4ImageIOJSBindingType::Read)
  ;
}
