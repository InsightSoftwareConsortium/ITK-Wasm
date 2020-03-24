if(NOT _ITKBridgeJavaScript_INCLUDED)

set(_add_executable add_executable)
function(add_executable target_name)
  _add_executable(${target_name} ${ARGN})
  set_property(TARGET ${target_name} APPEND_STRING
    PROPERTY LINK_FLAGS " -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"callMain\"]' -s EXPORTED_FUNCTIONS='[\"_main\"]' -s WASM=0 -s EXIT_RUNTIME=0 -s NO_EXIT_RUNTIME=1 -s INVOKE_RUN=0 --pre-js /ITKBridgeJavaScript/src/EmscriptenModule/itkJSPipelinePre.js --post-js /ITKBridgeJavaScript/src/EmscriptenModule/itkJSPost.js"
    )
  set_property(TARGET ${target_name} APPEND_STRING
    PROPERTY LINK_FLAGS_DEBUG " -s DISABLE_EXCEPTION_CATCHING=0"
    )

  set(wasm_target_name ${target_name}Wasm)
  _add_executable(${wasm_target_name} ${ARGN})
  set(pre_js ${CMAKE_CURRENT_BINARY_DIR}/itkJSPipelinePre${target_name}.js)
  configure_file(/ITKBridgeJavaScript/src/EmscriptenModule/itkJSPipelinePre.js.in
    ${pre_js} @ONLY)
  set_property(TARGET ${wasm_target_name} APPEND_STRING PROPERTY LINK_FLAGS " -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"callMain\"]' -s EXPORTED_FUNCTIONS='[\"_main\"]' -s WASM=1 -s WASM_ASYNC_COMPILATION=0 -s EXPORT_NAME=${target_name} -s MODULARIZE=1 -s EXIT_RUNTIME=0 -s NO_EXIT_RUNTIME=1 -s INVOKE_RUN=0 --pre-js ${pre_js} --post-js /ITKBridgeJavaScript/src/EmscriptenModule/itkJSPost.js"
    )
  set_property(TARGET ${wasm_target_name} APPEND_STRING
    PROPERTY LINK_FLAGS_DEBUG " -s DISABLE_EXCEPTION_CATCHING=0"
    )
endfunction()
function(web_add_executable)
  add_executable(${ARGN})
endfunction()

set(_target_link_libraries target_link_libraries)
function(target_link_libraries target_name)
  _target_link_libraries(${target_name} ${ARGN})

  set(wasm_target_name ${target_name}Wasm)
  if(TARGET ${wasm_target_name})
    _target_link_libraries(${wasm_target_name} ${ARGN})
  endif()
endfunction()
function(web_target_link_libraries)
  target_link_libraries(${ARGN})
endfunction()

set(_ITKBridgeJavaScript_INCLUDED 1)
endif() # NOT _ITKBridgeJavaScript_INCLUDED
