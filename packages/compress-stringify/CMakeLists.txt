cmake_minimum_required(VERSION 3.16)
project(compress-stringify)

set(CMAKE_CXX_STANDARD 20)

include(${CMAKE_CURRENT_SOURCE_DIR}/BuildZstd.cmake)

find_package(ITK REQUIRED COMPONENTS WebAssemblyInterface)
include(${ITK_USE_FILE})

add_executable(compress-stringify compress-stringify.cxx)
target_include_directories(compress-stringify PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} ${zstd_lib_INCLUDE_DIR})
target_link_libraries(compress-stringify PUBLIC libzstd_static cpp-base64 ${ITK_LIBRARIES})

add_executable(parse-string-decompress parse-string-decompress.cxx)
target_include_directories(parse-string-decompress PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} ${zstd_lib_INCLUDE_DIR})
target_link_libraries(parse-string-decompress PUBLIC libzstd_static cpp-base64 ${ITK_LIBRARIES})
