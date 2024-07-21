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
  DATA{Input/negative_idx_base.mha}
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
  DATA{Baseline/web_worker_pool.cy.png}
  DATA{Baseline/negative_idx_padded.mha}
)

set(WebAssemblyInterfaceTests
  itkWasmImageInterfaceTest.cxx
  itkWasmVectorImageInterfaceTest.cxx
  itkWasmImageInterfaceWithNegativeIndexTest.cxx
  itkWasmMeshInterfaceTest.cxx
  itkWasmPolyDataInterfaceTest.cxx
  itkWasmImageIOTest.cxx
  itkWasmMeshIOTest.cxx
  itkWasmTransformIOTest.cxx
  itkPipelineTest.cxx
  itkPipelineMemoryIOTest.cxx
  itkSupportInputImageTypesTest.cxx
  itkSupportInputImageTypesMemoryIOTest.cxx
  itkSupportInputMeshTypesTest.cxx
  itkSupportInputMeshTypesMemoryIOTest.cxx
  itkSupportInputPolyDataTypesTest.cxx
  itkTransformJSONTest.cxx
  itkWasmTransformInterfaceTest.cxx
  itkWasmTransformInterfaceCompositeTest.cxx
)

if (EMSCRIPTEN)
  # Currently crashing during link
  return()
endif()

CreateTestDriver(WebAssemblyInterface "${WebAssemblyInterface-Test_LIBRARIES}"
  "${WebAssemblyInterfaceTests}" )

itk_add_test(NAME itkWasmImageInterfaceTest
    COMMAND WebAssemblyInterfaceTestDriver
      --compare DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageInterfaceTest.mha
    itkWasmImageInterfaceTest
      DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageInterfaceTest.mha
)

itk_add_test(NAME itkWasmVectorImageInterfaceTest
    COMMAND WebAssemblyInterfaceTestDriver
      --compare DATA{Input/apple.jpg}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmVectorImageInterfaceTest.mha
    itkWasmVectorImageInterfaceTest
      DATA{Input/apple.jpg}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmVectorImageInterfaceTest.mha
)

itk_add_test(NAME itkWasmImageInterfaceWithNegativeIndexTest
        COMMAND WebAssemblyInterfaceTestDriver
        --compare DATA{Baseline/negative_idx_padded.mha}
        ${ITK_TEST_OUTPUT_DIR}/itkWasmImageInterfaceWithNegativeIndexTest.mha
        itkWasmImageInterfaceWithNegativeIndexTest
        DATA{Input/negative_idx_base.mha}
        ${ITK_TEST_OUTPUT_DIR}/itkWasmImageInterfaceWithNegativeIndexTest.mha
)

itk_add_test(NAME itkWasmMeshInterfaceTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkWasmMeshInterfaceTest
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmMeshInterfaceTest.vtk
)

itk_add_test(NAME itkWasmPolyDataInterfaceTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkWasmPolyDataInterfaceTest
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmPolyDataInterfaceTest.vtk
)

itk_add_test(NAME itkWasmImageInterfaceNiftiTest
    COMMAND WebAssemblyInterfaceTestDriver
      --compare DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageInterfaceNiftiTest.nii.gz
    itkWasmImageInterfaceTest
      DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageInterfaceNiftiTest.nii.gz
)

itk_add_test(NAME itkWasmImageIOTest
    COMMAND WebAssemblyInterfaceTestDriver
      --compare DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageIOTest.mha
      --compare DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageIOTest.cbor.mha
    itkWasmImageIOTest
      DATA{Input/brainweb165a10f17.mha}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageIOTest.iwi
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageIOTest.mha
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageIOTest.iwi.cbor
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageIOTest.cbor.mha
)

itk_add_test(NAME itkWasmImageIONiftiTest
    COMMAND WebAssemblyInterfaceTestDriver
      --compare DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageIONiftiTest.mha
      --compare DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageIONiftiTest.cbor.mha
    itkWasmImageIOTest
      DATA{Input/r16slice.nii.gz}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageIONiftiTest.iwi
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageIONiftiTest.mha
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageIONiftiTest.iwi.cbor
      ${ITK_TEST_OUTPUT_DIR}/itkWasmImageIONiftiTest.cbor.mha
)

itk_add_test(NAME itkWasmMeshIOTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkWasmMeshIOTest
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmMeshIOTest.iwm
      ${ITK_TEST_OUTPUT_DIR}/itkWasmMeshIOTest.vtk
      ${ITK_TEST_OUTPUT_DIR}/itkWasmMeshIOTest.iwm.cbor
      ${ITK_TEST_OUTPUT_DIR}/itkWasmMeshIOTest.cbor.vtk
)

itk_add_test(NAME itkWasmTransformIOTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkWasmTransformIOTest
      DATA{Input/LinearTransform.h5}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformIOTest.iwt
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformIOTest.h5
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformIOTest.iwt.cbor
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformIOTest.cbor.h5
)

itk_add_test(NAME itkWasmTransformIOSequenceTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkWasmTransformIOTest
      DATA{Input/TransformSequence.h5}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformIOSequenceTest.iwt
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformIOSequenceTest.h5
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformIOSequenceTest.iwt.cbor
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformIOSequenceTest.cbor.h5
)

itk_add_test(NAME itkWasmTransformIOCompositeTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkWasmTransformIOTest
      DATA{Input/CompositeTransform.h5}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformIOCompositeTest.iwt
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformIOCompositeTest.h5
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformIOCompositeTest.iwt.cbor
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformIOCompositeTest.cbor.h5
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
      DATA{Input/LinearTransform.h5}
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineTestOutputTransform.h5
      DATA{Input/CompositeTransform.h5}
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineTestOutputCompositeTransform.h5
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineTestOutputPointSet.vtk
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
      DATA{Input/LinearTransform.h5}
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineMemoryIOTestOutputTransform.h5
      DATA{Input/CompositeTransform.h5}
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineMemoryIOTestOutputCompositeTransform.h5
      DATA{Input/cow.vtk}
      ${ITK_TEST_OUTPUT_DIR}/itkPipelineMemoryIOTestOutputPointSet.vtk
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

itk_add_test(NAME itkTransformJSONTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkTransformJSONTest
)

itk_add_test(NAME itkWasmTransformInterfaceTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkWasmTransformInterfaceTest
      DATA{Input/LinearTransform.h5}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformInterfaceTest.h5
)

itk_add_test(NAME itkWasmTransformInterfaceCompositeTest
    COMMAND WebAssemblyInterfaceTestDriver
    itkWasmTransformInterfaceCompositeTest
      DATA{Input/CompositeTransform.h5}
      ${ITK_TEST_OUTPUT_DIR}/itkWasmTransformInterfaceCompositeTest.h5
)

if(EMSCRIPTEN)
  # setjmp workaround
  set_property(TARGET WebAssemblyInterfaceTestDriver APPEND_STRING
    PROPERTY LINK_FLAGS " -s ERROR_ON_UNDEFINED_SYMBOLS=0"
  )
endif()
