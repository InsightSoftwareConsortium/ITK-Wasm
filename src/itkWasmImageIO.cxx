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

#include "itkWasmImageIO.h"

#include "itkioComponentEnumFromJSON.h"
#include "itkioPixelEnumFromJSON.h"
#include "itkjsonFromIOComponentEnum.h"
#include "itkjsonFromIOPixelEnum.h"
#include "itkWasmComponentTypeFromIOComponentEnum.h"
#include "itkIOComponentEnumFromWasmComponentType.h"
#include "itkWasmPixelTypeFromIOPixelEnum.h"
#include "itkIOPixelEnumFromWasmPixelType.h"
#include "itkMetaDataDictionaryJSON.h"
#include "itkWasmIOCommon.h"

#include "itkIOCommon.h"
#include "itksys/SystemTools.hxx"

#include "itksys/SystemTools.hxx"

#include "cbor.h"

namespace itk
{

WasmImageIO
::WasmImageIO()
{
  this->SetNumberOfDimensions(3);
  this->AddSupportedWriteExtension(".iwi");
  this->AddSupportedWriteExtension(".iwi.cbor");
  this->AddSupportedReadExtension(".iwi");
  this->AddSupportedReadExtension(".iwi.cbor");
}


WasmImageIO
::~WasmImageIO()
{
}


bool
WasmImageIO
::SupportsDimension(unsigned long itkNotUsed(dimension))
{
  return true;
}


void
WasmImageIO
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}


bool
WasmImageIO
::CanReadFile(const char *filename)
{
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

  std::string::size_type zstdPos = fname.rfind(".zst");
  // WasmZstdImageIO is required
  if ( zstdPos != std::string::npos )
    {
    return false;
    }

  return true;
}


void
WasmImageIO
::SetJSON(const ImageJSON & imageJSON)
{
  const auto & imageType = imageJSON.imageType;

  const unsigned int dimension = imageType.dimension;
  this->SetNumberOfDimensions( dimension );

  const ImageIOBase::IOComponentEnum ioComponentType = ioComponentEnumFromJSON( imageType.componentType );
  this->SetComponentType( ioComponentType );

  const IOPixelEnum ioPixelType = ioPixelEnumFromJSON( imageType.pixelType );
  this->SetPixelType( ioPixelType );

  this->SetNumberOfComponents( imageType.components );

  for (unsigned int i = 0; i < dimension; ++i)
  {
    this->SetOrigin(i, imageJSON.origin[i]);
  }

  for (unsigned int i = 0; i < dimension; ++i)
  {
    this->SetSpacing(i, imageJSON.spacing[i]);
  }

  for (unsigned int i = 0; i < dimension; ++i)
  {
    this->SetDimensions(i, imageJSON.size[i]);
  }

  auto dictionary = this->GetMetaDataDictionary();
  jsonToMetaDataDictionary(imageJSON.metadata, dictionary);
  this->SetMetaDataDictionary(dictionary);
}


void
WasmImageIO
::ReadCBOR( void *buffer, unsigned char * cborBuffer, size_t cborBufferLength )
{
  bool cborBufferAllocated = false;
  size_t length = cborBufferLength;
  if (cborBuffer == nullptr)
  {
    FILE* file = fopen(this->GetFileName(), "rb");
    if (file == NULL) {
      itkExceptionMacro("Could not read file: " << this->GetFileName());
    }
    fseek(file, 0, SEEK_END);
    length = (size_t)ftell(file);
    fseek(file, 0, SEEK_SET);
    cborBuffer = static_cast< unsigned char *>(malloc(length));
    cborBufferAllocated = true;
    if (!fread(cborBuffer, length, 1, file))
    {
      itkExceptionMacro("Could not successfully read " << this->GetFileName());
    }
    fclose(file);
  }

  struct cbor_load_result result;
  cbor_item_t* index = cbor_load(cborBuffer, length, &result);
  if (cborBufferAllocated)
  {
    free(cborBuffer);
  }
  if (result.error.code != CBOR_ERR_NONE) {
    std::string errorDescription;
    switch (result.error.code) {
      case CBOR_ERR_MALFORMATED: {
        errorDescription = "Malformed data\n";
        break;
      }
      case CBOR_ERR_MEMERROR: {
        errorDescription = "Memory error -- perhaps the input is too large?\n";
        break;
      }
      case CBOR_ERR_NODATA: {
        errorDescription = "The input is empty\n";
        break;
      }
      case CBOR_ERR_NOTENOUGHDATA: {
        errorDescription = "Data seem to be missing -- is the input complete?\n";
        break;
      }
      case CBOR_ERR_SYNTAXERROR: {
        errorDescription = 
            "Syntactically malformed data -- see https://tools.ietf.org/html/rfc7049\n";
        break;
      }
      case CBOR_ERR_NONE: {
        break;
      }
    }
    itkExceptionMacro("" << errorDescription << "There was an error while reading the input near byte " << result.error.position << " (read " << result.read << " bytes in total): ");
  }

  const size_t indexCount = cbor_map_size(index);
  const struct cbor_pair * indexHandle = cbor_map_handle(index);
  for (size_t ii = 0; ii < indexCount; ++ii)
  {
    const std::string_view key(reinterpret_cast<char *>(cbor_string_handle(indexHandle[ii].key)), cbor_string_length(indexHandle[ii].key));
    if (key == "imageType")
    {
      const cbor_item_t * imageTypeItem = indexHandle[ii].value;
      const size_t imageTypeCount = cbor_map_size(imageTypeItem);
      const struct cbor_pair * imageTypeHandle = cbor_map_handle(imageTypeItem);
      for (size_t jj = 0; jj < imageTypeCount; ++jj)
      {
        const std::string_view imageTypeKey(reinterpret_cast<char *>(cbor_string_handle(imageTypeHandle[jj].key)), cbor_string_length(imageTypeHandle[jj].key));
        if (imageTypeKey == "dimension")
        {
          const auto dimension = cbor_get_uint32(imageTypeHandle[jj].value);
          this->SetNumberOfDimensions( dimension );
        }
        else if (imageTypeKey == "componentType")
        {
          const std::string componentType(reinterpret_cast<char *>(cbor_string_handle(imageTypeHandle[jj].value)), cbor_string_length(imageTypeHandle[jj].value));
          const ImageIOBase::IOComponentEnum ioComponentType = IOComponentEnumFromWasmComponentType( componentType );
          this->SetComponentType( ioComponentType );
        }
        else if (imageTypeKey == "pixelType")
        {
          const std::string pixelType(reinterpret_cast<char *>(cbor_string_handle(imageTypeHandle[jj].value)), cbor_string_length(imageTypeHandle[jj].value));
          const IOPixelEnum ioPixelType = IOPixelEnumFromWasmPixelType( pixelType );
          this->SetPixelType( ioPixelType );
        }
        else if (imageTypeKey == "components")
        {
          const auto components = cbor_get_uint32(imageTypeHandle[jj].value);
          this->SetNumberOfComponents( components );
        }
        else
        {
          itkExceptionMacro("Unexpected imageType cbor map key: " << imageTypeKey);
        }
      }
    }
    else if (key == "origin")
    {
      const auto originHandle = cbor_array_handle(indexHandle[ii].value);
      const size_t originSize = cbor_array_size(indexHandle[ii].value);
      for( int dim = 0; dim < originSize; ++dim )
        {
        const auto item = originHandle[dim];
        this->SetOrigin( dim, cbor_float_get_float(item) );
        }
    }
    else if (key == "spacing")
    {
      const auto spacingHandle = cbor_array_handle(indexHandle[ii].value);
      const size_t spacingSize = cbor_array_size(indexHandle[ii].value);
      for( int dim = 0; dim < spacingSize; ++dim )
        {
        const auto item = spacingHandle[dim];
        this->SetSpacing( dim, cbor_float_get_float(item) );
        }
    }
    else if (key == "size")
    {
      const auto sizeHandle = cbor_array_handle(indexHandle[ii].value);
      const size_t sizeSize = cbor_array_size(indexHandle[ii].value);
      for( int dim = 0; dim < sizeSize; ++dim )
        {
        const auto item = sizeHandle[dim];
        this->SetDimensions( dim, cbor_get_uint64(item) );
        }
    }
    else if (key == "direction")
    {
      cbor_item_t * directionItem = cbor_tag_item(indexHandle[ii].value);
      const double * directionHandle = reinterpret_cast< double * >( cbor_bytestring_handle(directionItem) );
      const size_t directionSize = cbor_bytestring_length(directionItem);
      const unsigned int dimension = std::sqrt( directionSize / sizeof(double) );
      for( unsigned int jj = 0; jj < dimension; ++jj )
        {
        std::vector< double > direction( dimension );
        for( unsigned int kk = 0; kk < dimension; ++kk )
          {
          direction[kk] = directionHandle[kk + jj*dimension];
          }
        this->SetDirection( jj, direction );
        }
    }
    else if (key == "data")
    {
      if( buffer != nullptr )
      {
        const SizeValueType numberOfBytesToBeRead =
          static_cast< SizeValueType >( this->GetImageSizeInBytes() );
        const cbor_item_t * dataItem = cbor_tag_item(indexHandle[ii].value);
        const char * dataHandle = reinterpret_cast< char * >( cbor_bytestring_handle(dataItem) );
        std::memcpy(buffer, dataHandle, numberOfBytesToBeRead);
      }
    }
    else if (key == "metadata")
    {
      // todo
    }
    else
    {
      itkExceptionMacro("Unexpected cbor map key: " << key);
    }
  }

  cbor_decref(&index);
}

size_t
WasmImageIO
::WriteCBOR(const void *buffer, unsigned char ** cborBufferPtr, bool allocateCBORBuffer )
{
  cbor_item_t * index  = cbor_new_definite_map(7);

  cbor_item_t * imageTypeItem = cbor_new_definite_map(4);
  cbor_map_add(imageTypeItem,
    cbor_pair{
      cbor_move(cbor_build_string("dimension")),
      cbor_move(cbor_build_uint32(this->GetNumberOfDimensions()))});
  const std::string componentString = WasmComponentTypeFromIOComponentEnum( this->GetComponentType() );
  cbor_map_add(imageTypeItem,
    cbor_pair{
      cbor_move(cbor_build_string("componentType")),
      cbor_move(cbor_build_string(componentString.c_str()))});
  const std::string pixelString = WasmPixelTypeFromIOPixelEnum( this->GetPixelType() );
  cbor_map_add(imageTypeItem,
    cbor_pair{
      cbor_move(cbor_build_string("pixelType")),
      cbor_move(cbor_build_string(pixelString.c_str()))});
  cbor_map_add(imageTypeItem,
    cbor_pair{
      cbor_move(cbor_build_string("components")),
      cbor_move(cbor_build_uint32(this->GetNumberOfComponents()))});
  cbor_map_add(index,
    cbor_pair{
      cbor_move(cbor_build_string("imageType")),
      cbor_move(imageTypeItem)});

  const unsigned int dimension = this->GetNumberOfDimensions();

  cbor_item_t * originItem = cbor_new_definite_array(dimension);
  for( unsigned int ii = 0; ii < dimension; ++ii )
  {
    cbor_array_set(originItem, ii, cbor_move(cbor_build_float8(this->GetOrigin(ii))));
  }
  cbor_map_add(index,
    cbor_pair{
      cbor_move(cbor_build_string("origin")),
      cbor_move(originItem)});

  cbor_item_t * spacingItem = cbor_new_definite_array(dimension);
  for( unsigned int ii = 0; ii < dimension; ++ii )
  {
    cbor_array_set(spacingItem, ii, cbor_move(cbor_build_float8(this->GetSpacing(ii))));
  }
  cbor_map_add(index,
    cbor_pair{
      cbor_move(cbor_build_string("spacing")),
      cbor_move(spacingItem)});

  std::vector< double > direction( dimension * dimension );
  for( unsigned int ii = 0; ii < dimension; ++ii )
    {
    const std::vector< double > dimensionDirection = this->GetDirection( ii );
    for( unsigned int jj = 0; jj < dimension; ++jj )
      {
      direction[jj + ii*dimension] = dimensionDirection[jj];
      }
    }
  cbor_item_t * directionItem = cbor_build_bytestring(reinterpret_cast<unsigned char *>(&(direction.at(0))), dimension*dimension*sizeof(double));
  cbor_item_t * directionTag = cbor_new_tag(86);
  cbor_tag_set_item(directionTag, cbor_move(directionItem));
  cbor_map_add(index,
    cbor_pair{
      cbor_move(cbor_build_string("direction")),
      cbor_move(directionTag)});

  cbor_item_t * sizeItem = cbor_new_definite_array(dimension);
  for( unsigned int ii = 0; ii < dimension; ++ii )
  {
    cbor_array_set(sizeItem, ii, cbor_move(cbor_build_uint64(this->GetDimensions(ii))));
  }
  cbor_map_add(index,
    cbor_pair{
      cbor_move(cbor_build_string("size")),
      cbor_move(sizeItem)});

  cbor_item_t * metaDataItem = cbor_new_definite_map(0);
  cbor_map_add(index,
    cbor_pair{
      cbor_move(cbor_build_string("metadata")),
      cbor_move(metaDataItem)});

  if( buffer != nullptr )
  {
    const SizeValueType numberOfBytesToWrite =
      static_cast< SizeValueType >( this->GetImageSizeInBytes() );
    cbor_item_t * dataItem = cbor_build_bytestring(reinterpret_cast< const unsigned char *>(buffer), numberOfBytesToWrite);
    uint64_t tag = 0;
    // Todo: support endianness
    // https://www.iana.org/assignments/cbor-tags/cbor-tags.xhtml
    switch (this->GetComponentType()) {
      case IOComponentEnum::CHAR:
        tag = 64;
        break;
      case IOComponentEnum::UCHAR:
        tag = 64;
        break;
      case IOComponentEnum::SHORT:
        tag = 73;
        break;
      case IOComponentEnum::USHORT:
        tag = 69;
        break;
      case IOComponentEnum::INT:
        tag = 74;
        break;
      case IOComponentEnum::UINT:
        tag = 70;
        break;
      case IOComponentEnum::LONG:
        tag = 75;
        break;
      case IOComponentEnum::ULONG:
        tag = 71;
        break;
      case IOComponentEnum::LONGLONG:
        tag = 75;
        break;
      case IOComponentEnum::ULONGLONG:
        tag = 71;
        break;
      case IOComponentEnum::FLOAT:
        tag = 85;
        break;
      case IOComponentEnum::DOUBLE:
        tag = 86;
        break;
      default:
        itkExceptionMacro("Unexpected component type");
    }
    cbor_item_t * dataTag = cbor_new_tag(tag);
    cbor_tag_set_item(dataTag, cbor_move(dataItem));
    cbor_map_add(index,
      cbor_pair{
        cbor_move(cbor_build_string("data")),
        cbor_move(dataTag)});
  }

  size_t cborBufferSize;
  size_t length;
  unsigned char * cborBuffer;

  if (allocateCBORBuffer)
  {
    length = cbor_serialize_alloc(index, cborBufferPtr, &cborBufferSize);
  }
  else
  {
    length = cbor_serialize_alloc(index, &cborBuffer, &cborBufferSize);
    FILE* file = fopen(this->GetFileName(), "wb");
    fwrite(cborBuffer, 1, length, file);
    free(cborBuffer);
    fclose(file);
  }

  cbor_decref(&index);

  return length;
}


void
WasmImageIO
::ReadImageInformation()
{
  this->SetByteOrderToLittleEndian();

  const std::string path = this->GetFileName();

  std::string::size_type cborPos = path.rfind(".cbor");
  if ( ( cborPos != std::string::npos )
       && ( cborPos == path.length() - 5 ) )
  {
    this->ReadCBOR(nullptr);
    return;
  }

  std::ifstream inputStream;
  const auto indexPath = path + "/index.json";
  this->OpenFileForReading( inputStream, indexPath.c_str(), true );
  std::string str((std::istreambuf_iterator<char>(inputStream)), std::istreambuf_iterator<char>());
  auto        deserializedAttempt = glz::read_json<itk::ImageJSON>(str);
  if (!deserializedAttempt)
  {
    const std::string descriptiveError = glz::format_error(deserializedAttempt, str);
    itkExceptionMacro("Failed to deserialize ImageJSON: " << descriptiveError);
  }
  const auto imageJSON = deserializedAttempt.value();

  this->SetJSON(imageJSON);

  const unsigned int dimension = imageJSON.imageType.dimension;

  const auto dataPath = path + "/data";
  const auto directionPath = dataPath +  "/direction.raw";
  std::ifstream directionStream;
  this->OpenFileForReading( directionStream, directionPath.c_str(), false );
  unsigned int count = 0;
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


void
WasmImageIO
::Read( void *buffer )
{
  const std::string path(this->GetFileName());

  std::string::size_type cborPos = path.rfind(".cbor");
  if ( ( cborPos != std::string::npos )
       && ( cborPos == path.length() - 5 ) )
  {
    this->ReadCBOR(buffer);
    return;
  }

  const std::string dataFile = (path + "/data/data.raw").c_str();
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
    if ( !readBufferAsBinary( dataStream, buffer, numberOfBytesToBeRead ) )
      {
      itkExceptionMacro(<< "Read failed: Wanted "
                        << numberOfBytesToBeRead
                        << " bytes, but read "
                        << dataStream.gcount() << " bytes.");
      }
  }
}


bool
WasmImageIO
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

  std::string::size_type zstdPos = filename.rfind(".zst");
  // WasmZstdImageIO is required
  if ( zstdPos != std::string::npos )
    {
    return false;
    }

  return true;
}


auto
WasmImageIO
::GetJSON() -> ImageJSON
{
  ImageJSON imageJSON;

  const unsigned int dimension = this->GetNumberOfDimensions();
  imageJSON.imageType.dimension = dimension;

  imageJSON.imageType.componentType = jsonComponentTypeFromIOComponentEnum( this->GetComponentType() );
  imageJSON.imageType.pixelType = jsonFromIOPixelEnum( this->GetPixelType() );
  imageJSON.imageType.components = this->GetNumberOfComponents();

  imageJSON.origin.clear();
  for( unsigned int ii = 0; ii < dimension; ++ii )
  {
    imageJSON.origin.push_back(this->GetOrigin( ii ));
  }

  imageJSON.spacing.clear();
  for( unsigned int ii = 0; ii < dimension; ++ii )
  {
    imageJSON.spacing.push_back(this->GetSpacing( ii ));
  }

  imageJSON.direction = "data:application/vnd.itk.path,data/direction.raw";

  imageJSON.size.clear();
  for( unsigned int ii = 0; ii < dimension; ++ii )
  {
    imageJSON.size.push_back(this->GetDimensions( ii ));
  }

  imageJSON.data = "data:application/vnd.itk.path,data/data.raw";

  auto dictionary = this->GetMetaDataDictionary();
  metaDataDictionaryToJSON(dictionary, imageJSON.metadata);

  return imageJSON;
}

void
WasmImageIO
::WriteImageInformation()
{
  const std::string path = this->GetFileName();

  std::string::size_type cborPos = path.rfind(".cbor");
  if (cborPos != std::string::npos)
  {
    return;
  }

  const auto indexPath = path + "/index.json";
  const auto dataPath = path + "/data";
  if ( !itksys::SystemTools::FileExists(path, false) )
    {
      itksys::SystemTools::MakeDirectory(path);
    }
  if ( !itksys::SystemTools::FileExists(dataPath, false) )
    {
      itksys::SystemTools::MakeDirectory(dataPath);
    }

  const auto imageJSON = this->GetJSON();
  const unsigned int dimension = this->GetNumberOfDimensions();

  const auto directionPath = dataPath + "/direction.raw";
  if ( !itksys::SystemTools::FileExists(dataPath, false) )
    {
      itksys::SystemTools::MakeDirectory(dataPath);
    }
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

  std::string serialized{};
  auto ec = glz::write<glz::opts{ .prettify = true }>(imageJSON, serialized);
  if (ec)
  {
    itkExceptionMacro("Failed to serialize ImageJSON");
  }
  std::ofstream outputStream;
  openFileForWriting(outputStream, indexPath.c_str(), true, true);
  outputStream << serialized;
  outputStream.close();
}


void
WasmImageIO
::Write( const void *buffer )
{
  const std::string path(this->GetFileName());

  std::string::size_type cborPos = path.rfind(".cbor");
  if ( ( cborPos != std::string::npos )
       && ( cborPos == path.length() - 5 ) )
  {
    this->WriteCBOR(buffer);
    return;
  }

  const std::string fileName = path + "/data/data.raw";

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

} // end namespace itk
