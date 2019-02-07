cmake_minimum_required(VERSION 3.10)
project(StdoutStderrTest)

if(EMSCRIPTEN)
  include(ITKBridgeJavaScript)
  web_add_executable(StdoutStderrTest StdoutStderrTest.cxx)
else()
  add_executable(StdoutStderrTest StdoutStderrTest.cxx)
endif()

enable_testing()
add_test(NAME StdoutStderrTest
  COMMAND StdoutStderrTest
  )
