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
#include "itkSupportInputMeshTypes.h"
#include "itkWasmExports.h"

#include "itkjsonFromIOComponentEnum.h"
#include "itkjsonFromIOPixelEnum.h"
#include "itkMeshJSON.h"

namespace itk
{

bool lexical_cast(const std::string &input, MeshTypeJSON & meshType)
{
  if (wasm::Pipeline::get_use_memory_io())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    const unsigned int index = std::stoi(input);
    auto json = wasm::getMemoryStoreInputJSON(0, index);
    std::string deserialized;
    auto        deserializedAttempt = glz::read_json<itk::MeshJSON>(json);
    if (!deserializedAttempt)
    {
      const std::string descriptiveError = glz::format_error(deserializedAttempt, json);
      throw std::runtime_error("Failed to deserialize MeshJSON: " + descriptiveError);
    }
    auto meshJSON = deserializedAttempt.value();
    meshType = meshJSON.meshType;
#else
    return false;
#endif
  }
  else
  {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    MeshIOBase::Pointer meshIO = MeshIOFactory::CreateMeshIO(input.c_str(), CommonEnums::IOFileMode::ReadMode);
    if (meshIO.IsNull())
    {
      std::cerr << "IO not available for: " << input << std::endl;
      return false;
    }
    meshIO->SetFileName(input);
    meshIO->ReadMeshInformation();

    meshType.dimension = meshIO->GetPointDimension();

    using IOComponentType = itk::IOComponentEnum;
    const IOComponentType ioComponentEnum = meshIO->GetPointPixelComponentType();
    const auto pointIOComponentType = meshIO->GetPointComponentType();
    meshType.pointComponentType = itk::jsonFloatTypeFromIOComponentEnum( pointIOComponentType );
    const auto pointPixelIOComponentType = meshIO->GetPointPixelComponentType();
    meshType.pointPixelComponentType = itk::jsonComponentTypeFromIOComponentEnum( pointPixelIOComponentType );
    const auto pointIOPixelType = meshIO->GetPointPixelType();
    meshType.pointPixelType = itk::jsonFromIOPixelEnum( pointIOPixelType );
    meshType.pointPixelComponents = meshIO->GetNumberOfPointPixelComponents();

    using IOPixelType = itk::IOPixelEnum;
    const IOPixelType ioPixelEnum = meshIO->GetPointPixelType();

    const auto cellIOComponentType = meshIO->GetCellComponentType();
    meshType.cellComponentType = itk::jsonIntTypeFromIOComponentEnum( cellIOComponentType );
    const auto cellPixelIOComponentType = meshIO->GetCellPixelComponentType();
    meshType.cellPixelComponentType = itk::jsonComponentTypeFromIOComponentEnum( cellPixelIOComponentType );
    const auto cellIOPixelType = meshIO->GetCellPixelType();
    meshType.cellPixelType = itk::jsonFromIOPixelEnum( cellIOPixelType );
    meshType.cellPixelComponents = meshIO->GetNumberOfCellPixelComponents();
#else
    return false;
#endif
  }
  return true;
}

} // end namespace itk
