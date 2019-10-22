itk_module_test()

find_program(NODE_EXECUTABLE
  NAMES node nodejs
  )
if(NODE_EXECUTABLE-NOTFOUND)
  message(SEND_ERROR "Node.js is required to run the test")
endif()

set(moduleDir "${CMAKE_BINARY_DIR}/bin")

if(BUILD_ITK_JS_IO_MODULES)
itk_add_test(NAME itkPNGImageIOJSBindingTest
  COMMAND ${NODE_EXECUTABLE} ${CMAKE_CURRENT_SOURCE_DIR}/_itkPNGImageIOJSBindingTest.js
    "${BridgeJavaScript_BINARY_DIR}/ImageIOs"
    DATA{Input/cthead1.png}
    ${ITK_TEST_OUTPUT_DIR}/cthead1.png
  )
endif()

# Download testing data for the tests executed via `npm test`
ExternalData_Expand_Arguments(
  ITKData
  npm_test_inputs
  DATA{Input/brainweb165a10f17.mha}
  DATA{Input/vol-raw-little.nrrd}
  DATA{Input/1.3.6.1.4.1.5962.99.1.3814087073.479799962.1489872804257.100.0.dcm}
  DATA{Input/ironProt.vtk}
  DATA{Input/ShortTestImage.tiff}
  DATA{Input/r16slice.nii.gz}
  DATA{Input/image_color.bmp}
  DATA{Input/apple.jpg}
  DATA{Input/biorad.pic}
  DATA{Input/19771.002.001}
  DATA{Input/113766.003.001}
  DATA{Input/I.001}
  DATA{Input/ramp.gipl}
  DATA{Input/ITKImage.hdf5}
  DATA{Input/cthead1.lsm}
  DATA{Input/t1_z+_short_cor.mnc}
  DATA{Input/T1.mgz}
  DATA{Input/tilt_series_little.mrc}
  DATA{Input/DicomImageOrientationTest/,REGEX:ImageOrientation.[0-9]+.dcm}
  DATA{Input/cow.vtk}
  DATA{Input/cube.byu}
  DATA{Input/sphere.fsa}
  DATA{Input/sphere.fsb}
  DATA{Input/box.obj}
  DATA{Input/octa.off}
  DATA{Input/sphere.stl}
  DATA{Input/cthead1.json}
  DATA{Input/cthead1.json.data}
  )
