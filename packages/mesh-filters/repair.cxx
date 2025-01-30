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

#include <geogram/mesh/mesh_repair.h>
#include <geogram/mesh/mesh_fill_holes.h>
#include <geogram/mesh/mesh_degree3_vertices.h>
#include <geogram/mesh/mesh_surface_intersection.h>
#include <geogram/mesh/mesh_geometry.h>
#include <geogram/mesh/mesh_preprocessing.h>
#include <geogram/basic/command_line.h>
#include <geogram/basic/command_line_args.h>

template <typename TMesh>
int repairMesh(itk::wasm::Pipeline &pipeline, const TMesh *inputMesh)
{
  using MeshType = TMesh;
  constexpr unsigned int Dimension = MeshType::PointDimension;
  using PixelType = typename MeshType::PixelType;

  static constexpr bool SinglePrecision = std::is_same<typename MeshType::CoordRepType, float>::value;

  pipeline.get_option("input-mesh")->required()->type_name("INPUT_MESH");

  double pointMergeTolerance = 1e-6;
  pipeline.add_option("--merge-tolerance", pointMergeTolerance, "Point merging tolerance as a percent of the bounding box diagonal.");

  double minimumComponentArea = 3.0;
  pipeline.add_option("--minimum-component-area", minimumComponentArea, "Minimum component area as a percent of the total area. Components smaller than this are removed.");

  double maximumHoleArea = 1e-1;
  pipeline.add_option("--maximum-hole-area", maximumHoleArea, "Maximum area of a hole as a percent of the total area. Holes smaller than this are filled.");

  uint64_t maximumHoleEdges = 2000;
  pipeline.add_option("--maximum-hole-edges", maximumHoleEdges, "Maximum number of edges in a hole. Holes with fewer edges than this are filled.");

  double maximumDegree3VerticesDistance = 0.0;
  pipeline.add_option("--maximum-degree3-distance", maximumDegree3VerticesDistance, "Maximum distance as a percent of the bounding box diagonal. Vertices with degree 3 that are closer than this are merged.");

  bool removeIntersectingTriangles = false;
  pipeline.add_flag("--remove-intersecting-triangles", removeIntersectingTriangles, "Remove intersecting triangles.");

  bool noTriangulate = false;
  // TODO: See if we can add this option, disable auto-repair in fill_holes, and successfully
  // repair with mesh_repair afterwards without triangulation.
  // remove_degree3_vertices and mesh_remove_intersections also need to be checked for compatibility.
  // pipeline.add_option("--no-triangulate", noTriangulate, "Do not triangulate the mesh.");

  itk::wasm::OutputMesh<MeshType> outputMesh;
  pipeline.add_option("output-mesh", outputMesh, "The output repaired mesh.")->type_name("OUTPUT_MESH");

  ITK_WASM_PARSE(pipeline);

  GEO::Logger::initialize();
  GEO::Logger::instance()->set_quiet(true);
  GEO::CmdLine::initialize();
  // GEO::initialize(GEO::GEOGRAM_INSTALL_ALL);
  // GEO::Logger::instance()->set_quiet(true);

  // For algo::nn_search
  GEO::CmdLine::import_arg_group("algo");

  GEO::Mesh geoMesh(Dimension, false);
  itk::meshToGeogramMesh<MeshType>(inputMesh, geoMesh);

  const double bboxDiagonal = GEO::bbox_diagonal(geoMesh);
  pointMergeTolerance *= (0.01 * bboxDiagonal);
  const double area = GEO::Geom::mesh_area(geoMesh, Dimension);
  minimumComponentArea *= (0.01 * area);
  maximumHoleArea *= (0.01 * area);

  if (noTriangulate)
  {
    GEO::mesh_repair(geoMesh, GEO::MeshRepairMode(GEO::MESH_REPAIR_COLOCATE | GEO::MESH_REPAIR_DUP_F), pointMergeTolerance);
  }
  else
  {
    GEO::mesh_repair(geoMesh, GEO::MESH_REPAIR_DEFAULT, pointMergeTolerance);
  }

  if(minimumComponentArea != 0.0) {
      double numberOfFacesRemoved = geoMesh.facets.nb();
      GEO::remove_small_connected_components(geoMesh, minimumComponentArea);
      numberOfFacesRemoved -= geoMesh.facets.nb();
      if(numberOfFacesRemoved != 0) {
          if (noTriangulate)
          {
            GEO::mesh_repair(geoMesh, GEO::MeshRepairMode(GEO::MESH_REPAIR_COLOCATE | GEO::MESH_REPAIR_DUP_F), pointMergeTolerance);
          }
          else
          {
            GEO::mesh_repair(geoMesh, GEO::MESH_REPAIR_DEFAULT, pointMergeTolerance);
          }
      }
  }

  if (maximumHoleArea != 0.0 && maximumHoleEdges != 0)
  {
    GEO::fill_holes(geoMesh, maximumHoleArea, maximumHoleEdges);
  }

  if (maximumDegree3VerticesDistance > 0.0)
  {
    maximumDegree3VerticesDistance *= (0.01 * bboxDiagonal);
    GEO::remove_degree3_vertices(geoMesh, maximumDegree3VerticesDistance);
  }

  if (removeIntersectingTriangles)
  {
    GEO::mesh_remove_intersections(geoMesh);
  }

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
  itk::wasm::Pipeline pipeline("repair", "Repair a mesh so it is 2-manifold and optionally watertight.", argc, argv);

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
