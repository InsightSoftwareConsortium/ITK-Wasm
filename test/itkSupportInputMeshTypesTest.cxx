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
#include "itkWasmMeshIOFactory.h"

template <typename TMesh>
class PipelineFunctor
{
public:
  int
  operator()(itk::wasm::Pipeline & pipeline)
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
itkSupportInputMeshTypesTest(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline(
    "support-input-mesh-types-test", "Test supporting multiple input mesh types", argc, argv);

  itk::WasmMeshIOFactory::RegisterOneFactory();

  return itk::wasm::SupportInputMeshTypes<PipelineFunctor, uint8_t, float>::Dimensions<2U, 3U>("input-mesh", pipeline);
}
