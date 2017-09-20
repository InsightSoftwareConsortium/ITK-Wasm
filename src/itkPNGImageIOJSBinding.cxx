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

#include "itkPNGImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::PNGImageIO > PNGImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_png_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<PNGImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<PNGImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<PNGImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &PNGImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &PNGImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &PNGImageIOJSBindingType::SetFileName)
  .function("GetFileName", &PNGImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &PNGImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &PNGImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &PNGImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &PNGImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &PNGImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &PNGImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &PNGImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &PNGImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &PNGImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &PNGImageIOJSBindingType::SetDirection)
  .function("GetDirection", &PNGImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &PNGImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &PNGImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &PNGImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &PNGImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &PNGImageIOJSBindingType::GetComponentType)
  .class_function("GetPixelTypeAsString", &PNGImageIOJSBindingType::GetPixelTypeAsString)
  .class_function("GetComponentTypeAsString", &PNGImageIOJSBindingType::GetComponentTypeAsString)
  .function("GetImageSizeInPixels", &PNGImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &PNGImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &PNGImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &PNGImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &PNGImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &PNGImageIOJSBindingType::Read)
  .function("Write", &PNGImageIOJSBindingType::Write)
  .function("SetUseCompression", &PNGImageIOJSBindingType::SetUseCompression)
  ;
}
