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
#include "itkSupportInputPolyDataTypes.h"
#include "itkWasmExports.h"

#include "itkjsonFromIOComponentEnum.h"
#include "itkjsonFromIOPixelEnum.h"
#include "itkMeshJSON.h"

namespace itk
{

bool
lexical_cast(const std::string & input, PolyDataTypeJSON & polyDataType)
{
  if (wasm::Pipeline::get_use_memory_io())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    const unsigned int index = std::stoi(input);
    auto               json = wasm::getMemoryStoreInputJSON(0, index);
    std::string        deserialized;
    auto               deserializedAttempt = glz::read_json<itk::PolyDataJSON>(json);
    if (!deserializedAttempt)
    {
      const std::string descriptiveError = glz::format_error(deserializedAttempt, json);
      throw std::runtime_error("Failed to deserialize PolyDataJSON: " + descriptiveError);
    }
    auto polyDataJSON = deserializedAttempt.value();
    polyDataType = polyDataJSON.polyDataType;
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

    using IOComponentType = itk::IOComponentEnum;
    const IOComponentType ioComponentEnum = meshIO->GetPointPixelComponentType();
    const auto            pointPixelIOComponentType = meshIO->GetPointPixelComponentType();
    polyDataType.pointPixelComponentType = itk::jsonComponentTypeFromIOComponentEnum(pointPixelIOComponentType);
    const auto pointIOPixelType = meshIO->GetPointPixelType();
    polyDataType.pointPixelType = itk::jsonFromIOPixelEnum(pointIOPixelType);
    polyDataType.pointPixelComponents = meshIO->GetNumberOfPointPixelComponents();

    using IOPixelType = itk::IOPixelEnum;
    const IOPixelType ioPixelEnum = meshIO->GetPointPixelType();

    const auto cellPixelIOComponentType = meshIO->GetCellPixelComponentType();
    polyDataType.cellPixelComponentType = itk::jsonComponentTypeFromIOComponentEnum(cellPixelIOComponentType);
    const auto cellIOPixelType = meshIO->GetCellPixelType();
    polyDataType.cellPixelType = itk::jsonFromIOPixelEnum(cellIOPixelType);
    polyDataType.cellPixelComponents = meshIO->GetNumberOfCellPixelComponents();
#else
    return false;
#endif
  }
  return true;
}

} // end namespace itk
