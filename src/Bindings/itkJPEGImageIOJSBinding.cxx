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

#include "itkJPEGImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::JPEGImageIO > JPEGImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_jpeg_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<JPEGImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<JPEGImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<JPEGImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &JPEGImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &JPEGImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &JPEGImageIOJSBindingType::SetFileName)
  .function("GetFileName", &JPEGImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &JPEGImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &JPEGImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &JPEGImageIOJSBindingType::ReadImageInformation)
  .function("WriteImageInformation", &JPEGImageIOJSBindingType::WriteImageInformation)
  .function("SetDimensions", &JPEGImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &JPEGImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &JPEGImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &JPEGImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &JPEGImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &JPEGImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &JPEGImageIOJSBindingType::SetDirection)
  .function("GetDirection", &JPEGImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &JPEGImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &JPEGImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &JPEGImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &JPEGImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &JPEGImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &JPEGImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &JPEGImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &JPEGImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &JPEGImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &JPEGImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &JPEGImageIOJSBindingType::Read)
  .function("Write", &JPEGImageIOJSBindingType::Write)
  .function("SetUseCompression", &JPEGImageIOJSBindingType::SetUseCompression)
  ;
}
