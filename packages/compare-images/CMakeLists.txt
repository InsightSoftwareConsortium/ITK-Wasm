cmake_minimum_required(VERSION 3.16)
project(itkwasm-compare-images LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)

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
   ITKImageIntensity
   ITKTestKernel
   ${io_components}
 )
include(${ITK_USE_FILE})

add_executable(compare-double-images compare-double-images.cxx)
target_link_libraries(compare-double-images PUBLIC ${ITK_LIBRARIES})

add_executable(vector-magnitude vector-magnitude.cxx)
target_link_libraries(vector-magnitude PUBLIC ${ITK_LIBRARIES})

enable_testing()
add_test(NAME compare-double-images
  COMMAND compare-double-images
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cake_easy.iwi.cbor
    ${CMAKE_CURRENT_BINARY_DIR}/metrics.json
    ${CMAKE_CURRENT_BINARY_DIR}/cake_diff_double.iwi.cbor
    ${CMAKE_CURRENT_BINARY_DIR}/cake_diff.png
    --baseline-images ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cake_hard.iwi.cbor
    )

add_test(NAME vector-magnitude
  COMMAND vector-magnitude
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/apple.iwi.cbor
    ${CMAKE_CURRENT_BINARY_DIR}/apply_magnitude.iwi.cbor
    )