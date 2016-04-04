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
  ;
}
