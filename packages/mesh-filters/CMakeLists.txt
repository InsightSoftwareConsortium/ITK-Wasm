cmake_minimum_required(VERSION 3.16)
project(itkwasm-mesh-filters LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)

if(EMSCRIPTEN)
  set(io_components
    )
elseif(WASI)
  set(io_components
    ITKIOOFF
    )
else()
  set(io_components
    ITKMeshIO
    )
endif()

find_package(ITK REQUIRED
 COMPONENTS
   WebAssemblyInterface
   ITKQuadEdgeMeshFiltering
   ${io_components}
 )
include(${ITK_USE_FILE})

include(FetchContent)

set(PMP_BUILD_DOCS OFF)
set(PMP_BUILD_EXAMPLES OFF)
set(PMP_BUILD_REGRESSIONS OFF)
set(PMP_BUILD_TESTS OFF)
set(PMP_BUILD_VIS OFF)
set(PMP_INSTALL OFF)

set(PMP_GIT_REPOSITORY "https://github.com/pmp-library/pmp-library.git")
# v3.0.0
set(PMP_GIT_TAG "f2fb04f4a4188a5c1ab137e83b96e62fa99c639f")
set(BUILD_SHARED_LIBS OFF)
FetchContent_Declare(
  pmp
  GIT_REPOSITORY ${PMP_GIT_REPOSITORY}
  GIT_TAG        ${PMP_GIT_TAG}
  GIT_SHALLOW TRUE
)

if (POLICY CMP0077)
  cmake_policy(SET CMP0077 NEW)
endif()
set(GEOGRAM_WITH_GARGATUA OFF CACHE BOOL "64-bit indices")
set(GEOGRAM_WITH_GRAPHICS OFF CACHE BOOL "Viewers and geogram_gfx library")
set(GEOGRAM_WITH_HLBFGS OFF CACHE BOOL "HLBFGS non-linear solver library")
set(GEOGRAM_WITH_LUA OFF CACHE BOOL "Lua scripting")
set(GEOGRAM_WITH_TBB OFF CACHE BOOL "Intel TBB")
set(GEOGRAM_WITH_TETGEN OFF CACHE BOOL "Tetrahedral mesh generation (Hang Si's TetGen)")
set(GEOGRAM_WITH_TRIANGLE OFF CACHE BOOL "Triangle mesher (Jonathan Shewchuk's Triangle)")

set(GEOGRAM_GIT_REPOSITORY "https://github.com/BrunoLevy/geogram.git")
# v1.9.1
set(GEOGRAM_GIT_TAG "fd3db7f141e570ebc68585e15d01a2f2c8ddb02e")
set(BUILD_SHARED_LIBS OFF)
FetchContent_Declare(
  geogram
  GIT_REPOSITORY ${GEOGRAM_GIT_REPOSITORY}
  GIT_TAG        ${GEOGRAM_GIT_TAG}
  GIT_SHALLOW TRUE
)

set(MESH_PLANE_INTERSECTION_GIT_REPOSITORY "https://github.com/intents-software/mesh-plane-intersection.git")
# 2024-12-14 master
set(MESH_PLANE_INTERSECTION_GIT_TAG "b632819a0027e8c3a6e64036c4984fe0f5c2c0d4")
FetchContent_Declare(
  mesh_plane_intersection
  GIT_REPOSITORY ${MESH_PLANE_INTERSECTION_GIT_REPOSITORY}
  GIT_TAG        ${MESH_PLANE_INTERSECTION_GIT_TAG}
  GIT_SHALLOW TRUE
)

FetchContent_MakeAvailable(pmp geogram mesh_plane_intersection)
include_directories(${pmp_SOURCE_DIR}/src)
include_directories(${geogram_SOURCE_DIR}/src/lib)
include_directories(${mesh_plane_intersection_SOURCE_DIR}/src)

foreach(pipeline geogram-conversion repair smooth-remesh)
  add_executable(${pipeline} ${pipeline}.cxx)
  target_link_libraries(${pipeline} PUBLIC ${ITK_LIBRARIES} geogram)
  target_include_directories(${pipeline} PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
endforeach()

add_executable(slice-mesh slice-mesh.cxx)
target_link_libraries(slice-mesh PUBLIC ${ITK_LIBRARIES})
target_include_directories(slice-mesh PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

enable_testing()

add_test(NAME geogram-conversion
  COMMAND geogram-conversion
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/suzanne.off
    ${CMAKE_CURRENT_BINARY_DIR}/suzanne-geogram.off
    )

add_test(NAME repair-help
  COMMAND repair
    --help
    )
add_test(NAME repair-suzanne
  COMMAND repair
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/suzanne.off
    ${CMAKE_CURRENT_BINARY_DIR}/suzanne-repair.off
    )
add_test(NAME repair-cow
  COMMAND repair
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cow.off
    ${CMAKE_CURRENT_BINARY_DIR}/cow-repair.off
    )
add_test(NAME repair-brain
  COMMAND repair
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/brain.off
    ${CMAKE_CURRENT_BINARY_DIR}/brain-repair.off
    )

add_test(NAME smooth-remesh-help
  COMMAND smooth-remesh
    --help
    )
add_test(NAME smooth-remesh-suzanne
  COMMAND smooth-remesh
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/baseline/suzanne-repair.off
    ${CMAKE_CURRENT_BINARY_DIR}/suzanne-smooth-remesh.off
    )
add_test(NAME smooth-remesh-cow
  COMMAND smooth-remesh
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/baseline/cow-repair.off
    ${CMAKE_CURRENT_BINARY_DIR}/cow-smooth-remesh.off
    )
add_test(NAME smooth-remesh-brain
  COMMAND smooth-remesh
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/baseline/brain-repair.off
    ${CMAKE_CURRENT_BINARY_DIR}/brain-smooth-remesh.off
    --number-points 30
    )

add_test(NAME slice-mesh-help
  COMMAND slice-mesh
    --help
    )
add_test(NAME slice-mesh-suzanne
  COMMAND slice-mesh
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/baseline/suzanne-repair.off
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/slice-mesh-plane.json
    ${CMAKE_CURRENT_BINARY_DIR}/slice-mesh-suzanne.vtk
    )
add_test(NAME slice-mesh-cow
  COMMAND slice-mesh
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/baseline/cow-repair.off
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/slice-mesh-plane.json
    ${CMAKE_CURRENT_BINARY_DIR}/slice-mesh-cow.vtk
    )
add_test(NAME slice-mesh-brain
  COMMAND slice-mesh
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/baseline/brain-repair.off
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/slice-mesh-plane.json
    ${CMAKE_CURRENT_BINARY_DIR}/slice-mesh-brain.vtk
    )
# # Interesting backtrace on exit
# if (NOT CMAKE_BUILD_TYPE STREQUAL "Debug")
#   add_test(NAME mesh-filters
#     COMMAND mesh-filters
#       ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
#       ${CMAKE_CURRENT_BINARY_DIR}/cthead1_mesh-filtersd.png
#       --shrink-factors 2 2
#       )
# endif()

# add_test(NAME mesh-filters-sigma
#   COMMAND mesh-filters-sigma
#     ${CMAKE_CURRENT_BINARY_DIR}/mesh-filters-sigma.json
#     --shrink-factors 2 4
#     )

# add_test(NAME gaussian-kernel-radius
#   COMMAND gaussian-kernel-radius
#     ${CMAKE_CURRENT_BINARY_DIR}/gaussian-kernel-radius.json
#     --size 64 64 32
#     --sigma 2.0 4.0 2.0
#     )

# add_test(NAME mesh-filters-bin-shrink
#   COMMAND mesh-filters-bin-shrink
#     ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
#     ${CMAKE_CURRENT_BINARY_DIR}/cthead1_mesh-filtersd_bin_shrink.png
#     --shrink-factors 2 2
#     )

# add_test(NAME mesh-filters-label-image
#   COMMAND mesh-filters-label-image
#     ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/2th_cthead1.png
#     ${CMAKE_CURRENT_BINARY_DIR}/cthead1_mesh-filtersd_label_image.png
#     --shrink-factors 2 2
#     )
