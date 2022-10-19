cmake_minimum_required(VERSION 3.16)
project(cast-image)

set(CMAKE_CXX_STANDARD 17)

find_package(ITK REQUIRED
 COMPONENTS
   WebAssemblyInterface
   ITKImageFilterBase
   )

include(${ITK_USE_FILE})

add_executable(cast-image-scalar cast-image.cxx)
target_link_libraries(cast-image-scalar PUBLIC ${ITK_LIBRARIES})

add_executable(cast-image-vector2 cast-image.cxx)
target_link_libraries(cast-image-vector2 PUBLIC ${ITK_LIBRARIES})
target_compile_definitions(cast-image-vector2 PUBLIC MULTICOMPONENT_PIXEL_TYPES VECTOR2_PIXEL_TYPES)

add_executable(cast-image-vector3 cast-image.cxx)
target_link_libraries(cast-image-vector3 PUBLIC ${ITK_LIBRARIES})
target_compile_definitions(cast-image-vector3 PUBLIC MULTICOMPONENT_PIXEL_TYPES VECTOR3_PIXEL_TYPES)

if (DEFINED WebAssemblyInterface_SOURCE_DIR AND EMSCRIPTEN)
  foreach(target cast-image-scalar cast-image-scalar.umd)
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
  foreach(target cast-image-scalar cast-image-vector2 cast-image-vector3)
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/wasi-image-io
      )
  endforeach()
endif()
