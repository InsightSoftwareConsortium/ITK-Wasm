cmake_minimum_required(VERSION 3.10)
project(read-image)

set(CMAKE_CXX_STANDARD 20)

find_package(ITK REQUIRED
  COMPONENTS WebAssemblyInterface
    ITKIOPNG
  )
include(${ITK_USE_FILE})

add_executable(read-image read-image.cxx)
target_link_libraries(read-image PUBLIC ${ITK_LIBRARIES})

enable_testing()
add_test(NAME read-imageTest
  COMMAND read-image ${CMAKE_CURRENT_SOURCE_DIR}/cthead1.png
  ${CMAKE_CURRENT_BINARY_DIR}/cthead1.iwi.cbor
  )
