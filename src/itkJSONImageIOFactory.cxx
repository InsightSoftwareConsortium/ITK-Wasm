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
#include "itkJSONImageIOFactory.h"
#include "itkJSONImageIO.h"
#include "itkVersion.h"

namespace itk
{

JSONImageIOFactory
::JSONImageIOFactory()
{
  this->RegisterOverride( "itkImageIOBase",
                          "itkJSONImageIO",
                          "JSON Image IO",
                          1,
                          CreateObjectFunction< JSONImageIO >::New() );
}


JSONImageIOFactory
::~JSONImageIOFactory()
{}


const char *
JSONImageIOFactory
::GetITKSourceVersion() const
{
  return ITK_SOURCE_VERSION;
}


const char *
JSONImageIOFactory
::GetDescription() const
{
  return "JSON ImageIO Factory, allows the loading of JSON images into insight";
}


// Undocumented API used to register during static initialization.
// DO NOT CALL DIRECTLY.

static bool JSONImageIOFactoryHasBeenRegistered;

void BridgeJavaScript_EXPORT JSONImageIOFactoryRegister__Private(void)
{
  if( ! JSONImageIOFactoryHasBeenRegistered )
    {
    JSONImageIOFactoryHasBeenRegistered = true;
    JSONImageIOFactory::RegisterOneFactory();
    }
}

} // end namespace itk
