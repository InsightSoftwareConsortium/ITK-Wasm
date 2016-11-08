find_package(ITK REQUIRED
  COMPONENTS
    ITKIOPNG
    ITKIONIFTI
    ITKIONRRD
  )
include(${ITK_USE_FILE})
add_executable(itkJSImageIO itkJSImageIO.cxx)
target_link_libraries(itkJSImageIO
  LINK_PRIVATE ${ITK_MODULE_BridgeJavaScript_PRIVATE_DEPENDS}
  LINK_PUBLIC ${ITK_MODULE_BridgeJavaScript_PUBLIC_DEPENDS})
itk_module_target_label(itkJSImageIO)
itk_module_target_export(itkJSImageIO)
itk_module_target_install(itkJSImageIO)
# For embind
set_property(TARGET itkJSImageIO APPEND_STRING
  PROPERTY LINK_FLAGS " --bind"
  )
set_property(TARGET itkJSImageIO APPEND_STRING
  PROPERTY LINK_FLAGS " --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/itkJSImageIOPre.js --post-js ${CMAKE_CURRENT_SOURCE_DIR}/itkJSImageIOPost.js"
  )
set_property(SOURCE ${target}.cxx APPEND
  PROPERTY OBJECT_DEPENDS
  ${CMAKE_CURRENT_SOURCE_DIR}/itkJSImageIOPost.js
  )
target_link_libraries(itkJSImageIO LINK_PUBLIC ${ITK_LIBRARIES})


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
      PROPERTY LINK_FLAGS " --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/itkJSImageIOPre.js --post-js ${CMAKE_CURRENT_SOURCE_DIR}/itkJSImageIOPost.js"
      )
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${BridgeJavaScript_BINARY_DIR}/ImageIOs
      )
    set_property(SOURCE ${target}.cxx APPEND
      PROPERTY OBJECT_DEPENDS
      ${CMAKE_CURRENT_SOURCE_DIR}/itkJSImageIOPost.js
      )
    target_link_libraries(${target} LINK_PUBLIC ${ITK_LIBRARIES})
  endforeach()
endforeach()
