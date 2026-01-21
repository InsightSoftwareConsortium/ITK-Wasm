cmake_minimum_required(VERSION 3.16)
project(HelloWorld)

find_package(ITK REQUIRED COMPONENTS WebAssemblyInterface)
include(${ITK_USE_FILE})

# Begin create-itk-wasm added pipelines.
add_subdirectory(hello)
# End create-itk-wasm added pipelines.
