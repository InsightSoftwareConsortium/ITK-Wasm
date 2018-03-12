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

#include "itkVTKImageIO.h"

#include "itkImageIOBaseJSBinding.h"

typedef itk::ImageIOBaseJSBinding< itk::VTKImageIO > VTKImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_vtk_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<VTKImageIOJSBindingType::IOPixelType>("IOPixelType")
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
  emscripten::enum_<VTKImageIOJSBindingType::IOComponentType>("IOComponentType")
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
  emscripten::class_<VTKImageIOJSBindingType>("ITKImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &VTKImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &VTKImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &VTKImageIOJSBindingType::SetFileName)
  .function("GetFileName", &VTKImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &VTKImageIOJSBindingType::CanReadFile)
  .function("CanWriteFile", &VTKImageIOJSBindingType::CanWriteFile)
  .function("ReadImageInformation", &VTKImageIOJSBindingType::ReadImageInformation)
  .function("WriteImageInformation", &VTKImageIOJSBindingType::WriteImageInformation)
  .function("SetDimensions", &VTKImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &VTKImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &VTKImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &VTKImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &VTKImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &VTKImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &VTKImageIOJSBindingType::SetDirection)
  .function("GetDirection", &VTKImageIOJSBindingType::GetDirection)
  .function("GetDefaultDirection", &VTKImageIOJSBindingType::GetDefaultDirection)
  .function("SetPixelType", &VTKImageIOJSBindingType::SetPixelType)
  .function("GetPixelType", &VTKImageIOJSBindingType::GetPixelType)
  .function("SetComponentType", &VTKImageIOJSBindingType::SetComponentType)
  .function("GetComponentType", &VTKImageIOJSBindingType::GetComponentType)
  .function("GetImageSizeInPixels", &VTKImageIOJSBindingType::GetImageSizeInPixels)
  .function("GetImageSizeInBytes", &VTKImageIOJSBindingType::GetImageSizeInBytes)
  .function("GetImageSizeInComponents", &VTKImageIOJSBindingType::GetImageSizeInComponents)
  .function("SetNumberOfComponents", &VTKImageIOJSBindingType::SetNumberOfComponents)
  .function("GetNumberOfComponents", &VTKImageIOJSBindingType::GetNumberOfComponents)
  .function("Read", &VTKImageIOJSBindingType::Read)
  .function("Write", &VTKImageIOJSBindingType::Write)
  .function("SetUseCompression", &VTKImageIOJSBindingType::SetUseCompression)
  ;
}
