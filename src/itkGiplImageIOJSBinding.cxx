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

#include "itkGiplImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::GiplImageIO > GiplImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_biorad_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<GiplImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<GiplImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<GiplImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &GiplImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &GiplImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &GiplImageIOJSBindingType::SetFileName)
  .function("GetFileName", &GiplImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &GiplImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &GiplImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &GiplImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &GiplImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &GiplImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &GiplImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &GiplImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &GiplImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &GiplImageIOJSBindingType::SetDirection)
  .function("GetDirection", &GiplImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &GiplImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &GiplImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &GiplImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &GiplImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &GiplImageIOJSBindingType::GetComponentType)
  .class_function("GetPixelTypeAsString", &GiplImageIOJSBindingType::GetPixelTypeAsString)
  .class_function("GetComponentTypeAsString", &GiplImageIOJSBindingType::GetComponentTypeAsString)
  .function("GetImageSizeInPixels", &GiplImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &GiplImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &GiplImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &GiplImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &GiplImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &GiplImageIOJSBindingType::Read)
  ;
}
