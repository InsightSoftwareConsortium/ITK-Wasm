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

#include "itkMINCImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::MINCImageIO > MINCImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_minc_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<MINCImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<MINCImageIOJSBindingType::IOComponentType>("IOComponentType")
    .value("UNKNOWNCOMPONENTTYPE", itk::ImageIOBase::UNKNOWNCOMPONENTTYPE)
    .value("UCHAR", itk::ImageIOBase::UCHAR)
    .value("CHAR", itk::ImageIOBase::CHAR)
    .value("USHORT", itk::ImageIOBase::USHORT)
    .value("SHORT", itk::ImageIOBase::SHORT)
    .value("UINT", itk::ImageIOBase::UINT)
    .value("INT", itk::ImageIOBase::INT)
    .value("ULONG", itk::ImageIOBase::ULONG)
    .value("LONG", itk::ImageIOBase::LONG)
    .value("FLOAT", itk::ImageIOBase::FLOAT)
    .value("DOUBLE", itk::ImageIOBase::DOUBLE)
    ;
  emscripten::class_<MINCImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &MINCImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &MINCImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &MINCImageIOJSBindingType::SetFileName)
  .function("GetFileName", &MINCImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &MINCImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &MINCImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &MINCImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &MINCImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &MINCImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &MINCImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &MINCImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &MINCImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &MINCImageIOJSBindingType::SetDirection)
  .function("GetDirection", &MINCImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &MINCImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &MINCImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &MINCImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &MINCImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &MINCImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &MINCImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &MINCImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &MINCImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &MINCImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &MINCImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &MINCImageIOJSBindingType::Read)
  ;
}
