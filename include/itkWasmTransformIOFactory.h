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
#ifndef itkWasmTransformIOFactory_h
#define itkWasmTransformIOFactory_h
#include "WebAssemblyInterfaceExport.h"

#include "itkObjectFactoryBase.h"
#include "itkTransformIOBase.h"

namespace itk
{
/** \class WasmTransformIOFactory
 *
 * \brief Create instances of WasmTransformIO objects using an object factory.
 *
 * \ingroup WebAssemblyInterface
 */
class WebAssemblyInterface_EXPORT WasmTransformIOFactory : public ObjectFactoryBase
{
public:
  /** Standard class typedefs. */
  typedef WasmTransformIOFactory   Self;
  typedef ObjectFactoryBase        Superclass;
  typedef SmartPointer<Self>       Pointer;
  typedef SmartPointer<const Self> ConstPointer;

  /** Class methods used to interface with the registered factories. */
  const char *
  GetITKSourceVersion() const override;

  const char *
  GetDescription() const override;

  /** Method for class instantiation. */
  itkFactorylessNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkOverrideGetNameOfClassMacro(WasmTransformIOFactory);

  /** Register one factory of this type  */
  static void
  RegisterOneFactory()
  {
    WasmTransformIOFactory::Pointer wasmFactory = WasmTransformIOFactory::New();

    ObjectFactoryBase::RegisterFactoryInternal(wasmFactory);
  }

protected:
  WasmTransformIOFactory();
  ~WasmTransformIOFactory() override;

private:
  ITK_DISALLOW_COPY_AND_MOVE(WasmTransformIOFactory);
};
} // end namespace itk

#endif
