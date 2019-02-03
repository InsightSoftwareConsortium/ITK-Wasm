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


MeshIOBase::IOComponentType
JSONMeshIO
::JSToITKComponentType(const std::string & jsComponentType)
{
  if( jsComponentType == "int8_t" )
    {
    return CHAR;
    }
  else if( jsComponentType == "uint8_t" )
    {
    return UCHAR;
    }
  else if( jsComponentType == "int16_t" )
    {
    return SHORT;
    }
  else if( jsComponentType == "uint16_t" )
    {
    return USHORT;
    }
  else if( jsComponentType == "int32_t" )
    {
    return INT;
    }
  else if( jsComponentType == "uint32_t" )
    {
    return UINT;
    }
  else if( jsComponentType == "int64_t" )
    {
    return LONGLONG;
    }
  else if( jsComponentType == "uint64_t" )
    {
    return ULONGLONG;
    }
  else if( jsComponentType == "float" )
    {
    return FLOAT;
    }
  else if( jsComponentType == "double" )
    {
    return DOUBLE;
    }
  return UNKNOWNCOMPONENTTYPE;
}


std::string
JSONMeshIO
::ITKToJSComponentType(const MeshIOBase::IOComponentType itkComponentType)
{
  switch ( itkComponentType )
    {
    case CHAR:
      return "int8_t";

    case UCHAR:
      return "uint8_t";

    case SHORT:
      return "int16_t";

    case USHORT:
      return "uint16_t";

    case INT:
      return "int32_t";

    case UINT:
      return "uint32_t";

    case LONG:
      return "int64_t";

    case ULONG:
      return "uint64_t";

    case LONGLONG:
      return "int64_t";

    case ULONGLONG:
      return "uint64_t";

    case FLOAT:
      return "float";

    case DOUBLE:
      return "double";

    default:
      return "int8_t";
    }
}


MeshIOBase::IOPixelType
JSONMeshIO
::JSToITKPixelType( const int jsPixelType )
{
  switch ( jsPixelType )
    {
    case 0:
      return UNKNOWNPIXELTYPE;
    case 1:
      return SCALAR;
    case 2:
      return RGB;
    case 3:
      return RGBA;
    case 4:
      return OFFSET;
    case 5:
      return VECTOR;
    case 6:
      return POINT;
    case 7:
      return COVARIANTVECTOR;
    case 8:
      return SYMMETRICSECONDRANKTENSOR;
    case 9:
      return DIFFUSIONTENSOR3D;
    case 10:
      return COMPLEX;
    case 11:
      return FIXEDARRAY;
    case 12:
      return ARRAY;
    case 13:
      return MATRIX;
    case 14:
      return VARIABLELENGTHVECTOR;
    case 15:
      return VARIABLESIZEMATRIX;
    }

  return UNKNOWNPIXELTYPE;
}


int
JSONMeshIO
::ITKToJSPixelType( const MeshIOBase::IOPixelType itkPixelType )
{
  switch ( itkPixelType )
    {
    case UNKNOWNPIXELTYPE:
      return 0;
    case SCALAR:
      return 1;
    case RGB:
      return 2;
    case RGBA:
      return 3;
    case OFFSET:
      return 4;
    case VECTOR:
      return 5;
    case POINT:
      return 6;
    case COVARIANTVECTOR:
      return 7;
    case SYMMETRICSECONDRANKTENSOR:
      return 7;
    case DIFFUSIONTENSOR3D:
      return 7;
    case COMPLEX:
      return 10;
    case FIXEDARRAY:
      return 11;
    case ARRAY:
      return 12;
    case MATRIX:
      return 13;
    case VARIABLELENGTHVECTOR:
      return 14;
    case VARIABLESIZEMATRIX:
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
  const MeshIOBase::IOComponentType pointIOComponentType = this->JSToITKComponentType( pointComponentType );
  this->SetPointComponentType( pointIOComponentType );

  const int pointPixelType( meshType["pointPixelType"].GetInt() );
  const MeshIOBase::IOPixelType pointIOPixelType = this->JSToITKPixelType( pointPixelType );
  this->SetPointPixelType( pointIOPixelType );

  this->SetNumberOfPointPixelComponents( meshType["pointPixelComponents"].GetInt() );

  const std::string cellComponentType( meshType["cellComponentType"].GetString() );
  const MeshIOBase::IOComponentType cellIOComponentType = this->JSToITKComponentType( cellComponentType );
  this->SetCellComponentType( cellIOComponentType );

  const int cellPixelType( meshType["cellPixelType"].GetInt() );
  const MeshIOBase::IOPixelType cellIOPixelType = this->JSToITKPixelType( cellPixelType );
  this->SetCellPixelType( cellIOPixelType );

  this->SetNumberOfCellPixelComponents( meshType["cellPixelComponents"].GetInt() );

  const rapidjson::Value & numberOfPoints = document["numberOfPoints"];
  this->SetNumberOfPoints( numberOfPoints.GetInt() );

  const rapidjson::Value & numberOfPointPixels = document["numberOfPointPixels"];
  this->SetNumberOfPointPixels( numberOfPointPixels.GetInt() );

  const rapidjson::Value & numberOfCells = document["numberOfCells"];
  this->SetNumberOfCells( numberOfCells.GetInt() );

  const rapidjson::Value & numberOfCellPixels = document["numberOfCellPixels"];
  this->SetNumberOfCellPixels( numberOfCellPixels.GetInt() );

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
    static_cast< SizeValueType >( this->GetNumberOfPoints() * this->GetPointDimension() );
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

  if ( !this->ReadBufferAsBinary( dataStream, buffer, this->GetCellBufferSize() ) )
    {
    itkExceptionMacro(<< "Read failed: Wanted "
                      << this->GetCellBufferSize()
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
    static_cast< SizeValueType >( this->GetNumberOfPointPixels() * this->GetNumberOfPointPixelComponents() );
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
    static_cast< SizeValueType >( this->GetNumberOfCellPixels() * this->GetNumberOfCellPixelComponents() );
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

  const std::string pointComponentString = this->ITKToJSComponentType( this->GetPointComponentType() );
  rapidjson::Value pointComponentType;
  pointComponentType.SetString( pointComponentString.c_str(), allocator );
  meshType.AddMember("pointComponentType", pointComponentType.Move(), allocator );

  const int pointPixelType = this->ITKToJSPixelType( this->GetPointPixelType() );
  meshType.AddMember("pointPixelType", rapidjson::Value(pointPixelType).Move(), allocator );

  meshType.AddMember("pointPixelComponents", rapidjson::Value( this->GetNumberOfPointPixelComponents() ).Move(), allocator );

  const std::string cellComponentString = this->ITKToJSComponentType( this->GetCellComponentType() );
  rapidjson::Value cellComponentType;
  cellComponentType.SetString( cellComponentString.c_str(), allocator );
  meshType.AddMember("cellComponentType", cellComponentType.Move(), allocator );

  const int cellPixelType = this->ITKToJSPixelType( this->GetCellPixelType() );
  meshType.AddMember("cellPixelType", rapidjson::Value(cellPixelType).Move(), allocator );

  meshType.AddMember("cellPixelComponents", rapidjson::Value( this->GetNumberOfCellPixelComponents() ).Move(), allocator );

  document.AddMember( "meshType", meshType.Move(), allocator );

  rapidjson::Value numberOfPoints;
  numberOfPoints.SetInt( this->GetNumberOfPoints() );
  document.AddMember( "numberOfPoints", numberOfPoints.Move(), allocator );

  rapidjson::Value numberOfPointPixels;
  numberOfPointPixels.SetInt( this->GetNumberOfPointPixels() );
  document.AddMember( "numberOfPointPixels", numberOfPointPixels.Move(), allocator );

  rapidjson::Value numberOfCells;
  numberOfCells.SetInt( this->GetNumberOfCells() );
  document.AddMember( "numberOfCells", numberOfCells.Move(), allocator );

  rapidjson::Value numberOfCellPixels;
  numberOfCellPixels.SetInt( this->GetNumberOfCellPixels() );
  document.AddMember( "numberOfCellPixels", numberOfCellPixels.Move(), allocator );

  rapidjson::Value cellBufferSize;
  cellBufferSize.SetInt( this->GetCellBufferSize() );
  document.AddMember( "cellBufferSize", cellBufferSize.Move(), allocator );

  std::string pointsDataFileString( std::string( this->GetFileName() ) + "points.data" );
  rapidjson::Value pointsDataFile;
  pointsDataFile.SetString( pointsDataFileString.c_str(), allocator );
  document.AddMember( "points", pointsDataFile, allocator );

  std::string cellsDataFileString( std::string( this->GetFileName() ) + "cells.data" );
  rapidjson::Value cellsDataFile;
  cellsDataFile.SetString( cellsDataFileString.c_str(), allocator );
  document.AddMember( "cells", cellsDataFile, allocator );

  std::string pointDataDataFileString( std::string( this->GetFileName() ) + "pointData.data" );
  rapidjson::Value pointDataDataFile;
  pointDataDataFile.SetString( pointDataDataFileString.c_str(), allocator );
  document.AddMember( "pointData", pointDataDataFile, allocator );

  std::string cellDataDataFileString( std::string( this->GetFileName() ) + "cellData.data" );
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
  this->WriteMeshInformation();
  const std::string fileName = std::string( this->GetFileName() ) + "points.data";
  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, fileName, true, false );
  const SizeValueType numberOfBytes = this->GetNumberOfPoints() * this->GetPointDimension();
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
}


void
JSONMeshIO
::WriteCells( void *buffer )
{
  const std::string fileName = std::string( this->GetFileName() ) + "cell.data";
  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, fileName, true, false );
  const SizeValueType numberOfBytes = this->GetCellBufferSize();
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
}


void
JSONMeshIO
::WritePointData( void *buffer )
{
  const std::string fileName = std::string( this->GetFileName() ) + "pointData.data";
  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, fileName, true, false );
  const SizeValueType numberOfBytes = this->GetNumberOfPointPixels() * this->GetNumberOfPointPixelComponents();
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
}


void
JSONMeshIO
::WriteCellData( void *buffer )
{
  const std::string fileName = std::string( this->GetFileName() ) + "cellData.data";
  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, fileName, true, false );
  const SizeValueType numberOfBytes = this->GetNumberOfPointPixels() * this->GetNumberOfPointPixelComponents();
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
}

void
JSONMeshIO
::Write()
{
}

} // end namespace itk
