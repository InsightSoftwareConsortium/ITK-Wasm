cmake_minimum_required(VERSION 3.10)
project(MedianFilterTest)

set(io_components ITKImageIO)
if(EMSCRIPTEN)
  include(ITKBridgeJavaScript)
  set(io_components BridgeJavaScript)
endif()
find_package(ITK REQUIRED
  COMPONENTS ${io_components}
    ITKSmoothing
  )
include(${ITK_USE_FILE})

add_executable(MedianFilterTest MedianFilterTest.cxx)
target_link_libraries(MedianFilterTest ${ITK_LIBRARIES})

enable_testing()
add_test(NAME MedianFilterTest
  COMMAND MedianFilterTest ${CMAKE_CURRENT_SOURCE_DIR}/cthead1.png
  ${CMAKE_CURRENT_BINARY_DIR}/cthead1.shrink.png
  4
  )
