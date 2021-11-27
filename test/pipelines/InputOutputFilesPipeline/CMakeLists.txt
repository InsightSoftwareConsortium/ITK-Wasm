cmake_minimum_required(VERSION 3.10)
project(InputOutputFilesTest)

find_package(ITK REQUIRED
  COMPONENTS WebAssemblyInterface)
add_executable(InputOutputFilesTest InputOutputFilesTest.cxx)
target_link_libraries(InputOutputFilesTest PUBLIC WebAssemblyInterface)

enable_testing()
add_test(NAME InputOutputFilesTest
  COMMAND InputOutputFilesTest
    ${CMAKE_CURRENT_SOURCE_DIR}/input.txt
    ${CMAKE_CURRENT_SOURCE_DIR}/input.bin
    ${CMAKE_CURRENT_BINARY_DIR}/output.txt
    ${CMAKE_CURRENT_BINARY_DIR}/output.bin
  )
