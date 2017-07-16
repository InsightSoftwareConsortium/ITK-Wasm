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

#include "itkGEAdwImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::GEAdwImageIO > GEAdwImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_vtk_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<GEAdwImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<GEAdwImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<GEAdwImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &GEAdwImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &GEAdwImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &GEAdwImageIOJSBindingType::SetFileName)
  .function("GetFileName", &GEAdwImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &GEAdwImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &GEAdwImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &GEAdwImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &GEAdwImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &GEAdwImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &GEAdwImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &GEAdwImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &GEAdwImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &GEAdwImageIOJSBindingType::SetDirection)
  .function("GetDirection", &GEAdwImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &GEAdwImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &GEAdwImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &GEAdwImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &GEAdwImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &GEAdwImageIOJSBindingType::GetComponentType)
  .class_function("GetPixelTypeAsString", &GEAdwImageIOJSBindingType::GetPixelTypeAsString)
  .class_function("GetComponentTypeAsString", &GEAdwImageIOJSBindingType::GetComponentTypeAsString)
  .function("GetImageSizeInPixels", &GEAdwImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &GEAdwImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &GEAdwImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &GEAdwImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &GEAdwImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &GEAdwImageIOJSBindingType::Read)
  ;
}
