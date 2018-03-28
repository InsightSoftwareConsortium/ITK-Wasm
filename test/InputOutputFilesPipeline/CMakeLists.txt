cmake_minimum_required(VERSION 3.10)
project(InputOutputFiles)

if(EMSCRIPTEN)
  include(ITKBridgeJavaScript)
  web_add_executable(InputOutputFiles InputOutputFiles.cxx)
else()
  add_executable(InputOutputFiles InputOutputFiles.cxx)
endif()

enable_testing()
add_test(NAME InputOutputFilesTest
  COMMAND InputOutputFiles
    ${CMAKE_CURRENT_SOURCE_DIR}/input.txt
    ${CMAKE_CURRENT_SOURCE_DIR}/input.bin
    ${CMAKE_CURRENT_BINARY_DIR}/output.txt
    ${CMAKE_CURRENT_BINARY_DIR}/output.bin
  )
