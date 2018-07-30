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

#include "itkJSONImageIO.h"

#include "itkMetaDataObject.h"
#include "itkIOCommon.h"

#include "rapidjson/document.h"
#include "rapidjson/prettywriter.h"
#include "rapidjson/ostreamwrapper.h"

namespace itk
{

JSONImageIO
::JSONImageIO()
{
  this->SetNumberOfDimensions(3);
  this->AddSupportedWriteExtension(".json");
  this->AddSupportedReadExtension(".json");
}


JSONImageIO
::~JSONImageIO()
{
}


bool
JSONImageIO
::SupportsDimension(unsigned long itkNotUsed(dimension))
{
  return true;
}


void
JSONImageIO
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}


ImageIOBase::IOComponentType
JSONImageIO
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
JSONImageIO
::ITKToJSComponentType(const ImageIOBase::IOComponentType itkComponentType)
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


ImageIOBase::IOPixelType
JSONImageIO
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
    case 13:
      return MATRIX;
    }

  return UNKNOWNPIXELTYPE;
}


int
JSONImageIO
::ITKToJSPixelType( const ImageIOBase::IOPixelType itkPixelType )
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
    case MATRIX:
      return 13;
    }

  return 0;
}


bool
JSONImageIO
::CanReadFile(const char *filename)
{
  // Check the extension first to avoid opening files that do not
  // look like nrrds.  The file must have an appropriate extension to be
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

  if( !document.HasMember("imageType") )
    {
    return false;
    }

  inputStream.close();
  return true;
}


void
JSONImageIO
::ReadImageInformation()
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


  const rapidjson::Value & imageType = document["imageType"];
  const int dimension = imageType["dimension"].GetInt();
  this->SetNumberOfDimensions( dimension );
  const std::string componentType( imageType["componentType"].GetString() );
  const ImageIOBase::IOComponentType ioComponentType = this->JSToITKComponentType( componentType );
  this->SetComponentType( ioComponentType );
  const int pixelType( imageType["pixelType"].GetInt() );
  const ImageIOBase::IOPixelType ioPixelType = this->JSToITKPixelType( pixelType );
  this->SetPixelType( ioPixelType );
  this->SetNumberOfComponents( imageType["components"].GetInt() );

  const rapidjson::Value & origin = document["origin"];
  int count = 0;
  for( rapidjson::Value::ConstValueIterator itr = origin.Begin(); itr != origin.End(); ++itr )
    {
    this->SetOrigin( count, itr->GetDouble() );
    ++count;
    }

  const rapidjson::Value & spacing = document["spacing"];
  count = 0;
  for( rapidjson::Value::ConstValueIterator itr = spacing.Begin(); itr != spacing.End(); ++itr )
    {
    this->SetSpacing( count, itr->GetDouble() );
    ++count;
    }

  const rapidjson::Value & directionContainer = document["direction"];
  const rapidjson::Value & direction = directionContainer["data"];
  count = 0;
  for( rapidjson::Value::ConstValueIterator itr = direction.Begin(); itr != direction.End(); )
    {
    std::vector< double > direction( dimension );
    for( unsigned int ii = 0; ii < dimension; ++ii )
      {
      direction[ii] = itr->GetDouble();
      ++itr;
      }
    this->SetDirection( count, direction );
    ++count;
    }

  const rapidjson::Value & size = document["size"];
  count = 0;
  for( rapidjson::Value::ConstValueIterator itr = size.Begin(); itr != size.End(); ++itr )
    {
    this->SetDimensions( count, itr->GetInt() );
    ++count;
    }
}


void
JSONImageIO
::Read( void *buffer )
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

  const std::string dataFile( document["data"].GetString() );
  std::ifstream dataStream;
  this->OpenFileForReading( dataStream, dataFile.c_str() );

  const SizeValueType numberOfBytesToBeRead =
    static_cast< SizeValueType >( this->GetImageSizeInBytes() );
  if ( !this->ReadBufferAsBinary( dataStream, buffer, numberOfBytesToBeRead ) )
    {
    itkExceptionMacro(<< "Read failed: Wanted "
                      << numberOfBytesToBeRead
                      << " bytes, but read "
                      << dataStream.gcount() << " bytes.");
    }
}


bool
JSONImageIO
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
JSONImageIO
::WriteImageInformation()
{
  rapidjson::Document document;
  document.SetObject();
  rapidjson::Document::AllocatorType& allocator = document.GetAllocator();

  rapidjson::Value imageType;
  imageType.SetObject();

  const unsigned int dimension = this->GetNumberOfDimensions();
  imageType.AddMember("dimension", rapidjson::Value(dimension).Move(), allocator );

  const std::string componentString = this->ITKToJSComponentType( this->GetComponentType() );
  rapidjson::Value componentType;
  componentType.SetString( componentString.c_str(), allocator );
  imageType.AddMember("componentType", componentType.Move(), allocator );

  const int pixelType = this->ITKToJSPixelType( this->GetPixelType() );
  imageType.AddMember("pixelType", rapidjson::Value(pixelType).Move(), allocator );

  imageType.AddMember("components", rapidjson::Value( this->GetNumberOfComponents() ).Move(), allocator );

  document.AddMember( "imageType", imageType.Move(), allocator );

  rapidjson::Value origin(rapidjson::kArrayType);
  for( unsigned int ii = 0; ii < dimension; ++ii )
    {
    origin.PushBack(rapidjson::Value().SetDouble(this->GetOrigin( ii )), allocator);
    }
  document.AddMember( "origin", origin.Move(), allocator );

  rapidjson::Value spacing(rapidjson::kArrayType);
  for( unsigned int ii = 0; ii < dimension; ++ii )
    {
    spacing.PushBack(rapidjson::Value().SetDouble(this->GetSpacing( ii )), allocator);
    }
  document.AddMember( "spacing", spacing.Move(), allocator );

  rapidjson::Value direction(rapidjson::kArrayType);
  for( unsigned int ii = 0; ii < dimension; ++ii )
    {
    const std::vector< double > dimensionDirection = this->GetDirection( ii );
    for( unsigned int jj = 0; jj < dimension; ++jj )
      {
      direction.PushBack(rapidjson::Value().SetDouble( dimensionDirection[jj] ), allocator);
      }
    }
  document.AddMember( "direction", direction.Move(), allocator );

  rapidjson::Value size(rapidjson::kArrayType);
  for( unsigned int ii = 0; ii < dimension; ++ii )
    {
    size.PushBack(rapidjson::Value().SetInt( this->GetDimensions( ii ) ), allocator);
    }
  document.AddMember( "size", size.Move(), allocator );

  std::string dataFileString( std::string( this->GetFileName() ) + ".data" );
  rapidjson::Value dataFile;
  dataFile.SetString( dataFileString.c_str(), allocator );
  document.AddMember( "data", dataFile, allocator );

  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, this->GetFileName(), true, true );
  rapidjson::OStreamWrapper ostreamWrapper( outputStream );
  rapidjson::PrettyWriter< rapidjson::OStreamWrapper > writer( ostreamWrapper );
  document.Accept( writer );
  outputStream.close();
}


void
JSONImageIO
::Write( const void *buffer )
{
  this->WriteImageInformation();
  const std::string fileName = std::string( this->GetFileName() ) + ".data";
  std::ofstream outputStream;
  this->OpenFileForWriting( outputStream, fileName, true, false );
  const SizeValueType numberOfBytes = this->GetImageSizeInBytes();
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
}

} // end namespace itk
