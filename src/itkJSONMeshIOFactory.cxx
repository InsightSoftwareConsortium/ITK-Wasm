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
#include "itkJSONMeshIOFactory.h"
#include "itkJSONMeshIO.h"
#include "itkVersion.h"

namespace itk
{

JSONMeshIOFactory
::JSONMeshIOFactory()
{
  this->RegisterOverride( "itkMeshIOBase",
                          "itkJSONMeshIO",
                          "JSON Mesh IO",
                          1,
                          CreateObjectFunction< JSONMeshIO >::New() );
}


JSONMeshIOFactory
::~JSONMeshIOFactory()
{}


const char *
JSONMeshIOFactory
::GetITKSourceVersion() const
{
  return ITK_SOURCE_VERSION;
}


const char *
JSONMeshIOFactory
::GetDescription() const
{
  return "JSON MeshIO Factory, allows the loading of JSON images into insight";
}


// Undocumented API used to register during static initialization.
// DO NOT CALL DIRECTLY.

static bool JSONMeshIOFactoryHasBeenRegistered;

void BridgeJavaScript_EXPORT JSONMeshIOFactoryRegister__Private(void)
{
  if( ! JSONMeshIOFactoryHasBeenRegistered )
    {
    JSONMeshIOFactoryHasBeenRegistered = true;
    JSONMeshIOFactory::RegisterOneFactory();
    }
}

} // end namespace itk
