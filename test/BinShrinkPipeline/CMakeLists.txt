cmake_minimum_required(VERSION 3.10)
project(BinShrink)

set(io_components ITKImageIO)
if(EMSCRIPTEN)
  set(io_components ITKIOPNG)
endif()
find_package(ITK REQUIRED
  COMPONENTS ${io_components}
    ITKIOImageBase
    ITKImageGrid
  )
include(${ITK_USE_FILE})

if(EMSCRIPTEN)
  include(ITKBridgeJavaScript)
  web_add_executable(BinShrink BinShrink.cxx)
  web_target_link_libraries(BinShrink ${ITK_LIBRARIES})
else()
  add_executable(BinShrink BinShrink.cxx)
  target_link_libraries(BinShrink ${ITK_LIBRARIES})
endif()

enable_testing()
add_test(NAME BinShrinkTest
  COMMAND BinShrink ${CMAKE_CURRENT_BINARY_DIR}/../../../build/ExternalData/test/Input/cthead1.png
  ./cthead1.shrink.png
  4
  )

