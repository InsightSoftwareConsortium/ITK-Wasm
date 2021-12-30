cmake_minimum_required(VERSION 3.16)
project(ReadImageDICOMFileSeries)

set(CMAKE_CXX_STANDARD 17)

find_package(ITK REQUIRED
  COMPONENTS ITKCommon
    ITKGDCM
    ITKIOGDCM
    ITKIOImageBase
    WebAssemblyInterface
  )
include(${ITK_USE_FILE})

add_executable(ReadImageDICOMFileSeries ReadImageDICOMFileSeries.cxx)
target_link_libraries(ReadImageDICOMFileSeries PUBLIC ${ITK_LIBRARIES})

if (EMSCRIPTEN AND DEFINED WebAssemblyInterface_BINARY_DIR)
  foreach(dicom_io_module
      ReadImageDICOMFileSeries
      # itkDICOMTagReader
  )
    set(target_esm "${dicom_io_module}")
    set(target_umd "${dicom_io_module}.umd")
    set(dicom_common_link_flags " ${common_link_flags} -s SUPPORT_LONGJMP=1 -s DISABLE_EXCEPTION_CATCHING=0")
    foreach(target ${target_esm} ${target_umd})
      itk_module_target_label(${target})
      itk_module_target_export(${target})
      itk_module_target_install(${target})
      set_property(TARGET ${target}
        PROPERTY RUNTIME_OUTPUT_DIRECTORY
        ${WebAssemblyInterface_BINARY_DIR}/image-io
        )
      set_property(TARGET ${target_umd} APPEND_STRING
        PROPERTY LINK_FLAGS " ${dicom_common_link_flags}"
        )
    endforeach()
  endforeach()
endif()