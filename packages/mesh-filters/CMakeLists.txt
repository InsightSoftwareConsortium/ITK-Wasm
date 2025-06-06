cmake_minimum_required(VERSION 3.16)
project(itkwasm-mesh-filters)

set(CMAKE_CXX_STANDARD 20)

if(EMSCRIPTEN)
  set(io_components
    )
elseif(WASI)
  set(io_components
    ITKIOMeshOFF
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

# set(PMP_GIT_REPOSITORY "https://github.com/pmp-library/pmp-library.git")
set(PMP_GIT_REPOSITORY "https://github.com/thewtex/pmp-library.git")
# v3.0.0
set(PMP_GIT_TAG "ff39b57af6bf2c3b15b69e5bb187483bd51e3cda")
set(BUILD_SHARED_LIBS OFF)
# re-enable after WASI threading enabled
if (NOT WASI)
FetchContent_Declare(
  pmp
  GIT_REPOSITORY ${PMP_GIT_REPOSITORY}
  GIT_TAG        ${PMP_GIT_TAG}
  GIT_SHALLOW TRUE
)
endif()

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
set(GEOGRAM_VORPALINE OFF CACHE BOOL "Vorpaline library")
set(GEOGRAM_LIB_ONLY ON CACHE BOOL "Only build the geogram library")
if (EMSCRIPTEN)
  set(VORPALINE_PLATFORM "Emscripten-clang" CACHE STRING "Vorpaline platform")
  set(EMSCRIPTEN_DIR "/emsdk/upstream/emscripten" CACHE PATH "Emscripten directory")
endif()
if (WASI)
  set(VORPALINE_PLATFORM "Wasi-clang" CACHE STRING "Vorpaline platform")
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_SIGNAL")
  set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -lwasi-emulated-process-clocks -lwasi-emulated-signal")
endif()
if(EMSCRIPTEN OR WASI)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -flto -msimd128 -Wno-missing-include-dirs -Wno-unsafe-buffer-usage -Wno-switch-default -Wno-undefined-reinterpret-cast -Wno-deprecated-declarations -Wno-documentation")
endif()

# set(GEOGRAM_GIT_REPOSITORY "https://github.com/BrunoLevy/geogram.git")
set(GEOGRAM_GIT_REPOSITORY "https://github.com/thewtex/geogram.git")
# wasi-2025-01-28
set(GEOGRAM_GIT_TAG "db55d1ead1bcfcef658e8868956b3abcea193dd5")
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

# Re-enable after WASI threading enabled
# FetchContent_MakeAvailable(pmp geogram mesh_plane_intersection)
# include_directories(${pmp_SOURCE_DIR}/src)
FetchContent_MakeAvailable(geogram mesh_plane_intersection)
include_directories(${geogram_SOURCE_DIR}/src/lib)
include_directories(${mesh_plane_intersection_SOURCE_DIR}/src)

foreach(pipeline geogram-conversion repair smooth-remesh keep-largest-component)
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
    ${CMAKE_CURRENT_BINARY_DIR}/slice-mesh-suzanne.off
    )
add_test(NAME slice-mesh-cow
  COMMAND slice-mesh
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/baseline/cow-repair.off
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/slice-mesh-plane.json
    ${CMAKE_CURRENT_BINARY_DIR}/slice-mesh-cow.off
    )
add_test(NAME slice-mesh-brain
  COMMAND slice-mesh
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/baseline/brain-repair.off
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/slice-mesh-plane.json
    ${CMAKE_CURRENT_BINARY_DIR}/slice-mesh-brain.off
    )

add_test(NAME keep-largest-component-help
  COMMAND keep-largest-component
    --help
    )
add_test(NAME keep-largest-component-suzanne
  COMMAND keep-largest-component
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/suzanne.off
    ${CMAKE_CURRENT_BINARY_DIR}/suzanne-keep-largest-component.off
    )
