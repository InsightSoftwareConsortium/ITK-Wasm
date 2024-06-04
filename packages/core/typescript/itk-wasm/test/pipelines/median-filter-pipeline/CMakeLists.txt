cmake_minimum_required(VERSION 3.10)
project(median-filter-test)

set(CMAKE_CXX_STANDARD 20)

set(io_components
  ITKImageIO
  WebAssemblyInterface
  )
if(EMSCRIPTEN OR WASI)
  set(io_components WebAssemblyInterface)
endif()
find_package(ITK REQUIRED
  COMPONENTS ${io_components}
    ITKSmoothing
    ITKImageIntensity
  )
include(${ITK_USE_FILE})

add_executable(median-filter-test median-filter-test.cxx)
target_link_libraries(median-filter-test PUBLIC ${ITK_LIBRARIES})

enable_testing()
add_test(NAME median-filter-test
  COMMAND median-filter-test ${CMAKE_CURRENT_SOURCE_DIR}/cthead1.iwi.cbor
  ${CMAKE_CURRENT_BINARY_DIR}/cthead1.shrink.iwi
  --radius 4
  )
