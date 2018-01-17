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

#include "itkNiftiImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::NiftiImageIO > NiftiImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_nifti_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<NiftiImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<NiftiImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<NiftiImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &NiftiImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &NiftiImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &NiftiImageIOJSBindingType::SetFileName)
  .function("GetFileName", &NiftiImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &NiftiImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &NiftiImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &NiftiImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &NiftiImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &NiftiImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &NiftiImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &NiftiImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &NiftiImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &NiftiImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &NiftiImageIOJSBindingType::SetDirection)
  .function("GetDirection", &NiftiImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &NiftiImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &NiftiImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &NiftiImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &NiftiImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &NiftiImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &NiftiImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &NiftiImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &NiftiImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &NiftiImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &NiftiImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &NiftiImageIOJSBindingType::Read)
  .function("Write", &NiftiImageIOJSBindingType::Write)
  .function("SetUseCompression", &NiftiImageIOJSBindingType::SetUseCompression)
  ;
}
