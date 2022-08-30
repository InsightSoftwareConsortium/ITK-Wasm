cmake_minimum_required(VERSION 3.16)
project(mesh-to-polydata)

set(CMAKE_CXX_STANDARD 17)

find_package(ITK REQUIRED
  COMPONENTS
    WebAssemblyInterface
    MeshToPolyData
    )
include(${ITK_USE_FILE})

add_executable(mesh-to-polydata mesh-to-polydata.cxx)
target_link_libraries(mesh-to-polydata PUBLIC ${ITK_LIBRARIES})

add_executable(polydata-to-mesh polydata-to-mesh.cxx)
target_link_libraries(polydata-to-mesh PUBLIC ${ITK_LIBRARIES})

if (EMSCRIPTEN AND DEFINED WebAssemblyInterface_BINARY_DIR)
  foreach(target mesh-to-polydata mesh-to-polydata.umd polydata-to-mesh polydata-to-mesh.umd)
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/mesh-io
      )
  endforeach()
endif()
if (WASI AND DEFINED WebAssemblyInterface_BINARY_DIR)
  foreach(target mesh-to-polydata polydata-to-mesh)
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/wasi-mesh-io
      )
  endforeach()
endif()
