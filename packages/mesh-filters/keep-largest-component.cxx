/*=========================================================================

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

#include <stack>

#include "itkPipeline.h"
#include "itkInputMesh.h"
#include "itkOutputMesh.h"
#include "itkSupportInputMeshTypes.h"

#include "itkmeshToGeogramMesh.h"
#include "itkgeogramMeshToMesh.h"

#include <geogram/mesh/mesh_remesh.h>
#include <geogram/mesh/mesh_geometry.h>
#include <geogram/basic/command_line.h>
#include <geogram/basic/command_line_args.h>

#include <geogram/basic/common.h>
#include <geogram/basic/process.h>
#include <geogram/basic/logger.h>
#include <geogram/basic/command_line.h>

template <typename TMesh>
int keepLargestComponent(itk::wasm::Pipeline &pipeline, const TMesh *inputMesh)
{
  using MeshType = TMesh;
  constexpr unsigned int Dimension = MeshType::PointDimension;
  using PixelType = typename MeshType::PixelType;

  using index_t = GEO::index_t;

  pipeline.get_option("input-mesh")->required()->type_name("INPUT_MESH");

  itk::wasm::OutputMesh<MeshType> outputMesh;
  pipeline.add_option("output-mesh", outputMesh, "The output mesh with only the largest component.")->type_name("OUTPUT_MESH");

  ITK_WASM_PARSE(pipeline);

  // GEO::initialize(GEO::GEOGRAM_INSTALL_ALL);

  GEO::Logger::initialize(); GEO::Logger::instance()->set_quiet(true);
  GEO::CmdLine::initialize();
  const auto flags = GEO::GEOGRAM_INSTALL_ALL;
  GEO::Process::initialize(flags);
  GEO::CmdLine::import_arg_group("algo");

  GEO::Mesh geoMesh(Dimension, false);
  itk::meshToGeogramMesh<MeshType>(inputMesh, geoMesh);

  // component[f] will correspond to the component id of facet f
  GEO::vector<index_t> component(geoMesh.facets.nb(), index_t(-1));
  index_t nb_comp = 0;

  // Iterates on all the facets of M
  // (equivalent to for(index_t f = 0; f < M.facets.nb(); ++f))
  for(index_t f: geoMesh.facets) {
      if(component[f] == index_t(-1)) {
          // recursive traversal of the connected component
          // incident to facet f (if it was not already traversed)
          component[f] = nb_comp;
          std::stack<index_t> S;
          S.push(f);
          while(!S.empty()) {
              index_t top_f = S.top();
              S.pop();
              // Push the neighbors of facet top_f onto the stack if
              // they were not already visited
              for(
                  index_t le=0;
                  le<geoMesh.facets.nb_vertices(top_f); ++le
              ) {
                  index_t adj_f = geoMesh.facets.adjacent(top_f,le);
                  if(adj_f != index_t(-1) &&
                      component[adj_f] == index_t(-1)) {
                      component[adj_f] = nb_comp;
                      S.push(adj_f);
                  }
              }
          }
          ++nb_comp;
      }
  }

  // Now compute the number of facets in each connected component
  GEO::vector<index_t> comp_size(nb_comp,0);
  for(index_t f: geoMesh.facets) {
      ++comp_size[component[f]];
  }

  // Determine the id of the largest component
  index_t largest_comp = 0;
  index_t largest_comp_size = 0;
  for(index_t comp=0; comp<nb_comp; ++comp) {
      if(comp_size[comp] >= largest_comp_size) {
          largest_comp_size = comp_size[comp];
          largest_comp = comp;
      }
  }
  // Remove all the facets that are not in the largest component
  // component[] is now used as follows:
  //   component[f] = 0 if f should be kept
  //   component[f] = 1 if f should be deleted
  // See GEO::MeshElements::delete_elements() documentation.
  for(index_t f: geoMesh.facets) {
      component[f] = (component[f] != largest_comp) ? 1 : 0;
  }
  geoMesh.facets.delete_elements(component);

  typename MeshType::Pointer itkMesh = MeshType::New();
  itk::geogramMeshToMesh<MeshType>(geoMesh, itkMesh);

  outputMesh.Set(itkMesh);

  return EXIT_SUCCESS;
}

template <typename TMesh>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline &pipeline)
  {
    using MeshType = TMesh;

    itk::wasm::InputMesh<MeshType> testMesh;
    pipeline.add_option("input-mesh", testMesh, "The input mesh.")->type_name("INPUT_MESH");

    ITK_WASM_PRE_PARSE(pipeline);

    typename MeshType::ConstPointer inputMeshRef = testMesh.Get();
    return keepLargestComponent<MeshType>(pipeline, inputMeshRef);
  }
};

int main(int argc, char *argv[])
{
  itk::wasm::Pipeline pipeline("keep-largest-component", "Keep only the largest component in the mesh.", argc, argv);

  return itk::wasm::SupportInputMeshTypes<PipelineFunctor,
                                          uint8_t,
                                          // int8_t,
                                          uint16_t,
                                          int16_t,
                                          // uint32_t,
                                          // int32_t,
                                          float,
                                          double>::Dimensions<
      3U>("input-mesh", pipeline);
}
