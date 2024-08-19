find_package(ITK REQUIRED
  COMPONENTS
    ITKDCMTK
    WebAssemblyInterface
  )
include(${ITK_USE_FILE})

add_executable(structured-report-to-text structured-report-to-text.cxx)
target_link_libraries(structured-report-to-text PUBLIC ${ITK_LIBRARIES})

add_executable(apply-presentation-state-to-image
  apply-presentation-state-to-image.cxx dcostrmb.cc)
target_link_libraries(apply-presentation-state-to-image PUBLIC cpp-base64 ${ITK_LIBRARIES})
#add_test(NAME apply-presentation-state-to-image-test
  #COMMAND apply-presentation-state-to-image
    #${CMAKE_CURRENT_SOURCE_DIR}/../test/data/input/csps-input-image.dcm
    #${CMAKE_CURRENT_SOURCE_DIR}/../test/data/input/csps-input-pstate.dcm
    #${CMAKE_CURRENT_BINARY_DIR}/apply-presentation-state-to-image-p-state.json
    #${CMAKE_CURRENT_BINARY_DIR}/apply-presentation-state-to-image-output-image.iwi.cbor
    #)

add_executable(structured-report-to-html structured-report-to-html.cxx)
target_link_libraries(structured-report-to-html PUBLIC ${ITK_LIBRARIES})

add_executable(read-dicom-encapsulated-pdf read-dicom-encapsulated-pdf.cxx)
target_link_libraries(read-dicom-encapsulated-pdf PUBLIC ${ITK_LIBRARIES})
