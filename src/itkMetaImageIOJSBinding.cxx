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

#include "itkMetaImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::MetaImageIO > MetaImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_meta_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<MetaImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<MetaImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<MetaImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &MetaImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &MetaImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &MetaImageIOJSBindingType::SetFileName)
  .function("GetFileName", &MetaImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &MetaImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &MetaImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &MetaImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &MetaImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &MetaImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &MetaImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &MetaImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &MetaImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &MetaImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &MetaImageIOJSBindingType::SetDirection)
  .function("GetDirection", &MetaImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &MetaImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &MetaImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &MetaImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &MetaImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &MetaImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &MetaImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &MetaImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &MetaImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &MetaImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &MetaImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &MetaImageIOJSBindingType::Read)
  .function("Write", &MetaImageIOJSBindingType::Write)
  .function("SetUseCompression", &MetaImageIOJSBindingType::SetUseCompression)
  ;
}
