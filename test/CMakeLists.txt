itk_module_test()

find_program(NODE_EXECUTABLE
  NAMES node nodejs
  )
if(NODE_EXECUTABLE-NOTFOUND)
  message(SEND_ERROR "Node.js is required to run the test")
endif()

set(moduleDir "${CMAKE_BINARY_DIR}/bin")

itk_add_test(NAME itkImageJSExampleTest
  COMMAND ${NODE_EXECUTABLE} ${CMAKE_CURRENT_SOURCE_DIR}/itkImageJSExample.js
    ${moduleDir}
    DATA{Input/cthead1.png}
    ${ITK_TEST_OUTPUT_DIR}/cthead1.png
  )
