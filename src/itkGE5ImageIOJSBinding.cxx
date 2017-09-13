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

#include "itkGE5ImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::GE5ImageIO > GE5ImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_vtk_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<GE5ImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<GE5ImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<GE5ImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &GE5ImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &GE5ImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &GE5ImageIOJSBindingType::SetFileName)
  .function("GetFileName", &GE5ImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &GE5ImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &GE5ImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &GE5ImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &GE5ImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &GE5ImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &GE5ImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &GE5ImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &GE5ImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &GE5ImageIOJSBindingType::SetDirection)
  .function("GetDirection", &GE5ImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &GE5ImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &GE5ImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &GE5ImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &GE5ImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &GE5ImageIOJSBindingType::GetComponentType)
  .class_function("GetPixelTypeAsString", &GE5ImageIOJSBindingType::GetPixelTypeAsString)
  .class_function("GetComponentTypeAsString", &GE5ImageIOJSBindingType::GetComponentTypeAsString)
  .function("GetImageSizeInPixels", &GE5ImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &GE5ImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &GE5ImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &GE5ImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &GE5ImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &GE5ImageIOJSBindingType::Read)
  ;
}
