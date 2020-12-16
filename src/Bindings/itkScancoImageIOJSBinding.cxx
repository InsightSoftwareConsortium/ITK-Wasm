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

#include "itkScancoImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::ScancoImageIO > ScancoImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_scanco_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<ScancoImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<ScancoImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<ScancoImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &ScancoImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &ScancoImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &ScancoImageIOJSBindingType::SetFileName)
  .function("GetFileName", &ScancoImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &ScancoImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &ScancoImageIOJSBindingType::ReadImageInformation)
  .function("WriteImageInformation", &ScancoImageIOJSBindingType::WriteImageInformation)
  .function("SetDimensions", &ScancoImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &ScancoImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &ScancoImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &ScancoImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &ScancoImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &ScancoImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &ScancoImageIOJSBindingType::SetDirection)
  .function("GetDirection", &ScancoImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &ScancoImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &ScancoImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &ScancoImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &ScancoImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &ScancoImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &ScancoImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &ScancoImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &ScancoImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &ScancoImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &ScancoImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &ScancoImageIOJSBindingType::Read)
  ;
}
