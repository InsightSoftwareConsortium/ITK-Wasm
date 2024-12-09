cmake_minimum_required(VERSION 3.16)
project(itkwasm-mesh-io)

set(CMAKE_CXX_STANDARD 20)

if (NOT TARGET libzstd_static)
  include(${CMAKE_CURRENT_SOURCE_DIR}/BuildZstd.cmake)
endif()

include_directories(${CMAKE_CURRENT_SOURCE_DIR})

# This list should be ordered from approximately most commonly to least
# commonly used modules.
set(WebAssemblyInterface_MeshIOModules
  "ITKIOMeshVTK"
  "IOMeshSTL"
  "ITKIOMeshOBJ"
  "ITKIOMeshOFF"
  "IOMeshSWC"
  "ITKIOMeshBYU"
  "ITKIOMeshFreeSurfer"
  "IOMeshMZ3"
  CACHE STRING
  "String delimited list of ITK mesh IO modules to support.")

set(meshios_ITKIOMeshBYU itkBYUMeshIO)
set(meshio_id_itkBYUMeshIO 0)
set(meshio_kebab_itkBYUMeshIO "byu")

set(meshios_ITKIOMeshFreeSurfer itkFreeSurferAsciiMeshIO itkFreeSurferBinaryMeshIO)
set(meshio_id_itkFreeSurferAsciiMeshIO 1)
set(meshio_kebab_itkFreeSurferAsciiMeshIO "free-surfer-ascii")
set(meshio_id_itkFreeSurferBinaryMeshIO 2)
set(meshio_kebab_itkFreeSurferBinaryMeshIO "free-surfer-binary")

set(meshios_ITKIOMeshVTK itkVTKPolyDataMeshIO)
set(meshio_id_itkVTKPolyDataMeshIO 3)
set(meshio_kebab_itkVTKPolyDataMeshIO "vtk-poly-data")

set(meshios_ITKIOMeshOBJ itkOBJMeshIO)
set(meshio_id_itkOBJMeshIO 4)
set(meshio_kebab_itkOBJMeshIO "obj")

set(meshios_ITKIOMeshOFF itkOFFMeshIO)
set(meshio_id_itkOFFMeshIO 5)
set(meshio_kebab_itkOFFMeshIO "off")

set(meshios_IOMeshSTL itkSTLMeshIO)
set(meshio_id_itkSTLMeshIO 6)
set(meshio_kebab_itkSTLMeshIO "stl")

set(meshios_IOMeshSWC itkSWCMeshIO)
set(meshio_id_itkSWCMeshIO 7)
set(meshio_kebab_itkSWCMeshIO "swc")

set(meshios_WebAssemblyInterface itkWasmMeshIO itkWasmZstdMeshIO)
set(meshio_id_itkWasmMeshIO 8)
set(meshio_kebab_itkWasmMeshIO "wasm")
set(meshio_id_itkWasmZstdMeshIO 9)
set(meshio_kebab_itkWasmZstdMeshIO "wasm-zstd")

set(meshios_IOMeshMZ3 itkMZ3MeshIO)
set(meshio_id_itkMZ3MeshIO 10)
set(meshio_kebab_itkMZ3MeshIO "mz3")

set(ITK_NO_MESHIO_FACTORY_REGISTER_MANAGER 1)
set(MeshIOIndex_ARRAY "")
foreach(io_module ${WebAssemblyInterface_MeshIOModules} WebAssemblyInterface)
  if (DEFINED WebAssemblyInterface_INCLUDE_DIRS)
    if(${io_module} STREQUAL "WebAssemblyInterface")
      find_package(ITK REQUIRED COMPONENTS ITKIOMeshBase)
      include(${ITK_USE_FILE})
      include_directories(${WebAssemblyInterface_INCLUDE_DIRS})
      include_directories(${CMAKE_CURRENT_SOURCE_DIR})
      list(APPEND ITK_LIBRARIES ${WebAssemblyInterface_LIBRARIES})
    else()
      find_package(ITK REQUIRED COMPONENTS ${io_module} WebAssemblyInterface)
      include(${ITK_USE_FILE})
    endif()
  else()
    find_package(ITK REQUIRED COMPONENTS ${io_module} WebAssemblyInterface)
    include(${ITK_USE_FILE})
  endif()

  if(NOT DEFINED meshios_${io_module})
    message(FATAL_ERROR "Unknown MeshIOBase classes for module ${io_module}")
  endif()
  foreach(meshio ${meshios_${io_module}})
    string(SUBSTRING "${meshio}" 3 -1 ioname)
    if(NOT DEFINED meshio_kebab_${meshio})
      message(FATAL_ERROR "Unknown kebab name for meshio ${meshio}")
    endif()
    set(ioname ${meshio_kebab_${meshio}})
    set(read_binary "${ioname}-read-mesh")
    set(write_binary "${ioname}-write-mesh")
    set(MeshIOIndex_ARRAY "${MeshIOIndex_ARRAY}'${ioname}', ")
    set(extra_srcs)
    if(${meshio} STREQUAL "itkWasmZstdMeshIO")
      list(APPEND ITK_LIBRARIES libzstd_static)
      list(APPEND extra_srcs itkWasmZstdMeshIO.cxx)
    endif()

    add_executable(${read_binary} read-mesh.cxx itkWasmPointSetIOBase.cxx itkWasmMeshIOBase.cxx ${extra_srcs})
    target_link_libraries(${read_binary} PUBLIC ${ITK_LIBRARIES})
    target_compile_definitions(${read_binary} PUBLIC -DMESH_IO_CLASS=${meshio_id_${meshio}} -DMESH_IO_KEBAB_NAME=${ioname})
    add_executable(${write_binary} write-mesh.cxx itkWasmPointSetIOBase.cxx itkWasmMeshIOBase.cxx ${extra_srcs})
    target_link_libraries(${write_binary} PUBLIC ${ITK_LIBRARIES})
    target_compile_definitions(${write_binary} PUBLIC -DMESH_IO_CLASS=${meshio_id_${meshio}} -DMESH_IO_KEBAB_NAME=${ioname})
    if (EMSCRIPTEN)
      set(target_esm_read "${read_binary}")
      set(target_esm_write "${write_binary}")
      foreach(target ${target_esm_read} ${target_esm_write})
        set(exception_catching )
        set(meshio_common_link_flags " -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s SUPPORT_LONGJMP=1")
        get_property(link_flags TARGET ${target} PROPERTY LINK_FLAGS)
        set_property(TARGET ${target} APPEND_STRING PROPERTY LINK_FLAGS " ${meshio_common_link_flags} ${link_flags}")
      endforeach()
    endif()
  endforeach()
endforeach()

enable_testing()

set(input_dir ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input)
set(baseline_dir ${CMAKE_CURRENT_SOURCE_DIR}/test/data/baseline)
set(output_dir ${CMAKE_CURRENT_BINARY_DIR})

add_test(NAME byu-read-mesh-test
  COMMAND byu-read-mesh
  ${input_dir}/cube.byu
  ${output_dir}/byu-read-mesh-test.could-read.json
  ${output_dir}/byu-read-mesh-test.iwm.cbor)

add_test(NAME byu-write-mesh-test
  COMMAND byu-write-mesh
  ${baseline_dir}/byu-read-mesh-test.iwm.cbor
  ${output_dir}/byu-write-mesh-test.could-write.json
  ${output_dir}/byu-write-mesh-test.byu)

add_test(NAME mz3-read-mesh-test
  COMMAND mz3-read-mesh
  ${input_dir}/11ScalarMesh.mz3
  ${output_dir}/mz3-read-mesh-test.could-read.json
  ${output_dir}/mz3-read-mesh-test.iwm.cbor)

add_test(NAME mz3-write-mesh-test
  COMMAND mz3-write-mesh
  ${baseline_dir}/mz3-read-mesh-test.iwm.cbor
  ${output_dir}/mz3-write-mesh-test.could-write.json
  ${output_dir}/mz3-write-mesh-test.mz3)

# This list should be ordered from approximately most commonly to least
# commonly used modules.
set(WebAssemblyInterface_PointSetIOModules
  "ITKIOMeshVTK"
  "ITKIOMeshOBJ"
  "ITKIOMeshOFF"
  "IOMeshMZ3"
  CACHE STRING
  "String delimited list of ITK point set IO modules to support.")

set(pointsetios_ITKIOMeshVTK itkVTKPolyDataMeshIO)
set(pointsetio_id_itkVTKPolyDataMeshIO 0)
set(pointsetio_kebab_itkVTKPolyDataMeshIO "vtk-poly-data")

set(pointsetios_ITKIOMeshOBJ itkOBJMeshIO)
set(pointsetio_id_itkOBJMeshIO 1)
set(pointsetio_kebab_itkOBJMeshIO "obj")

set(pointsetios_ITKIOMeshOFF itkOFFMeshIO)
set(pointsetio_id_itkOFFMeshIO 2)
set(pointsetio_kebab_itkOFFMeshIO "off")

set(pointsetios_WebAssemblyInterface itkWasmMeshIO itkWasmZstdMeshIO)
set(pointsetio_id_itkWasmMeshIO 3)
set(pointsetio_kebab_itkWasmMeshIO "wasm")
set(pointsetio_id_itkWasmZstdMeshIO 4)
set(pointsetio_kebab_itkWasmZstdMeshIO "wasm-zstd")

set(pointsetios_IOMeshMZ3 itkMZ3MeshIO)
set(pointsetio_id_itkMZ3MeshIO 5)
set(pointsetio_kebab_itkMZ3MeshIO "mz3")

set(ITK_NO_MESHIO_FACTORY_REGISTER_MANAGER 1)
set(PointSetIOIndex_ARRAY "")
foreach(io_module ${WebAssemblyInterface_PointSetIOModules} WebAssemblyInterface)
  if (DEFINED WebAssemblyInterface_INCLUDE_DIRS)
    if(${io_module} STREQUAL "WebAssemblyInterface")
      find_package(ITK REQUIRED COMPONENTS ITKIOMeshBase)
      include(${ITK_USE_FILE})
      include_directories(${WebAssemblyInterface_INCLUDE_DIRS})
      include_directories(${CMAKE_CURRENT_SOURCE_DIR})
      list(APPEND ITK_LIBRARIES ${WebAssemblyInterface_LIBRARIES})
    else()
      find_package(ITK REQUIRED COMPONENTS ${io_module} WebAssemblyInterface)
      include(${ITK_USE_FILE})
    endif()
  else()
    find_package(ITK REQUIRED COMPONENTS ${io_module} WebAssemblyInterface)
    include(${ITK_USE_FILE})
  endif()

  if(NOT DEFINED pointsetios_${io_module})
    message(FATAL_ERROR "Unknown MeshIOBase classes for module ${io_module}")
  endif()
  foreach(pointsetio ${meshios_${io_module}})
    string(SUBSTRING "${pointsetio}" 3 -1 ioname)
    if(NOT DEFINED pointsetio_kebab_${pointsetio})
      message(FATAL_ERROR "Unknown kebab name for pointsetio ${pointsetio}")
    endif()
    set(ioname ${pointsetio_kebab_${pointsetio}})
    set(read_binary "${ioname}-read-point-set")
    set(write_binary "${ioname}-write-point-set")
    set(PointSetIOIndex_ARRAY "${PointSetIOIndex_ARRAY}'${ioname}', ")
    set(extra_srcs)
    if(${pointsetio} STREQUAL "itkWasmZstdMeshIO")
      list(APPEND ITK_LIBRARIES libzstd_static)
      list(APPEND extra_srcs itkWasmZstdMeshIO.cxx)
    endif()

    add_executable(${read_binary} read-point-set.cxx itkWasmPointSetIOBase.cxx itkWasmMeshIOBase.cxx ${extra_srcs})
    target_link_libraries(${read_binary} PUBLIC ${ITK_LIBRARIES})
    target_compile_definitions(${read_binary} PUBLIC -DMESH_IO_CLASS=${pointsetio_id_${pointsetio}} -DPOINT_SET_IO_KEBAB_NAME=${ioname})
    add_executable(${write_binary} write-point-set.cxx itkWasmPointSetIOBase.cxx itkWasmMeshIOBase.cxx ${extra_srcs})
    target_link_libraries(${write_binary} PUBLIC ${ITK_LIBRARIES})
    target_compile_definitions(${write_binary} PUBLIC -DMESH_IO_CLASS=${pointsetio_id_${pointsetio}} -DPOINT_SET_IO_KEBAB_NAME=${ioname})
    if (EMSCRIPTEN)
      set(target_esm_read "${read_binary}")
      set(target_esm_write "${write_binary}")
      foreach(target ${target_esm_read} ${target_esm_write})
        set(exception_catching )
        set(pointsetio_common_link_flags " -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s SUPPORT_LONGJMP=1")
        get_property(link_flags TARGET ${target} PROPERTY LINK_FLAGS)
        set_property(TARGET ${target} APPEND_STRING PROPERTY LINK_FLAGS " ${pointsetio_common_link_flags} ${link_flags}")
      endforeach()
    endif()
  endforeach()
endforeach()

add_test(NAME obj-read-point-set-test
  COMMAND obj-read-point-set
  ${input_dir}/box-points.obj
  ${output_dir}/obj-read-point-set-test.could-read.json
  ${output_dir}/obj-read-point-set-test.iwm.cbor)

add_test(NAME obj-write-point-set-test
  COMMAND obj-write-point-set
  ${baseline_dir}/obj-read-point-set-test.iwm.cbor
  ${output_dir}/obj-write-point-set-test.could-write.json
  ${output_dir}/obj-write-point-set-test.obj)

add_test(NAME mz3-read-point-set-test
  COMMAND mz3-read-point-set
  ${input_dir}/11ScalarMesh.mz3
  ${output_dir}/mz3-read-point-set-test.could-read.json
  ${output_dir}/mz3-read-point-set-test.iwm.cbor)

add_test(NAME mz3-write-point-set-test
  COMMAND mz3-write-point-set
  ${baseline_dir}/mz3-read-point-set-test.iwm.cbor
  ${output_dir}/mz3-write-point-set-test.could-write.json
  ${output_dir}/mz3-write-point-set-test.mz3)
