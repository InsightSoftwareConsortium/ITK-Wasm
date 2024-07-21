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
#include "itkSupportInputPointSetTypes.h"
#include "itkWasmExports.h"

#include "itkjsonFromIOComponentEnum.h"
#include "itkjsonFromIOPixelEnum.h"
#include "itkPointSetJSON.h"

namespace itk
{

bool lexical_cast(const std::string &input, PointSetTypeJSON & pointSetType)
{
  if (wasm::Pipeline::get_use_memory_io())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    const unsigned int index = std::stoi(input);
    auto json = wasm::getMemoryStoreInputJSON(0, index);
    std::string deserialized;
    auto        deserializedAttempt = glz::read_json<itk::PointSetJSON>(json);
    if (!deserializedAttempt)
    {
      const std::string descriptiveError = glz::format_error(deserializedAttempt, json);
      throw std::runtime_error("Failed to deserialize PointSetJSON: " + descriptiveError);
    }
    auto pointSetJSON = deserializedAttempt.value();
    pointSetType = pointSetJSON.pointSetType;
#else
    return false;
#endif
  }
  else
  {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    MeshIOBase::Pointer pointSetIO = MeshIOFactory::CreateMeshIO(input.c_str(), CommonEnums::IOFileMode::ReadMode);
    if (pointSetIO.IsNull())
    {
      std::cerr << "IO not available for: " << input << std::endl;
      return false;
    }
    pointSetIO->SetFileName(input);
    pointSetIO->ReadMeshInformation();

    pointSetType.dimension = pointSetIO->GetPointDimension();

    using IOComponentType = itk::IOComponentEnum;
    const IOComponentType ioComponentEnum = pointSetIO->GetPointPixelComponentType();
    const auto pointIOComponentType = pointSetIO->GetPointComponentType();
    pointSetType.pointComponentType = itk::jsonFloatTypeFromIOComponentEnum( pointIOComponentType );
    const auto pointPixelIOComponentType = pointSetIO->GetPointPixelComponentType();
    pointSetType.pointPixelComponentType = itk::jsonComponentTypeFromIOComponentEnum( pointPixelIOComponentType );
    const auto pointIOPixelType = pointSetIO->GetPointPixelType();
    pointSetType.pointPixelType = itk::jsonFromIOPixelEnum( pointIOPixelType );
    pointSetType.pointPixelComponents = pointSetIO->GetNumberOfPointPixelComponents();

    using IOPixelType = itk::IOPixelEnum;
    const IOPixelType ioPixelEnum = pointSetIO->GetPointPixelType();
#else
    return false;
#endif
  }
  return true;
}

} // end namespace itk
