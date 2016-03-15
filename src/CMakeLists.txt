find_package(ITK REQUIRED
  COMPONENTS
    ITKIOPNG
    ITKIONIFTI
    ITKIONRRD
  )
include(${ITK_USE_FILE})
add_executable(itkImageJS itkImageJS.cxx)
target_link_libraries(itkImageJS
  LINK_PRIVATE ${ITK_MODULE_BridgeJavaScript_PRIVATE_DEPENDS}
  LINK_PUBLIC ${ITK_MODULE_BridgeJavaScript_PUBLIC_DEPENDS})
itk_module_target_label(itkImageJS)
itk_module_target_export(itkImageJS)
itk_module_target_install(itkImageJS)
# For embind
set_property(TARGET itkImageJS APPEND
  PROPERTY LINK_FLAGS " --bind"
  )
target_link_libraries(itkImageJS LINK_PUBLIC ${ITK_LIBRARIES})
