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
#include "itkWASMStringStream.h"

namespace itk
{

void
WASMStringStream::PrintSelf(std::ostream & os, Indent indent) const
{
  // Skip WASMDataObject since we do not have a DataObject
  Superclass::Superclass::PrintSelf(os, indent);
  os << indent << "JSON: " << this->m_JSON << std::endl;
  os << indent << "String: " << this->m_StringStream.str() << std::endl;
}

} // end namespace itk