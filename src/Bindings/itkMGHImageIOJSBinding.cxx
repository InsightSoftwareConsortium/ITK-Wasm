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

#include "itkMGHImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::MGHImageIO > MGHImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_mgh_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<MGHImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<MGHImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<MGHImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &MGHImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &MGHImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &MGHImageIOJSBindingType::SetFileName)
  .function("GetFileName", &MGHImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &MGHImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &MGHImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &MGHImageIOJSBindingType::ReadImageInformation)
  .function("WriteImageInformation", &MGHImageIOJSBindingType::WriteImageInformation)
  .function("SetDimensions", &MGHImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &MGHImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &MGHImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &MGHImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &MGHImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &MGHImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &MGHImageIOJSBindingType::SetDirection)
  .function("GetDirection", &MGHImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &MGHImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &MGHImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &MGHImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &MGHImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &MGHImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &MGHImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &MGHImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &MGHImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &MGHImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &MGHImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &MGHImageIOJSBindingType::Read)
  .function("Write", &MGHImageIOJSBindingType::Write)
  .function("SetUseCompression", &MGHImageIOJSBindingType::SetUseCompression)
  ;
}
