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

#include "itkWASMImageIO.h"

#include "itkMetaDataObject.h"
#include "itkIOCommon.h"
#include "itksys/SystemTools.hxx"

#include "rapidjson/document.h"
#include "rapidjson/prettywriter.h"
#include "rapidjson/ostreamwrapper.h"

#include <filesystem>

#include "zip.h"

namespace itk
{

WASMImageIO
::WASMImageIO()
{
  this->SetNumberOfDimensions(3);
  this->AddSupportedWriteExtension(".iwi");
  this->AddSupportedWriteExtension(".iwi.zip");
  this->AddSupportedReadExtension(".iwi");
  this->AddSupportedReadExtension(".iwi.zip");
}


WASMImageIO
::~WASMImageIO()
{
}


bool
WASMImageIO
::SupportsDimension(unsigned long itkNotUsed(dimension))
{
  return true;
}


void
WASMImageIO
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}


ImageIOBase::IOComponentEnum
WASMImageIO
::WASMToITKComponentType(const std::string & wasmComponentType)
{
  if( wasmComponentType == "int8_t" )
    {
    return IOComponentEnum::CHAR;
    }
  else if( wasmComponentType == "uint8_t" )
    {
    return IOComponentEnum::UCHAR;
    }
  else if( wasmComponentType == "int16_t" )
    {
    return IOComponentEnum::SHORT;
    }
  else if( wasmComponentType == "uint16_t" )
    {
    return IOComponentEnum::USHORT;
    }
  else if( wasmComponentType == "int32_t" )
    {
    return IOComponentEnum::INT;
    }
  else if( wasmComponentType == "uint32_t" )
    {
    return IOComponentEnum::UINT;
    }
  else if( wasmComponentType == "int64_t" )
    {
    return IOComponentEnum::LONGLONG;
    }
  else if( wasmComponentType == "uint64_t" )
    {
    return IOComponentEnum::ULONGLONG;
    }
  else if( wasmComponentType == "float" )
    {
    return IOComponentEnum::FLOAT;
    }
  else if( wasmComponentType == "double" )
    {
    return IOComponentEnum::DOUBLE;
    }
  return IOComponentEnum::UNKNOWNCOMPONENTTYPE;
}


std::string
WASMImageIO
::ITKToWASMComponentType(const ImageIOBase::IOComponentEnum itkComponentType)
{
  switch ( itkComponentType )
    {
    case IOComponentEnum::CHAR:
      return "int8_t";

    case IOComponentEnum::UCHAR:
      return "uint8_t";

    case IOComponentEnum::SHORT:
      return "int16_t";

    case IOComponentEnum::USHORT:
      return "uint16_t";

    case IOComponentEnum::INT:
      return "int32_t";

    case IOComponentEnum::UINT:
      return "uint32_t";

    case IOComponentEnum::LONG:
      return "int64_t";

    case IOComponentEnum::ULONG:
      return "uint64_t";

    case IOComponentEnum::LONGLONG:
      return "int64_t";

    case IOComponentEnum::ULONGLONG:
      return "uint64_t";

    case IOComponentEnum::FLOAT:
      return "float";

    case IOComponentEnum::DOUBLE:
      return "double";

    default:
      return "int8_t";
    }
}


IOPixelEnum
WASMImageIO
::WASMToITKPixelType( const std::string & wasmPixelType )
{
  if ( wasmPixelType == "Unknown" )
    {
    return IOPixelEnum::UNKNOWNPIXELTYPE;
    }
  else if ( wasmPixelType == "Scalar" )
    {
    return IOPixelEnum::SCALAR;
    }
  else if ( wasmPixelType == "RGB" )
    {
    return IOPixelEnum::RGB;
    }
  else if ( wasmPixelType == "RGBA" )
    {
    return IOPixelEnum::RGBA;
    }
  else if ( wasmPixelType == "Offset" )
    {
    return IOPixelEnum::OFFSET;
    }
  else if ( wasmPixelType == "Vector" )
    {
    return IOPixelEnum::VECTOR;
    }
  else if ( wasmPixelType == "Point" )
    {
    return IOPixelEnum::POINT;
    }
  else if ( wasmPixelType == "CovariantVector" )
    {
    return IOPixelEnum::COVARIANTVECTOR;
    }
  else if ( wasmPixelType == "SymmetricSecondRankTensor" )
    {
    return IOPixelEnum::SYMMETRICSECONDRANKTENSOR;
    }
  else if ( wasmPixelType == "DiffusionTensor3D" )
    {
    return IOPixelEnum::DIFFUSIONTENSOR3D;
    }
  else if ( wasmPixelType == "Complex" )
    {
    return IOPixelEnum::COMPLEX;
    }
  else if ( wasmPixelType == "FixedArray" )
    {
    return IOPixelEnum::FIXEDARRAY;
    }
  else if ( wasmPixelType == "Array" )
    {
    return IOPixelEnum::ARRAY;
    }
  else if ( wasmPixelType == "Matrix" )
    {
    return IOPixelEnum::MATRIX;
    }
  else if ( wasmPixelType == "VariableLengthVector" )
    {
    return IOPixelEnum::VARIABLELENGTHVECTOR;
    }
  else if ( wasmPixelType == "VariableSizeMatrix" )
    {
    return IOPixelEnum::VARIABLESIZEMATRIX;
    }

  return IOPixelEnum::UNKNOWNPIXELTYPE;
}


std::string
WASMImageIO
::ITKToWASMPixelType( const IOPixelEnum itkPixelType )
{
  switch ( itkPixelType )
    {
    case IOPixelEnum::UNKNOWNPIXELTYPE:
      return "Unknown";
    case IOPixelEnum::SCALAR:
      return "Scalar";
    case IOPixelEnum::RGB:
      return "RGB";
    case IOPixelEnum::RGBA:
      return "RGBA";
    case IOPixelEnum::OFFSET:
      return "Offset";
    case IOPixelEnum::VECTOR:
      return "Vector";
    case IOPixelEnum::POINT:
      return "Point";
    case IOPixelEnum::COVARIANTVECTOR:
      return "CovariantVector";
    case IOPixelEnum::SYMMETRICSECONDRANKTENSOR:
      return "SymmetricSecondRankTensor";
    case IOPixelEnum::DIFFUSIONTENSOR3D:
      return "DiffusionTensor3D";
    case IOPixelEnum::COMPLEX:
      return "Complex";
    case IOPixelEnum::FIXEDARRAY:
      return "FixedArray";
    case IOPixelEnum::ARRAY:
      return "Array";
    case IOPixelEnum::MATRIX:
      return "Matrix";
    case IOPixelEnum::VARIABLELENGTHVECTOR:
      return "VariableLengthVector";
    case IOPixelEnum::VARIABLESIZEMATRIX:
      return "VariableSizeMatrix";
    }

  return "Unknown";
}


bool
WASMImageIO
::CanReadFile(const char *filename)
{
  // Check the extension first to avoid opening files that do not
  // look like nrrds.  The file must have an appropriate extension to be
  // recognized.
  std::string fname = filename;

  bool extensionFound = false;
  std::string::size_type extensionPos = fname.rfind(".iwi");
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
WASMImageIO
::ReadImageInformation()
{
  this->SetByteOrderToLittleEndian();
  rapidjson::Document document;

  const std::string path = this->GetFileName();
  const auto indexPath = std::filesystem::path(path) / "index.json";
  const auto dataPath = std::filesystem::path(path) / "data";

  std::string::size_type zipPos = path.rfind(".zip");
  struct zip_t * zip = nullptr;
  bool useZip = false;
  if ( ( zipPos != std::string::npos )
       && ( zipPos == path.length() - 4 ) )
  {
    useZip = true;
    zip = zip_open(path.c_str(), 0, 'r');

    zip_entry_open(zip, "index.json");
    const size_t bufsize = zip_entry_size(zip);
    void * buf = calloc(bufsize, sizeof(unsigned char));
    zip_entry_noallocread(zip, buf, bufsize);
    if (document.Parse(static_cast<const char *>(buf)).HasParseError())
      {
      free(buf);
      zip_entry_close(zip);
      zip_close(zip);
      itkExceptionMacro("Could not parse JSON");
      return;
      }
    free(buf);
    zip_entry_close(zip);
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

  const rapidjson::Value & imageType = document["imageType"];
  const int dimension = imageType["dimension"].GetInt();
  this->SetNumberOfDimensions( dimension );
  const std::string componentType( imageType["componentType"].GetString() );
  const ImageIOBase::IOComponentEnum ioComponentType = this->WASMToITKComponentType( componentType );
  this->SetComponentType( ioComponentType );
  const std::string pixelType( imageType["pixelType"].GetString() );
  const IOPixelEnum ioPixelType = this->WASMToITKPixelType( pixelType );
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

  const auto directionPath = dataPath / "direction.raw";
  if (useZip)
  {
    zip_entry_open(zip, "data/direction.raw");
    const size_t bufsize = zip_entry_size(zip);
    double * buf = static_cast< double * >(malloc(bufsize));
    zip_entry_noallocread(zip, static_cast<void *>(buf), bufsize);

    count = 0;
    for( unsigned int jj = 0; jj < dimension; ++jj )
      {
      std::vector< double > direction( dimension );
      for( unsigned int ii = 0; ii < dimension; ++ii )
        {
        direction[ii] = buf[ii + jj*dimension];
        }
      this->SetDirection( count, direction );
      ++count;
      }
    free(buf);
    zip_entry_close(zip);
  }
  else
  {
    std::ifstream directionStream;
    this->OpenFileForReading( directionStream, directionPath.c_str(), false );
    count = 0;
    for( unsigned int jj = 0; jj < dimension; ++jj )
      {
      std::vector< double > direction( dimension );
      for( unsigned int ii = 0; ii < dimension; ++ii )
        {
        directionStream.read(reinterpret_cast< char * >(&(direction[ii])), sizeof(double));
        }
      this->SetDirection( count, direction );
      ++count;
      }
  }

  const rapidjson::Value & size = document["size"];
  count = 0;
  for( rapidjson::Value::ConstValueIterator itr = size.Begin(); itr != size.End(); ++itr )
    {
    this->SetDimensions( count, itr->GetInt() );
    ++count;
    }

  if (useZip)
  {
    zip_close(zip);
  }
}


void
WASMImageIO
::Read( void *buffer )
{
  const std::string path(this->GetFileName());
  const std::string dataFile = (std::filesystem::path(path) / "data" / "data.raw").c_str();

  std::string::size_type zipPos = path.rfind(".zip");
  if ( ( zipPos != std::string::npos )
       && ( zipPos == path.length() - 4 ) )
  {
    struct zip_t * zip = zip_open(path.c_str(), 0, 'r');

    zip_entry_open(zip, "data/data.raw");
    const SizeValueType numberOfBytesToBeRead =
      static_cast< SizeValueType >( this->GetImageSizeInBytes() );
    zip_entry_noallocread(zip, buffer, numberOfBytesToBeRead);
    zip_entry_close(zip);
    zip_close(zip);
  }
  else
  {
    std::ifstream dataStream;
    this->OpenFileForReading( dataStream, dataFile.c_str() );

    if (this->RequestedToStream())
    {
      this->OpenFileForReading( dataStream, dataFile.c_str() );
      this->StreamReadBufferAsBinary( dataStream, buffer );
    }

    else
    {
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
  }
}


bool
WASMImageIO
::CanWriteFile(const char *name)
{
  std::string filename = name;

  if( filename == "" )
    {
    return false;
    }

  bool extensionFound = false;
  std::string::size_type iwiPos = filename.rfind(".iwi");
  if ( iwiPos != std::string::npos )
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
WASMImageIO
::WriteImageInformation()
{
  const std::string path = this->GetFileName();
  const auto indexPath = std::filesystem::path(path) / "index.json";
  const auto dataPath = std::filesystem::path(path) / "data";
  std::string::size_type zipPos = path.rfind(".zip");
  struct zip_t * zip = nullptr;
  bool useZip = false;
  if ( ( zipPos != std::string::npos )
       && ( zipPos == path.length() - 4 ) )
  {
    useZip = true;
    zip = zip_open(path.c_str(), 0, 'w');
  }
  else
  {
    if ( !std::filesystem::exists(path) )
      {
      std::filesystem::create_directories(path);
      }
    if ( !std::filesystem::exists(dataPath) )
      {
      std::filesystem::create_directory(dataPath);
      }
  }

  rapidjson::Document document;
  document.SetObject();
  rapidjson::Document::AllocatorType& allocator = document.GetAllocator();

  rapidjson::Value imageType;
  imageType.SetObject();

  const unsigned int dimension = this->GetNumberOfDimensions();
  imageType.AddMember("dimension", rapidjson::Value(dimension).Move(), allocator );

  const std::string componentString = this->ITKToWASMComponentType( this->GetComponentType() );
  rapidjson::Value componentType;
  componentType.SetString( componentString.c_str(), allocator );
  imageType.AddMember("componentType", componentType.Move(), allocator );

  const std::string pixelString = this->ITKToWASMPixelType( this->GetPixelType() );
  rapidjson::Value pixelType;
  pixelType.SetString( pixelString.c_str(), allocator );
  imageType.AddMember("pixelType", pixelType.Move(), allocator );

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

  if (useZip)
  {
    zip_entry_open(zip, "data/direction.raw");
    for( unsigned int ii = 0; ii < dimension; ++ii )
      {
      const std::vector< double > dimensionDirection = this->GetDirection( ii );
      for( unsigned int jj = 0; jj < dimension; ++jj )
        {
        zip_entry_write(zip, reinterpret_cast< const char *>(&(dimensionDirection[jj])), sizeof(double) );
        }
      }
    zip_entry_close(zip);
  }
  else
  {
    const auto directionPath = dataPath / "direction.raw";
    std::ofstream directionFile;
    this->OpenFileForWriting(directionFile, directionPath.c_str(), false);
    for( unsigned int ii = 0; ii < dimension; ++ii )
      {
      const std::vector< double > dimensionDirection = this->GetDirection( ii );
      for( unsigned int jj = 0; jj < dimension; ++jj )
        {
        directionFile.write(reinterpret_cast< const char *>(&(dimensionDirection[jj])), sizeof(double) );
        }
      }
  }
  rapidjson::Value directionValue;
  directionValue.SetString( "path:data/direction.raw", allocator );
  document.AddMember( "direction", directionValue.Move(), allocator );

  rapidjson::Value size(rapidjson::kArrayType);
  for( unsigned int ii = 0; ii < dimension; ++ii )
    {
    size.PushBack(rapidjson::Value().SetInt( this->GetDimensions( ii ) ), allocator);
    }
  document.AddMember( "size", size.Move(), allocator );

  std::string dataFileString( "path:data/data.raw" );
  rapidjson::Value dataFile;
  dataFile.SetString( dataFileString.c_str(), allocator );
  document.AddMember( "data", dataFile, allocator );

  if (useZip)
  {
    rapidjson::StringBuffer stringBuffer;
    rapidjson::Writer< rapidjson::StringBuffer > writer( stringBuffer );
    document.Accept( writer );
    zip_entry_open(zip, "index.json");
    zip_entry_write(zip, stringBuffer.GetString(), stringBuffer.GetLength());
    zip_entry_close(zip);
  }
  else
  {
    std::ofstream outputStream;
    this->OpenFileForWriting( outputStream, indexPath.c_str(), true, true );
    rapidjson::OStreamWrapper ostreamWrapper( outputStream );
    rapidjson::PrettyWriter< rapidjson::OStreamWrapper > writer( ostreamWrapper );
    document.Accept( writer );
    outputStream.close();
  }

  if (useZip)
  {
    zip_close(zip);
  }
}


void
WASMImageIO
::Write( const void *buffer )
{
  const std::string path(this->GetFileName());
  const std::string fileName = (std::filesystem::path(path) / "data" / "data.raw").c_str();
  std::string::size_type zipPos = path.rfind(".zip");
  struct zip_t * zip = nullptr;
  bool useZip = false;
  if ( ( zipPos != std::string::npos )
       && ( zipPos == path.length() - 4 ) )
  {
    useZip = true;
  }

  if (useZip)
  {
    this->WriteImageInformation();
    zip = zip_open(path.c_str(), 0, 'a');
    zip_entry_open(zip, "data/data.raw");
    const SizeValueType numberOfBytes = this->GetImageSizeInBytes();
    zip_entry_write(zip, static_cast< const char * >( buffer ), numberOfBytes); \
    zip_entry_close(zip);
    zip_close(zip);
  }
  else
  {
    if (this->RequestedToStream())
    {
      if (!itksys::SystemTools::FileExists(path.c_str()))
      {
        this->WriteImageInformation();
        std::ofstream file;
        this->OpenFileForWriting(file, fileName, false);

        // write one byte at the end of the file to allocate (this is a
        // nifty trick which should not write the entire size of the file
        // just allocate it, if the system supports sparse files)
        std::streampos seekPos = this->GetImageSizeInBytes();
        file.seekp(seekPos, std::ios::cur);
        file.write("\0", 1);
        file.seekp(0);
      }

      std::ofstream file;
      // open and stream write
      this->OpenFileForWriting(file, fileName, false);

      this->StreamWriteBufferAsBinary(file, buffer);
    }
    else
    {
      this->WriteImageInformation();
      std::ofstream outputStream;
      this->OpenFileForWriting( outputStream, fileName, true, false );
      const SizeValueType numberOfBytes = this->GetImageSizeInBytes();
      outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
    }
  }
}

} // end namespace itk
