cmake_minimum_required(VERSION 3.16)
project(HelloWorld)

find_package(ITK REQUIRED COMPONENTS WebAssemblyInterface)
include(${ITK_USE_FILE})

add_executable(hello hello.cxx)
target_link_libraries(hello PUBLIC ${ITK_LIBRARIES})
