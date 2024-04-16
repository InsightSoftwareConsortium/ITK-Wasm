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

#include "itkWasmIOCommon.h"

#include "itksys/SystemTools.hxx"

#include <sstream>
#include <cstring>

#include "cbor.h"

namespace itk
{

void
openFileForReading(std::ifstream & inputStream, const std::string & filename, bool ascii)
{
  // Make sure that we have a file to
  if ( filename.empty() )
    {
    throw std::runtime_error( "A FileName must be specified." );
    }

  // Close file from any previous image
  if ( inputStream.is_open() )
    {
    inputStream.close();
    }

  std::ios::openmode mode = std::ios::in;
  if ( !ascii )
    {
    mode |= std::ios::binary;
    }

  inputStream.open( filename.c_str(), mode );

  if ( !inputStream.is_open() || inputStream.fail() )
    {
    std::ostringstream ostrm;
    ostrm << "Could not open file: "
                       << filename << " for reading."
                       << std::endl
                       << "Reason: "
                       << itksys::SystemTools::GetLastSystemError();
    throw std::runtime_error(ostrm.str());
    }
}


void
openFileForWriting(std::ofstream & outputStream, const std::string & filename, bool truncate, bool ascii)
{
  // Make sure that we have a file to
  if ( filename.empty() )
    {
    throw std::runtime_error("A FileName must be specified." );
    }

  // Close file from any previous image
  if ( outputStream.is_open() )
    {
    outputStream.close();
    }

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
    std::ostringstream ostrm;
    ostrm << "Could not open file: "
                       << filename << " for writing."
                       << std::endl
                       << "Reason: "
                       << itksys::SystemTools::GetLastSystemError();
    throw std::runtime_error(ostrm.str());
    }
}

/** Convenient method to read a buffer as binary. Return true on success. */
bool
readBufferAsBinary(std::istream & is, void *buffer, SizeValueType num)
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


bool
fileNameIsCBOR(const char * fileName)
{
  const std::string path(fileName);
  std::string::size_type cborPos = path.rfind(".cbor");
  if ( cborPos != std::string::npos )
  {
    return true;
  }
  return false;
}


void
readCBORBuffer(const cbor_item_t * index, const char * dataName, void * buffer, SizeValueType numberOfBytesToBeRead)
{
  if (index == nullptr) {
    throw std::logic_error("Read information before reading the data buffer");
  }
  const size_t indexCount = cbor_map_size(index);
  const struct cbor_pair * indexHandle = cbor_map_handle(index);
  for (size_t ii = 0; ii < indexCount; ++ii)
  {
    const std::string_view key(reinterpret_cast<char *>(cbor_string_handle(indexHandle[ii].key)), cbor_string_length(indexHandle[ii].key));
    if (key == dataName)
    {
      const cbor_item_t * dataItem = cbor_tag_item(indexHandle[ii].value);
      const char * dataHandle = reinterpret_cast< char * >( cbor_bytestring_handle(dataItem) );
      std::memcpy(buffer, dataHandle, numberOfBytesToBeRead);
    }
  }
}

void
writeCBORBuffer(cbor_item_t * index, const char * dataName, const void * buffer, SizeValueType numberOfBytesToWrite, IOComponentEnum ioComponent)
{
  if (index == nullptr) {
    throw std::logic_error("Call write information before writing the data buffer");
  }
  cbor_item_t * dataItem = cbor_build_bytestring(reinterpret_cast< const unsigned char *>(buffer), numberOfBytesToWrite);
  uint64_t tag = 0;
  // Todo: support endianness
  // https://www.iana.org/assignments/cbor-tags/cbor-tags.xhtml
  switch (ioComponent) {
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
      throw std::logic_error("Unexpected component type");
  }
  cbor_item_t * dataTag = cbor_new_tag(tag);
  cbor_tag_set_item(dataTag, cbor_move(dataItem));
  cbor_map_add(index,
    cbor_pair{
      cbor_move(cbor_build_string(dataName)),
      cbor_move(dataTag)});
}

size_t
ITKComponentSize(const CommonEnums::IOComponent itkComponentType)
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

} // end namespace itk
