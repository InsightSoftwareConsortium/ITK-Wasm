cmake_minimum_required(VERSION 3.10)
project(ReadImage)

set(CMAKE_CXX_STANDARD 17)

find_package(ITK REQUIRED
  COMPONENTS WebAssemblyInterface
    ITKIOPNG
  )
include(${ITK_USE_FILE})

add_executable(ReadImage ReadImage.cxx)
target_link_libraries(ReadImage PUBLIC ${ITK_LIBRARIES})

enable_testing()
add_test(NAME ReadImageTest
  COMMAND ReadImage ${CMAKE_CURRENT_SOURCE_DIR}/cthead1.png
  ${CMAKE_CURRENT_BINARY_DIR}/cthead1.iwi.zip
  )
