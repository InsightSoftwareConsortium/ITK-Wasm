find_path(RapidJSON_INCLUDE_DIR
  NAMES rapidjson/document.h
  )
include_directories(${RapidJSON_INCLUDE_DIR})

set(BridgeJavaScript_SRCS
  itkJSONImageIOFactory.cxx
  itkJSONImageIO.cxx
  )
itk_module_add_library(BridgeJavaScript ${BridgeJavaScript_SRCS})

if(BUILD_ITK_JS_IO_MODULES)

set(ImageIOIndex_ARRAY "")
foreach(io_module ${BridgeJavaScript_ImageIOModules} BridgeJavaScript)
  if(${io_module} STREQUAL "BridgeJavaScript")
    find_package(ITK REQUIRED COMPONENTS ITKIOImageBase)
    include(${ITK_USE_FILE})
    list(APPEND ITK_LIBRARIES ${BridgeJavaScript_LIBRARIES})
  else()
    find_package(ITK REQUIRED COMPONENTS ${io_module})
    include(${ITK_USE_FILE})
  endif()

  if(NOT DEFINED imageios_${io_module})
    message(FATAL_ERROR "Unknown ImageIOBase classes for module ${io_module}")
  endif()
  foreach(imageio ${imageios_${io_module}})
    set(ImageIOIndex_ARRAY "${ImageIOIndex_ARRAY}'${imageio}JSBinding', ")
    set(target ${imageio}JSBinding)
    set(wasm_target ${imageio}JSBindingWasm)
    add_executable(${target} Bindings/${target}.cxx)
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})
    add_executable(${wasm_target} Bindings/${target}.cxx)
    itk_module_target_label(${wasm_target})
    itk_module_target_export(${wasm_target})
    itk_module_target_install(${wasm_target})
    # For embind
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " --bind"
      )
    set_property(TARGET ${wasm_target} APPEND_STRING
      PROPERTY LINK_FLAGS " --bind"
      )
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " -s NO_EXIT_RUNTIME=1 -s INVOKE_RUN=0 --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSImageIOPre.js --post-js ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSPost.js"
      )
    set(pre_js ${CMAKE_CURRENT_BINARY_DIR}/itkJSImageIOPre${imageio}.js)
    configure_file(${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSImageIOPre.js.in
      ${pre_js} @ONLY)
    set_property(TARGET ${wasm_target} APPEND_STRING
      PROPERTY LINK_FLAGS " -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -s WASM=1 -s NO_EXIT_RUNTIME=1 -s INVOKE_RUN=0 --pre-js ${pre_js} --post-js ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSPost.js"
      )
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${BridgeJavaScript_BINARY_DIR}/ImageIOs
      )
    set_property(TARGET ${wasm_target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${BridgeJavaScript_BINARY_DIR}/ImageIOs
      )
    set_property(SOURCE Bindings/${target}.cxx APPEND
      PROPERTY OBJECT_DEPENDS
      ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSPost.js
      )
    target_link_libraries(${target} LINK_PUBLIC ${ITK_LIBRARIES})
    target_link_libraries(${wasm_target} LINK_PUBLIC ${ITK_LIBRARIES})
  endforeach()
endforeach()
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/ImageIOIndex.js.in
  ${CMAKE_CURRENT_SOURCE_DIR}/ImageIOIndex.js @ONLY)

# itkDICOMImageSeriesReader
find_package(ITK REQUIRED COMPONENTS ITKIODCMTK)
include(${ITK_USE_FILE})
set(target itkDICOMImageSeriesReaderJSBinding)
set(wasm_target itkDICOMImageSeriesReaderJSBindingWasm)
add_executable(${target} Bindings/${target}.cxx)
itk_module_target_label(${target})
itk_module_target_export(${target})
itk_module_target_install(${target})
add_executable(${wasm_target} Bindings/${target}.cxx)
itk_module_target_label(${wasm_target})
itk_module_target_export(${wasm_target})
itk_module_target_install(${wasm_target})
# For embind
set_property(TARGET ${target} APPEND_STRING
  PROPERTY LINK_FLAGS " --bind"
  )
set_property(TARGET ${wasm_target} APPEND_STRING
  PROPERTY LINK_FLAGS " --bind"
  )
set_property(TARGET ${target} APPEND_STRING
  PROPERTY LINK_FLAGS " -s FORCE_FILESYSTEM=1 -s NO_EXIT_RUNTIME=1 -s INVOKE_RUN=0 --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSImageIOPre.js --post-js ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSPost.js"
  )
set(pre_js ${CMAKE_CURRENT_BINARY_DIR}/itkJSImageIOPreDICOMImageSeriesReader.js)
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSImageIOPre.js.in
  ${pre_js} @ONLY)
set_property(TARGET ${wasm_target} APPEND_STRING
  PROPERTY LINK_FLAGS " -s FORCE_FILESYSTEM=1 -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -s WASM=1 -s NO_EXIT_RUNTIME=1 -s INVOKE_RUN=0 --pre-js ${pre_js} --post-js ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSPost.js"
  )
set_property(TARGET ${target}
  PROPERTY RUNTIME_OUTPUT_DIRECTORY
  ${BridgeJavaScript_BINARY_DIR}/ImageIOs
  )
set_property(TARGET ${wasm_target}
  PROPERTY RUNTIME_OUTPUT_DIRECTORY
  ${BridgeJavaScript_BINARY_DIR}/ImageIOs
  )
set_property(SOURCE Bindings/${target}.cxx APPEND
  PROPERTY OBJECT_DEPENDS
  ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSPost.js
  )
target_link_libraries(${target} LINK_PUBLIC ${ITK_LIBRARIES})
target_link_libraries(${wasm_target} LINK_PUBLIC ${ITK_LIBRARIES})

set(MeshIOIndex_ARRAY "")
foreach(io_module ${BridgeJavaScript_MeshIOModules})
  find_package(ITK REQUIRED COMPONENTS ${io_module})
  include(${ITK_USE_FILE})

  if(NOT DEFINED meshios_${io_module})
    message(FATAL_ERROR "Unknown MeshIOBase classes for module ${io_module}")
  endif()
  foreach(meshio ${meshios_${io_module}})
    set(MeshIOIndex_ARRAY "${MeshIOIndex_ARRAY}'${meshio}JSBinding', ")
    set(target ${meshio}JSBinding)
    set(wasm_target ${meshio}JSBindingWasm)
    add_executable(${target} Bindings/${target}.cxx)
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})
    add_executable(${wasm_target} Bindings/${target}.cxx)
    itk_module_target_label(${wasm_target})
    itk_module_target_export(${wasm_target})
    itk_module_target_install(${wasm_target})
    # For embind
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " --bind"
      )
    set_property(TARGET ${wasm_target} APPEND_STRING
      PROPERTY LINK_FLAGS " --bind"
      )
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " -s NO_EXIT_RUNTIME=1 -s INVOKE_RUN=0 --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSMeshIOPre.js --post-js ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSPost.js"
      )
    set(pre_js ${CMAKE_CURRENT_BINARY_DIR}/itkJSMeshIOPre${meshio}.js)
    configure_file(${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSMeshIOPre.js.in
      ${pre_js} @ONLY)
    set_property(TARGET ${wasm_target} APPEND_STRING
      PROPERTY LINK_FLAGS " -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -s WASM=1 -s NO_EXIT_RUNTIME=1 -s INVOKE_RUN=0 --pre-js ${pre_js} --post-js ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSPost.js"
      )
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${BridgeJavaScript_BINARY_DIR}/MeshIOs
      )
    set_property(TARGET ${wasm_target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${BridgeJavaScript_BINARY_DIR}/MeshIOs
      )
    set_property(SOURCE Bindings/${target}.cxx APPEND
      PROPERTY OBJECT_DEPENDS
      ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSPost.js
      )
    target_link_libraries(${target} LINK_PUBLIC ${ITK_LIBRARIES})
    target_link_libraries(${wasm_target} LINK_PUBLIC ${ITK_LIBRARIES})
  endforeach()
endforeach()
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/MeshIOIndex.js.in
  ${CMAKE_CURRENT_SOURCE_DIR}/MeshIOIndex.js @ONLY)

endif() # BUILD_ITK_JS_IO_MODULES
