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

#include "itkFDFImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::FDFImageIO > FDFImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_fdf_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<FDFImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<FDFImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<FDFImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &FDFImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &FDFImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &FDFImageIOJSBindingType::SetFileName)
  .function("GetFileName", &FDFImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &FDFImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &FDFImageIOJSBindingType::ReadImageInformation)
  .function("WriteImageInformation", &FDFImageIOJSBindingType::WriteImageInformation)
  .function("SetDimensions", &FDFImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &FDFImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &FDFImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &FDFImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &FDFImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &FDFImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &FDFImageIOJSBindingType::SetDirection)
  .function("GetDirection", &FDFImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &FDFImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &FDFImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &FDFImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &FDFImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &FDFImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &FDFImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &FDFImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &FDFImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &FDFImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &FDFImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &FDFImageIOJSBindingType::Read)
  ;
}
