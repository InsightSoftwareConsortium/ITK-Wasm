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
#include "itkMesh.h"
#include "itkQuadEdgeMesh.h"
#include "itkInputMesh.h"
#include "itkOutputMesh.h"
#include "itkPipeline.h"

#include "itkmeshToGeogramMesh.h"
#include "itkgeogramMeshToMesh.h"

int main( int argc, char * argv[] )
{
  itk::wasm::Pipeline pipeline("geogram-conversion", "A test for reading and writing with geogram, itk::QuadEdgeMesh meshes", argc, argv);

  using PixelType = float;
  constexpr unsigned int Dimension = 3;
  using MeshType = itk::QuadEdgeMesh< PixelType, Dimension >;

  static constexpr bool SinglePrecision = std::is_same<typename MeshType::CoordRepType, float>::value;

  using InputMeshType = itk::wasm::InputMesh<MeshType>;
  InputMeshType inputMesh;
  pipeline.add_option("input-mesh", inputMesh, "The input mesh")->required()->type_name("INPUT_MESH");

  using OutputMeshType = itk::wasm::OutputMesh<MeshType>;
  OutputMeshType outputMesh;
  pipeline.add_option("output-mesh", outputMesh, "The output mesh")->required()->type_name("OUTPUT_MESH");

  ITK_WASM_PARSE(pipeline);

  GEO::Mesh geoMesh(Dimension, SinglePrecision);
  itk::meshToGeogramMesh<MeshType>(inputMesh.Get(), geoMesh);

  MeshType::Pointer itkMesh = MeshType::New();
  itk::geogramMeshToMesh<MeshType>(geoMesh, itkMesh);

  outputMesh.Set(itkMesh);

  return EXIT_SUCCESS;
}
