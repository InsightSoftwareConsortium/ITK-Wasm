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
set_property(TARGET itkJSImageIO APPEND
  PROPERTY LINK_FLAGS " --bind"
  )
target_link_libraries(itkJSImageIO LINK_PUBLIC ${ITK_LIBRARIES})
