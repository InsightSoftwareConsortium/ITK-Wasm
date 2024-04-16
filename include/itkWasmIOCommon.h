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
#ifndef itkWasmIOCommon_h
#define itkWasmIOCommon_h
// Common functions used across the WebAssembly IO classes

#include "WebAssemblyInterfaceExport.h"

#include "itkIntTypes.h"
#include "itkMath.h"
#include "itkCommonEnums.h"

#include <fstream>

#include "cbor.h"

namespace itk
{

/** \brief Opens a file for reading and random access
 *
 * \param[out] inputStream is an istream presumed to be opened for reading
 * \param[in] filename is the name of the file
 * \param[in] ascii optional (default is false);
 *                  if true than the file will be opened in ASCII mode,
 *                  which generally only applies to Windows
 *
 * The stream is closed if it's already opened. If an error is
 * encountered than an exception will be thrown.
 */
WebAssemblyInterface_EXPORT
void
openFileForReading(std::ifstream & inputStream, const std::string & filename,
                                bool ascii = false);

/** \brief Opens a file for writing and random access
 *
 * \param[out] outputStream is an ostream presumed to be opened for writing
 * \param[in] filename is the name of the file
 * \param[in] truncate optional (default is true);
 *                     if true than the file's existing content is truncated,
 *                     if false than the file is opened for reading and
 *                     writing with existing content intact
 * \param[in] ascii optional (default is false);
 *                  if true than the file will be opened in ASCII mode,
 *                  which generally only applies to Windows
 *
 * The stream is closed if it's already opened. If an error is
 * encountered than an exception will be thrown.
 */
WebAssemblyInterface_EXPORT
void
openFileForWriting(std::ofstream & outputStream, const std::string & filename,
                                bool truncate = true, bool ascii = false);

/** Convenient method to read a buffer as binary. Return true on success. */
WebAssemblyInterface_EXPORT
bool
readBufferAsBinary(std::istream & os, void *buffer, SizeValueType numberOfBytesToBeRead);

WebAssemblyInterface_EXPORT
bool fileNameIsCBOR(const char * fileName);

WebAssemblyInterface_EXPORT
void
readCBORBuffer(const cbor_item_t * index, const char * dataName, void * buffer, SizeValueType numberOfBytesToBeRead);

WebAssemblyInterface_EXPORT
void
writeCBORBuffer(cbor_item_t * index, const char * dataName, const void * buffer, SizeValueType numberOfBytesToWrite, IOComponentEnum ioComponent);

WebAssemblyInterface_EXPORT
size_t
ITKComponentSize( const CommonEnums::IOComponent );

} // end namespace itk

#endif // itkWasmIOCommon_h
