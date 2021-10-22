/*=========================================================================
 *
 *  Copyright NumFOCUS
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

#include "itkJSONImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::JSONImageIO > JSONImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_wasm_json_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<JSONImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<JSONImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<JSONImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &JSONImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &JSONImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &JSONImageIOJSBindingType::SetFileName)
  .function("GetFileName", &JSONImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &JSONImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &JSONImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &JSONImageIOJSBindingType::ReadImageInformation)
  .function("WriteImageInformation", &JSONImageIOJSBindingType::WriteImageInformation)
  .function("SetDimensions", &JSONImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &JSONImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &JSONImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &JSONImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &JSONImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &JSONImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &JSONImageIOJSBindingType::SetDirection)
  .function("GetDirection", &JSONImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &JSONImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &JSONImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &JSONImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &JSONImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &JSONImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &JSONImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &JSONImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &JSONImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &JSONImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &JSONImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &JSONImageIOJSBindingType::Read)
  .function("Write", &JSONImageIOJSBindingType::Write)
  .function("SetUseCompression", &JSONImageIOJSBindingType::SetUseCompression)
  ;
}
