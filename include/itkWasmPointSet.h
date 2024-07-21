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
#ifndef itkWasmPointSet_h
#define itkWasmPointSet_h

#include "itkWasmDataObject.h"
#include "itkVectorContainer.h"

namespace itk
{
/**
 *\class WasmPointSet
 * \brief JSON representation for an itk::PointSet
 *
 * JSON representation for an itk::PointSet for interfacing across programming languages and runtimes.
 *
 * Point and PointData binary array buffer's are stored as strings with memory addresses or paths on disks or a virtual filesystem.
 *
 * - 0: Point buffer
 * - 1: Point data buffer
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TPointSet>
class ITK_TEMPLATE_EXPORT WasmPointSet : public WasmDataObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(WasmPointSet);

  /** Standard class type aliases. */
  using Self = WasmPointSet;
  using Superclass = WasmDataObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  itkNewMacro(Self);
  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmPointSet, WasmDataObject);

  using PointSetType = TPointSet;

  using PointIdentifier = typename PointSetType::PointIdentifier;

  void SetPointSet(const PointSetType * pointSet);

  const PointSetType * GetPointSet() const {
    return static_cast< const PointSetType * >(this->GetDataObject());
  }

protected:
  WasmPointSet() = default;
  ~WasmPointSet() override = default;
};

} // namespace itk

#ifndef ITK_MANUAL_INSTANTIATION
#  include "itkWasmPointSet.hxx"
#endif

#endif
