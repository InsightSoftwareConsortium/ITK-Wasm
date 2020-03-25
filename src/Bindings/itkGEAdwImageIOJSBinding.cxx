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

#include "itkGEAdwImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::GEAdwImageIO > GEAdwImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_geadw_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<GEAdwImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<GEAdwImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<GEAdwImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &GEAdwImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &GEAdwImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &GEAdwImageIOJSBindingType::SetFileName)
  .function("GetFileName", &GEAdwImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &GEAdwImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &GEAdwImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &GEAdwImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &GEAdwImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &GEAdwImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &GEAdwImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &GEAdwImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &GEAdwImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &GEAdwImageIOJSBindingType::SetDirection)
  .function("GetDirection", &GEAdwImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &GEAdwImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &GEAdwImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &GEAdwImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &GEAdwImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &GEAdwImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &GEAdwImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &GEAdwImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &GEAdwImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &GEAdwImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &GEAdwImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &GEAdwImageIOJSBindingType::Read)
  ;
}
