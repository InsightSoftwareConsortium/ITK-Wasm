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

#include "itkPNGImageIO.h"

#include "itkNodeJSEmscriptenJSBinding.h"
#include "itkImageIOBaseJSBinding.h"

itkNodeJSEmscriptenJSBindingMacro();

typedef itk::ImageIOBaseJSBinding< itk::PNGImageIO > PNGImageIOJSBindingType;

EMSCRIPTEN_BINDINGS(itk_png_image_io_js_binding) {
  emscripten::register_vector<double>("AxisDirectionType");
  emscripten::enum_<PNGImageIOJSBindingType::IOPixelType>("IOPixelType")
    .value("UNKNOWNPIXELTYPE", PNGImageIOJSBindingType::UNKNOWNPIXELTYPE)
    .value("SCALAR", PNGImageIOJSBindingType::SCALAR)
    .value("RGB", PNGImageIOJSBindingType::RGB)
    .value("RGBA", PNGImageIOJSBindingType::RGBA)
    .value("OFFSET", PNGImageIOJSBindingType::OFFSET)
    .value("VECTOR", PNGImageIOJSBindingType::VECTOR)
    .value("POINT", PNGImageIOJSBindingType::POINT)
    .value("COVARIANTVECTOR", PNGImageIOJSBindingType::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", PNGImageIOJSBindingType::SYMMETRICSECONDRANKTENSOR)
    .value("POINT", PNGImageIOJSBindingType::POINT)
    .value("COVARIANTVECTOR", PNGImageIOJSBindingType::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", PNGImageIOJSBindingType::SYMMETRICSECONDRANKTENSOR)
    .value("DIFFUSIONTENSOR3D", PNGImageIOJSBindingType::DIFFUSIONTENSOR3D)
    .value("COMPLEX", PNGImageIOJSBindingType::COMPLEX)
    .value("FIXEDARRAY", PNGImageIOJSBindingType::FIXEDARRAY)
    .value("MATRIX", PNGImageIOJSBindingType::MATRIX)
    ;
  emscripten::enum_<PNGImageIOJSBindingType::IOComponentType>("IOComponentType")
    .value("UNKNOWNCOMPONENTTYPE", PNGImageIOJSBindingType::UNKNOWNCOMPONENTTYPE)
    .value("UCHAR", PNGImageIOJSBindingType::UCHAR)
    .value("CHAR", PNGImageIOJSBindingType::CHAR)
    .value("USHORT", PNGImageIOJSBindingType::USHORT)
    .value("SHORT", PNGImageIOJSBindingType::SHORT)
    .value("UINT", PNGImageIOJSBindingType::UINT)
    .value("INT", PNGImageIOJSBindingType::INT)
    .value("ULONG", PNGImageIOJSBindingType::ULONG)
    .value("LONG", PNGImageIOJSBindingType::LONG)
    .value("FLOAT", PNGImageIOJSBindingType::FLOAT)
    .value("DOUBLE", PNGImageIOJSBindingType::DOUBLE)
    ;
  emscripten::class_<PNGImageIOJSBindingType>("itkPNGImageIO")
  .constructor<>()
  .function("SetNumberOfDimensions", &PNGImageIOJSBindingType::SetNumberOfDimensions)
  .function("GetNumberOfDimensions", &PNGImageIOJSBindingType::GetNumberOfDimensions)
  .function("SetFileName", &PNGImageIOJSBindingType::SetFileName)
  .function("GetFileName", &PNGImageIOJSBindingType::GetFileName)
  .function("CanReadFile", &PNGImageIOJSBindingType::CanReadFile)
  .function("ReadImageInformation", &PNGImageIOJSBindingType::ReadImageInformation)
  .function("SetDimensions", &PNGImageIOJSBindingType::SetDimensions)
  .function("GetDimensions", &PNGImageIOJSBindingType::GetDimensions)
  .function("SetOrigin", &PNGImageIOJSBindingType::SetOrigin)
  .function("GetOrigin", &PNGImageIOJSBindingType::GetOrigin)
  .function("SetSpacing", &PNGImageIOJSBindingType::SetSpacing)
  .function("GetSpacing", &PNGImageIOJSBindingType::GetSpacing)
  .function("SetDirection", &PNGImageIOJSBindingType::SetDirection)
  .function("GetDirection", &PNGImageIOJSBindingType::GetDirection)
  ;
}
