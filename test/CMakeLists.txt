itk_module_test()

find_program(NODE_EXECUTABLE
  NAMES node nodejs
  )
if(NODE_EXECUTABLE-NOTFOUND)
  message(SEND_ERROR "Node.js is required to run the test")
endif()

set(moduleDir "${CMAKE_BINARY_DIR}/bin")

itk_add_test(NAME itkJSImageIOTest
  COMMAND ${NODE_EXECUTABLE} ${CMAKE_CURRENT_SOURCE_DIR}/itkJSImageIOTest.js
    ${moduleDir}
    DATA{Input/cthead1.png}
    ${ITK_TEST_OUTPUT_DIR}/itkJSImageIOTest.png
  )

itk_add_test(NAME itkJSImageIOExampleTest
  COMMAND ${NODE_EXECUTABLE} ${CMAKE_CURRENT_SOURCE_DIR}/itkJSImageIOExample.js
    ${moduleDir}
    DATA{Input/cthead1.png}
    ${ITK_TEST_OUTPUT_DIR}/cthead1.png
  )

itk_add_test(NAME itkPNGImageIOJSBindingTest
  COMMAND ${NODE_EXECUTABLE} ${CMAKE_CURRENT_SOURCE_DIR}/itkPNGImageIOJSBindingTest.js
    "${BridgeJavaScript_BINARY_DIR}/ImageIOs"
    DATA{Input/cthead1.png}
    ${ITK_TEST_OUTPUT_DIR}/cthead1.png
  )
