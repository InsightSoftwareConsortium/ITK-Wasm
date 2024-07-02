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
#ifndef itkWasmTransform_hxx
#define itkWasmTransform_hxx

#include "itkWasmTransform.h"
#include "itkDataObjectDecorator.h"

namespace itk
{

template <typename TTransform>
void
WasmTransform<TTransform>
::SetTransform(const TransformType * transform)
{
  using DecoratorType = DataObjectDecorator<TransformType>;
  typename DecoratorType::Pointer decorator = DecoratorType::New();
  decorator->Set(transform);
  this->SetDataObject(decorator);
}

} // end namespace itk

#endif
