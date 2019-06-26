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

#include "itkNiftiImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::NiftiImageIO > NiftiImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_nifti_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<NiftiImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<NiftiImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<NiftiImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &NiftiImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &NiftiImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &NiftiImageIOJSBindingType::SetFileName)
  .function("GetFileName", &NiftiImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &NiftiImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &NiftiImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &NiftiImageIOJSBindingType::ReadImageInformation)
  .function("WriteImageInformation", &NiftiImageIOJSBindingType::WriteImageInformation)
  .function("SetDimensions", &NiftiImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &NiftiImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &NiftiImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &NiftiImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &NiftiImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &NiftiImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &NiftiImageIOJSBindingType::SetDirection)
  .function("GetDirection", &NiftiImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &NiftiImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &NiftiImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &NiftiImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &NiftiImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &NiftiImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &NiftiImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &NiftiImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &NiftiImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &NiftiImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &NiftiImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &NiftiImageIOJSBindingType::Read)
  .function("Write", &NiftiImageIOJSBindingType::Write)
  .function("SetUseCompression", &NiftiImageIOJSBindingType::SetUseCompression)
  ;
}
