/*=========================================================================
 *
 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/
#ifndef itkWASMText_h
#define itkWASMText_h

#include "itkWASMDataObject.h"

namespace itk
{
/**
 *\class WASMText
 * \brief JSON representation for an itk::TextBase
 *
 * JSON representation for an itk::TextBase for interfacing across programming languages and runtimes.
 * 
 * Pixel and Direction binary array buffer's are stored as strings with memory addresses or paths on disks or a virtual filesystem.
 * 
 * Arrays:
 * 
 * - 0: Pixel buffer `data`
 * - 1: Orientation `direction`
 * 
 * \ingroup WebAssemblyInterface
 */
template <typename TText>
class ITK_TEMPLATE_EXPORT WASMText : public WASMDataObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(WASMText);

  /** Standard class type aliases. */
  using Self = WASMText;
  using Superclass = WASMDataObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  itkNewMacro(Self);
  /** Run-time type information (and related methods). */
  itkTypeMacro(WASMText, WASMDataObject);

  using TextType = TText;

  void SetText(const TextType * image) {
    this->SetDataObject(const_cast<TextType *>(image));
  }

  const TextType * GetText() const {
    return static_cast< const TextType * >(this->GetDataObject());
  }

protected:
  WASMText() = default;
  ~WASMText() override = default;
};

} // namespace itk

#endif
