itk_module_test()

find_program(NODE_EXECUTABLE
  NAMES node nodejs
  )
if(NODE_EXECUTABLE-NOTFOUND)
  message(SEND_ERROR "Node.js is required to run the test")
endif()

set(moduleDir "${CMAKE_BINARY_DIR}/bin")

itk_add_test(NAME itkPNGImageIOJSBindingTest
  COMMAND ${NODE_EXECUTABLE} ${CMAKE_CURRENT_SOURCE_DIR}/_itkPNGImageIOJSBindingTest.js
    "${BridgeJavaScript_BINARY_DIR}/itkImageIOs"
    DATA{Input/cthead1.png}
    ${ITK_TEST_OUTPUT_DIR}/cthead1.png
  )

# Download testing data for the tests executed via `npm test`
ExternalData_Expand_Arguments(
  ITKData
  npm_test_inputs
  DATA{Input/vol-raw-little.nrrd}
  )
