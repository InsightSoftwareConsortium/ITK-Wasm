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
#ifndef itkMetaDataDictionaryCBOR_h
#define itkMetaDataDictionaryCBOR_h

#include "itkMetaDataDictionary.h"
#include "itkDefaultConvertPixelTraits.h"
#include "itkMetaDataObject.h"
#include "itkArray.h"
#include "itkMatrix.h"

#include <string>
#include <vector>
#include <tuple>

#include "WebAssemblyInterfaceExport.h"

#include "cbor.h"

namespace itk
{

WebAssemblyInterface_EXPORT void
metaDataDictionaryToCBOR(const itk::MetaDataDictionary & dictionary, cbor_item_t * metadataCbor);

WebAssemblyInterface_EXPORT void
cborToMetaDataDictionary(const cbor_item_t * metadataCbor, itk::MetaDataDictionary & dictionary);

} // end namespace itk

#endif
