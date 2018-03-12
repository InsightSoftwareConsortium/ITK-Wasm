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

#include "itkLSMImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::LSMImageIO > LSMImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_lsm_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<LSMImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<LSMImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<LSMImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &LSMImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &LSMImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &LSMImageIOJSBindingType::SetFileName)
  .function("GetFileName", &LSMImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &LSMImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &LSMImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &LSMImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &LSMImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &LSMImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &LSMImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &LSMImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &LSMImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &LSMImageIOJSBindingType::SetDirection)
  .function("GetDirection", &LSMImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &LSMImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &LSMImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &LSMImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &LSMImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &LSMImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &LSMImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &LSMImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &LSMImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &LSMImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &LSMImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &LSMImageIOJSBindingType::Read)
  ;
}
