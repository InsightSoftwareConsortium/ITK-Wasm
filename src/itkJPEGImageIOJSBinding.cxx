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

#include "itkJPEGImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::JPEGImageIO > JPEGImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_jpeg_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<JPEGImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<JPEGImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<JPEGImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &JPEGImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &JPEGImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &JPEGImageIOJSBindingType::SetFileName)
  .function("GetFileName", &JPEGImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &JPEGImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &JPEGImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &JPEGImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &JPEGImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &JPEGImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &JPEGImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &JPEGImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &JPEGImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &JPEGImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &JPEGImageIOJSBindingType::SetDirection)
  .function("GetDirection", &JPEGImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &JPEGImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &JPEGImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &JPEGImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &JPEGImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &JPEGImageIOJSBindingType::GetComponentType)
  .class_function("GetPixelTypeAsString", &JPEGImageIOJSBindingType::GetPixelTypeAsString)
  .class_function("GetComponentTypeAsString", &JPEGImageIOJSBindingType::GetComponentTypeAsString)
  .function("GetImageSizeInPixels", &JPEGImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &JPEGImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &JPEGImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &JPEGImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &JPEGImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &JPEGImageIOJSBindingType::Read)
  .function("Write", &JPEGImageIOJSBindingType::Write)
  .function("SetUseCompression", &JPEGImageIOJSBindingType::SetUseCompression)
  ;
}
