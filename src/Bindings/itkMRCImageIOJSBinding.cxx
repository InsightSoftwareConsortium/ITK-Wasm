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

#include "itkMRCImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::MRCImageIO > MRCImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_mrc_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<MRCImageIOJSBindingType::IOPixelType>("IOPixelType")
    .value("UNKNOWNPIXELTYPE", itk::ImageIOBase::UNKNOWNPIXELTYPE)
    .value("SCALAR", itk::ImageIOBase::SCALAR)
    .value("RGB", itk::ImageIOBase::RGB)
    .value("RGBA", itk::ImageIOBase::RGBA)
    .value("OFFSET", itk::ImageIOBase::OFFSET)
    .value("VECTOR", itk::ImageIOBase::VECTOR)
    .value("POINT", itk::ImageIOBase::POINT)
    .value("COVARIANTVECTOR", itk::ImageIOBase::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::ImageIOBase::SYMMETRICSECONDRANKTENSOR)
    .value("POINT", itk::ImageIOBase::POINT)
    .value("COVARIANTVECTOR", itk::ImageIOBase::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::ImageIOBase::SYMMETRICSECONDRANKTENSOR)
    .value("DIFFUSIONTENSOR3D", itk::ImageIOBase::DIFFUSIONTENSOR3D)
    .value("COMPLEX", itk::ImageIOBase::COMPLEX)
    .value("FIXEDARRAY", itk::ImageIOBase::FIXEDARRAY)
    .value("MATRIX", itk::ImageIOBase::MATRIX)
    ;
  emscripten::enum_<MRCImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<MRCImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &MRCImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &MRCImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &MRCImageIOJSBindingType::SetFileName)
  .function("GetFileName", &MRCImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &MRCImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &MRCImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &MRCImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &MRCImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &MRCImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &MRCImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &MRCImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &MRCImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &MRCImageIOJSBindingType::SetDirection)
  .function("GetDirection", &MRCImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &MRCImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &MRCImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &MRCImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &MRCImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &MRCImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &MRCImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &MRCImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &MRCImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &MRCImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &MRCImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &MRCImageIOJSBindingType::Read)
  ;
}
