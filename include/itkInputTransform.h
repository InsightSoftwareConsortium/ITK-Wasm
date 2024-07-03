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
#ifndef itkInputTransform_h
#define itkInputTransform_h

#include "itkPipeline.h"

#ifndef ITK_WASM_NO_MEMORY_IO
#include "itkWasmExports.h"
#include "itkWasmTransform.h"
#include "itkWasmTransformToTransformFilter.h"
#endif
#ifndef ITK_WASM_NO_FILESYSTEM_IO
#include "itkTransformFileReader.h"
#endif

namespace itk
{
namespace wasm
{

/**
 *\class InputTransform
 * \brief Input transform for an itk::wasm::Pipeline
 *
 * This transform is read from the filesystem or memory when ITK_WASM_PARSE_ARGS is called.
 *
 * Call `Get()` to get the TTransform * to use an input to a pipeline.
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TTransform>
class ITK_TEMPLATE_EXPORT InputTransform
{
public:
  using TransformType = TTransform;

  void Set(const TransformType * transform) {
    this->m_Transform = transform;
  }

  const TransformType * Get() const {
    return this->m_Transform.GetPointer();
  }

  InputTransform() = default;
  ~InputTransform() = default;
protected:
  typename TTransform::ConstPointer m_Transform;
};


template <typename TTransform>
bool lexical_cast(const std::string &input, InputTransform<TTransform> &inputTransform)
{
  if (input.empty())
  {
    return false;
  }

  if (wasm::Pipeline::get_use_memory_io())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    using WasmTransformToTransformFilterType = WasmTransformToTransformFilter<TTransform>;
    auto wasmTransformToTransformFilter = WasmTransformToTransformFilterType::New();
    auto wasmTransform = WasmTransformToTransformFilterType::WasmTransformType::New();
    const unsigned int index = std::stoi(input);
    auto json = getMemoryStoreInputJSON(0, index);
    wasmTransform->SetJSON(json);
    wasmTransformToTransformFilter->SetInput(wasmTransform);
    wasmTransformToTransformFilter->Update();
    inputTransform.Set(wasmTransformToTransformFilter->GetOutput());
#else
    return false;
#endif
  }
  else
  {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    using ParametersValueType = typename TTransform::ParametersValueType;
    using ReaderType = itk::TransformFileReaderTemplate<ParametersValueType>;
    auto reader = ReaderType::New();
    reader->SetFileName(input);
    reader->Update();
    auto transformList = reader->GetTransformList();
    if (transformList->empty())
    {
      return false;
    }
    auto transform = dynamic_cast<const TTransform *>(transformList->front().GetPointer());
    if (!transform)
    {
      return false;
    }
    inputTransform.Set(transform);
#else
    return false;
#endif
  }
  return true;
}

} // end namespace wasm
} // end namespace itk

#endif
