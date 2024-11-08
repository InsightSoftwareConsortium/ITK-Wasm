cmake_minimum_required(VERSION 3.16)
project(transform-read-write-test)

set(CMAKE_CXX_STANDARD 20)

set(io_components)
if(NOT EMSCRIPTEN)
  set(io_components ITKIOTransformHDF5)
endif()
find_package(ITK REQUIRED
  COMPONENTS
    ${io_components}
    WebAssemblyInterface
  )
include(${ITK_USE_FILE})

add_executable(transform-read-write-test transform-read-write-test.cxx)
target_link_libraries(transform-read-write-test PUBLIC ${ITK_LIBRARIES})

enable_testing()
add_test(NAME transform-read-write-test
  COMMAND transform-read-write-test ${CMAKE_CURRENT_SOURCE_DIR}/LinearTransform.h5
  ${CMAKE_CURRENT_BINARY_DIR}/LinearTransform.written.h5
  )

add_test(NAME transformReadWriteWasmTest
  COMMAND transform-read-write-test ${CMAKE_CURRENT_SOURCE_DIR}/LinearTransform.h5
  ${CMAKE_CURRENT_BINARY_DIR}/LinearTransform.iwt
  )

add_test(NAME transformReadWriteWasmCBORTest
  COMMAND transform-read-write-test ${CMAKE_CURRENT_SOURCE_DIR}/LinearTransform.h5
  ${CMAKE_CURRENT_BINARY_DIR}/LinearTransform.iwt.cbor
  )

add_test(NAME transformReadWriteWasmInputTest
  COMMAND transform-read-write-test ${CMAKE_CURRENT_BINARY_DIR}/LinearTransform.iwt
  ${CMAKE_CURRENT_BINARY_DIR}/LinearTransform.out.iwt
  )
