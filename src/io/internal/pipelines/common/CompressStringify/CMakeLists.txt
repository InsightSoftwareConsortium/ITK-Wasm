cmake_minimum_required(VERSION 3.16)
project(CompressStringify)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)
option(ZSTD_BUILD_CONTRIB "BUILD_CONTRIB" OFF)
option(ZSTD_BUILD_PROGRAMS "BUILD_PROGRAMS" OFF)
option(ZSTD_BUILD_SHARED "BUILD_SHARED" OFF)
option(ZSTD_BUILD_STATIC "BUILD_STATIC" ON)
option(ZSTD_BUILD_TESTS "BUILD_TESTS" OFF)
option(ZSTD_BUILD_LEGACY_SUPPORT "BUILD_LEGACY_SUPPORT" OFF)
option(ZSTD_MULTITHREAD_SUPPORT "BUILD_MULTITHREAD_SUPPORT" OFF)
option(ZSTD_BUILD_PROGRAMS_LINK_SHARED "BUILD_PROGRAMS_LINK_SHARED" OFF)
option(ZSTD_BUILD_LZ4 "BUILD_LZ4" OFF)
option(ZSTD_BUILD_LZMA "BUILD_LZMA" OFF)
option(ZSTD_BUILD_ZLIB "BUILD_ZLIB" OFF)
set(zstd_GIT_REPOSITORY "https://github.com/facebook/zstd.git")
# v1.5.2
set(zstd_GIT_TAG c9c7be85f49f45a581ec00c309afda5c62ba9ef2)
FetchContent_Declare(
  zstd_lib
  GIT_REPOSITORY ${zstd_GIT_REPOSITORY}
  GIT_TAG        ${zstd_GIT_TAG}
)

set(cpp_base64_GIT_REPOSITORY "https://github.com/thewtex/cpp-base64.git")
set(cpp_base64_GET_TAG 9144cd53be930b37235ae552a92b5d2aa51e9325)
FetchContent_Declare(
  cpp_base64
  GIT_REPOSITORY ${cpp_base64_GIT_REPOSITORY}
  GIT_TAG        ${cpp_base64_GIT_TAG}
)

FetchContent_MakeAvailable(zstd_lib cpp_base64)
set(zstd_lib_INCLUDE_DIR "${zstd_lib_SOURCE_DIR}/lib")
include_directories(${zstd_lib_INCLUDE_DIR})
# message(FATAL_ERROR "${zstd_lib_INCLUDE_DIR}")
add_subdirectory("${zstd_lib_SOURCE_DIR}/build/cmake" "${zstd_lib_BINARY_DIR}")

find_package(ITK REQUIRED COMPONENTS WebAssemblyInterface)
include(${ITK_USE_FILE})

add_executable(CompressStringify CompressStringify.cxx)
target_include_directories(CompressStringify PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} ${zstd_lib_INCLUDE_DIR})
target_link_libraries(CompressStringify PUBLIC libzstd_static cpp-base64 ${ITK_LIBRARIES})

add_executable(ParseStringDecompress ParseStringDecompress.cxx)
target_include_directories(ParseStringDecompress PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} ${zstd_lib_INCLUDE_DIR})
target_link_libraries(ParseStringDecompress PUBLIC libzstd_static cpp-base64 ${ITK_LIBRARIES})

if (DEFINED WebAssemblyInterface_SOURCE_DIR)
  foreach(target CompressStringify CompressStringify.umd ParseStringDecompress ParseStringDecompress.umd)
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/image-io
      )
  endforeach()
endif()