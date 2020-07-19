if(NOT _ITKBridgeJavaScript_INCLUDED)

set(_add_executable add_executable)
function(add_executable target)
  _add_executable(${target} ${ARGN})
  get_property(_link_flags TARGET ${target} PROPERTY LINK_FLAGS)
  set_property(TARGET ${target} PROPERTY LINK_FLAGS " -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"callMain\"]' -s EXPORTED_FUNCTIONS='[\"_main\"]' -s WASM=0 -lnodefs.js -s EXIT_RUNTIME=0 -s INVOKE_RUN=0 --pre-js /ITKBridgeJavaScript/src/EmscriptenModule/itkJSPipelinePre.js --post-js /ITKBridgeJavaScript/src/EmscriptenModule/itkJSPost.js ${_link_flags}"
    )
  get_property(_link_flags_debug TARGET ${target} PROPERTY LINK_FLAGS_DEBUG)
  set_property(TARGET ${target}
    PROPERTY LINK_FLAGS_DEBUG " -s DISABLE_EXCEPTION_CATCHING=0 ${_link_flags_debug}"
    )

  set(wasm_target ${target}Wasm)
  _add_executable(${wasm_target} ${ARGN})
  set(pre_js ${CMAKE_CURRENT_BINARY_DIR}/itkJSPipelinePre${target}.js)
  configure_file(/ITKBridgeJavaScript/src/EmscriptenModule/itkJSPipelinePre.js.in
    ${pre_js} @ONLY)
  get_property(_link_flags TARGET ${wasm_target} PROPERTY LINK_FLAGS)
  set_property(TARGET ${wasm_target} PROPERTY LINK_FLAGS " -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"callMain\"]' -s EXPORTED_FUNCTIONS='[\"_main\"]' -s WASM=1 -lworkerfs.js -s WASM_ASYNC_COMPILATION=0 -s EXPORT_NAME=${target} -s MODULARIZE=1 -s EXIT_RUNTIME=0 -s INVOKE_RUN=0 --pre-js ${pre_js} --post-js /ITKBridgeJavaScript/src/EmscriptenModule/itkJSPost.js ${_link_flags}")
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

  set(wasm_target ${target}Wasm)
  if(TARGET ${wasm_target})
    _target_link_libraries(${wasm_target} ${ARGN})
  endif()
endfunction()
function(web_target_link_libraries)
  target_link_libraries(${ARGN})
endfunction()

set(_ITKBridgeJavaScript_INCLUDED 1)
endif() # NOT _ITKBridgeJavaScript_INCLUDED
