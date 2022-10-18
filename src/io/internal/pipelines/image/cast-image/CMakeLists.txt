cmake_minimum_required(VERSION 3.16)
project(cast-image)

set(CMAKE_CXX_STANDARD 17)

find_package(ITK REQUIRED
 COMPONENTS
   WebAssemblyInterface
   ITKImageFilterBase
   )

include(${ITK_USE_FILE})

add_executable(cast-image cast-image.cxx)
target_link_libraries(cast-image PUBLIC ${ITK_LIBRARIES})

if (DEFINED WebAssemblyInterface_SOURCE_DIR AND EMSCRIPTEN)
  foreach(target cast-image cast-image.umd)
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/image-io
      )
  endforeach()
endif()
if (DEFINED WebAssemblyInterface_SOURCE_DIR AND WASI)
  foreach(target cast-image)
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/wasi-image-io
      )
  endforeach()
endif()
