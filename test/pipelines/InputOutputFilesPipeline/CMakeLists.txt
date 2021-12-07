cmake_minimum_required(VERSION 3.16)
project(InputOutputFilesTest)

find_package(ITK REQUIRED
  COMPONENTS WebAssemblyInterface)
include(${ITK_USE_FILE})
add_executable(InputOutputFilesTest InputOutputFilesTest.cxx)
target_link_libraries(InputOutputFilesTest PUBLIC WebAssemblyInterface)

enable_testing()
add_test(NAME InputOutputStreamsTest
  COMMAND InputOutputFilesTest
    --input-text-stream ${CMAKE_CURRENT_SOURCE_DIR}/input.txt
    --input-binary-stream ${CMAKE_CURRENT_SOURCE_DIR}/input.bin
    --output-text-stream ${CMAKE_CURRENT_BINARY_DIR}/output.txt
    --output-binary-stream ${CMAKE_CURRENT_BINARY_DIR}/output.bin
  )

add_test(NAME InputOutputFilesTest
  COMMAND InputOutputFilesTest
    --use-files
    --input-text-file ${CMAKE_CURRENT_SOURCE_DIR}/input.txt
    --input-binary-file ${CMAKE_CURRENT_SOURCE_DIR}/input.bin
    --output-text-file ${CMAKE_CURRENT_BINARY_DIR}/output.txt
    --output-binary-file ${CMAKE_CURRENT_BINARY_DIR}/output.bin
  )