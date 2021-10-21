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
#ifndef itkJSONMeshIO_h
#define itkJSONMeshIO_h
#include "BridgeJavaScriptExport.h"


#include "itkMeshIOBase.h"
#include <fstream>

namespace itk
{
/** \class JSONMeshIO
 *
 * \brief Read and write the an itk::Mesh in JSON format.
 *
 * This format is intended to facilitage data exchange in itk.js.
 * It reads and writes an itk.js itk/Mesh JSON object where TypedArrays are
 * replaced by binary files on the filesystem.
 *
 * The format is experimental and subject to change. We mean it.
 *
 * \ingroup IOFilters
 * \ingroup BridgeJavaScript
 */
class BridgeJavaScript_EXPORT JSONMeshIO: public MeshIOBase
{
public:
  /** Standard class typedefs. */
  typedef JSONMeshIO           Self;
  typedef MeshIOBase           Superclass;
  typedef SmartPointer< Self > Pointer;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(JSONMeshIO, MeshIOBase);

  bool CanReadFile(const char *) override;

  /** Determine the required information and whether need to ReadPoints,
    ReadCells, ReadPointData and ReadCellData */
  void ReadMeshInformation() override;

  /** Reads the data from disk into the memory buffer provided. */
  void ReadPoints(void *buffer) override;

  void ReadCells(void *buffer) override;

  void ReadPointData(void *buffer) override;

  void ReadCellData(void *buffer) override;

  /*-------- This part of the interfaces deals with writing data ----- */

  /** Writes the data to disk from the memory buffer provided. Make sure
     * that the IORegions has been set properly. */
  bool CanWriteFile(const char *)  override;

  void WriteMeshInformation() override;

  void WritePoints(void *buffer) override;

  void WriteCells(void *buffer) override;

  void WritePointData(void *buffer) override;

  void WriteCellData(void *buffer) override;

  void Write() override;

protected:
  JSONMeshIO();
  ~JSONMeshIO() override;
  void PrintSelf(std::ostream & os, Indent indent) const override;

  static CommonEnums::IOComponent JSToITKComponentType( const std::string & jsComponentType );
  static std::string ITKToJSComponentType( const CommonEnums::IOComponent );

  static CommonEnums::IOPixel JSToITKPixelType( const int jsPixelType );
  static int ITKToJSPixelType( const CommonEnums::IOPixel );

  static size_t ITKComponentSize( const CommonEnums::IOComponent );

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
  void OpenFileForReading(std::ifstream & inputStream, const std::string & filename,
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
  void OpenFileForWriting(std::ofstream & outputStream, const std::string & filename,
                                  bool truncate = true, bool ascii = false);

  /** Convenient method to read a buffer as binary. Return true on success. */
  bool ReadBufferAsBinary(std::istream & os, void *buffer, SizeValueType numberOfBytesToBeRead);

private:
  ITK_DISALLOW_COPY_AND_ASSIGN(JSONMeshIO);
};
} // end namespace itk

#endif // itkJSONMeshIO_h
