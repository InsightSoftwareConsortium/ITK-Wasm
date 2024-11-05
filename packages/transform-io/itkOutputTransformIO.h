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
#ifndef itkOutputTransformIO_h
#define itkOutputTransformIO_h

#include "itkTransformBase.h"

#include "itkPipeline.h"

#include "itkTransformIOBase.h"
#include "itkWasmTransformIOBase.h"
#include "itkWasmTransformIO.h"
#include "itkTransformJSON.h"
#ifndef ITK_WASM_NO_MEMORY_IO
#include "itkWasmExports.h"
#endif
#ifndef ITK_WASM_NO_FILESYSTEM_IO
#endif

namespace
{

template <typename TParametersValueType>
void
addTransformBuffersToMemoryStore(const itk::TransformListJSON & transformListJSON, size_t index)
{
  using ParametersValueType = TParametersValueType;

  using TransformBaseType = itk::TransformBaseTemplate<ParametersValueType>;

  using FixedParametersValueType = typename TransformBaseType::FixedParametersValueType;

  unsigned int dataCount = 0;
  // iterate through the transform list and store each transfrom's fixed parameters and parameters
  for (const auto & transformJSON: transformListJSON)
  {
    if (transformJSON.transformType.transformParameterization == itk::JSONTransformParameterizationEnum::Composite)
    {
      continue;
    }
    const auto fixedParamsAddress = static_cast< size_t >( std::strtoull(transformJSON.fixedParameters.substr(35).c_str(), nullptr, 10) );
    const auto fixedParamsSize = transformJSON.numberOfFixedParameters * sizeof(FixedParametersValueType);
    itk::wasm::setMemoryStoreOutputArray(0, index, dataCount, fixedParamsAddress, fixedParamsSize);
    ++dataCount;

    const auto paramsAddress = static_cast< size_t >( std::strtoull(transformJSON.parameters.substr(35).c_str(), nullptr, 10) );
    const auto paramsSize = transformJSON.numberOfParameters * sizeof(ParametersValueType);
    itk::wasm::setMemoryStoreOutputArray(0, index, dataCount, paramsAddress, paramsSize);
    ++dataCount;
  }
}

} // end anonymous namespace

namespace itk
{
namespace wasm
{
/**
 *\class OutputTransformIO
 * \brief Output transform for an itk::wasm::Pipeline from an itk::TransformIOBaseTemplate
 *
 * This transform is written to the filesystem or memory when it goes out of scope.
 *
 * This class is for the ReadTransform ITK-Wasm pipeline. Most pipelines will use itk::wasm::OutputTransform.
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TParametersValueType>
class OutputTransformIO
{
public:
  using ParametersValueType = TParametersValueType;
  using TransformIOBaseType = itk::TransformIOBaseTemplate<ParametersValueType>;

  void Set(TransformIOBaseType * transformIO) {
    this->m_TransformIO = transformIO;
  }

  TransformIOBaseType * Get() const {
    return this->m_TransformIO.GetPointer();
  }

  /** FileName or output index. */
  void SetIdentifier(const std::string & identifier)
  {
    this->m_Identifier = identifier;
  }
  const std::string & GetIdentifier() const
  {
    return this->m_Identifier;
  }

  OutputTransformIO() = default;
  ~OutputTransformIO() {
    if(wasm::Pipeline::get_use_memory_io())
    {
#ifndef ITK_WASM_NO_MEMORY_IO
    if (!this->m_TransformIO.IsNull() && !this->m_Identifier.empty())
    {
      this->m_TransformIO->Read();

      const auto index = std::stoi(this->m_Identifier);
      auto wasmTransformIOBase = WasmTransformIOBase<ParametersValueType>::New();
      wasmTransformIOBase->SetTransformIO(this->m_TransformIO);
      setMemoryStoreOutputDataObject(0, index, wasmTransformIOBase);

      const auto transformListJSON = wasmTransformIOBase->GetTransformListJSON();

      if (transformListJSON.size() > 0)
      {
        addTransformBuffersToMemoryStore<ParametersValueType>(transformListJSON, index);
      }
    }
#else
    std::cerr << "Memory IO not supported" << std::endl;
    abort();
#endif
    }
    else
    {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    if (!this->m_TransformIO.IsNull() && !this->m_Identifier.empty())
    {
      this->m_TransformIO->Read();

      using WasmTransformIOType = itk::WasmTransformIOTemplate<ParametersValueType>;
      auto wasmTransformIO = WasmTransformIOType::New();

      wasmTransformIO->SetTransformList(*(reinterpret_cast<typename WasmTransformIOType::ConstTransformListType *>(&(this->m_TransformIO->GetTransformList()))));
      wasmTransformIO->SetFileName(this->m_Identifier);
      wasmTransformIO->Write();
    }
#else
    std::cerr << "Filesystem IO not supported" << std::endl;
    abort();
#endif
    }
  }
protected:
  typename TransformIOBaseType::Pointer m_TransformIO;

  std::string m_Identifier;
};

template<typename TParametersValueType>
bool lexical_cast(const std::string &input, OutputTransformIO<TParametersValueType> &outputTransformIO)
{
  outputTransformIO.SetIdentifier(input);
  return true;
}

} // namespace wasm
} // namespace itk

#endif
