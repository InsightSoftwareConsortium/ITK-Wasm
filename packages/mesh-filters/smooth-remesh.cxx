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
int repairMesh(itk::wasm::Pipeline &pipeline, const TMesh *inputMesh)
{
  using MeshType = TMesh;
  constexpr unsigned int Dimension = MeshType::PointDimension;
  using PixelType = typename MeshType::PixelType;

  pipeline.get_option("input-mesh")->required()->type_name("INPUT_MESH");

  double numberPointsPercent = 75.0;
  pipeline.add_option("--number-points", numberPointsPercent, "Number of points as a percent of the bounding box diagonal. Output may have slightly more points.");

  double triangleShapeAdaptation = 1.0;
  pipeline.add_option("--triangle-shape-adaptation", triangleShapeAdaptation, "Triangle shape adaptation factor. Use 0.0 to disable.");

  double triangleSizeAdaptation = 0.0;
  pipeline.add_option("--triangle-size-adaptation", triangleSizeAdaptation, "Triangle size adaptation factor. Use 0.0 to disable.");

  uint32_t normalIterations = 3;
  pipeline.add_option("--normal-iterations", normalIterations, "Number of normal smoothing iterations.");

  uint32_t lloydIterations = 5;
  pipeline.add_option("--lloyd-iterations", lloydIterations, "Number of Lloyd relaxation iterations.");

  uint32_t newtonIterations = 30;
  pipeline.add_option("--newton-iterations", newtonIterations, "Number of Newton iterations.");

  uint32_t newtonM = 7;
  pipeline.add_option("--newton-m", newtonM, "Number of Newton evaluations per step for Hessian approximation.");

  uint64_t lfsSamples = 10000;
  pipeline.add_option("--lfs-samples", lfsSamples, "Number of samples for size adaptation if triangle size adaptation is not 0.0.");

  itk::wasm::OutputMesh<MeshType> outputMesh;
  pipeline.add_option("output-mesh", outputMesh, "The output repaired mesh.")->type_name("OUTPUT_MESH");

  ITK_WASM_PARSE(pipeline);

  // GEO::initialize(GEO::GEOGRAM_INSTALL_ALL);

  GEO::Logger::initialize(); GEO::Logger::instance()->set_quiet(true);
  GEO::CmdLine::initialize();
  const auto flags = GEO::GEOGRAM_INSTALL_ALL;
  GEO::Process::initialize(flags);
  GEO::CmdLine::import_arg_group("algo");

  GEO::Mesh geoMesh(Dimension, false);
  itk::meshToGeogramMesh<MeshType>(inputMesh, geoMesh);

  if (geoMesh.facets.nb() == 0)
  {
    std::cerr << "The input mesh has no facets." << std::endl;
    return EXIT_FAILURE;
  }

  if (!geoMesh.facets.are_simplices())
  {
    std::cerr << "The mesh needs to be simplicial. Use repair." << std::endl;
    return EXIT_FAILURE;
  }

  uint64_t numberPoints = static_cast<uint64_t>(std::ceil(numberPointsPercent * 0.01 * geoMesh.vertices.nb()));

  if(triangleShapeAdaptation != 0.0)
  {
   triangleShapeAdaptation *= 0.02;
   GEO::compute_normals(geoMesh);
   if(normalIterations != 0)
   {
    GEO::simple_Laplacian_smooth(geoMesh, normalIterations, true);
   }
   GEO::set_anisotropy(geoMesh, triangleShapeAdaptation);
  }
  else
  {
    geoMesh.vertices.set_dimension(3);
  }

  if(triangleSizeAdaptation != 0.0)
  {
    GEO::compute_sizing_field(geoMesh, triangleSizeAdaptation, lfsSamples);
  }
  else
  {
    GEO::AttributesManager& attributes = geoMesh.vertices.attributes();
    if(attributes.is_defined("weight"))
    {
      attributes.delete_attribute_store("weight");
    }
  }

  GEO::Mesh remesh;

  GEO::remesh_smooth(geoMesh, remesh, numberPoints, 0, lloydIterations, newtonIterations, newtonM);

  GEO::MeshElementsFlags what = GEO::MeshElementsFlags(
      GEO::MESH_VERTICES | GEO::MESH_EDGES | GEO::MESH_FACETS | GEO::MESH_CELLS
  );
  geoMesh.clear();
  geoMesh.copy(remesh, true, what);

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
    pipeline.add_option("input-mesh", testMesh, "The input mesh")->type_name("INPUT_MESH");

    ITK_WASM_PRE_PARSE(pipeline);

    typename MeshType::ConstPointer inputMeshRef = testMesh.Get();
    return repairMesh<MeshType>(pipeline, inputMeshRef);
  }
};

int main(int argc, char *argv[])
{
  itk::wasm::Pipeline pipeline("remesh", "Smooth and remesh a mesh to improve quality.", argc, argv);

  return itk::wasm::SupportInputMeshTypes<PipelineFunctor,
                                          uint8_t,
                                          int8_t,
                                          uint16_t,
                                          int16_t,
                                          uint32_t,
                                          int32_t,
                                          float,
                                          double>::Dimensions<
      3U>("input-mesh", pipeline);
}
