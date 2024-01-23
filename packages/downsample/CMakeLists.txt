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
   GenericLabelInterpolator
   ${io_components}
 )
include(${ITK_USE_FILE})

foreach(pipeline downsample downsample-sigma gaussian-kernel-radius downsample-bin-shrink downsample-label-image)
  add_executable(${pipeline} ${pipeline}.cxx)
  target_link_libraries(${pipeline} PUBLIC ${ITK_LIBRARIES})
  target_include_directories(${pipeline} PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
endforeach()

enable_testing()
add_test(NAME downsample
  COMMAND downsample
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_downsampled.png
    --shrink-factors 2 2
    )

add_test(NAME downsample-sigma
  COMMAND downsample-sigma
    ${CMAKE_CURRENT_BINARY_DIR}/downsample-sigma.json
    --shrink-factors 2 4
    )

add_test(NAME gaussian-kernel-radius
  COMMAND gaussian-kernel-radius
    ${CMAKE_CURRENT_BINARY_DIR}/gaussian-kernel-radius.json
    --size 64 64 32
    --sigma 2.0 4.0 2.0
    )

add_test(NAME downsample-bin-shrink
  COMMAND downsample-bin-shrink
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_downsampled_bin_shrink.png
    --shrink-factors 2 2
    )

add_test(NAME downsample-label-image
  COMMAND downsample-label-image
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/2th_cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_downsampled_label_image.png
    --shrink-factors 2 2
    )
