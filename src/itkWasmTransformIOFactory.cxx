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
#include "itkWasmTransformIOFactory.h"
#include "itkWasmTransformIO.h"
#include "itkVersion.h"

namespace itk
{

WasmTransformIOFactory
::WasmTransformIOFactory()
{
  this->RegisterOverride( "itkTransformIOBase",
                          "itkWasmTransformIO",
                          "Wasm Transform IO",
                          1,
                          CreateObjectFunction< WasmTransformIO >::New() );
}


WasmTransformIOFactory
::~WasmTransformIOFactory()
{}


const char *
WasmTransformIOFactory
::GetITKSourceVersion() const
{
  return ITK_SOURCE_VERSION;
}


const char *
WasmTransformIOFactory
::GetDescription() const
{
  return "Wasm TransformIO Factory, allows the loading of Wasm images into Insight";
}


// Undocumented API used to register during static initialization.
// DO NOT CALL DIRECTLY.

static bool WasmTransformIOFactoryHasBeenRegistered;

void WebAssemblyInterface_EXPORT WasmTransformIOFactoryRegister__Private(void)
{
  if( ! WasmTransformIOFactoryHasBeenRegistered )
    {
    WasmTransformIOFactoryHasBeenRegistered = true;
    WasmTransformIOFactory::RegisterOneFactory();
    }
}

} // end namespace itk
