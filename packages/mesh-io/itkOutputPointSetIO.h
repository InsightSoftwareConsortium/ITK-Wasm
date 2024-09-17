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
#ifndef itkOutputPointSetIO_h
#define itkOutputPointSetIO_h

#include "itkPipeline.h"

#include "itkMeshIOBase.h"
#include "itkWasmMeshIOBase.h"
#include "itkWasmMeshIO.h"
#include "itkWasmIOCommon.h"
#ifndef ITK_WASM_NO_MEMORY_IO
#include "itkWasmExports.h"
#endif
#ifndef ITK_WASM_NO_FILESYSTEM_IO
#endif

namespace itk
{
  namespace wasm
  {
    /**
     *\class OutputPointSetIO
     * \brief Output point set for an itk::wasm::Pipeline from an itk::MeshIOBase
     *
     * This ponit set is written to the filesystem or memory when it goes out of scope.
     *
     * This class is for the ReadMesh ITK-Wasm pipeline. Most pipelines will use itk::wasm::OutputPointSet.
     *
     * \ingroup WebAssemblyInterface
     */
    class OutputPointSetIO
    {
    public:
      /** Set whether to only read point set metadata. Do not read the points, points data. */
      void SetInformationOnly(bool informationOnly)
      {
        this->m_InformationOnly = informationOnly;
      }

      void Set(MeshIOBase *imageIO)
      {
        this->m_MeshIO = imageIO;
      }

      MeshIOBase *Get() const
      {
        return this->m_MeshIO.GetPointer();
      }

      /** FileName or output index. */
      void SetIdentifier(const std::string &identifier)
      {
        this->m_Identifier = identifier;
      }
      const std::string &GetIdentifier() const
      {
        return this->m_Identifier;
      }

      OutputPointSetIO() = default;
      ~OutputPointSetIO()
      {
        if (wasm::Pipeline::get_use_memory_io())
        {
#ifndef ITK_WASM_NO_MEMORY_IO
          if (!this->m_MeshIO.IsNull() && !this->m_Identifier.empty())
          {
            const auto index = std::stoi(this->m_Identifier);
            auto wasmMeshIOBase = itk::WasmMeshIOBase::New();
            wasmMeshIOBase->SetMeshIO(this->m_MeshIO);
            setMemoryStoreOutputDataObject(0, index, wasmMeshIOBase);

            if (this->m_InformationOnly)
            {
              return;
            }

            const auto pointsSize = wasmMeshIOBase->GetPointsContainer()->size();
            if (pointsSize)
            {
              const auto pointsAddress = reinterpret_cast<size_t>(&(wasmMeshIOBase->GetPointsContainer()->at(0)));
              setMemoryStoreOutputArray(0, index, 0, pointsAddress, pointsSize);
            }

            const auto pointDataSize = wasmMeshIOBase->GetPointDataContainer()->size();
            if (pointDataSize)
            {
              const auto pointDataAddress = reinterpret_cast<size_t>(&(wasmMeshIOBase->GetPointDataContainer()->at(0)));
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
          if (!this->m_MeshIO.IsNull() && !this->m_Identifier.empty())
          {
            this->m_MeshIO->ReadMeshInformation();

            auto wasmMeshIO = itk::WasmMeshIO::New();
            wasmMeshIO->SetFileName(this->m_Identifier);

            const unsigned int dimension = this->m_MeshIO->GetPointDimension();
            wasmMeshIO->SetPointDimension(dimension);
            wasmMeshIO->SetPointComponentType(this->m_MeshIO->GetPointComponentType());
            wasmMeshIO->SetPointPixelType(this->m_MeshIO->GetPointPixelType());
            wasmMeshIO->SetPointPixelComponentType(this->m_MeshIO->GetPointPixelComponentType());
            wasmMeshIO->SetNumberOfPointPixelComponents(this->m_MeshIO->GetNumberOfPointPixelComponents());
            wasmMeshIO->SetNumberOfPoints(this->m_MeshIO->GetNumberOfPoints());
            wasmMeshIO->SetNumberOfPointPixels(this->m_MeshIO->GetNumberOfPointPixels());

            wasmMeshIO->WriteMeshInformation();

            if (this->m_InformationOnly)
            {
              return;
            }

            SizeValueType numberOfBytes = this->m_MeshIO->GetNumberOfPoints() * this->m_MeshIO->GetPointDimension() * ITKComponentSize(this->m_MeshIO->GetPointComponentType());
            std::vector<char> loadBuffer(numberOfBytes);
            if (numberOfBytes)
            {
              this->m_MeshIO->ReadPoints(reinterpret_cast<void *>(&(loadBuffer.at(0))));
              wasmMeshIO->WritePoints(reinterpret_cast<void *>(&(loadBuffer.at(0))));
            }

            numberOfBytes =
                static_cast<SizeValueType>(
                    this->m_MeshIO->GetNumberOfPointPixels() * this->m_MeshIO->GetNumberOfPointPixelComponents() * ITKComponentSize(this->m_MeshIO->GetPointPixelComponentType()));
            if (numberOfBytes)
            {
              loadBuffer.resize(numberOfBytes);
              this->m_MeshIO->ReadPointData(reinterpret_cast<void *>(&(loadBuffer.at(0))));
              wasmMeshIO->WritePointData(reinterpret_cast<void *>(&(loadBuffer.at(0))));
            }

            wasmMeshIO->Write();
          }
#else
          std::cerr << "Filesystem IO not supported" << std::endl;
          abort();
#endif
        }
      }

    protected:
      typename MeshIOBase::Pointer m_MeshIO;

      std::string m_Identifier;

      bool m_InformationOnly{false};
    };

    bool lexical_cast(const std::string &input, OutputPointSetIO &outputMeshIO)
    {
      outputMeshIO.SetIdentifier(input);
      return true;
    }

  } // namespace wasm
} // namespace itk

#endif
