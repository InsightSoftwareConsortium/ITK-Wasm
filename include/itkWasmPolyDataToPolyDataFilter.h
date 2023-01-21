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
#ifndef itkWasmPolyDataToPolyDataFilter_h
#define itkWasmPolyDataToPolyDataFilter_h

#include "itkProcessObject.h"
#include "itkWasmPolyData.h"

namespace itk
{
/**
 *\class WasmPolyDataToPolyDataFilter
 * \brief Convert an WasmPolyData to an PolyData object.
 *
 * TPolyData must match the type stored in the JSON representation or an exception will be shown.
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TPolyData>
class ITK_TEMPLATE_EXPORT WasmPolyDataToPolyDataFilter : public ProcessObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(WasmPolyDataToPolyDataFilter);

  /** Standard class type aliases. */
  using Self = WasmPolyDataToPolyDataFilter;
  using Superclass = ProcessObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmPolyDataToPolyDataFilter, ProcessObject);

  using DataObjectIdentifierType = Superclass::DataObjectIdentifierType;
  using DataObjectPointerArraySizeType = Superclass::DataObjectPointerArraySizeType;

  using PolyDataType = TPolyData;
  using WasmPolyDataType = WasmPolyData<PolyDataType>;

  /** Set/Get the path input of this process object.  */
  using Superclass::SetInput;
  virtual void
  SetInput(const WasmPolyDataType * mesh);

  virtual void
  SetInput(unsigned int, const WasmPolyDataType * mesh);

  const WasmPolyDataType *
  GetInput();

  const WasmPolyDataType *
  GetInput(unsigned int idx);

  PolyDataType *
  GetOutput();
  const PolyDataType *
  GetOutput() const;

  PolyDataType *
  GetOutput(unsigned int idx);

protected:
  WasmPolyDataToPolyDataFilter();
  ~WasmPolyDataToPolyDataFilter() override = default;

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
#  include "itkWasmPolyDataToPolyDataFilter.hxx"
#endif

#endif
