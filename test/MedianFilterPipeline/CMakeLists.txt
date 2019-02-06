cmake_minimum_required(VERSION 3.10)
project(MedianFilter)

set(io_components ITKImageIO)
if(EMSCRIPTEN)
  set(io_components BridgeJavaScript)
endif()
find_package(ITK REQUIRED
  COMPONENTS ${io_components}
    ITKSmoothing
  )
include(${ITK_USE_FILE})

if(EMSCRIPTEN)
  include(ITKBridgeJavaScript)
  web_add_executable(MedianFilter MedianFilter.cxx)
  web_target_link_libraries(MedianFilter ${ITK_LIBRARIES})
else()
  add_executable(MedianFilter MedianFilter.cxx)
  target_link_libraries(MedianFilter ${ITK_LIBRARIES})
endif()

enable_testing()
add_test(NAME MedianFilterTest
  COMMAND MedianFilter ${CMAKE_CURRENT_SOURCE_DIR}/cthead1.png
  ${CMAKE_CURRENT_BINARY_DIR}/cthead1.shrink.png
  4
  )
