cmake_minimum_required(VERSION 3.16)
project(composite-transform-test)

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

add_executable(composite-transform-test composite-transform-test.cxx)
target_link_libraries(composite-transform-test PUBLIC ${ITK_LIBRARIES})

enable_testing()
add_test(NAME composite-transform-test
  COMMAND composite-transform-test
  ${CMAKE_CURRENT_BINARY_DIR}/CompositeTransform.iwt
  )

add_test(NAME compositeTransformWasmTest
  COMMAND composite-transform-test
  ${CMAKE_CURRENT_BINARY_DIR}/CompositeTransform.iwt
  )
