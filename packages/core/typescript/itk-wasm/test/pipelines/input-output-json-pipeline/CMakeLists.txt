cmake_minimum_required(VERSION 3.16)
project(input-output-json-test)

set(CMAKE_CXX_STANDARD 20)

find_package(ITK REQUIRED
  COMPONENTS WebAssemblyInterface)
include(${ITK_USE_FILE})
add_executable(input-output-json-test input-output-json-test.cxx)
target_link_libraries(input-output-json-test PUBLIC WebAssemblyInterface)

enable_testing()
add_test(NAME InputOutputJsonObjectTest
  COMMAND input-output-json-test
    ${CMAKE_CURRENT_SOURCE_DIR}/input-object.json
    ${CMAKE_CURRENT_BINARY_DIR}/output-object.json
  )

add_test(NAME InputOutputJsonArrayTest
  COMMAND input-output-json-test
    ${CMAKE_CURRENT_SOURCE_DIR}/input-array.json
    ${CMAKE_CURRENT_BINARY_DIR}/output-array.json
  )