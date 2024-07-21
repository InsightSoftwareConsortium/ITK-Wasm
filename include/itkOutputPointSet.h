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
#ifndef itkOutputPointSet_h
#define itkOutputPointSet_h

#include "itkPipeline.h"
#include "itkMeshConvertPixelTraits.h"

#ifndef ITK_WASM_NO_MEMORY_IO
#include "itkWasmExports.h"
#include "itkWasmPointSet.h"
#include "itkPointSetToWasmPointSetFilter.h"
#endif
#ifndef ITK_WASM_NO_FILESYSTEM_IO
#include "itkMesh.h"
#include "itkMeshFileWriter.h"
#endif

namespace itk
{
namespace wasm
{
/**
 *\class OutputPointSet
 * \brief Output point set for an itk::wasm::Pipeline
 *
 * This point set is written to the filesystem or memory when it goes out of scope.
 * 
 * Call `GetPointSet()` to get the TPointSet * to use an input to a pipeline.
 * 
 * \ingroup WebAssemblyInterface
 */
template <typename TPointSet>
class ITK_TEMPLATE_EXPORT OutputPointSet
{
public:
  using PointSetType = TPointSet;

  void Set(const PointSetType * pointSet) {
    this->m_PointSet = pointSet;
  }

  const PointSetType * Get() const {
    return this->m_PointSet.GetPointer();
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

  OutputPointSet() = default;
  ~OutputPointSet() {
    if(wasm::Pipeline::get_use_memory_io())
    {
#ifndef ITK_WASM_NO_MEMORY_IO
    if (!this->m_PointSet.IsNull() && !this->m_Identifier.empty())
      {
        using PointSetToWasmPointSetFilterType = PointSetToWasmPointSetFilter<PointSetType>;
        auto pointSetToWasmPointSetFilter = PointSetToWasmPointSetFilterType::New();
        pointSetToWasmPointSetFilter->SetInput(this->m_PointSet);
        pointSetToWasmPointSetFilter->Update();
        auto wasmPointSet = pointSetToWasmPointSetFilter->GetOutput();
        const auto index = std::stoi(this->m_Identifier);
        setMemoryStoreOutputDataObject(0, index, wasmPointSet);

        if (this->m_PointSet->GetNumberOfPoints() > 0)
        {
          const auto pointsAddress = reinterpret_cast< size_t >( &(wasmPointSet->GetPointSet()->GetPoints()->at(0)) );
          const auto pointsSize = wasmPointSet->GetPointSet()->GetPoints()->Size() * sizeof(typename PointSetType::CoordRepType) * PointSetType::PointDimension;
          setMemoryStoreOutputArray(0, index, 0, pointsAddress, pointsSize);
        }

        if (this->m_PointSet->GetPointData() != nullptr && this->m_PointSet->GetPointData()->Size() > 0)
        {
          using PointPixelType = typename PointSetType::PixelType;
          using ConvertPointPixelTraits = MeshConvertPixelTraits<PointPixelType>;
          const auto pointDataAddress = reinterpret_cast< size_t >( &(wasmPointSet->GetPointSet()->GetPointData()->at(0)) );
          const auto pointDataSize = wasmPointSet->GetPointSet()->GetPointData()->Size() * sizeof(typename ConvertPointPixelTraits::ComponentType) * ConvertPointPixelTraits::GetNumberOfComponents();
          setMemoryStoreOutputArray(0, index, 1, pointDataAddress, pointDataSize);
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
    if (!this->m_PointSet.IsNull() && !this->m_Identifier.empty())
      {
      using MeshType = Mesh<typename TPointSet::PixelType, TPointSet::PointDimension>;
      using PointSetWriterType = itk::MeshFileWriter<MeshType>;
      auto pointSetWriter = PointSetWriterType::New();
      pointSetWriter->SetFileName(this->m_Identifier);
      typename MeshType::Pointer mesh = MeshType::New();
      mesh->SetPoints(const_cast<typename MeshType::PointsContainer *>(this->m_PointSet->GetPoints()));
      mesh->SetPointData(const_cast<typename MeshType::PointDataContainer *>(this->m_PointSet->GetPointData()));
      pointSetWriter->SetInput(mesh);
      pointSetWriter->Update();
      }
#else
    std::cerr << "Filesystem IO not supported" << std::endl;
    abort();
#endif
    }
  }
protected:
  typename TPointSet::ConstPointer m_PointSet;

  std::string m_Identifier;
};

template <typename TPointSet>
bool lexical_cast(const std::string &input, OutputPointSet<TPointSet> &outputPointSet)
{
  outputPointSet.SetIdentifier(input);
  return true;
}

} // namespace wasm
} // namespace itk

#endif
