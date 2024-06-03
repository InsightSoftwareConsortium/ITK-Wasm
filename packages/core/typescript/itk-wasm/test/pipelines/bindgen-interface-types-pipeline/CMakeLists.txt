cmake_minimum_required(VERSION 3.10)
project(bindgen-interface-types-test)

set(CMAKE_CXX_STANDARD 20)

set(io_components)
if(NOT EMSCRIPTEN)
  set(io_components ITKIOMeshVTK ITKIOPNG)
endif()
find_package(ITK REQUIRED
  COMPONENTS
    ${io_components}
    WebAssemblyInterface
  )
include(${ITK_USE_FILE})

add_executable(bindgen-interface-types-test bindgen-interface-types-test.cxx)
target_link_libraries(bindgen-interface-types-test PUBLIC ${ITK_LIBRARIES})

enable_testing()
add_test(NAME bindgen-interface-types-test
  COMMAND bindgen-interface-types-test
    ${CMAKE_CURRENT_SOURCE_DIR}/input.txt
    ${CMAKE_CURRENT_SOURCE_DIR}/input.bin
    ${CMAKE_CURRENT_SOURCE_DIR}/input.txt
    ${CMAKE_CURRENT_SOURCE_DIR}/input.bin
    ${CMAKE_CURRENT_SOURCE_DIR}/input-object.json
    ${CMAKE_CURRENT_SOURCE_DIR}/cthead1.png
    ${CMAKE_CURRENT_SOURCE_DIR}/cow.vtk
    ${CMAKE_CURRENT_BINARY_DIR}/output.txt
    ${CMAKE_CURRENT_BINARY_DIR}/output.bin
    ${CMAKE_CURRENT_BINARY_DIR}/output-stream.txt
    ${CMAKE_CURRENT_BINARY_DIR}/output-stream.bin
    ${CMAKE_CURRENT_BINARY_DIR}/output-object.json
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1.output.png
    ${CMAKE_CURRENT_BINARY_DIR}/cow.output.vtk
  )