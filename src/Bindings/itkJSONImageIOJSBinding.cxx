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

#include "itkJSONImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::JSONImageIO > JSONImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_json_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<JSONImageIOJSBindingType::IOPixelType>("IOPixelType")
    .value("UNKNOWNPIXELTYPE", itk::ImageIOBase::UNKNOWNPIXELTYPE)
    .value("SCALAR", itk::ImageIOBase::SCALAR)
    .value("RGB", itk::ImageIOBase::RGB)
    .value("RGBA", itk::ImageIOBase::RGBA)
    .value("OFFSET", itk::ImageIOBase::OFFSET)
    .value("VECTOR", itk::ImageIOBase::VECTOR)
    .value("POINT", itk::ImageIOBase::POINT)
    .value("COVARIANTVECTOR", itk::ImageIOBase::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::ImageIOBase::SYMMETRICSECONDRANKTENSOR)
    .value("DIFFUSIONTENSOR3D", itk::ImageIOBase::DIFFUSIONTENSOR3D)
    .value("COMPLEX", itk::ImageIOBase::COMPLEX)
    .value("FIXEDARRAY", itk::ImageIOBase::FIXEDARRAY)
    .value("MATRIX", itk::ImageIOBase::MATRIX)
    ;
  emscripten::enum_<JSONImageIOJSBindingType::IOComponentType>("IOComponentType")
    .value("UNKNOWNCOMPONENTTYPE", itk::ImageIOBase::UNKNOWNCOMPONENTTYPE)
    .value("UCHAR", itk::ImageIOBase::UCHAR)
    .value("CHAR", itk::ImageIOBase::CHAR)
    .value("USHORT", itk::ImageIOBase::USHORT)
    .value("SHORT", itk::ImageIOBase::SHORT)
    .value("UINT", itk::ImageIOBase::UINT)
    .value("INT", itk::ImageIOBase::INT)
    .value("ULONG", itk::ImageIOBase::ULONG)
    .value("LONG", itk::ImageIOBase::LONG)
    .value("ULONGLONG", itk::ImageIOBase::ULONGLONG)
    .value("LONGLONG", itk::ImageIOBase::LONGLONG)
    .value("FLOAT", itk::ImageIOBase::FLOAT)
    .value("DOUBLE", itk::ImageIOBase::DOUBLE)
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
