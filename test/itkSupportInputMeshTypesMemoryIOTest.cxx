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
#include "itkPipeline.h"
#include "itkInputMesh.h"
#include "itkOutputMesh.h"
#include "itkSupportInputMeshTypes.h"
#include "itkMeshToWASMMeshFilter.h"
#include "itkWASMMeshIOFactory.h"

template<typename TMesh>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using MeshType = TMesh;

    using InputMeshType = itk::wasm::InputMesh<MeshType>;
    InputMeshType inputMesh;
    pipeline.add_option("input-mesh", inputMesh, "The input mesh")->required()->type_name("INPUT_MESH");

    using OutputMeshType = itk::wasm::OutputMesh<MeshType>;
    OutputMeshType outputMesh;
    pipeline.add_option("output-mesh", outputMesh, "The output mesh")->required()->type_name("OUTPUT_MESH");

    ITK_WASM_PARSE(pipeline);

    outputMesh.Set(inputMesh.Get());

    return EXIT_SUCCESS;
  }
};

int
itkSupportInputMeshTypesMemoryIOTest(int argc, char * argv[])
{
  itk::WASMMeshIOFactory::RegisterOneFactory();

  // Create mesh in memory
  constexpr unsigned int Dimension = 3;
  using PixelType = uint8_t;
  using MeshType = itk::Mesh<PixelType, Dimension>;

  const char * inputMeshFile = argv[1];
  using MeshReaderType = itk::MeshFileReader<MeshType>;
  auto meshReader = MeshReaderType::New();
  meshReader->SetFileName(inputMeshFile);
  meshReader->Update();
  auto readInputMesh = meshReader->GetOutput();
  using MeshToWASMMeshFilterType = itk::MeshToWASMMeshFilter<MeshType>;
  auto meshToWASMMeshFilter = MeshToWASMMeshFilterType::New();
  meshToWASMMeshFilter->SetInput(readInputMesh);
  meshToWASMMeshFilter->Update();
  auto readWASMMesh = meshToWASMMeshFilter->GetOutput();

  auto readMeshJSON = readWASMMesh->GetJSON();
  void * readWASMMeshPointer = reinterpret_cast< void * >( itk_wasm_input_json_alloc(0, 0, readMeshJSON.size()));
  std::memcpy(readWASMMeshPointer, readMeshJSON.data(), readMeshJSON.size());

  const char * mockArgv[] = {"itkSupportInputMeshTypesMemoryIOTest", "--memory-io", "0", "0", NULL};

  itk::wasm::Pipeline pipeline("support-input-mesh-types-memory-io-test", "Test supporting multiple input mesh types in memory", 4, const_cast< char ** >(mockArgv));

  return itk::wasm::SupportInputMeshTypes<PipelineFunctor,
   uint8_t,
   float>
  ::Dimensions<2U,3U>("input-mesh", pipeline);
}
