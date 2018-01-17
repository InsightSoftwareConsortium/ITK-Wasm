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

#include "itkMGHImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::MGHImageIO > MGHImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_mgh_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<MGHImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<MGHImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<MGHImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &MGHImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &MGHImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &MGHImageIOJSBindingType::SetFileName)
  .function("GetFileName", &MGHImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &MGHImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &MGHImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &MGHImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &MGHImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &MGHImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &MGHImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &MGHImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &MGHImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &MGHImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &MGHImageIOJSBindingType::SetDirection)
  .function("GetDirection", &MGHImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &MGHImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &MGHImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &MGHImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &MGHImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &MGHImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &MGHImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &MGHImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &MGHImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &MGHImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &MGHImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &MGHImageIOJSBindingType::Read)
  .function("Write", &MGHImageIOJSBindingType::Write)
  .function("SetUseCompression", &MGHImageIOJSBindingType::SetUseCompression)
  ;
}
