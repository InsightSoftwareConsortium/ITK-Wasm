# Override the default set in the Emscripten toolchain (11) to be compatible
# with ITK's requirement for c++14 or newer.
set(CMAKE_C_STANDARD_COMPUTED_DEFAULT 14)

if(NOT _ITKBridgeJavaScript_INCLUDED)

set(_add_executable add_executable)
function(add_executable target)
  _add_executable(${target} ${ARGN})
  set(wasm_target ${target})
  set(pre_js ${CMAKE_CURRENT_BINARY_DIR}/itkJSPipelinePre${target}.js)
  configure_file(/ITKBridgeJavaScript/src/emscripten-module/itkJSPipelinePre.js.in
    ${pre_js} @ONLY)
  get_property(_link_flags TARGET ${wasm_target} PROPERTY LINK_FLAGS)
  set_property(TARGET ${wasm_target} PROPERTY LINK_FLAGS " -s
  EXTRA_EXPORTED_RUNTIME_METHODS='[\"callMain\"]' -s EXPORTED_FUNCTIONS='[\"_main\"]' -flto -s STANDALONE_WASM=1 -s WASM=1 -lworkerfs.js -s WASM_ASYNC_COMPILATION=1 -s EXPORT_NAME=${target} -s MODULARIZE=1 -s EXIT_RUNTIME=0 -s INVOKE_RUN=0 --pre-js ${pre_js} --post-js /ITKBridgeJavaScript/src/emscripten-module/itkJSPost.js ${_link_flags}")
  get_property(_link_flags_debug TARGET ${wasm_target} PROPERTY LINK_FLAGS_DEBUG)
  set_property(TARGET ${wasm_target} PROPERTY LINK_FLAGS_DEBUG " -s DISABLE_EXCEPTION_CATCHING=0 ${_link_flags_debug}"
    )
endfunction()
function(web_add_executable)
  add_executable(${ARGN})
endfunction()

set(_target_link_libraries target_link_libraries)
function(target_link_libraries target)
  _target_link_libraries(${target} ${ARGN})
endfunction()
function(web_target_link_libraries)
  target_link_libraries(${ARGN})
endfunction()

set(_ITKBridgeJavaScript_INCLUDED 1)
endif() # NOT _ITKBridgeJavaScript_INCLUDED
