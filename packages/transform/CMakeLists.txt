cmake_minimum_required(VERSION 3.16)
project(itkwasm-downsample LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)

if(EMSCRIPTEN)
  set(io_components
    )
elseif(WASI)
  set(io_components
    )
else()
  set(io_components
    ITKTransformIO
    )
endif()

find_package(ITK REQUIRED
 COMPONENTS
   WebAssemblyInterface
   ${io_components}
 )
include(${ITK_USE_FILE})

foreach(pipeline create-transform)
  add_executable(${pipeline} ${pipeline}.cxx)
  target_link_libraries(${pipeline} PUBLIC ${ITK_LIBRARIES})
  target_include_directories(${pipeline} PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
endforeach()

enable_testing()
add_test(NAME create-translation
  COMMAND create-transform
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/create-translation.json
    ${CMAKE_CURRENT_BINARY_DIR}/create-translation.iwt
    )

add_test(NAME create-affine
  COMMAND create-transform
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/create-affine.json
    ${CMAKE_CURRENT_BINARY_DIR}/create-affine.iwt
    )