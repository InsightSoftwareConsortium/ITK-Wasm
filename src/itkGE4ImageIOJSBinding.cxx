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

#include "itkGE4ImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::GE4ImageIO > GE4ImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_ge4_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<GE4ImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<GE4ImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<GE4ImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &GE4ImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &GE4ImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &GE4ImageIOJSBindingType::SetFileName)
  .function("GetFileName", &GE4ImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &GE4ImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &GE4ImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &GE4ImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &GE4ImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &GE4ImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &GE4ImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &GE4ImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &GE4ImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &GE4ImageIOJSBindingType::SetDirection)
  .function("GetDirection", &GE4ImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &GE4ImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &GE4ImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &GE4ImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &GE4ImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &GE4ImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &GE4ImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &GE4ImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &GE4ImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &GE4ImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &GE4ImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &GE4ImageIOJSBindingType::Read)
  ;
}
