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

#include "itkLSMImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::LSMImageIO > LSMImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_lsm_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<LSMImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<LSMImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<LSMImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &LSMImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &LSMImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &LSMImageIOJSBindingType::SetFileName)
  .function("GetFileName", &LSMImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &LSMImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &LSMImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &LSMImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &LSMImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &LSMImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &LSMImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &LSMImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &LSMImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &LSMImageIOJSBindingType::SetDirection)
  .function("GetDirection", &LSMImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &LSMImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &LSMImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &LSMImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &LSMImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &LSMImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &LSMImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &LSMImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &LSMImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &LSMImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &LSMImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &LSMImageIOJSBindingType::Read)
  ;
}
