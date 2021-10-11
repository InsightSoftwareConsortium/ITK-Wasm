# Override the default set in the Emscripten toolchain (11) to be compatible
# with ITK's requirement for c++14 or newer.
set(CMAKE_C_STANDARD_COMPUTED_DEFAULT 14)

if(NOT _ITKBridgeJavaScript_INCLUDED)

set(_add_executable add_executable)
function(add_executable target)
  set(wasm_target ${target})
  set(umd_target ${wasm_target}.umd)
  _add_executable(${wasm_target} ${ARGN})
  _add_executable(${umd_target} ${ARGN})

  set(pre_js ${CMAKE_CURRENT_BINARY_DIR}/itkJSPipelinePre${target}.js)
  configure_file(/ITKBridgeJavaScript/src/emscripten-module/itkJSPipelinePre.js.in ${pre_js} @ONLY)

  get_property(_link_flags TARGET ${target} PROPERTY LINK_FLAGS)
  set(common_link_flags " -s FORCE_FILESYSTEM=1 -s EXPORTED_RUNTIME_METHODS='[\"callMain\"]' -s EXPORTED_FUNCTIONS='[\"_main\"]' -flto -s WASM=1 -lnodefs.js -s WASM_ASYNC_COMPILATION=0 -s EXPORT_NAME=${target} -s MODULARIZE=1 -s EXIT_RUNTIME=0 -s INVOKE_RUN=0 --pre-js ${pre_js} --post-js /ITKBridgeJavaScript/src/emscripten-module/itkJSPost.js ${_link_flags}")
  set_property(TARGET ${wasm_target} PROPERTY LINK_FLAGS "${common_link_flags} -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0")
  set_property(TARGET ${umd_target} PROPERTY LINK_FLAGS "${common_link_flags}")

  get_property(_link_flags_debug TARGET ${target} PROPERTY LINK_FLAGS_DEBUG)
  set_property(TARGET ${wasm_target} PROPERTY LINK_FLAGS_DEBUG " -s DISABLE_EXCEPTION_CATCHING=0 --bind ${_link_flags_debug}")
  set_property(TARGET ${umd_target} PROPERTY LINK_FLAGS_DEBUG " -s DISABLE_EXCEPTION_CATCHING=0 --bind ${_link_flags_debug}")
endfunction()
function(web_add_executable)
  add_executable(${ARGN})
endfunction()

set(_target_link_libraries target_link_libraries)
function(target_link_libraries target)
  _target_link_libraries(${target} ${ARGN})
  if (TARGET ${target}.umd)
    _target_link_libraries(${target}.umd ${ARGN})
  endif()
  get_target_property(target_type ${target} TYPE)
  if ("${CMAKE_BUILD_TYPE}" STREQUAL Debug AND "${target_type}" STREQUAL EXECUTABLE)
    target_sources(${target} PRIVATE /ITKBridgeJavaScript/src/getExceptionMessage.cxx)
    if (TARGET ${target}.umd)
      target_sources(${target}.umd PRIVATE /ITKBridgeJavaScript/src/getExceptionMessage.cxx)
    endif()
  endif()
endfunction()
function(web_target_link_libraries)
  target_link_libraries(${ARGN})
endfunction()

set(_ITKBridgeJavaScript_INCLUDED 1)
endif() # NOT _ITKBridgeJavaScript_INCLUDED
