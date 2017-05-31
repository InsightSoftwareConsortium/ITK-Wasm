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

#include "itkBMPImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::BMPImageIO > BMPImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_bmp_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<BMPImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<BMPImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<BMPImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &BMPImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &BMPImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &BMPImageIOJSBindingType::SetFileName)
  .function("GetFileName", &BMPImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &BMPImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &BMPImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &BMPImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &BMPImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &BMPImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &BMPImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &BMPImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &BMPImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &BMPImageIOJSBindingType::SetDirection)
  .function("GetDirection", &BMPImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &BMPImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &BMPImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &BMPImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &BMPImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &BMPImageIOJSBindingType::GetComponentType)
  .class_function("GetPixelTypeAsString", &BMPImageIOJSBindingType::GetPixelTypeAsString)
  .class_function("GetComponentTypeAsString", &BMPImageIOJSBindingType::GetComponentTypeAsString)
  .function("GetImageSizeInPixels", &BMPImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &BMPImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &BMPImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &BMPImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &BMPImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &BMPImageIOJSBindingType::Read)
  ;
}
