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

#include "itkGDCMImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::GDCMImageIO > GDCMImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_gdcm_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<GDCMImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<GDCMImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<GDCMImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &GDCMImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &GDCMImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &GDCMImageIOJSBindingType::SetFileName)
  .function("GetFileName", &GDCMImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &GDCMImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &GDCMImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &GDCMImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &GDCMImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &GDCMImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &GDCMImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &GDCMImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &GDCMImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &GDCMImageIOJSBindingType::SetDirection)
  .function("GetDirection", &GDCMImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &GDCMImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &GDCMImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &GDCMImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &GDCMImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &GDCMImageIOJSBindingType::GetComponentType)
  .class_function("GetPixelTypeAsString", &GDCMImageIOJSBindingType::GetPixelTypeAsString)
  .class_function("GetComponentTypeAsString", &GDCMImageIOJSBindingType::GetComponentTypeAsString)
  .function("GetImageSizeInPixels", &GDCMImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &GDCMImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &GDCMImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &GDCMImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &GDCMImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &GDCMImageIOJSBindingType::Read)
  ;
}
