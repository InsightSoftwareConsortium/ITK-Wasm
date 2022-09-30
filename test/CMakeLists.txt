itk_module_test()

# Download testing data for the tests executed via `npm test`
ExternalData_Expand_Arguments(
  ITKData
  npm_test_inputs
  DATA{Input/brainweb165a10f17.mha}
  DATA{Input/3x2.mha}
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
  DATA{Input/cthead1.iwi.cbor}
  DATA{Input/cthead1.iwi/index.json}
  DATA{Input/cthead1.iwi/data/direction.raw}
  DATA{Input/cthead1.iwi/data/data.raw}
  DATA{Input/cow.iwm.cbor}
  DATA{Input/cow.iwm/index.json}
  DATA{Input/cow.iwm/data/cells.raw}
  DATA{Input/cow.iwm/data/points.raw}
  DATA{Input/uGridEx.vtk}
  DATA{Input/diskout.vtp}
  DATA{Input/elements.vtu}
  DATA{Input/disk_out_ref.ex2}
  DATA{Input/RectGrid2.vtr}
  DATA{Input/bunny.ply}
  DATA{Input/C0004255.ISQ}
  DATA{Input/PNGSeries/,REGEX:mri3D_.[0-9]+.png}
  DATA{Input/11706c2.CNG.swc}
  DATA{Input/88.33-comprehensive-SR.dcm}
  DATA{Input/88.59-KeyObjectSelection-SR.dcm}
  DATA{Input/88.67-radiation-dose-SR.dcm}
  DATA{Input/104.1-SR-printed-to-pdf.dcm}
  DATA{Input/test-style.css}

  DATA{Baseline/web_worker_pool.cy.png}
  )

set(WebAssemblyInterfaceTests
  itkWASMImageInterfaceTest.cxx
  itkWASMMeshInterfaceTest.cxx
  itkWASMPolyDataInterfaceTest.cxx
  itkWASMImageIOTest.cxx
  itkWASMMeshIOTest.cxx
  itkPipelineTest.cxx
  itkPipelineMemoryIOTest.cxx
  itkSupportInputImageTypesTest.cxx
  itkSupportInputImageTypesMemoryIOTest.cxx
  itkSupportInputMeshTypesTest.cxx
  itkSupportInputMeshTypesMemoryIOTest.cxx
  itkSupportInputPolyDataTypesTest.cxx
)

if (EMSCRIPTEN)
  # Currently crashing during link
  return()
endif()

CreateTestDriver(WebAssemblyInterface "${WebAssemblyInterface-Test_LIBRARIES}"
  "${WebAssemblyInterfaceTests}" )

itk_add_test(NAME itkWASMImageInterfaceTest
    COMMAND WebAssemblyInterfaceTestDriver
      --compare DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageInterfaceTest.mha
    itkWASMImageInterfaceTest
      DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageInterfaceTest.mha
)

itk_add_test(NAME itkWASMMeshInterfaceTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkWASMMeshInterfaceTest
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMMeshInterfaceTest.vtk
)

itk_add_test(NAME itkWASMPolyDataInterfaceTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkWASMPolyDataInterfaceTest
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMPolyDataInterfaceTest.vtk
)

itk_add_test(NAME itkWASMImageInterfaceNiftiTest
    COMMAND WebAssemblyInterfaceTestDriver
      --compare DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageInterfaceNiftiTest.nii.gz
    itkWASMImageInterfaceTest
      DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageInterfaceNiftiTest.nii.gz
)

itk_add_test(NAME itkWASMImageIOTest
    COMMAND WebAssemblyInterfaceTestDriver
      --compare DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIOTest.mha
      --compare DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIOTest.cbor.mha
    itkWASMImageIOTest
      DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIOTest.iwi
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIOTest.mha
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIOTest.iwi.cbor
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIOTest.cbor.mha
)

itk_add_test(NAME itkWASMImageIONiftiTest
    COMMAND WebAssemblyInterfaceTestDriver
      --compare DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIONiftiTest.mha
      --compare DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIONiftiTest.cbor.mha
    itkWASMImageIOTest
      DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIONiftiTest.iwi
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIONiftiTest.mha
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIONiftiTest.iwi.cbor
      ${ITK_TEST_OUTPUT_DIR}/itkWASMImageIONiftiTest.cbor.mha
)

itk_add_test(NAME itkWASMMeshIOTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkWASMMeshIOTest
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkWASMMeshIOTest.iwm
      ${ITK_TEST_OUTPUT_DIR}/itkWASMMeshIOTest.vtk
      ${ITK_TEST_OUTPUT_DIR}/itkWASMMeshIOTest.iwm.cbor
      ${ITK_TEST_OUTPUT_DIR}/itkWASMMeshIOTest.cbor.vtk
)

itk_add_test(NAME itkPipelineTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkPipelineTest
      DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineTest.mha
      ${CMAKE_CURRENT_SOURCE_DIR}/Input/itk-wasm-text.txt
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineTestOutputText.txt
      ${CMAKE_CURRENT_SOURCE_DIR}/Input/itk-wasm-text.txt
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineTestOutputBinary.bin
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineTestOutputMesh.vtk
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineTestOutputPolyData.vtk
)

itk_add_test(NAME itkPipelineMemoryIOTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkPipelineMemoryIOTest
      --memory-io
      DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineMemoryIOTest.mha
      ${CMAKE_CURRENT_SOURCE_DIR}/Input/itk-wasm-text.txt
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineMemoryIOTestOutputText.txt
      ${CMAKE_CURRENT_SOURCE_DIR}/Input/itk-wasm-text.txt
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineMemoryIOTestOutputBinary.bin
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineMemoryIOTestOutputMesh.vtk
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineMemoryIOTestOutputPolyData.vtk
)

itk_add_test(NAME itkPipelineInterfaceJSONTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkPipelineTest
      --interface-json
)

itk_add_test(NAME itkSupportInputImageTypesTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkSupportInputImageTypesTest
      DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkSupportInputImageTypesTest.mha
)

itk_add_test(NAME itkSupportInputImageTypesMemoryIOTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkSupportInputImageTypesMemoryIOTest
      DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkSupportInputImageTypesMemoryIOTest.mha
)

itk_add_test(NAME itkSupportInputMeshTypesTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkSupportInputMeshTypesTest
      DATA{Input/cow.iwm.cbor}
      ${ITK_TEST_OUTPUT_DIR}/itkSupportInputMeshTypesTest.iwm
)

itk_add_test(NAME itkSupportInputMeshTypesMemoryIOTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkSupportInputMeshTypesMemoryIOTest
      DATA{Input/cow.iwm.cbor}
      ${ITK_TEST_OUTPUT_DIR}/itkSupportInputMeshTypesMemoryIOTest.iwm
)

itk_add_test(NAME itkSupportInputPolyDataTypesTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkSupportInputPolyDataTypesTest
      DATA{Input/cow.iwm.cbor}
      ${ITK_TEST_OUTPUT_DIR}/itkSupportInputPolyDataTypesTest.iwm
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
