cmake_minimum_required(VERSION 3.10)
project(MedianFilterTest)

set(CMAKE_CXX_STANDARD 17)

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

add_executable(MedianFilterTest MedianFilterTest.cxx)
target_link_libraries(MedianFilterTest PUBLIC ${ITK_LIBRARIES})

enable_testing()
add_test(NAME MedianFilterTest
  COMMAND MedianFilterTest ${CMAKE_CURRENT_SOURCE_DIR}/cthead1.iwi.zip
  ${CMAKE_CURRENT_BINARY_DIR}/cthead1.shrink.iwi
  --radius 4
  )
