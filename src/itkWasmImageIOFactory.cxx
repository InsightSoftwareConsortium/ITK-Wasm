/*=========================================================================
 *
 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         https://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/
#include "itkWasmImageIOFactory.h"
#include "itkWasmImageIO.h"
#include "itkVersion.h"

namespace itk
{

WasmImageIOFactory
::WasmImageIOFactory()
{
  this->RegisterOverride( "itkImageIOBase",
                          "itkWasmImageIO",
                          "Wasm Image IO",
                          1,
                          CreateObjectFunction< WasmImageIO >::New() );
}


WasmImageIOFactory
::~WasmImageIOFactory()
{}


const char *
WasmImageIOFactory
::GetITKSourceVersion() const
{
  return ITK_SOURCE_VERSION;
}


const char *
WasmImageIOFactory
::GetDescription() const
{
  return "Wasm ImageIO Factory, allows the loading of ITK Wasm images into Insight";
}


// Undocumented API used to register during static initialization.
// DO NOT CALL DIRECTLY.

static bool WasmImageIOFactoryHasBeenRegistered;

void WebAssemblyInterface_EXPORT WasmImageIOFactoryRegister__Private(void)
{
  if( ! WasmImageIOFactoryHasBeenRegistered )
    {
    WasmImageIOFactoryHasBeenRegistered = true;
    WasmImageIOFactory::RegisterOneFactory();
    }
}

} // end namespace itk
