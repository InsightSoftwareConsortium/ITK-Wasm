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
#ifndef itkWASMStringStream_h
#define itkWASMStringStream_h

#include "itkWASMDataObject.h"

namespace itk
{
/**
 *\class WASMStringStream
 * \brief JSON representation for a std::stringstream
 *
 * JSON representation for a std::stringstream for interfacing across programming languages and runtimes.
 * 
 * Arrays:
 * 
 * - 0: The associated std::string data.
 * 
 * \ingroup WebAssemblyInterface
 */
class ITK_TEMPLATE_EXPORT WASMStringStream : public WASMDataObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(WASMStringStream);

  /** Standard class type aliases. */
  using Self = WASMStringStream;
  using Superclass = WASMDataObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  itkNewMacro(Self);
  /** Run-time type information (and related methods). */
  itkTypeMacro(WASMStringStream, WASMDataObject);

  void SetString(const std::string & string) {
    this->m_StringStream.str(string);
  }

  std::string GetString() const {
    return this->m_StringStream.str();
  }

  std::stringstream & GetStringStream() {
    return this->m_StringStream;
  }

protected:
  WASMStringStream() = default;
  ~WASMStringStream() override = default;

  std::stringstream m_StringStream;
};

} // namespace itk

#endif
