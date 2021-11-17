itk_module_test()

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
  DATA{Input/cthead1.png}
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
  DATA{Input/cthead1.iwi.zip}
  DATA{Input/cthead1.iwi/index.json}
  DATA{Input/cthead1.iwi/data/direction.raw}
  DATA{Input/cthead1.iwi/data/data.raw}
  DATA{Input/uGridEx.vtk}
  DATA{Input/diskout.vtp}
  DATA{Input/elements.vtu}
  DATA{Input/disk_out_ref.ex2}
  DATA{Input/RectGrid2.vtr}
  DATA{Input/bunny.ply}
  DATA{Input/C0004255.ISQ}
  DATA{Input/PNGSeries/,REGEX:mri3D_.[0-9]+.png}
  )

set(WebAssemblyInterfaceTests
  itkJSONImageInterfaceTest.cxx
  itkJSONMeshInterfaceTest.cxx
  itkWASMImageIOTest.cxx
  itkWASMMeshIOTest.cxx
)

CreateTestDriver(WebAssemblyInterface "${WebAssemblyInterface-Test_LIBRARIES}"
  "${WebAssemblyInterfaceTests}" )

itk_add_test(NAME itkJSONImageInterfaceTest
    COMMAND WebAssemblyInterfaceTestDriver
      --compare DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkJSONImageInterfaceTest.mha
    itkJSONImageInterfaceTest
      DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkJSONImageInterfaceTest.mha
)

itk_add_test(NAME itkJSONMeshInterfaceTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkJSONMeshInterfaceTest
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkJSONMeshInterfaceTest.vtk
)

itk_add_test(NAME itkJSONImageInterfaceNiftiTest
    COMMAND WebAssemblyInterfaceTestDriver
      --compare DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkJSONImageInterfaceNiftiTest.nii.gz
    itkJSONImageInterfaceTest
      DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkJSONImageInterfaceNiftiTest.nii.gz
)

itk_add_test(NAME itkWASMImageIOTest
    COMMAND WebAssemblyInterfaceTestDriver
      --compare DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIOTest.mha
      --compare DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIOTest.zip.mha
    itkWASMImageIOTest
      DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIOTest.iwi
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIOTest.mha
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIOTest.iwi.zip
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIOTest.zip.mha
)

itk_add_test(NAME itkWASMImageIONiftiTest
    COMMAND WebAssemblyInterfaceTestDriver
      --compare DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIONiftiTest.mha
      --compare DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIONiftiTest.zip.mha
    itkWASMImageIOTest
      DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIONiftiTest.iwi
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIONiftiTest.mha
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIONiftiTest.iwi.zip
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIONiftiTest.zip.mha
)

itk_add_test(NAME itkWASMMeshIOTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkWASMMeshIOTest
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMMeshIOTest.iwm
      ${ITK_TEST_OUTPUT_DIR}/itkWASMMeshIOTest.vtk
      ${ITK_TEST_OUTPUT_DIR}/itkWASMMeshIOTest.iwm.zip
      ${ITK_TEST_OUTPUT_DIR}/itkWASMMeshIOTest.zip.vtk
)

if(EMSCRIPTEN)
  # setjmp workaround
  set_property(TARGET WebAssemblyInterfaceTestDriver APPEND_STRING
    PROPERTY LINK_FLAGS " -s ERROR_ON_UNDEFINED_SYMBOLS=0"
  )
  set_property(TARGET WebAssemblyInterfaceTestDriver.umd APPEND_STRING
    PROPERTY LINK_FLAGS " -s ERROR_ON_UNDEFINED_SYMBOLS=0"
  )
endif()
