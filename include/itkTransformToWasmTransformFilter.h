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
#ifndef itkTransformToWasmTransformFilter_h
#define itkTransformToWasmTransformFilter_h

#include "itkProcessObject.h"
#include "itkWasmTransform.h"

#include "itkDataObjectDecorator.h"

namespace itk
{
/**
 *\class TransformToWasmTransformFilter
 * \brief Convert an Transform to an WasmTransform object.
 * 
 * \ingroup WebAssemblyInterface
 */
template <typename TTransform>
class ITK_TEMPLATE_EXPORT TransformToWasmTransformFilter : public ProcessObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(TransformToWasmTransformFilter);

  /** Standard class type aliases. */
  using Self = TransformToWasmTransformFilter;
  using Superclass = ProcessObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(TransformToWasmTransformFilter, ProcessObject);

  using DataObjectIdentifierType = Superclass::DataObjectIdentifierType;
  using DataObjectPointerArraySizeType = Superclass::DataObjectPointerArraySizeType;

  using TransformType = TTransform;
  using WasmTransformType = WasmTransform<TransformType>;

  itkSetGetDecoratedObjectInputMacro(Transform, TransformType);

  WasmTransformType *
  GetOutput();
  const WasmTransformType *
  GetOutput() const;

  WasmTransformType *
  GetOutput(unsigned int idx);

protected:
  TransformToWasmTransformFilter();
  ~TransformToWasmTransformFilter() override = default;

  ProcessObject::DataObjectPointer
  MakeOutput(ProcessObject::DataObjectPointerArraySizeType idx) override;
  ProcessObject::DataObjectPointer
  MakeOutput(const ProcessObject::DataObjectIdentifierType &) override;

  void
  GenerateOutputInformation() override
  {} // do nothing
  void
  GenerateData() override;

  void
  PrintSelf(std::ostream & os, Indent indent) const override;
};
} // end namespace itk

#ifndef ITK_MANUAL_INSTANTIATION
#  include "itkTransformToWasmTransformFilter.hxx"
#endif

#endif
