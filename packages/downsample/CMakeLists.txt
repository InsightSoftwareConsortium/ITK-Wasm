cmake_minimum_required(VERSION 3.16)
project(itkwasm-downsample LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)

if(EMSCRIPTEN)
  set(io_components
    )
elseif(WASI)
  set(io_components
    ITKIOPNG
    )
else()
  set(io_components
    ITKImageIO
    )
endif()

find_package(ITK REQUIRED
 COMPONENTS
   WebAssemblyInterface
   ITKSmoothing
   ITKImageGrid
   ${io_components}
 )
include(${ITK_USE_FILE})

add_executable(downsample downsample.cxx)
target_link_libraries(downsample PUBLIC ${ITK_LIBRARIES})

enable_testing()
add_test(NAME downsample
  COMMAND downsample
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_downsampled.png
    --shrink-factors 2 2
    --sigma-values 2.0 2.0
    )