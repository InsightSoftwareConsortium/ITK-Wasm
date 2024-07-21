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
#ifndef itkWasmPointSetToPointSetFilter_h
#define itkWasmPointSetToPointSetFilter_h

#include "itkProcessObject.h"
#include "itkWasmPointSet.h"

namespace itk
{
/**
 *\class WasmPointSetToPointSetFilter
 * \brief Convert an WasmPointSet to an PointSet object.
 *
 * TPointSet must match the type stored in the JSON representation or an exception will be shown.
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TPointSet>
class ITK_TEMPLATE_EXPORT WasmPointSetToPointSetFilter : public ProcessObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(WasmPointSetToPointSetFilter);

  /** Standard class type aliases. */
  using Self = WasmPointSetToPointSetFilter;
  using Superclass = ProcessObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmPointSetToPointSetFilter, ProcessObject);

  using DataObjectIdentifierType = Superclass::DataObjectIdentifierType;
  using DataObjectPointerArraySizeType = Superclass::DataObjectPointerArraySizeType;

  using PointSetType = TPointSet;
  using WasmPointSetType = WasmPointSet<PointSetType>;

  /** Set/Get the path input of this process object.  */
  using Superclass::SetInput;
  virtual void
  SetInput(const WasmPointSetType * mesh);

  virtual void
  SetInput(unsigned int, const WasmPointSetType * mesh);

  const WasmPointSetType *
  GetInput();

  const WasmPointSetType *
  GetInput(unsigned int idx);

  PointSetType *
  GetOutput();
  const PointSetType *
  GetOutput() const;

  PointSetType *
  GetOutput(unsigned int idx);

protected:
  WasmPointSetToPointSetFilter();
  ~WasmPointSetToPointSetFilter() override = default;

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
#  include "itkWasmPointSetToPointSetFilter.hxx"
#endif

#endif
