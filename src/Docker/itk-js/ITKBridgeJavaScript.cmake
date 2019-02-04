function(web_add_executable target_name)
  add_executable(${target_name} ${ARGN})
  set_property(TARGET ${target_name} APPEND_STRING
    PROPERTY LINK_FLAGS " -s WASM=0 -s NO_EXIT_RUNTIME=1 -s INVOKE_RUN=0 --pre-js /ITKBridgeJavaScript/src/EmscriptenModule/itkJSPipelinePre.js --post-js /ITKBridgeJavaScript/src/EmscriptenModule/itkJSPost.js"
    )
  set_property(TARGET ${target_name} APPEND_STRING
    PROPERTY LINK_FLAGS_DEBUG " -s DISABLE_EXCEPTION_CATCHING=0"
    )

  set(wasm_target_name ${target_name}Wasm)
  add_executable(${wasm_target_name} ${ARGN})
  set(pre_js ${CMAKE_CURRENT_BINARY_DIR}/itkJSPipelinePre${target_name}.js)
  configure_file(/ITKBridgeJavaScript/src/EmscriptenModule/itkJSPipelinePre.js.in
    ${pre_js} @ONLY)
  set_property(TARGET ${wasm_target_name} APPEND_STRING
    PROPERTY LINK_FLAGS " -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -s WASM=1 -s NO_EXIT_RUNTIME=1 -s INVOKE_RUN=0 --pre-js ${pre_js} --post-js /ITKBridgeJavaScript/src/EmscriptenModule/itkJSPost.js"
    )
  set_property(TARGET ${wasm_target_name} APPEND_STRING
    PROPERTY LINK_FLAGS_DEBUG " -s DISABLE_EXCEPTION_CATCHING=0"
    )
endfunction()

function(web_target_link_libraries target_name)
  target_link_libraries(${target_name} ${ARGN})

  set(wasm_target_name ${target_name}Wasm)
  target_link_libraries(${wasm_target_name} ${ARGN})
endfunction()
