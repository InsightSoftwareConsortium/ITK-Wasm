foreach(io_module ${BridgeJavaScript_IOModules})
  find_package(ITK REQUIRED COMPONENTS ${io_module})
  include(${ITK_USE_FILE})

  if(NOT DEFINED imageio_${io_module})
    message(FATAL_ERROR "Unknown ImageIOBase classes for module ${io_module}")
  endif()
  foreach(imageio ${imageio_${io_module}})
    set(target ${imageio}JSBinding)
    add_executable(${target} ${target}.cxx)
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})
    # For embind
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " --bind"
      )
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " -s NO_EXIT_RUNTIME=1 -s INVOKE_RUN=0 --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSImageIOPre.js --post-js ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSImageIOPost.js"
      )
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${BridgeJavaScript_BINARY_DIR}/itkImageIOs
      )
    set_property(SOURCE ${target}.cxx APPEND
      PROPERTY OBJECT_DEPENDS
      ${CMAKE_CURRENT_SOURCE_DIR}/EmscriptenModule/itkJSImageIOPost.js
      )
    target_link_libraries(${target} LINK_PUBLIC ${ITK_LIBRARIES})
  endforeach()
endforeach()
