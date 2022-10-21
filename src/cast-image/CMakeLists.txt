cmake_minimum_required(VERSION 3.16)
project(cast-image)

set(CMAKE_CXX_STANDARD 17)

find_package(ITK REQUIRED
 COMPONENTS
   WebAssemblyInterface
   ITKImageFilterBase
   )

include(${ITK_USE_FILE})

set(targets )
foreach(pixel_types
  uint8
  int8
  uint16
  int16
  uint32
  int32
  uint64
  int64
  float
  double
  )
  set(target cast-image-scalarvectorimage${pixel_types}-input)
  add_executable(${target} cast-image.cxx)
  target_link_libraries(${target} PUBLIC ${ITK_LIBRARIES})
  string(TOUPPER "${pixel_types}" pixel_types_upper)
  target_compile_definitions(${target} PUBLIC ${pixel_types_upper}_PIXEL_TYPES)
  if (EMSCRIPTEN)
    target_compile_definitions(${target}.umd PUBLIC ${pixel_types_upper}_PIXEL_TYPES)
  endif()
  list(APPEND targets ${target})
endforeach()

foreach(component_types
  uint8
  int8
  uint16
  int16
  float
  double
  )
  foreach(num_components 2 3)
    set(target cast-image-vector${component_types}${num_components}-input)
    add_executable(${target} cast-image.cxx)
    target_link_libraries(${target} PUBLIC ${ITK_LIBRARIES})
    string(TOUPPER "${component_types}" component_types_upper)
    target_compile_definitions(${target} PUBLIC VECTOR_${component_types_upper}_${num_components}_PIXEL_TYPES)
    if (EMSCRIPTEN)
      target_compile_definitions(${target}.umd PUBLIC VECTOR_${component_types_upper}_${num_components}_PIXEL_TYPES)
    endif()
    list(APPEND targets ${target})
  endforeach()
endforeach()

if (EMSCRIPTEN)
  foreach(target ${targets})
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${PROJECT_BINARY_DIR}/../public/pipelines
      )
    set_property(TARGET ${target}.umd
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${PROJECT_BINARY_DIR}/../public/pipelines
      )
  endforeach()
endif()
if (WASI)
  # Todo: Output in Python, C# packages
  # foreach(target ${targets})
  #   set_property(TARGET ${target}
  #     PROPERTY RUNTIME_OUTPUT_DIRECTORY
  #     ${WebAssemblyInterface_BINARY_DIR}/wasi-cast-image
  #     )
  # endforeach()
endif()
