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

#include "itkHDF5ImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::HDF5ImageIO > HDF5ImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_biorad_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<HDF5ImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<HDF5ImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<HDF5ImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &HDF5ImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &HDF5ImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &HDF5ImageIOJSBindingType::SetFileName)
  .function("GetFileName", &HDF5ImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &HDF5ImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &HDF5ImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &HDF5ImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &HDF5ImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &HDF5ImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &HDF5ImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &HDF5ImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &HDF5ImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &HDF5ImageIOJSBindingType::SetDirection)
  .function("GetDirection", &HDF5ImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &HDF5ImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &HDF5ImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &HDF5ImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &HDF5ImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &HDF5ImageIOJSBindingType::GetComponentType)
  .class_function("GetPixelTypeAsString", &HDF5ImageIOJSBindingType::GetPixelTypeAsString)
  .class_function("GetComponentTypeAsString", &HDF5ImageIOJSBindingType::GetComponentTypeAsString)
  .function("GetImageSizeInPixels", &HDF5ImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &HDF5ImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &HDF5ImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &HDF5ImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &HDF5ImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &HDF5ImageIOJSBindingType::Read)
  ;
}
