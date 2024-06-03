cmake_minimum_required(VERSION 3.16)
project(input-output-files-test)

set(CMAKE_CXX_STANDARD 20)

find_package(ITK REQUIRED
  COMPONENTS WebAssemblyInterface)
include(${ITK_USE_FILE})
add_executable(input-output-files-test input-output-files-test.cxx)
target_link_libraries(input-output-files-test PUBLIC WebAssemblyInterface)

enable_testing()
add_test(NAME InputOutputStreamsTest
  COMMAND input-output-files-test
    --input-text-stream ${CMAKE_CURRENT_SOURCE_DIR}/input.txt
    --input-binary-stream ${CMAKE_CURRENT_SOURCE_DIR}/input.bin
    --output-text-stream ${CMAKE_CURRENT_BINARY_DIR}/output.txt
    --output-binary-stream ${CMAKE_CURRENT_BINARY_DIR}/output.bin
  )

add_test(NAME input-output-files-test
  COMMAND input-output-files-test
    --use-files
    --input-text-file ${CMAKE_CURRENT_SOURCE_DIR}/input.txt
    --input-binary-file ${CMAKE_CURRENT_SOURCE_DIR}/input.bin
    --output-text-file ${CMAKE_CURRENT_BINARY_DIR}/output.txt
    --output-binary-file ${CMAKE_CURRENT_BINARY_DIR}/output.bin
  )