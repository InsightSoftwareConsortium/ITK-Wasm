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
#ifndef itkInputPointSet_h
#define itkInputPointSet_h

#include "itkPipeline.h"

#ifndef ITK_WASM_NO_MEMORY_IO
#include "itkWasmExports.h"
#include "itkWasmPointSet.h"
#include "itkWasmPointSetToPointSetFilter.h"
#endif
#ifndef ITK_WASM_NO_FILESYSTEM_IO
#include "itkMesh.h"
#include "itkMeshFileReader.h"
#endif

namespace itk
{
namespace wasm
{

/**
 *\class InputPointSet
 * \brief Input pointSet for an itk::wasm::Pipeline
 *
 * This point set is read from the filesystem or memory when ITK_WASM_PARSE_ARGS is called.
 *
 * Call `Get()` to get the TPointSet * to use an input to a pipeline.
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TPointSet>
class ITK_TEMPLATE_EXPORT InputPointSet
{
public:
  using PointSetType = TPointSet;

  void Set(const PointSetType * pointSet) {
    this->m_PointSet = pointSet;
  }

  const PointSetType * Get() const {
    return this->m_PointSet.GetPointer();
  }

  InputPointSet() = default;
  ~InputPointSet() = default;
protected:
  typename TPointSet::ConstPointer m_PointSet;
};


template <typename TPointSet>
bool lexical_cast(const std::string &input, InputPointSet<TPointSet> &inputPointSet)
{
  if (input.empty())
  {
    return false;
  }

  if (wasm::Pipeline::get_use_memory_io())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    using WasmPointSetToPointSetFilterType = WasmPointSetToPointSetFilter<TPointSet>;
    auto wasmPointSetToPointSetFilter = WasmPointSetToPointSetFilterType::New();
    auto wasmPointSet = WasmPointSetToPointSetFilterType::WasmPointSetType::New();
    const unsigned int index = std::stoi(input);
    auto json = getMemoryStoreInputJSON(0, index);
    wasmPointSet->SetJSON(json);
    wasmPointSetToPointSetFilter->SetInput(wasmPointSet);
    wasmPointSetToPointSetFilter->Update();
    inputPointSet.Set(wasmPointSetToPointSetFilter->GetOutput());
#else
    return false;
#endif
  }
  else
  {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    using MeshType = Mesh<typename TPointSet::PixelType, TPointSet::PointDimension>;
    using ReaderType = MeshFileReader<MeshType>;
    auto reader = ReaderType::New();
    reader->SetFileName(input);
    reader->Update();
    auto pointSet = reader->GetOutput();
    inputPointSet.Set(pointSet);
#else
    return false;
#endif
  }
  return true;
}

} // end namespace wasm
} // end namespace itk

#endif
