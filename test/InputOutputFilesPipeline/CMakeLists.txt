cmake_minimum_required(VERSION 3.10)
project(InputOutputFilesTest)

add_executable(InputOutputFilesTest InputOutputFilesTest.cxx)

enable_testing()
add_test(NAME InputOutputFilesTest
  COMMAND InputOutputFilesTest
    ${CMAKE_CURRENT_SOURCE_DIR}/input.txt
    ${CMAKE_CURRENT_SOURCE_DIR}/input.bin
    ${CMAKE_CURRENT_BINARY_DIR}/output.txt
    ${CMAKE_CURRENT_BINARY_DIR}/output.bin
  )
