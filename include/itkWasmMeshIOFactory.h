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
#ifndef itkWasmMeshIOFactory_h
#define itkWasmMeshIOFactory_h
#include "WebAssemblyInterfaceExport.h"

#include "itkObjectFactoryBase.h"
#include "itkMeshIOBase.h"

namespace itk
{
/** \class WasmMeshIOFactory
 *
 * \brief Create instances of WasmMeshIO objects using an object factory.
 *
 * \ingroup WebAssemblyInterface
 */
class WebAssemblyInterface_EXPORT WasmMeshIOFactory: public ObjectFactoryBase
{
public:
  /** Standard class typedefs. */
  typedef WasmMeshIOFactory          Self;
  typedef ObjectFactoryBase          Superclass;
  typedef SmartPointer< Self >       Pointer;
  typedef SmartPointer< const Self > ConstPointer;

  /** Class methods used to interface with the registered factories. */
  const char * GetITKSourceVersion() const override;

  const char * GetDescription() const override;

  /** Method for class instantiation. */
  itkFactorylessNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmMeshIOFactory, ObjectFactoryBase);

  /** Register one factory of this type  */
  static void RegisterOneFactory()
  {
    WasmMeshIOFactory::Pointer wasmFactory = WasmMeshIOFactory::New();

    ObjectFactoryBase::RegisterFactoryInternal(wasmFactory);
  }

protected:
  WasmMeshIOFactory();
  ~WasmMeshIOFactory() override;

private:
  ITK_DISALLOW_COPY_AND_ASSIGN(WasmMeshIOFactory);
};
} // end namespace itk

#endif
