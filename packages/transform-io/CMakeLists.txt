cmake_minimum_required(VERSION 3.16)
project(itkwasm-transform-io)

set(CMAKE_CXX_STANDARD 20)

if (NOT TARGET libzstd_static)
  include(${CMAKE_CURRENT_SOURCE_DIR}/BuildZstd.cmake)
endif()

include_directories(${CMAKE_CURRENT_SOURCE_DIR})

if(WASI)
  set(WebAssemblyInterface_TransformIOModules
    "ITKIOTransformHDF5"
    "ITKIOTransformInsightLegacy"
    "ITKIOTransformMatlab"
    "ITKIOTransformMINC"
    CACHE STRING
    "String delimited list of ITK transform IO modules to support.")
else()
  # This list should be ordered from approximately most commonly to least
  # commonly used modules.
  set(WebAssemblyInterface_TransformIOModules
    "ITKIOTransformHDF5"
    "ITKIOTransformInsightLegacy"
    "ITKIOTransformMatlab"
    "ITKIOTransformMINC"
    CACHE STRING
    "String delimited list of ITK transform IO modules to support.")
endif()
set(transformios_ITKIOTransformHDF5 itkHDF5TransformIO)
set(transformio_id_itkHDF5TransformIO 0)
set(transformio_kebab_itkHDF5TransformIO "hdf5")

set(transformios_ITKIOTransformInsightLegacy itkTxtTransformIO)
set(transformio_id_itkTxtTransformIO 1)
set(transformio_kebab_itkTxtTransformIO "txt")

set(transformios_ITKIOTransformMatlab itkMatlabTransformIO)
set(transformio_id_itkMatlabTransformIO 2)
set(transformio_kebab_itkMatlabTransformIO "mat")

set(transformios_ITKIOTransformMINC itkMINCTransformIO)
set(transformio_id_itkMINCTransformIO 3)
set(transformio_kebab_itkMINCTransformIO "mnc")

set(transformios_WebAssemblyInterface itkWasmTransformIO itkWasmZstdTransformIO)
set(transformio_id_itkWasmTransformIO 4)
set(transformio_kebab_itkWasmTransformIO "wasm")
set(transformio_id_itkWasmZstdTransformIO 5)
set(transformio_kebab_itkWasmZstdTransformIO "wasm-zstd")

set(ITK_NO_TRANSFORMIO_FACTORY_REGISTER_MANAGER 1)
set(TransformIOIndex_ARRAY "")
foreach(io_module ${WebAssemblyInterface_TransformIOModules} WebAssemblyInterface)
  if (DEFINED WebAssemblyInterface_INCLUDE_DIRS)
    if(${io_module} STREQUAL "WebAssemblyInterface")
      find_package(ITK REQUIRED COMPONENTS ITKIOTransformBase)
      include(${ITK_USE_FILE})
      include_directories(${WebAssemblyInterface_INCLUDE_DIRS})
      include_directories(${CMAKE_CURRENT_SOURCE_DIR})
      list(APPEND ITK_LIBRARIES ${WebAssemblyInterface_LIBRARIES})
    else()
      find_package(ITK REQUIRED COMPONENTS ${io_module} WebAssemblyInterface)
      include(${ITK_USE_FILE})
    endif()
  else()
    find_package(ITK REQUIRED COMPONENTS ${io_module} WebAssemblyInterface)
    include(${ITK_USE_FILE})
  endif()

  if(NOT DEFINED transformios_${io_module})
    message(FATAL_ERROR "Unknown TransformIOBase classes for module ${io_module}")
  endif()
  foreach(transformio ${transformios_${io_module}})
    string(SUBSTRING "${transformio}" 3 -1 ioname)
    if(NOT DEFINED transformio_kebab_${transformio})
      message(FATAL_ERROR "Unknown kebab name for transformio ${transformio}")
    endif()
    set(ioname ${transformio_kebab_${transformio}})
    set(read_binary "${ioname}-read-transform")
    set(write_binary "${ioname}-write-transform")
    set(TransformIOIndex_ARRAY "${TransformIOIndex_ARRAY}'${ioname}', ")
    set(extra_srcs)
    if(${transformio} STREQUAL "itkWasmZstdTransformIO")
      list(APPEND ITK_LIBRARIES libzstd_static)
      list(APPEND extra_srcs itkWasmZstdTransformIO.cxx)
    endif()

    add_executable(${read_binary} read-transform.cxx ${extra_srcs})
    target_link_libraries(${read_binary} PUBLIC ${ITK_LIBRARIES})
    target_compile_definitions(${read_binary} PUBLIC -DTRANSFORM_IO_CLASS=${transformio_id_${transformio}} -DTRANSFORM_IO_KEBAB_NAME=${ioname})
    if (NOT ${transformio} IN_LIST transformios_no_write)
      add_executable(${write_binary} write-transform.cxx ${extra_srcs})
      target_link_libraries(${write_binary} PUBLIC ${ITK_LIBRARIES})
      target_compile_definitions(${write_binary} PUBLIC -DTRANSFORM_IO_CLASS=${transformio_id_${transformio}} -DTRANSFORM_IO_KEBAB_NAME=${ioname})
    endif()
    if (EMSCRIPTEN)
      set(target_esm_read "${read_binary}")
      if (NOT ${transformio} IN_LIST transformios_no_write)
        set(target_esm_write "${write_binary}")
      endif()
    endif()
  endforeach()
endforeach()

enable_testing()

set(input_dir ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input)
set(baseline_dir ${CMAKE_CURRENT_SOURCE_DIR}/test/data/baseline)
set(output_dir ${CMAKE_CURRENT_BINARY_DIR})

add_test(NAME hdf5-read-transform-test
  COMMAND hdf5-read-transform
  ${input_dir}/LinearTransform.h5
  ${output_dir}/hdf5-read-transform-test.could-read.json
  ${output_dir}/hdf5-read-transform-test.iwt.cbor)

add_test(NAME hdf5-write-transform-test
  COMMAND hdf5-write-transform
  ${input_dir}/LinearTransform.iwt.cbor
  ${output_dir}/hdf5-write-transform-test.could-write.json
  ${output_dir}/hdf5-write-transform-test.h5)

add_test(NAME mat-read-transform-test
  COMMAND mat-read-transform
  ${input_dir}/LinearTransform.mat
  ${output_dir}/mat-read-transform-test.could-read.json
  ${output_dir}/mat-read-transform-test.iwt.cbor)

add_test(NAME mat-write-transform-test
  COMMAND mat-write-transform
  ${input_dir}/LinearTransform.iwt.cbor
  ${output_dir}/mat-write-transform-test.could-write.json
  ${output_dir}/mat-write-transform-test.mat)

add_test(NAME txt-read-transform-test
  COMMAND txt-read-transform
  ${input_dir}/LinearTransform.txt
  ${output_dir}/txt-read-transform-test.could-read.json
  ${output_dir}/txt-read-transform-test.iwt.cbor)

add_test(NAME txt-write-transform-test
  COMMAND txt-write-transform
  ${input_dir}/LinearTransform.iwt.cbor
  ${output_dir}/txt-write-transform-test.could-write.json
  ${output_dir}/txt-write-transform-test.txt)

add_test(NAME mnc-read-transform-test
  COMMAND mnc-read-transform
  ${input_dir}/LinearTransform.xfm
  ${output_dir}/mnc-read-transform-test.could-read.json
  ${output_dir}/mnc-read-transform-test.iwt.cbor)

add_test(NAME mnc-write-transform-test
  COMMAND mnc-write-transform
  ${input_dir}/LinearTransform.iwt.cbor
  ${output_dir}/mnc-write-transform-test.could-write.json
  ${output_dir}/mnc-write-transform-test.xfm)
