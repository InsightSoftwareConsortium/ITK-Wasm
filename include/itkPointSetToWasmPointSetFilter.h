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
#ifndef itkPointSetToWasmPointSetFilter_h
#define itkPointSetToWasmPointSetFilter_h

#include "itkProcessObject.h"
#include "itkWasmPointSet.h"

namespace itk
{
/**
 *\class PointSetToWasmPointSetFilter
 * \brief Convert an PointSet to an WasmPointSet object.
 * 
 * \ingroup WebAssemblyInterface
 */
template <typename TPointSet>
class ITK_TEMPLATE_EXPORT PointSetToWasmPointSetFilter : public ProcessObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(PointSetToWasmPointSetFilter);

  /** Standard class type aliases. */
  using Self = PointSetToWasmPointSetFilter;
  using Superclass = ProcessObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(PointSetToWasmPointSetFilter, ProcessObject);

  using DataObjectIdentifierType = Superclass::DataObjectIdentifierType;
  using DataObjectPointerArraySizeType = Superclass::DataObjectPointerArraySizeType;

  using PointSetType = TPointSet;
  using WasmPointSetType = WasmPointSet<PointSetType>;

  /** Set/Get the path input of this process object.  */
  using Superclass::SetInput;
  virtual void
  SetInput(const PointSetType * pointSet);

  virtual void
  SetInput(unsigned int, const PointSetType * pointSet);

  const PointSetType *
  GetInput();

  const PointSetType *
  GetInput(unsigned int idx);

  WasmPointSetType *
  GetOutput();
  const WasmPointSetType *
  GetOutput() const;

  WasmPointSetType *
  GetOutput(unsigned int idx);

protected:
  PointSetToWasmPointSetFilter();
  ~PointSetToWasmPointSetFilter() override = default;

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
#  include "itkPointSetToWasmPointSetFilter.hxx"
#endif

#endif
