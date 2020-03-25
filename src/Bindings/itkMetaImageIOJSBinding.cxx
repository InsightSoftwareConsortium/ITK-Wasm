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

#include "itkMetaImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::MetaImageIO > MetaImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_meta_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<MetaImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<MetaImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<MetaImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &MetaImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &MetaImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &MetaImageIOJSBindingType::SetFileName)
  .function("GetFileName", &MetaImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &MetaImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &MetaImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &MetaImageIOJSBindingType::ReadImageInformation)
  .function("WriteImageInformation", &MetaImageIOJSBindingType::WriteImageInformation)
  .function("SetDimensions", &MetaImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &MetaImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &MetaImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &MetaImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &MetaImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &MetaImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &MetaImageIOJSBindingType::SetDirection)
  .function("GetDirection", &MetaImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &MetaImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &MetaImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &MetaImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &MetaImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &MetaImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &MetaImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &MetaImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &MetaImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &MetaImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &MetaImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &MetaImageIOJSBindingType::Read)
  .function("Write", &MetaImageIOJSBindingType::Write)
  .function("SetUseCompression", &MetaImageIOJSBindingType::SetUseCompression)
  ;
}
