cmake_minimum_required(VERSION 3.10)
project(StdoutStderrTest)

add_executable(StdoutStderrTest StdoutStderrTest.cxx)

enable_testing()
add_test(NAME StdoutStderrTest
  COMMAND StdoutStderrTest
  )
