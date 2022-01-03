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
#ifndef itkWASMImageIO_h
#define itkWASMImageIO_h
#include "WebAssemblyInterfaceExport.h"

#include "itkStreamingImageIOBase.h"
#include <fstream>
#include "rapidjson/document.h"

namespace itk
{
/** \class WASMImageIO
 *
 * \brief Read and write the an itk::Image in  format.
 *
 * This format is intended to facilitage data exchange in itk-wasm.
 * It reads and writes an itk-wasm Image object where TypedArrays are
 * replaced by binary files on the file system or in a ZIP file.
 *
 * \ingroup IOFilters
 * \ingroup WebAssemblyInterface
 */
class WebAssemblyInterface_EXPORT WASMImageIO: public StreamingImageIOBase
{
public:
  /** Standard class typedefs. */
  typedef WASMImageIO          Self;
  typedef StreamingImageIOBase Superclass;
  typedef SmartPointer< Self > Pointer;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(WASMImageIO, StreamingImageIOBase);

  /** The different types of ImageIO's can support data of varying
   * dimensionality. For example, some file formats are strictly 2D
   * while others can support 2D, 3D, or even n-D. This method returns
   * true/false as to whether the ImageIO can support the dimension
   * indicated. */
  bool SupportsDimension(unsigned long) override;

  /** Determine the file type. Returns true if this ImageIO can read the
   * file specified. */
  bool CanReadFile(const char *) override;

  /** Set the spacing and dimension information for the set filename. */
  void ReadImageInformation() override;

  /** Reads the data from disk into the memory buffer provided. */
  void Read(void *buffer) override;

  /** Set the JSON representation of the image information. */
  void SetJSON(rapidjson::Document & json);

  /** Determine the file type. Returns true if this ImageIO can write the
   * file specified. */
  bool CanWriteFile(const char *) override;

  /** Set the spacing and dimension information for the set filename. */
  void WriteImageInformation() override;

  /** Get the JSON representation of the image information. */
  rapidjson::Document GetJSON();

  /** Writes the data to disk from the memory buffer provided. Make sure
   * that the IORegions has been set properly. */
  void Write(const void *buffer) override;

protected:
  WASMImageIO();
  ~WASMImageIO() override;
  void PrintSelf(std::ostream & os, Indent indent) const override;

  Superclass::SizeType GetHeaderSize() const override
  {
    return 0;
  }

private:
  ITK_DISALLOW_COPY_AND_ASSIGN(WASMImageIO);
};
} // end namespace itk

#endif // itkWASMImageIO_h
