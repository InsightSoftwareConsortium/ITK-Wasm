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

#include "itkNrrdImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::NrrdImageIO > NrrdImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_nrrd_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<NrrdImageIOJSBindingType::IOPixelType>("IOPixelType")
    .value("UNKNOWNPIXELTYPE", itk::ImageIOBase::UNKNOWNPIXELTYPE)
    .value("SCALAR", itk::ImageIOBase::SCALAR)
    .value("RGB", itk::ImageIOBase::RGB)
    .value("RGBA", itk::ImageIOBase::RGBA)
    .value("OFFSET", itk::ImageIOBase::OFFSET)
    .value("VECTOR", itk::ImageIOBase::VECTOR)
    .value("POINT", itk::ImageIOBase::POINT)
    .value("COVARIANTVECTOR", itk::ImageIOBase::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::ImageIOBase::SYMMETRICSECONDRANKTENSOR)
    .value("DIFFUSIONTENSOR3D", itk::ImageIOBase::DIFFUSIONTENSOR3D)
    .value("COMPLEX", itk::ImageIOBase::COMPLEX)
    .value("FIXEDARRAY", itk::ImageIOBase::FIXEDARRAY)
    .value("MATRIX", itk::ImageIOBase::MATRIX)
    ;
  emscripten::enum_<NrrdImageIOJSBindingType::IOComponentType>("IOComponentType")
    .value("UNKNOWNCOMPONENTTYPE", itk::ImageIOBase::UNKNOWNCOMPONENTTYPE)
    .value("UCHAR", itk::ImageIOBase::UCHAR)
    .value("CHAR", itk::ImageIOBase::CHAR)
    .value("USHORT", itk::ImageIOBase::USHORT)
    .value("SHORT", itk::ImageIOBase::SHORT)
    .value("UINT", itk::ImageIOBase::UINT)
    .value("INT", itk::ImageIOBase::INT)
    .value("ULONG", itk::ImageIOBase::ULONG)
    .value("LONG", itk::ImageIOBase::LONG)
    .value("ULONGLONG", itk::ImageIOBase::ULONGLONG)
    .value("LONGLONG", itk::ImageIOBase::LONGLONG)
    .value("FLOAT", itk::ImageIOBase::FLOAT)
    .value("DOUBLE", itk::ImageIOBase::DOUBLE)
    ;
  emscripten::class_<NrrdImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &NrrdImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &NrrdImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &NrrdImageIOJSBindingType::SetFileName)
  .function("GetFileName", &NrrdImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &NrrdImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &NrrdImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &NrrdImageIOJSBindingType::ReadImageInformation)
  .function("WriteImageInformation", &NrrdImageIOJSBindingType::WriteImageInformation)
  .function("SetDimensions", &NrrdImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &NrrdImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &NrrdImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &NrrdImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &NrrdImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &NrrdImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &NrrdImageIOJSBindingType::SetDirection)
  .function("GetDirection", &NrrdImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &NrrdImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &NrrdImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &NrrdImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &NrrdImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &NrrdImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &NrrdImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &NrrdImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &NrrdImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &NrrdImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &NrrdImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &NrrdImageIOJSBindingType::Read)
  .function("Write", &NrrdImageIOJSBindingType::Write)
  .function("SetUseCompression", &NrrdImageIOJSBindingType::SetUseCompression)
  .function("Write", &NrrdImageIOJSBindingType::Write)
  .function("SetUseCompression", &NrrdImageIOJSBindingType::SetUseCompression)
  ;
}
