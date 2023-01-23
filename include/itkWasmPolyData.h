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
#ifndef itkWasmPolyData_h
#define itkWasmPolyData_h

#include "itkWasmDataObject.h"
#include "itkVectorContainer.h"

namespace itk
{
/**
 *\class WasmPolyData
 * \brief JSON representation for an itk::PolyData
 *
 * JSON representation for an itk::PolyData for interfacing across programming languages and runtimes.
 *
 * Array buffer's are stored as strings with memory addresses or paths on disks or a virtual filesystem.
 * 
 * - 0: Point buffer
 * - 1: Vertices buffer
 * - 2: Lines buffer
 * - 3: Polygons buffer
 * - 4: Triangle strips buffer
 * - 5: Point data buffer
 * - 6: Cell data buffer
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TPolyData>
class ITK_TEMPLATE_EXPORT WasmPolyData : public WasmDataObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(WasmPolyData);

  /** Standard class type aliases. */
  using Self = WasmPolyData;
  using Superclass = WasmDataObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  itkNewMacro(Self);
  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmPolyData, WasmDataObject);

  using PolyDataType = TPolyData;

  void SetPolyData(const PolyDataType * polyData) {
    this->SetDataObject(const_cast<PolyDataType *>(polyData));
  }

  const PolyDataType * GetPolyData() const {
    return static_cast< const PolyDataType * >(this->GetDataObject());
  }

protected:
  WasmPolyData() = default;
  ~WasmPolyData() override = default;
};

} // namespace itk

#endif
