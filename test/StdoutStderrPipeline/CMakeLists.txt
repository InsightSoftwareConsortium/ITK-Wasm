cmake_minimum_required(VERSION 3.10)
project(StdoutStderr)

if(EMSCRIPTEN)
  include(ITKBridgeJavaScript)
  web_add_executable(StdoutStderr StdoutStderr.cxx)
else()
  add_executable(StdoutStderr StdoutStderr.cxx)
endif()

enable_testing()
add_test(NAME StdoutStderrTest
  COMMAND StdoutStderr
  )
