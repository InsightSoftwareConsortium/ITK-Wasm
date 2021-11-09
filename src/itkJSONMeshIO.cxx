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

#include "itkJSONMeshIO.h"

#include "itkMetaDataObject.h"
#include "itkIOCommon.h"
#include "itksys/SystemTools.hxx"

#include "rapidjson/document.h"
#include "rapidjson/prettywriter.h"
#include "rapidjson/ostreamwrapper.h"

namespace itk
{

JSONMeshIO
::JSONMeshIO()
{
  this->AddSupportedWriteExtension(".json");
  this->AddSupportedReadExtension(".json");
}


JSONMeshIO
::~JSONMeshIO()
{
}


void
JSONMeshIO
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}


void
JSONMeshIO
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
JSONMeshIO
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
JSONMeshIO
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


CommonEnums::IOComponent
JSONMeshIO
::WASMToITKComponentType(const std::string & jsComponentType)
{
  if( jsComponentType == "int8_t" )
    {
    return CommonEnums::IOComponent::CHAR;
    }
  else if( jsComponentType == "uint8_t" )
    {
    return CommonEnums::IOComponent::UCHAR;
    }
  else if( jsComponentType == "int16_t" )
    {
    return CommonEnums::IOComponent::SHORT;
    }
  else if( jsComponentType == "uint16_t" )
    {
    return CommonEnums::IOComponent::USHORT;
    }
  else if( jsComponentType == "int32_t" )
    {
    return CommonEnums::IOComponent::INT;
    }
  else if( jsComponentType == "uint32_t" )
    {
    return CommonEnums::IOComponent::UINT;
    }
  else if( jsComponentType == "int64_t" )
    {
    return CommonEnums::IOComponent::LONGLONG;
    }
  else if( jsComponentType == "uint64_t" )
    {
    return CommonEnums::IOComponent::ULONGLONG;
    }
  else if( jsComponentType == "float" )
    {
    return CommonEnums::IOComponent::FLOAT;
    }
  else if( jsComponentType == "double" )
    {
    return CommonEnums::IOComponent::DOUBLE;
    }
  return CommonEnums::IOComponent::UNKNOWNCOMPONENTTYPE;
}


std::string
JSONMeshIO
::ITKToWASMComponentType(const CommonEnums::IOComponent itkComponentType)
{
  switch ( itkComponentType )
    {
    case CommonEnums::IOComponent::CHAR:
      return "int8_t";

    case CommonEnums::IOComponent::UCHAR:
      return "uint8_t";

    case CommonEnums::IOComponent::SHORT:
      return "int16_t";

    case CommonEnums::IOComponent::USHORT:
      return "uint16_t";

    case CommonEnums::IOComponent::INT:
      return "int32_t";

    case CommonEnums::IOComponent::UINT:
      return "uint32_t";

    case CommonEnums::IOComponent::LONG:
      return "int64_t";

    case CommonEnums::IOComponent::ULONG:
      return "uint64_t";

    case CommonEnums::IOComponent::LONGLONG:
      return "int64_t";

    case CommonEnums::IOComponent::ULONGLONG:
      return "uint64_t";

    case CommonEnums::IOComponent::FLOAT:
      return "float";

    case CommonEnums::IOComponent::DOUBLE:
      return "double";

    default:
      return "null";
    }
}


size_t
JSONMeshIO
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

CommonEnums::IOPixel
JSONMeshIO
::WASMToITKPixelType( const int jsPixelType )
{
  switch ( jsPixelType )
    {
    case 0:
      return CommonEnums::IOPixel::UNKNOWNPIXELTYPE;
    case 1:
      return CommonEnums::IOPixel::SCALAR;
    case 2:
      return CommonEnums::IOPixel::RGB;
    case 3:
      return CommonEnums::IOPixel::RGBA;
    case 4:
      return CommonEnums::IOPixel::OFFSET;
    case 5:
      return CommonEnums::IOPixel::VECTOR;
    case 6:
      return CommonEnums::IOPixel::POINT;
    case 7:
      return CommonEnums::IOPixel::COVARIANTVECTOR;
    case 8:
      return CommonEnums::IOPixel::SYMMETRICSECONDRANKTENSOR;
    case 9:
      return CommonEnums::IOPixel::DIFFUSIONTENSOR3D;
    case 10:
      return CommonEnums::IOPixel::COMPLEX;
    case 11:
      return CommonEnums::IOPixel::FIXEDARRAY;
    case 12:
      return CommonEnums::IOPixel::ARRAY;
    case 13:
      return CommonEnums::IOPixel::MATRIX;
    case 14:
      return CommonEnums::IOPixel::VARIABLELENGTHVECTOR;
    case 15:
      return CommonEnums::IOPixel::VARIABLESIZEMATRIX;
    }

  return CommonEnums::IOPixel::UNKNOWNPIXELTYPE;
}


int
JSONMeshIO
::ITKToWASMPixelType( const CommonEnums::IOPixel itkPixelType )
{
  switch ( itkPixelType )
    {
    case CommonEnums::IOPixel::UNKNOWNPIXELTYPE:
      return 0;
    case CommonEnums::IOPixel::SCALAR:
      return 1;
    case CommonEnums::IOPixel::RGB:
      return 2;
    case CommonEnums::IOPixel::RGBA:
      return 3;
    case CommonEnums::IOPixel::OFFSET:
      return 4;
    case CommonEnums::IOPixel::VECTOR:
      return 5;
    case CommonEnums::IOPixel::POINT:
      return 6;
    case CommonEnums::IOPixel::COVARIANTVECTOR:
      return 7;
    case CommonEnums::IOPixel::SYMMETRICSECONDRANKTENSOR:
      return 7;
    case CommonEnums::IOPixel::DIFFUSIONTENSOR3D:
      return 7;
    case CommonEnums::IOPixel::COMPLEX:
      return 10;
    case CommonEnums::IOPixel::FIXEDARRAY:
      return 11;
    case CommonEnums::IOPixel::ARRAY:
      return 12;
    case CommonEnums::IOPixel::MATRIX:
      return 13;
    case CommonEnums::IOPixel::VARIABLELENGTHVECTOR:
      return 14;
    case CommonEnums::IOPixel::VARIABLESIZEMATRIX:
      return 15;
    }

  return 0;
}


bool
JSONMeshIO
::CanReadFile(const char *filename)
{
  // Check the extension first to avoid opening files that do not
  // look like JSON.  The file must have an appropriate extension to be
  // recognized.
  std::string fname = filename;

  bool extensionFound = false;
  std::string::size_type jsonPos = fname.rfind(".json");
  if ( ( jsonPos != std::string::npos )
       && ( jsonPos == fname.length() - 5 ) )
    {
    extensionFound = true;
    }

  if ( !extensionFound )
    {
    itkDebugMacro(<< "The filename extension is not recognized");
    return false;
    }


  std::ifstream inputStream;
  try
    {
    this->OpenFileForReading( inputStream, fname, true );
    }
  catch( ExceptionObject & )
    {
    return false;
    }

  std::string str((std::istreambuf_iterator<char>(inputStream)),
                   std::istreambuf_iterator<char>());
  rapidjson::Document document;
  if( document.Parse( str.c_str() ).HasParseError() )
    {
    inputStream.close();
    return false;
    }

  if( !document.HasMember("meshType") )
    {
    return false;
    }

  inputStream.close();
  return true;
}


void
JSONMeshIO
::ReadMeshInformation()
{
  this->SetByteOrderToLittleEndian();

  std::ifstream inputStream;
  this->OpenFileForReading( inputStream, this->GetFileName(), true );
  rapidjson::Document document;
  std::string str((std::istreambuf_iterator<char>(inputStream)),
                   std::istreambuf_iterator<char>());
  if (document.Parse(str.c_str()).HasParseError())
    {
    itkExceptionMacro("Could not parse JSON");
    return;
    }


  const rapidjson::Value & meshType = document["meshType"];
  const int dimension = meshType["dimension"].GetInt();
  this->SetPointDimension( dimension );

  const std::string pointComponentType( meshType["pointComponentType"].GetString() );
  const CommonEnums::IOComponent pointIOComponentType = this->WASMToITKComponentType( pointComponentType );
  this->SetPointComponentType( pointIOComponentType );

  const std::string pointPixelComponentType( meshType["pointPixelComponentType"].GetString() );
  const CommonEnums::IOComponent pointPixelIOComponentType = this->WASMToITKComponentType( pointPixelComponentType );
  this->SetPointPixelComponentType( pointPixelIOComponentType );

  const int pointPixelType( meshType["pointPixelType"].GetInt() );
  const CommonEnums::IOPixel pointIOPixelType = this->WASMToITKPixelType( pointPixelType );
  this->SetPointPixelType( pointIOPixelType );

  this->SetNumberOfPointPixelComponents( meshType["pointPixelComponents"].GetInt() );

  const std::string cellComponentType( meshType["cellComponentType"].GetString() );
  const CommonEnums::IOComponent cellIOComponentType = this->WASMToITKComponentType( cellComponentType );
  this->SetCellComponentType( cellIOComponentType );

  const std::string cellPixelComponentType( meshType["cellPixelComponentType"].GetString() );
  const CommonEnums::IOComponent cellPixelIOComponentType = this->WASMToITKComponentType( cellPixelComponentType );
  this->SetCellPixelComponentType( cellPixelIOComponentType );

  const int cellPixelType( meshType["cellPixelType"].GetInt() );
  const CommonEnums::IOPixel cellIOPixelType = this->WASMToITKPixelType( cellPixelType );
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
JSONMeshIO
::ReadPoints( void *buffer )
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

  const std::string dataFile( document["points"].GetString() );
  std::ifstream dataStream;
  this->OpenFileForReading( dataStream, dataFile.c_str() );

  const SizeValueType numberOfBytesToBeRead =
    static_cast< SizeValueType >( this->GetNumberOfPoints() * this->GetPointDimension() * ITKComponentSize( this->GetPointComponentType() ) );
  if ( !this->ReadBufferAsBinary( dataStream, buffer, numberOfBytesToBeRead ) )
    {
    itkExceptionMacro(<< "Read failed: Wanted "
                      << numberOfBytesToBeRead
                      << " bytes, but read "
                      << dataStream.gcount() << " bytes.");
    }
}


void
JSONMeshIO
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
JSONMeshIO
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
JSONMeshIO
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
JSONMeshIO
::CanWriteFile(const char *name)
{
  std::string filename = name;

  if( filename == "" )
    {
    return false;
    }

  bool extensionFound = false;
  std::string::size_type jsonPos = filename.rfind(".json");
  if ( ( jsonPos != std::string::npos )
       && ( jsonPos == filename.length() - 5 ) )
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
JSONMeshIO
::WriteMeshInformation()
{
  rapidjson::Document document;
  document.SetObject();
  rapidjson::Document::AllocatorType& allocator = document.GetAllocator();

  rapidjson::Value meshType;
  meshType.SetObject();

  const unsigned int dimension = this->GetPointDimension();
  meshType.AddMember("dimension", rapidjson::Value(dimension).Move(), allocator );

  const std::string pointComponentString = this->ITKToWASMComponentType( this->GetPointComponentType() );
  rapidjson::Value pointComponentType;
  pointComponentType.SetString( pointComponentString.c_str(), allocator );
  meshType.AddMember("pointComponentType", pointComponentType.Move(), allocator );

  const std::string pointPixelComponentString = this->ITKToWASMComponentType( this->GetPointPixelComponentType() );
  rapidjson::Value pointPixelComponentType;
  pointPixelComponentType.SetString( pointPixelComponentString.c_str(), allocator );
  meshType.AddMember("pointPixelComponentType", pointPixelComponentType.Move(), allocator );

  const int pointPixelType = this->ITKToWASMPixelType( this->GetPointPixelType() );
  meshType.AddMember("pointPixelType", rapidjson::Value(pointPixelType).Move(), allocator );

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

  const std::string cellPixelComponentString = this->ITKToWASMComponentType( this->GetCellPixelComponentType() );
  rapidjson::Value cellPixelComponentType;
  cellPixelComponentType.SetString( cellPixelComponentString.c_str(), allocator );
  meshType.AddMember("cellPixelComponentType", cellPixelComponentType.Move(), allocator );

  const int cellPixelType = this->ITKToWASMPixelType( this->GetCellPixelType() );
  meshType.AddMember("cellPixelType", rapidjson::Value(cellPixelType).Move(), allocator );

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
JSONMeshIO
::WritePoints( void *buffer )
{
  const std::string fileName = std::string( this->GetFileName() ) + ".points.data";
  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, fileName, true, false );
  const SizeValueType numberOfBytes = this->GetNumberOfPoints() * this->GetPointDimension() * ITKComponentSize( this->GetPointComponentType() );
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
}


void
JSONMeshIO
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
JSONMeshIO
::WritePointData( void *buffer )
{
  const std::string fileName = std::string( this->GetFileName() ) + ".pointData.data";
  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, fileName, true, false );
  const SizeValueType numberOfBytes = this->GetNumberOfPointPixels() * this->GetNumberOfPointPixelComponents() * ITKComponentSize( this->GetPointPixelComponentType() );
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
}


void
JSONMeshIO
::WriteCellData( void *buffer )
{
  const std::string fileName = std::string( this->GetFileName() ) + ".cellData.data";
  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, fileName, true, false );
  const SizeValueType numberOfBytes = this->GetNumberOfPointPixels() * this->GetNumberOfPointPixelComponents() * ITKComponentSize( this->GetCellPixelComponentType() );
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
}

void
JSONMeshIO
::Write()
{
}

} // end namespace itk
