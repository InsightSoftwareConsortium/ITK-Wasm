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

#include "itkPNGImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::PNGImageIO > PNGImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_png_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<PNGImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<PNGImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<PNGImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &PNGImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &PNGImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &PNGImageIOJSBindingType::SetFileName)
  .function("GetFileName", &PNGImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &PNGImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &PNGImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &PNGImageIOJSBindingType::ReadImageInformation)
  .function("WriteImageInformation", &PNGImageIOJSBindingType::WriteImageInformation)
  .function("SetDimensions", &PNGImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &PNGImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &PNGImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &PNGImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &PNGImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &PNGImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &PNGImageIOJSBindingType::SetDirection)
  .function("GetDirection", &PNGImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &PNGImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &PNGImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &PNGImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &PNGImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &PNGImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &PNGImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &PNGImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &PNGImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &PNGImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &PNGImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &PNGImageIOJSBindingType::Read)
  .function("Write", &PNGImageIOJSBindingType::Write)
  .function("SetUseCompression", &PNGImageIOJSBindingType::SetUseCompression)
  ;
}
