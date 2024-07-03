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
#ifndef itkWasmTransformToTransformFilter_h
#define itkWasmTransformToTransformFilter_h

#include "itkProcessObject.h"
#include "itkWasmTransform.h"
#include "itkDataObjectDecorator.h"

namespace itk
{
/**
 *\class WasmTransformToTransformFilter
 * \brief Convert an WasmTransform to an Transform object.
 *
 * TTransform must match the type stored in the JSON representation or an exception will be shown.
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TTransform>
class ITK_TEMPLATE_EXPORT WasmTransformToTransformFilter : public ProcessObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(WasmTransformToTransformFilter);

  /** Standard class type aliases. */
  using Self = WasmTransformToTransformFilter;
  using Superclass = ProcessObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmTransformToTransformFilter, ProcessObject);

  using DataObjectIdentifierType = Superclass::DataObjectIdentifierType;
  using DataObjectPointerArraySizeType = Superclass::DataObjectPointerArraySizeType;

  using TransformType = TTransform;
  using DecoratorType = DataObjectDecorator<TransformType>;
  using WasmTransformType = WasmTransform<TransformType>;

  /** Set/Get the path input of this process object.  */
  using Superclass::SetInput;
  virtual void
  SetInput(const WasmTransformType * transform);

  virtual void
  SetInput(unsigned int, const WasmTransformType * transform);

  const WasmTransformType *
  GetInput();

  const WasmTransformType *
  GetInput(unsigned int idx);

  TransformType *
  GetOutput();
  const TransformType *
  GetOutput() const;

  TransformType *
  GetOutput(unsigned int idx);

protected:
  WasmTransformToTransformFilter();
  ~WasmTransformToTransformFilter() override = default;

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

  typename TransformType::Pointer m_OutputTransform;
};
} // end namespace itk

#ifndef ITK_MANUAL_INSTANTIATION
#  include "itkWasmTransformToTransformFilter.hxx"
#endif

#endif
