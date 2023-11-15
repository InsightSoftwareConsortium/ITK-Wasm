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
target_include_directories(downsample PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

add_executable(downsample-sigma downsample-sigma.cxx)
target_link_libraries(downsample-sigma PUBLIC ${ITK_LIBRARIES})
target_include_directories(downsample-sigma PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

enable_testing()
add_test(NAME downsample
  COMMAND downsample
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_downsampled.png
    --shrink-factors 2 2
    )

add_test(NAME downsample-sigma
  COMMAND downsample-sigma
    --shrink-factors 2 4
    ${CMAKE_CURRENT_BINARY_DIR}/downsample-sigma.json
    )