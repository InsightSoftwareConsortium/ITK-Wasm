cmake_minimum_required(VERSION 3.16)
project(itkwasm-dicom)

set(CMAKE_CXX_STANDARD 17)

find_package(ITK REQUIRED
  COMPONENTS
    ITKDCMTK
    WebAssemblyInterface
  )
include(${ITK_USE_FILE})

set(wasm_modules )

# diquant.cc required for odd linker error
add_executable(structured-report-to-text structured-report-to-text.cxx diquant.cc)
add_executable(structured-report-to-html structured-report-to-html.cxx diquant.cc)
add_executable(read-dicom-encapsulated-pdf read-dicom-encapsulated-pdf.cxx)
add_executable(apply-presentation-state-to-image apply-presentation-state-to-image.cxx)
target_link_libraries(structured-report-to-text PUBLIC ${ITK_LIBRARIES})
target_link_libraries(structured-report-to-html PUBLIC ${ITK_LIBRARIES})
target_link_libraries(read-dicom-encapsulated-pdf PUBLIC ${ITK_LIBRARIES})
target_link_libraries(apply-presentation-state-to-image PUBLIC cpp-base64 ${ITK_LIBRARIES})
list(APPEND wasm_modules "structured-report-to-text")
list(APPEND wasm_modules "structured-report-to-html")
list(APPEND wasm_modules "read-dicom-encapsulated-pdf")
list(APPEND wasm_modules "apply-presentation-state-to-image")


if (WASI AND DEFINED WebAssemblyInterface_BINARY_DIR)
  foreach(target ${wasm_modules})
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/wasi-dicom
      )
  endforeach()
  return()
endif()

if (EMSCRIPTEN AND DEFINED WebAssemblyInterface_BINARY_DIR)
  foreach(target ${wasm_modules})
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/dicom
      )
    itk_module_target_label(${target}.umd)
    itk_module_target_export(${target}.umd)
    itk_module_target_install(${target}.umd)
    set_property(TARGET ${target}.umd
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/dicom
      )
  endforeach()
  return()
endif()
