# Override the default set in the Emscripten toolchain (11) to be compatible
# with ITK's requirement for C++17 or newer.
# C++17 for string_view support
# C++20 for glaze support
set(CMAKE_CXX_STANDARD_COMPUTED_DEFAULT 20)

# Not compatible
set(CMAKE_DISABLE_FIND_PACKAGE_OpenMP TRUE)

if(NOT _ITKWebAssemblyInterface_INCLUDED)

function(kebab_to_camel kebab camel)
  set(result "${kebab}")
  while(result MATCHES "-([a-z])")
    string(REGEX MATCH "-([a-z])" post_dash "${result}")
    string(SUBSTRING "${post_dash}" 1 1 post_dash)
    string(TOUPPER "${post_dash}" post_dash_upper)
    string(REGEX REPLACE "(-${post_dash})" "${post_dash_upper}" result "${result}")
  endwhile()
  set(${camel} "${result}" PARENT_SCOPE)
endfunction()

set(_target_link_libraries target_link_libraries)
function(target_link_libraries target)
  _target_link_libraries(${target} ${ARGN})
  if(EMSCRIPTEN)
    get_target_property(target_type ${target} TYPE)
    if ("${CMAKE_BUILD_TYPE}" STREQUAL Debug AND "${target_type}" STREQUAL EXECUTABLE)
      target_sources(${target} PRIVATE /ITKWebAssemblyInterface/src/getExceptionMessage.cxx)
    endif()
  else()
  endif()
endfunction()
function(web_target_link_libraries)
  target_link_libraries(${ARGN})
endfunction()

set(_add_executable add_executable)
function(add_executable target)
  set(wasm_target ${target})
  _add_executable(${wasm_target} ${ARGN})
  # Suppress CLI11 Encoding_inl.hpp std::wstring_convert deprecation warning
  set_property(TARGET ${wasm_target} APPEND PROPERTY COMPILE_OPTIONS -msimd128 -flto -Wno-warn-absolute-paths -Wno-deprecated-declarations -DITK_WASM_NO_FILESYSTEM_IO)
  if(EMSCRIPTEN)
    kebab_to_camel(${target} targetCamel)
    get_property(_link_flags TARGET ${target} PROPERTY LINK_FLAGS)
    set(common_link_flags "-flto -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -s FORCE_FILESYSTEM=1 -s EXPORTED_RUNTIME_METHODS='[\"callMain\",\"cwrap\",\"ccall\",\"writeArrayToMemory\",\"lengthBytesUTF8\",\"stringToUTF8\",\"UTF8ToString\", \"stackSave\", \"stackRestore\"]' -flto -s  ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -s WASM=1 -lnodefs.js -s WASM_ASYNC_COMPILATION=1 -s EXPORT_NAME=${targetCamel} -s MODULARIZE=1 -s EXIT_RUNTIME=0 -s INVOKE_RUN=0 --pre-js /ITKWebAssemblyInterface/src/emscripten-module/itkJSPipelinePre.js --post-js /ITKWebAssemblyInterface/src/emscripten-module/itkJSPost.js -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s EXPORTED_FUNCTIONS='[\"_main\"]' ${_link_flags}")
    set_property(TARGET ${wasm_target} PROPERTY LINK_FLAGS "${common_link_flags} -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=1")

    get_property(_include_dirs TARGET ${target} PROPERTY INCLUDE_DIRECTORIES)

    get_property(_link_flags_debug TARGET ${target} PROPERTY LINK_FLAGS_DEBUG)
    set_property(TARGET ${wasm_target} PROPERTY LINK_FLAGS_DEBUG " -s EXPORT_EXCEPTION_HANDLING_HELPERS=1 -fno-lto -s SAFE_HEAP=1 -s DISABLE_EXCEPTION_CATCHING=0 -lembind ${_link_flags_debug}")

    get_property(_is_imported TARGET ${target} PROPERTY IMPORTED)
    if (NOT ${_is_imported})
      add_custom_command(TARGET ${target}
        POST_BUILD
        COMMAND /usr/bin/zstd -f "$<TARGET_FILE_DIR:${target}>/$<TARGET_FILE_BASE_NAME:${target}>.wasm" -o "$<TARGET_FILE_DIR:${target}>/$<TARGET_FILE_BASE_NAME:${target}>.wasm.zst"
        )
    endif()
  else()
    # WASI
    set_property(TARGET ${wasm_target} PROPERTY SUFFIX ".wasi.wasm")
    if (NOT TARGET wasi-itk-extras AND DEFINED CMAKE_CXX_COMPILE_OBJECT)
      set_source_files_properties(/ITKWebAssemblyInterface/src/exceptionShimInitPrimaryException.cxx PROPERTIES COMPILE_FLAGS "-fno-lto")
      add_library(wasi-itk-extras STATIC
        /ITKWebAssemblyInterface/src/exceptionShim.cxx
        /ITKWebAssemblyInterface/src/exceptionShimInitPrimaryException.cxx
        /ITKWebAssemblyInterface/src/cxaThreadAtExitShim.cxx
        /ITKWebAssemblyInterface/src/pthreadShim.cxx
        /ITKWebAssemblyInterface/src/initialization.cxx)
    endif()
    get_property(_is_imported TARGET ${wasm_target} PROPERTY IMPORTED)
    if (NOT ${_is_imported})
      _target_link_libraries(${target} PRIVATE $<$<LINK_LANGUAGE:CXX>:wasi-itk-extras>)
      set_property(TARGET ${wasm_target} APPEND PROPERTY COMPILE_OPTIONS -flto -msimd128 -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_SIGNAL)
      target_compile_options(${wasm_target} PRIVATE $<$<CONFIG:Debug>:-fno-lto -g>)
      get_property(_link_flags TARGET ${wasm_target} PROPERTY LINK_FLAGS)
      set_property(TARGET ${wasm_target} PROPERTY LINK_FLAGS
        "-flto -lwasi-emulated-process-clocks -lwasi-emulated-signal -lc-printscan-long-double -mexec-model=reactor -Wl,--export-if-defined=itk_wasm_input_array_alloc -Wl,--export-if-defined=itk_wasm_input_json_alloc -Wl,--export-if-defined=itk_wasm_output_json_address -Wl,--export-if-defined=itk_wasm_output_json_size -Wl,--export-if-defined=itk_wasm_output_array_address -Wl,--export-if-defined=itk_wasm_output_array_size -Wl,--export-if-defined=itk_wasm_free_all -Wl,--export-if-defined=_start -Wl,--export-if-defined=itk_wasm_delayed_start -Wl,--export-if-defined=itk_wasm_delayed_exit ${_link_flags}")
      set_property(TARGET ${wasm_target} PROPERTY LINK_FLAGS_DEBUG
        "-fno-lto -lwasi-emulated-process-clocks -lwasi-emulated-signal -lc-printscan-long-double -mexec-model=reactor -Wl,--export-if-defined=itk_wasm_input_array_alloc -Wl,--export-if-defined=itk_wasm_input_json_alloc -Wl,--export-if-defined=itk_wasm_output_json_address -Wl,--export-if-defined=itk_wasm_output_json_size -Wl,--export-if-defined=itk_wasm_output_array_address -Wl,--export-if-defined=itk_wasm_output_array_size -Wl,--export-if-defined=itk_wasm_free_all -Wl,--export-if-defined=_start -Wl,--export-if-defined=itk_wasm_delayed_start -Wl,--export-if-defined=itk_wasm_delayed_exit ${_link_flags}")
      if(NOT ITK_WASM_NO_INTERFACE_LINK)
        if(NOT TARGET WebAssemblyInterface)
          find_package(ITK QUIET COMPONENTS WebAssemblyInterface)
        endif()
        if(TARGET WebAssemblyInterface)
          _target_link_libraries(${wasm_target} PRIVATE WebAssemblyInterface)
        endif()
      endif()
    endif()
  endif()
endfunction()
function(web_add_executable)
  add_executable(${ARGN})
endfunction()

set(_ITKWebAssemblyInterface_INCLUDED 1)
endif() # NOT _ITKWebAssemblyInterface_INCLUDED
