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
#ifndef itkOutputTransform_h
#define itkOutputTransform_h

#include "itkPipeline.h"

#ifndef ITK_WASM_NO_MEMORY_IO
#include "itkWasmExports.h"
#include "itkWasmTransform.h"
#include "itkTransformToWasmTransformFilter.h"
#include "itkCompositeTransform.h"
#include "itkCompositeTransformIOHelper.h"
#endif
#ifndef ITK_WASM_NO_FILESYSTEM_IO
#include "itkTransformFileWriter.h"
#endif

namespace itk
{
namespace wasm
{
/**
 *\class OutputTransform
 * \brief Output transform for an itk::wasm::Pipeline
 *
 * This transform is written to the filesystem or memory when it goes out of scope.
 * 
 * Call `GetTransform()` to get the TTransform * to use an input to a pipeline.
 * 
 * \ingroup WebAssemblyInterface
 */
template <typename TTransform>
class ITK_TEMPLATE_EXPORT OutputTransform
{
public:
  using TransformType = TTransform;

  void Set(const TransformType * transform) {
    this->m_Transform = transform;
  }

  const TransformType * Get() const {
    return this->m_Transform.GetPointer();
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

  OutputTransform() = default;
  ~OutputTransform() {
    if(wasm::Pipeline::get_use_memory_io())
    {
#ifndef ITK_WASM_NO_MEMORY_IO
    if (!this->m_Transform.IsNull() && !this->m_Identifier.empty())
      {
        using TransformToWasmTransformFilterType = TransformToWasmTransformFilter<TransformType>;
        auto transformToWasmTransformFilter = TransformToWasmTransformFilterType::New();
        transformToWasmTransformFilter->SetTransform(this->m_Transform.GetPointer());
        transformToWasmTransformFilter->Update();
        auto wasmTransform = transformToWasmTransformFilter->GetOutput();
        const auto index = std::stoi(this->m_Identifier);
        setMemoryStoreOutputDataObject(0, index, wasmTransform);

        using ParametersValueType = typename TransformType::ParametersValueType;
        using FixedParametersValueType = typename TransformType::FixedParametersValueType;
        using CompositeTransformType = CompositeTransform<ParametersValueType, TransformType::InputSpaceDimension>;
        auto compositeTransform = dynamic_cast<const CompositeTransformType *>(wasmTransform->GetTransform());
        if (compositeTransform)
        {
          unsigned int dataCount = 0;
          CompositeTransformIOHelperTemplate<ParametersValueType> helper;
          auto transformList = helper.GetTransformList(compositeTransform);
          // composite transform
          transformList.pop_front();
          // iterate through the transform list and store each transfrom's fixed parameters and parameters
          for (const auto & transform: transformList)
          {
            const auto fixedParamsAddress = reinterpret_cast< size_t >( transform->GetFixedParameters().data_block() );
            const auto fixedParamsSize = transform->GetFixedParameters().Size() * sizeof(FixedParametersValueType);
            setMemoryStoreOutputArray(0, index, dataCount, fixedParamsAddress, fixedParamsSize);
            ++dataCount;

            const auto paramsAddress = reinterpret_cast< size_t >( transform->GetParameters().data_block() );
            const auto paramsSize = transform->GetParameters().Size() * sizeof(ParametersValueType);
            setMemoryStoreOutputArray(0, index, dataCount, paramsAddress, paramsSize);
            ++dataCount;
          }
        }
        else
        {
          const auto fixedParamsAddress = reinterpret_cast< size_t >( wasmTransform->GetTransform()->GetFixedParameters().data_block() );
          const auto fixedParamsSize = wasmTransform->GetTransform()->GetFixedParameters().Size() * sizeof(FixedParametersValueType);
          setMemoryStoreOutputArray(0, index, 0, fixedParamsAddress, fixedParamsSize);

          const auto paramsAddress = reinterpret_cast< size_t >( wasmTransform->GetTransform()->GetParameters().data_block() );
          const auto paramsSize = wasmTransform->GetTransform()->GetParameters().Size() * sizeof(ParametersValueType);
          setMemoryStoreOutputArray(0, index, 1, paramsAddress, paramsSize);
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
    if (!this->m_Transform.IsNull() && !this->m_Identifier.empty())
      {
        using ParametersValueType = typename TransformType::ParametersValueType;
        using WriterType = TransformFileWriterTemplate<ParametersValueType>;
        auto writer = WriterType::New();
        writer->SetFileName(this->m_Identifier);
        writer->SetInput(this->m_Transform);
        writer->Update();
      }
#else
    std::cerr << "Filesystem IO not supported" << std::endl;
    abort();
#endif
    }
  }
protected:
  typename TTransform::ConstPointer m_Transform;

  std::string m_Identifier;
};

template <typename TTransform>
bool lexical_cast(const std::string &input, OutputTransform<TTransform> &outputTransform)
{
  outputTransform.SetIdentifier(input);
  return true;
}

} // namespace wasm
} // namespace itk

#endif
