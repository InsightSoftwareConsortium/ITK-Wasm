/*=========================================================================
 *
 *  Copyright NumFOCUS
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
    .value("UNKNOWNPIXELTYPE", itk::CommonEnums::IOPixel::UNKNOWNPIXELTYPE)
    .value("SCALAR", itk::CommonEnums::IOPixel::SCALAR)
    .value("RGB", itk::CommonEnums::IOPixel::RGB)
    .value("RGBA", itk::CommonEnums::IOPixel::RGBA)
    .value("OFFSET", itk::CommonEnums::IOPixel::OFFSET)
    .value("VECTOR", itk::CommonEnums::IOPixel::VECTOR)
    .value("POINT", itk::CommonEnums::IOPixel::POINT)
    .value("COVARIANTVECTOR", itk::CommonEnums::IOPixel::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::CommonEnums::IOPixel::SYMMETRICSECONDRANKTENSOR)
    .value("DIFFUSIONTENSOR3D", itk::CommonEnums::IOPixel::DIFFUSIONTENSOR3D)
    .value("FIXEDARRAY", itk::CommonEnums::IOPixel::ARRAY)
    .value("COMPLEX", itk::CommonEnums::IOPixel::COMPLEX)
    .value("FIXEDARRAY", itk::CommonEnums::IOPixel::FIXEDARRAY)
    .value("MATRIX", itk::CommonEnums::IOPixel::MATRIX)
    .value("VARIABLELENGTHVECTOR", itk::CommonEnums::IOPixel::VARIABLELENGTHVECTOR)
    .value("VARIABLESIZEMATRIX", itk::CommonEnums::IOPixel::VARIABLESIZEMATRIX)
    ;
  emscripten::enum_<VTKImageIOJSBindingType::IOComponentType>("IOComponentType")
    .value("UNKNOWNCOMPONENTTYPE", itk::CommonEnums::IOComponent::UNKNOWNCOMPONENTTYPE)
    .value("UCHAR", itk::CommonEnums::IOComponent::UCHAR)
    .value("CHAR", itk::CommonEnums::IOComponent::CHAR)
    .value("USHORT", itk::CommonEnums::IOComponent::USHORT)
    .value("SHORT", itk::CommonEnums::IOComponent::SHORT)
    .value("UINT", itk::CommonEnums::IOComponent::UINT)
    .value("INT", itk::CommonEnums::IOComponent::INT)
    .value("ULONG", itk::CommonEnums::IOComponent::ULONG)
    .value("LONG", itk::CommonEnums::IOComponent::LONG)
    .value("ULONGLONG", itk::CommonEnums::IOComponent::ULONGLONG)
    .value("LONGLONG", itk::CommonEnums::IOComponent::LONGLONG)
    .value("FLOAT", itk::CommonEnums::IOComponent::FLOAT)
    .value("DOUBLE", itk::CommonEnums::IOComponent::DOUBLE)
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
