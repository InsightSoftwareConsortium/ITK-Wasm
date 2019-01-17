/*=========================================================================
 *
 *  Copyright Insight Software Consortium
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
#ifndef itkMeshIOBaseJSBinding_h
#define itkMeshIOBaseJSBinding_h
#if defined(EMSCRIPTEN)

#include <string>
#include <vector>

#include "emscripten/val.h"

namespace itk
{

/** \class MeshIOBaseJSBinding
 *
 * \brief Provides as JavaScript binding interface to itk::MeshIOBase derived
 * classes.
 *
 * \ingroup BridgeJavaScript
 */
template< typename TMeshIO >
class MeshIOBaseJSBinding
{
public:
  typedef TMeshIO MeshIOType;

  typedef typename MeshIOType::IOPixelType      IOPixelType;
  typedef typename MeshIOType::IOComponentType  IOComponentType;
  typedef typename MeshIOType::FileType         FileType;
  typedef typename MeshIOType::ByteOrder        ByteOrder;
  typedef typename MeshIOType::CellGeometryType CellGeometryType;

  MeshIOBaseJSBinding();

  /** Set/Get the name of the file to be read. This file should exist on the
   * Emscripten virtual filesystem. */
  void SetFileName( std::string fileName );
  std::string GetFileName() const;

  bool CanReadFile( std::string fileName );
  bool CanWriteFile( std::string fileName );

  void SetPointDimension( unsigned int dimension );
  unsigned int GetPointDimension() const;

  void SetPointPixelType( IOPixelType pixelType );
  IOPixelType GetPointPixelType() const;
  void SetCellPixelType( IOPixelType pixelType );
  IOPixelType GetCellPixelType() const;
  void SetFileType( FileType fileType );
  FileType GetFileType() const;
  void SetByteOrder( ByteOrder byteOrder );
  ByteOrder GetByteOrder() const;

  void SetPointComponentType( IOComponentType componentType );
  IOComponentType GetPointComponentType() const;
  void SetCellComponentType( IOComponentType componentType );
  IOComponentType GetCellComponentType() const;
  void SetPointPixelComponentType( IOComponentType componentType );
  IOComponentType GetPointPixelComponentType() const;
  void SetCellPixelComponentType( IOComponentType componentType );
  IOComponentType GetCellPixelComponentType() const;
  void SetNumberOfPointPixelComponents( unsigned int components );
  unsigned int GetNumberOfPointPixelComponents() const;
  void SetNumberOfCellPixelComponents( unsigned int components );
  unsigned int GetNumberOfCellPixelComponents() const;

  void SetNumberOfPoints( unsigned long );
  unsigned long GetNumberOfPoints() const;
  void SetNumberOfCells( unsigned long );
  unsigned long GetNumberOfCells() const;
  void SetNumberOfPointPixels( unsigned long );
  unsigned long GetNumberOfPointPixels() const;
  void SetNumberOfCellPixels( unsigned long );
  unsigned long GetNumberOfCellPixels() const;
  void SetCellBufferSize( unsigned long );
  unsigned long GetCellBufferSize() const;

  void SetUpdatePoints( bool );
  void SetUpdateCells( bool );
  void SetUpdatePointData( bool );
  void SetUpdateCellData( bool );

  void ReadMeshInformation();
  void WriteMeshInformation();

  emscripten::val ReadPoints();
  emscripten::val ReadCells();
  emscripten::val ReadPointData();
  emscripten::val ReadCellData();
  void WritePoints( uintptr_t cBuffer );
  void WriteCells( uintptr_t cBuffer );
  void WritePointData( uintptr_t cBuffer );
  void WriteCellData( uintptr_t cBuffer );

  void Write();

  /** Use compression when writing */
  void SetUseCompression( bool compression );

protected:
  typename MeshIOType::Pointer m_MeshIO;

  std::vector< unsigned char > m_PointsBuffer;
  std::vector< unsigned char > m_CellsBuffer;
  std::vector< unsigned char > m_PointDataBuffer;
  std::vector< unsigned char > m_CellDataBuffer;

  static unsigned long GetIOComponentSizeInBytes( IOComponentType componentType );

};

} // end namespace itk

#include "itkMeshIOBaseJSBinding.hxx"

#endif // #if defined(EMSCRIPTEN)
#endif
