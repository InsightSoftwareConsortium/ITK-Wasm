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

#include "itkGDCMImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::GDCMImageIO > GDCMImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_gdcm_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<GDCMImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<GDCMImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<GDCMImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &GDCMImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &GDCMImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &GDCMImageIOJSBindingType::SetFileName)
  .function("GetFileName", &GDCMImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &GDCMImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &GDCMImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &GDCMImageIOJSBindingType::ReadImageInformation)
  .function("WriteImageInformation", &GDCMImageIOJSBindingType::WriteImageInformation)
  .function("SetDimensions", &GDCMImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &GDCMImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &GDCMImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &GDCMImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &GDCMImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &GDCMImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &GDCMImageIOJSBindingType::SetDirection)
  .function("GetDirection", &GDCMImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &GDCMImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &GDCMImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &GDCMImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &GDCMImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &GDCMImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &GDCMImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &GDCMImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &GDCMImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &GDCMImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &GDCMImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &GDCMImageIOJSBindingType::Read)
  ;
}
