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

#include "itkWASMMeshIO.h"

#include "itkWASMComponentTypeFromIOComponentEnum.h"
#include "itkIOComponentEnumFromWASMComponentType.h"
#include "itkWASMPixelTypeFromIOPixelEnum.h"
#include "itkIOPixelEnumFromWASMPixelType.h"

#include "itkMetaDataObject.h"
#include "itkIOCommon.h"
#include "itksys/SystemTools.hxx"

#include "rapidjson/document.h"
#include "rapidjson/prettywriter.h"
#include "rapidjson/ostreamwrapper.h"

#include "itksys/SystemTools.hxx"

#include "mz.h"
#include "mz_os.h"
#include "mz_strm.h"
#include "mz_zip.h"
#include "mz_zip_rw.h"

namespace itk
{

WASMMeshIO
::WASMMeshIO()
{
  this->AddSupportedWriteExtension(".iwm");
  this->AddSupportedWriteExtension(".iwm.zip");
  this->AddSupportedReadExtension(".iwm");
  this->AddSupportedReadExtension(".iwm.zip");
}


WASMMeshIO
::~WASMMeshIO()
{
}


void
WASMMeshIO
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}


void
WASMMeshIO
::OpenFileForReading(std::ifstream & inputStream, const std::string & filename, bool ascii)
{
  // Make sure that we have a file to
  if ( filename.empty() )
    {
    itkExceptionMacro( << "A FileName must be specified." );
    }

  // Close file from any previous image
  if ( inputStream.is_open() )
    {
    inputStream.close();
    }

  // Open the new file for reading
  itkDebugMacro( << "Opening file for reading: " << filename );

  std::ios::openmode mode = std::ios::in;
  if ( !ascii )
    {
    mode |= std::ios::binary;
    }

  inputStream.open( filename.c_str(), mode );

  if ( !inputStream.is_open() || inputStream.fail() )
    {
    itkExceptionMacro( << "Could not open file: "
                       << filename << " for reading."
                       << std::endl
                       << "Reason: "
                       << itksys::SystemTools::GetLastSystemError() );
    }
}


void
WASMMeshIO
::OpenFileForWriting(std::ofstream & outputStream, const std::string & filename, bool truncate, bool ascii)
{
  // Make sure that we have a file to
  if ( filename.empty() )
    {
    itkExceptionMacro( << "A FileName must be specified." );
    }

  // Close file from any previous image
  if ( outputStream.is_open() )
    {
    outputStream.close();
    }

  // Open the new file for writing
  itkDebugMacro( << "Opening file for writing: " << filename );

  std::ios::openmode mode = std::ios::out;
  if ( truncate )
    {
    // typically, ios::out also implies ios::trunc, but being explicit is safer
    mode |= std::ios::trunc;
    }
  else
    {
    mode |= std::ios::in;
    // opening a nonexistent file for reading + writing is not allowed on some platforms
    if ( !itksys::SystemTools::FileExists( filename.c_str() ) )
      {
      itksys::SystemTools::Touch( filename.c_str(), true );
      // don't worry about failure here, errors should be detected later when the file
      // is "actually" opened, unless there is a race condition
      }
    }
  if ( !ascii )
    {
    mode |= std::ios::binary;
    }

  outputStream.open( filename.c_str(), mode );

  if ( !outputStream.is_open() || outputStream.fail() )
    {
    itkExceptionMacro( << "Could not open file: "
                       << filename << " for writing."
                       << std::endl
                       << "Reason: "
                       << itksys::SystemTools::GetLastSystemError() );
    }
}


bool
WASMMeshIO
::ReadBufferAsBinary(std::istream & is, void *buffer, SizeValueType num)
{
  const auto numberOfBytesToBeRead = Math::CastWithRangeCheck< std::streamsize >(num);

  is.read(static_cast< char * >( buffer ), numberOfBytesToBeRead);

  const std::streamsize numberOfBytesRead = is.gcount();

  if ( ( numberOfBytesRead != numberOfBytesToBeRead )  || is.fail() )
    {
    return false; // read failed
    }

  return true;
}


size_t
WASMMeshIO
::ITKComponentSize(const CommonEnums::IOComponent itkComponentType)
{
  switch ( itkComponentType )
    {
    case CommonEnums::IOComponent::CHAR:
      return sizeof( uint8_t );

    case CommonEnums::IOComponent::UCHAR:
      return sizeof( uint8_t );

    case CommonEnums::IOComponent::SHORT:
      return sizeof( int16_t );

    case CommonEnums::IOComponent::USHORT:
      return sizeof( uint16_t );

    case CommonEnums::IOComponent::INT:
      return sizeof( int32_t );

    case CommonEnums::IOComponent::UINT:
      return sizeof( uint32_t );

    case CommonEnums::IOComponent::LONG:
      return sizeof( int64_t );

    case CommonEnums::IOComponent::ULONG:
      return sizeof( uint64_t );

    case CommonEnums::IOComponent::LONGLONG:
      return sizeof( int64_t );

    case CommonEnums::IOComponent::ULONGLONG:
      return sizeof( uint64_t );

    case CommonEnums::IOComponent::FLOAT:
      return sizeof( float );

    case CommonEnums::IOComponent::DOUBLE:
      return sizeof( double );

    default:
      return sizeof( int8_t );
    }
}


bool
WASMMeshIO
::CanReadFile(const char *filename)
{
  // Check the extension first to avoid opening files that do not
  // look like JSON.  The file must have an appropriate extension to be
  // recognized.
  std::string fname = filename;

  bool extensionFound = false;
  std::string::size_type extensionPos = fname.rfind(".iwm");
  if ( extensionPos != std::string::npos )
    {
    extensionFound = true;
    }

  if ( !extensionFound )
    {
    itkDebugMacro(<< "The filename extension is not recognized");
    return false;
    }

  return true;
}


void
WASMMeshIO
::ReadMeshInformation()
{
  this->SetByteOrderToLittleEndian();
  rapidjson::Document document;

  const std::string path = this->GetFileName();
  const auto indexPath = path + "/index.json";
  const auto dataPath = path + "/data";

  std::string::size_type zipPos = path.rfind(".zip");
  void * zip_reader = NULL;
  bool useZip = false;
  if ( ( zipPos != std::string::npos )
       && ( zipPos == path.length() - 4 ) )
  {
    useZip = true;
    mz_zip_reader_create(&zip_reader);
    if (mz_zip_reader_open_file(zip_reader, path.c_str()) != MZ_OK)
    {
      itkExceptionMacro("Could not open zip file");
    }

    mz_zip_reader_set_pattern(zip_reader, "index.json", 0);
    if (mz_zip_reader_goto_first_entry(zip_reader) != MZ_OK)
    {
      itkExceptionMacro("Could not find index.json entry");
    }
    mz_zip_file *file_info = NULL;
    mz_zip_reader_entry_get_info(zip_reader, &file_info);
    mz_zip_reader_entry_open(zip_reader);
    const int64_t bufsize = file_info->uncompressed_size;
    void * buf = calloc(bufsize, sizeof(unsigned char));
    mz_zip_reader_entry_read(zip_reader, buf, bufsize);
    if (document.Parse(static_cast<const char *>(buf)).HasParseError())
      {
      free(buf);
      mz_zip_reader_entry_close(zip_reader);
      mz_zip_reader_close(zip_reader);
      mz_zip_reader_delete(&zip_reader);
      itkExceptionMacro("Could not parse JSON");
      return;
      }
    free(buf);
    mz_zip_reader_entry_close(zip_reader);
  }
  else
  {
    std::ifstream inputStream;
    this->OpenFileForReading( inputStream, indexPath.c_str(), true );
    std::string str((std::istreambuf_iterator<char>(inputStream)),
                     std::istreambuf_iterator<char>());
    if (document.Parse(str.c_str()).HasParseError())
      {
      itkExceptionMacro("Could not parse JSON");
      return;
      }
  }

  const rapidjson::Value & meshType = document["meshType"];
  const int dimension = meshType["dimension"].GetInt();
  this->SetPointDimension( dimension );

  const std::string pointComponentType( meshType["pointComponentType"].GetString() );
  const CommonEnums::IOComponent pointIOComponentType = IOComponentEnumFromWASMComponentType( pointComponentType );
  this->SetPointComponentType( pointIOComponentType );

  const std::string pointPixelComponentType( meshType["pointPixelComponentType"].GetString() );
  const CommonEnums::IOComponent pointPixelIOComponentType = IOComponentEnumFromWASMComponentType( pointPixelComponentType );
  this->SetPointPixelComponentType( pointPixelIOComponentType );

  const std::string pointPixelType( meshType["pointPixelType"].GetString() );
  const CommonEnums::IOPixel pointIOPixelType = IOPixelEnumFromWASMPixelType( pointPixelType );
  this->SetPointPixelType( pointIOPixelType );

  this->SetNumberOfPointPixelComponents( meshType["pointPixelComponents"].GetInt() );

  const std::string cellComponentType( meshType["cellComponentType"].GetString() );
  const CommonEnums::IOComponent cellIOComponentType = IOComponentEnumFromWASMComponentType( cellComponentType );
  this->SetCellComponentType( cellIOComponentType );

  const std::string cellPixelComponentType( meshType["cellPixelComponentType"].GetString() );
  const CommonEnums::IOComponent cellPixelIOComponentType = IOComponentEnumFromWASMComponentType( cellPixelComponentType );
  this->SetCellPixelComponentType( cellPixelIOComponentType );

  const std::string cellPixelType( meshType["cellPixelType"].GetString() );
  const CommonEnums::IOPixel cellIOPixelType = IOPixelEnumFromWASMPixelType( cellPixelType );
  this->SetCellPixelType( cellIOPixelType );

  this->SetNumberOfCellPixelComponents( meshType["cellPixelComponents"].GetInt() );

  const rapidjson::Value & numberOfPoints = document["numberOfPoints"];
  this->SetNumberOfPoints( numberOfPoints.GetInt() );
  if ( numberOfPoints.GetInt() )
    {
    this->m_UpdatePoints = true;
    }

  const rapidjson::Value & numberOfPointPixels = document["numberOfPointPixels"];
  this->SetNumberOfPointPixels( numberOfPointPixels.GetInt() );
  if ( numberOfPointPixels.GetInt() )
    {
    this->m_UpdatePointData = true;
    }

  const rapidjson::Value & numberOfCells = document["numberOfCells"];
  this->SetNumberOfCells( numberOfCells.GetInt() );
  if ( numberOfCells.GetInt() )
    {
    this->m_UpdateCells = true;
    }

  const rapidjson::Value & numberOfCellPixels = document["numberOfCellPixels"];
  this->SetNumberOfCellPixels( numberOfCellPixels.GetInt() );
  if ( numberOfCellPixels.GetInt() )
    {
    this->m_UpdateCellData = true;
    }

  const rapidjson::Value & cellBufferSize = document["cellBufferSize"];
  this->SetCellBufferSize( cellBufferSize.GetInt() );
}


void
WASMMeshIO
::ReadPoints( void *buffer )
{
  const std::string path(this->GetFileName());
  const std::string dataFile = (path + "/data/points.raw").c_str();
  const SizeValueType numberOfBytesToBeRead =
    static_cast< SizeValueType >( this->GetNumberOfPoints() * this->GetPointDimension() * ITKComponentSize( this->GetPointComponentType() ) );

  std::string::size_type zipPos = path.rfind(".zip");
  if ( ( zipPos != std::string::npos )
       && ( zipPos == path.length() - 4 ) )
  {
    void * zip_reader = NULL;
    mz_zip_reader_create(&zip_reader);
    mz_zip_reader_open_file(zip_reader, path.c_str());

    mz_zip_reader_locate_entry(zip_reader, "data/points.raw", 0);
    mz_zip_reader_entry_open(zip_reader);

    mz_zip_reader_entry_save_buffer(zip_reader, buffer, numberOfBytesToBeRead);
    mz_zip_reader_entry_close(zip_reader);
    mz_zip_reader_close(zip_reader);
    mz_zip_reader_delete(&zip_reader);
  }
  else
  {
  std::ifstream dataStream;
  this->OpenFileForReading( dataStream, dataFile.c_str() );

  if ( !this->ReadBufferAsBinary( dataStream, buffer, numberOfBytesToBeRead ) )
    {
    itkExceptionMacro(<< "Read failed: Wanted "
                      << numberOfBytesToBeRead
                      << " bytes, but read "
                      << dataStream.gcount() << " bytes.");
    }
  }
}


void
WASMMeshIO
::ReadCells( void *buffer )
{
  std::ifstream inputStream;
  this->OpenFileForReading( inputStream, this->GetFileName(), true );
  std::string str((std::istreambuf_iterator<char>(inputStream)),
                   std::istreambuf_iterator<char>());
  rapidjson::Document document;
  if ( document.Parse( str.c_str() ).HasParseError())
    {
    itkExceptionMacro("Could not parse JSON");
    return;
    }

  const std::string dataFile( document["cells"].GetString() );
  std::ifstream dataStream;
  this->OpenFileForReading( dataStream, dataFile.c_str() );
  const SizeValueType numberOfBytesToBeRead =
    static_cast< SizeValueType >( this->GetCellBufferSize() * ITKComponentSize( this->GetCellComponentType() ));

  if ( !this->ReadBufferAsBinary( dataStream, buffer, numberOfBytesToBeRead ) )
    {
    itkExceptionMacro(<< "Read failed: Wanted "
                      << numberOfBytesToBeRead
                      << " bytes, but read "
                      << dataStream.gcount() << " bytes.");
    }
}


void
WASMMeshIO
::ReadPointData( void *buffer )
{
  std::ifstream inputStream;
  this->OpenFileForReading( inputStream, this->GetFileName(), true );
  std::string str((std::istreambuf_iterator<char>(inputStream)),
                   std::istreambuf_iterator<char>());
  rapidjson::Document document;
  if ( document.Parse( str.c_str() ).HasParseError())
    {
    itkExceptionMacro("Could not parse JSON");
    return;
    }

  const std::string dataFile( document["pointData"].GetString() );
  std::ifstream dataStream;
  this->OpenFileForReading( dataStream, dataFile.c_str() );

  const SizeValueType numberOfBytesToBeRead =
    static_cast< SizeValueType >( this->GetNumberOfPointPixels() * this->GetNumberOfPointPixelComponents() * ITKComponentSize( this->GetPointPixelComponentType() ));
  if ( !this->ReadBufferAsBinary( dataStream, buffer, numberOfBytesToBeRead ) )
    {
    itkExceptionMacro(<< "Read failed: Wanted "
                      << numberOfBytesToBeRead
                      << " bytes, but read "
                      << dataStream.gcount() << " bytes.");
    }
}


void
WASMMeshIO
::ReadCellData( void *buffer )
{
  std::ifstream inputStream;
  this->OpenFileForReading( inputStream, this->GetFileName(), true );
  std::string str((std::istreambuf_iterator<char>(inputStream)),
                   std::istreambuf_iterator<char>());
  rapidjson::Document document;
  if ( document.Parse( str.c_str() ).HasParseError())
    {
    itkExceptionMacro("Could not parse JSON");
    return;
    }

  const std::string dataFile( document["cellData"].GetString() );
  std::ifstream dataStream;
  this->OpenFileForReading( dataStream, dataFile.c_str() );

  const SizeValueType numberOfBytesToBeRead =
    static_cast< SizeValueType >( this->GetNumberOfCellPixels() * this->GetNumberOfCellPixelComponents() * ITKComponentSize( this->GetCellPixelComponentType() ));
  if ( !this->ReadBufferAsBinary( dataStream, buffer, numberOfBytesToBeRead ) )
    {
    itkExceptionMacro(<< "Read failed: Wanted "
                      << numberOfBytesToBeRead
                      << " bytes, but read "
                      << dataStream.gcount() << " bytes.");
    }
}


bool
WASMMeshIO
::CanWriteFile(const char *name)
{
  std::string filename = name;

  if( filename == "" )
    {
    return false;
    }

  bool extensionFound = false;
  std::string::size_type extensionPos = filename.rfind(".iwm");
  if ( extensionPos != std::string::npos )
    {
    extensionFound = true;
    }

  if ( !extensionFound )
    {
    itkDebugMacro(<< "The filename extension is not recognized");
    return false;
    }

  return true;
}


void
WASMMeshIO
::WriteMeshInformation()
{
  rapidjson::Document document;
  document.SetObject();
  rapidjson::Document::AllocatorType& allocator = document.GetAllocator();

  rapidjson::Value meshType;
  meshType.SetObject();

  const unsigned int dimension = this->GetPointDimension();
  meshType.AddMember("dimension", rapidjson::Value(dimension).Move(), allocator );

  const std::string pointComponentString = WASMComponentTypeFromIOComponentEnum( this->GetPointComponentType() );
  rapidjson::Value pointComponentType;
  pointComponentType.SetString( pointComponentString.c_str(), allocator );
  meshType.AddMember("pointComponentType", pointComponentType.Move(), allocator );

  const std::string pointPixelComponentString = WASMComponentTypeFromIOComponentEnum( this->GetPointPixelComponentType() );
  rapidjson::Value pointPixelComponentType;
  pointPixelComponentType.SetString( pointPixelComponentString.c_str(), allocator );
  meshType.AddMember("pointPixelComponentType", pointPixelComponentType.Move(), allocator );

  rapidjson::Value pointPixelType;
  pointPixelType.SetString( WASMPixelTypeFromIOPixelEnum( this->GetPointPixelType()).c_str(), allocator );
  meshType.AddMember("pointPixelType", pointPixelType.Move(), allocator );

  meshType.AddMember("pointPixelComponents", rapidjson::Value( this->GetNumberOfPointPixelComponents() ).Move(), allocator );

  // The MeshFileWriter sets this to CellIdentifier / IdentifierType /
  // uint64_t. However, JavaScript does not support 64 bit integers, so force
  // uint32_t
  //const std::string cellComponentString = this->ITKToWASMComponentType( this->GetCellComponentType() );
  const std::string cellComponentString( "uint32_t" );
  rapidjson::Value cellComponentType;
  cellComponentType.SetString( cellComponentString.c_str(), allocator );
  meshType.AddMember("cellComponentType", cellComponentType.Move(), allocator );
  this->SetCellComponentType( CommonEnums::IOComponent::UINT );

  const std::string cellPixelComponentString = WASMComponentTypeFromIOComponentEnum( this->GetCellPixelComponentType() );
  rapidjson::Value cellPixelComponentType;
  cellPixelComponentType.SetString( cellPixelComponentString.c_str(), allocator );
  meshType.AddMember("cellPixelComponentType", cellPixelComponentType.Move(), allocator );

  rapidjson::Value cellPixelType;
  cellPixelType.SetString(WASMPixelTypeFromIOPixelEnum( this->GetCellPixelType() ).c_str(), allocator);
  meshType.AddMember("cellPixelType", cellPixelType, allocator );

  meshType.AddMember("cellPixelComponents", rapidjson::Value( this->GetNumberOfCellPixelComponents() ).Move(), allocator );

  document.AddMember( "meshType", meshType.Move(), allocator );

  rapidjson::Value numberOfPoints;
  numberOfPoints.SetInt( this->GetNumberOfPoints() );
  document.AddMember( "numberOfPoints", numberOfPoints.Move(), allocator );
  if ( this->GetNumberOfPoints() )
    {
    this->m_UpdatePoints = true;
    }

  rapidjson::Value numberOfPointPixels;
  numberOfPointPixels.SetInt( this->GetNumberOfPointPixels() );
  document.AddMember( "numberOfPointPixels", numberOfPointPixels.Move(), allocator );
  if ( this->GetNumberOfPointPixels() )
    {
    this->m_UpdatePointData = true;
    }

  rapidjson::Value numberOfCells;
  numberOfCells.SetInt( this->GetNumberOfCells() );
  document.AddMember( "numberOfCells", numberOfCells.Move(), allocator );
  if ( this->GetNumberOfCells() )
    {
    this->m_UpdateCells = true;
    }

  rapidjson::Value numberOfCellPixels;
  numberOfCellPixels.SetInt( this->GetNumberOfCellPixels() );
  document.AddMember( "numberOfCellPixels", numberOfCellPixels.Move(), allocator );
  if ( this->GetNumberOfCellPixels() )
    {
    this->m_UpdateCellData = true;
    }

  rapidjson::Value cellBufferSize;
  cellBufferSize.SetInt( this->GetCellBufferSize() );
  document.AddMember( "cellBufferSize", cellBufferSize.Move(), allocator );

  std::string pointsDataFileString( std::string( this->GetFileName() ) + ".points.data" );
  rapidjson::Value pointsDataFile;
  pointsDataFile.SetString( pointsDataFileString.c_str(), allocator );
  document.AddMember( "points", pointsDataFile, allocator );

  std::string cellsDataFileString( std::string( this->GetFileName() ) + ".cells.data" );
  rapidjson::Value cellsDataFile;
  cellsDataFile.SetString( cellsDataFileString.c_str(), allocator );
  document.AddMember( "cells", cellsDataFile, allocator );

  std::string pointDataDataFileString( std::string( this->GetFileName() ) + ".pointData.data" );
  rapidjson::Value pointDataDataFile;
  pointDataDataFile.SetString( pointDataDataFileString.c_str(), allocator );
  document.AddMember( "pointData", pointDataDataFile, allocator );

  std::string cellDataDataFileString( std::string( this->GetFileName() ) + ".cellData.data" );
  rapidjson::Value cellDataDataFile;
  cellDataDataFile.SetString( cellDataDataFileString.c_str(), allocator );
  document.AddMember( "cellData", cellDataDataFile, allocator );

  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, this->GetFileName(), true, true );
  rapidjson::OStreamWrapper ostreamWrapper( outputStream );
  rapidjson::PrettyWriter< rapidjson::OStreamWrapper > writer( ostreamWrapper );
  document.Accept( writer );
  outputStream.close();
}


void
WASMMeshIO
::WritePoints( void *buffer )
{
  const std::string fileName = std::string( this->GetFileName() ) + ".points.data";
  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, fileName, true, false );
  const SizeValueType numberOfBytes = this->GetNumberOfPoints() * this->GetPointDimension() * ITKComponentSize( this->GetPointComponentType() );
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
}


void
WASMMeshIO
::WriteCells( void *buffer )
{
  const std::string fileName = std::string( this->GetFileName() ) + ".cells.data";
  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, fileName, true, false );
  const SizeValueType numberOfBytes = this->GetCellBufferSize() * ITKComponentSize( this->GetCellComponentType() );
  // Cast from 64 bit unsigned integers (not supported in JavaScript) to 32
  // bit unsigned integers
  const IdentifierType * bufferIdentifier = static_cast< IdentifierType * >( buffer );
  const SizeValueType cellBufferSize = this->GetCellBufferSize();
  for( SizeValueType ii = 0; ii < cellBufferSize; ++ii )
    {
    const uint32_t asInt32 = static_cast< uint32_t >( bufferIdentifier[ii] );
    outputStream.write(reinterpret_cast< const char * >( &asInt32 ), sizeof( uint32_t ));
    }
  if (outputStream.tellp() != numberOfBytes )
    {
    itkExceptionMacro(<< "Write failed: Wanted to write "
                      << numberOfBytes
                      << " bytes, but wrote "
                      << outputStream.tellp() << " bytes.");
    }
}


void
WASMMeshIO
::WritePointData( void *buffer )
{
  const std::string fileName = std::string( this->GetFileName() ) + ".pointData.data";
  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, fileName, true, false );
  const SizeValueType numberOfBytes = this->GetNumberOfPointPixels() * this->GetNumberOfPointPixelComponents() * ITKComponentSize( this->GetPointPixelComponentType() );
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
}


void
WASMMeshIO
::WriteCellData( void *buffer )
{
  const std::string fileName = std::string( this->GetFileName() ) + ".cellData.data";
  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, fileName, true, false );
  const SizeValueType numberOfBytes = this->GetNumberOfPointPixels() * this->GetNumberOfPointPixelComponents() * ITKComponentSize( this->GetCellPixelComponentType() );
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
}

void
WASMMeshIO
::Write()
{
}

} // end namespace itk
