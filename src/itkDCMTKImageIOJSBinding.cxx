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

#include "itkDCMTKImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::DCMTKImageIO > DCMTKImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_gdcm_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<DCMTKImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<DCMTKImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<DCMTKImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &DCMTKImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &DCMTKImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &DCMTKImageIOJSBindingType::SetFileName)
  .function("GetFileName", &DCMTKImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &DCMTKImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &DCMTKImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &DCMTKImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &DCMTKImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &DCMTKImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &DCMTKImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &DCMTKImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &DCMTKImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &DCMTKImageIOJSBindingType::SetDirection)
  .function("GetDirection", &DCMTKImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &DCMTKImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &DCMTKImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &DCMTKImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &DCMTKImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &DCMTKImageIOJSBindingType::GetComponentType)
  .class_function("GetPixelTypeAsString", &DCMTKImageIOJSBindingType::GetPixelTypeAsString)
  .class_function("GetComponentTypeAsString", &DCMTKImageIOJSBindingType::GetComponentTypeAsString)
  .function("GetImageSizeInPixels", &DCMTKImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &DCMTKImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &DCMTKImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &DCMTKImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &DCMTKImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &DCMTKImageIOJSBindingType::Read)
  ;
}
