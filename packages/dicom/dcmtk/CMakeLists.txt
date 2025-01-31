find_package(ITK REQUIRED
  COMPONENTS
    ITKDCMTK
    ITKLabelMap
    ITKThresholding
    WebAssemblyInterface
  )
include(${ITK_USE_FILE})

if(POLICY CMP0077)
  set(CMAKE_POLICY_DEFAULT_CMP0077 NEW)
endif()

include(FetchContent)
# DCMQI
# 2024-12-10 master
set(DCMQI_GIT_REPOSITORY "https://github.com/QIICR/dcmqi")
set(DCMQI_GIT_TAG        "011237d7c2d294ef960c31384d92db23d826f7bc")
option(DCMQI_SUPERBUILD "Build dcmqi as a superbuild" OFF)
set(DCMQI_BUILD_SLICER_EXTENSION OFF)
set(DCMQI_BUILD_APPS OFF)
set(DCMQI_BUILD_DOC OFF)
#set(DCMQI_BUILD_TESTING ON)
set(DCMTK_DIR ${ITK_DIR}/Modules/ThirdParty/DCMTK/ITKDCMTK_ExtProject-build)
FetchContent_Declare(
  dcmqi_lib
  GIT_REPOSITORY ${DCMQI_GIT_REPOSITORY}
  GIT_TAG ${DCMQI_GIT_TAG}
)

FetchContent_MakeAvailable(dcmqi_lib)
#set(BUILD_TESTING OFF)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/bin)

if(WASI)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_PTHREAD")
  set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINK_FLAGS} -lwasi-emulated-process-clocks -lwasi-emulated-pthread")
endif()

list(APPEND DCMQI_INCLUDE_DIRS "${dcmqi_lib_SOURCE_DIR}/include" "${dcmqi_lib_SOURCE_DIR}/jsoncpp" "${dcmqi_lib_BINARY_DIR}/include")
include_directories(${DCMQI_INCLUDE_DIRS})

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

add_executable(read-segmentation read-segmentation.cxx)
target_link_libraries(read-segmentation PUBLIC ${ITK_LIBRARIES} dcmqi)

add_executable(read-overlapping-segmentation read-overlapping-segmentation.cxx)
target_link_libraries(read-overlapping-segmentation PUBLIC ${ITK_LIBRARIES} dcmqi)

add_executable(write-segmentation write-segmentation.cxx)
target_link_libraries(write-segmentation PUBLIC ${ITK_LIBRARIES} dcmqi)

add_executable(write-multi-segmentation write-multi-segmentation.cxx)
target_link_libraries(write-multi-segmentation PUBLIC ${ITK_LIBRARIES} dcmqi)

add_executable(write-overlapping-segmentation write-overlapping-segmentation.cxx)
target_link_libraries(write-overlapping-segmentation PUBLIC ${ITK_LIBRARIES} dcmqi)

if (NOT WASI)
  # Currently crashing on exit?

set(TEMP_DIR ${CMAKE_BINARY_DIR}/Testing/Temporary)
set(BASELINE ${dcmqi_lib_SOURCE_DIR}/data/segmentations)
set(JSON_DIR ${dcmqi_lib_SOURCE_DIR}/doc/examples)
set(DICOM_DIR ${BASELINE}/ct-3slice)
set(MODULE_TEMP_DIR ${TEMP_DIR}/seg)
make_directory(${MODULE_TEMP_DIR})

set(dcm2itk read-segmentation)
set(itk2dcm write-segmentation)

add_test(
  NAME write-segmentation_help
  COMMAND write-segmentation --help
)

add_test(
  NAME write-multi-segmentation_help
  COMMAND write-multi-segmentation --help
)

add_test(
  NAME write-overlapping-segmentation_help
  COMMAND write-overlapping-segmentation --help
)

add_test(
  NAME write-segmentation_makeSEG
  COMMAND write-segmentation
    ${BASELINE}/liver_seg.nrrd
    ${JSON_DIR}/seg-example.json
    ${CMAKE_CURRENT_SOURCE_DIR}/../test/data/output/write-read-overlapping-segmentation-output_makeSEG.dcm
    --ref-dicom-series ${dcmqi_lib_SOURCE_DIR}/data/segmentations/ct-3slice/01.dcm
                       ${dcmqi_lib_SOURCE_DIR}/data/segmentations/ct-3slice/02.dcm
                       ${dcmqi_lib_SOURCE_DIR}/data/segmentations/ct-3slice/03.dcm
)

add_test(
  NAME write-multi-segmentation_makeSEG_merged_segment_files_from_partial_overlap
  COMMAND write-multi-segmentation
    ${dcmqi_lib_SOURCE_DIR}/doc/examples/seg-example_partial_overlaps.json
    ${CMAKE_CURRENT_SOURCE_DIR}/../test/data/output/partial_overlaps.dcm
    --ref-dicom-series ${dcmqi_lib_SOURCE_DIR}/data/segmentations/ct-3slice/01.dcm ${dcmqi_lib_SOURCE_DIR}/data/segmentations/ct-3slice/02.dcm ${dcmqi_lib_SOURCE_DIR}/data/segmentations/ct-3slice/03.dcm
    --seg-images ${BASELINE}/partial_overlaps-1.nrrd ${BASELINE}/partial_overlaps-2.nrrd ${BASELINE}/partial_overlaps-3.nrrd
    -l
)

add_test(
  NAME write-multi-segmentation_makeSEG_multiple_segment_files
  COMMAND write-multi-segmentation
    ${dcmqi_lib_SOURCE_DIR}/doc/examples/seg-example_multiple_segments.json
    ${MODULE_TEMP_DIR}/liver_heart_seg.dcm
    --ref-dicom-series ${DICOM_DIR}/01.dcm ${DICOM_DIR}/02.dcm ${DICOM_DIR}/03.dcm
    --seg-images ${BASELINE}/liver_seg.nrrd ${BASELINE}/spine_seg.nrrd ${BASELINE}/heart_seg.nrrd
)

add_test(
    NAME write-multi-segmentation_makeSEG_multiple_segment_files_reordered
    COMMAND write-multi-segmentation
      ${dcmqi_lib_SOURCE_DIR}/doc/examples/seg-example_multiple_segments_reordered.json
      ${MODULE_TEMP_DIR}/liver_heart_seg_reordered.dcm
      --ref-dicom-series ${DICOM_DIR}/01.dcm ${DICOM_DIR}/02.dcm ${DICOM_DIR}/03.dcm
      --seg-images ${BASELINE}/heart_seg.nrrd ${BASELINE}/liver_seg.nrrd ${BASELINE}/spine_seg.nrrd
)

add_test(
  NAME read-segmentation_help
  COMMAND read-segmentation --help
)

add_test(
  NAME read-overlapping-segmentation_help
  COMMAND read-overlapping-segmentation --help
)

add_test(
  NAME read-segmentation_makeNRRD
  COMMAND
    read-segmentation
    ${dcmqi_lib_SOURCE_DIR}/data/segmentations/liver.dcm
    ${MODULE_TEMP_DIR}/makeNRRD-1.nrrd
    ${MODULE_TEMP_DIR}/makeNRRD-1.json
  )

add_test(
  NAME ${dcm2itk}_makeNRRD_merged_segment_files_from_partial_overlaps
  COMMAND
    ${dcm2itk}
    ${BASELINE}/partial_overlaps.dcm
    ${MODULE_TEMP_DIR}/makeNRRD_merged_segment_files_from_partial_overlaps.nrrd
    ${MODULE_TEMP_DIR}/makeNRRD_merged_segment_files_from_partial_overlaps.json
)

set(TEST_SEG_SIZES 24x38x3 23x38x3)

foreach(seg_size ${TEST_SEG_SIZES})

  add_test(
    NAME ${itk2dcm}_makeSEG_${seg_size}
    COMMAND ${itk2dcm}
      ${BASELINE}/${seg_size}/nrrd/label.nrrd
      ${dcmqi_lib_SOURCE_DIR}/doc/examples/seg-example.json
      ${MODULE_TEMP_DIR}/${seg_size}_seg.dcm
      --ref-dicom-series
        ${BASELINE}/${seg_size}/image/IMG0001.dcm
        ${BASELINE}/${seg_size}/image/IMG0002.dcm
        ${BASELINE}/${seg_size}/image/IMG0003.dcm
    )

  add_test(
    NAME ${dcm2itk}_makeNRRD_${seg_size}
    COMMAND ${dcm2itk}
      ${MODULE_TEMP_DIR}/${seg_size}_seg.dcm
      ${MODULE_TEMP_DIR}/${seg_size}.nrrd
      ${MODULE_TEMP_DIR}/${seg_size}.json
    )

  set_tests_properties(${dcm2itk}_makeNRRD_${seg_size}
    PROPERTIES DEPENDS ${itk2dcm}_makeSEG_${seg_size}
    )

endforeach()

endif() # wasi guard

# Plastimatch
find_package(ITK REQUIRED
  COMPONENTS
    ITKDCMTK
    ITKImageIntensity
    ITKDistanceMap
    ITKRegistrationCommon
    WebAssemblyInterface
  )
# Todo: fix invocation of the dockcross/ITK-Wasm wasm-compatible CMake CheckTypeSize
if (EMSCRIPTEN OR WASI)
  set(CMAKE_SIZEOF_SIZE_T 4 CACHE STRING "Size of size_t")
  set(CMAKE_SIZEOF_UINT 4 CACHE STRING "Size of unsigned int")
  set(CMAKE_SIZEOF_ULONG 4 CACHE STRING "Size of unsigned long")
  set(CMAKE_SIZEOF_ULONGLONG 8 CACHE STRING "Size of unsigned long long")
  set(HAVE_CMAKE_SIZEOF_SIZE_T TRUE CACHE STRING "Have size of size_t")
  set(HAVE_CMAKE_SIZEOF_UINT TRUE CACHE STRING "Have size of unsigned int")
  set(HAVE_CMAKE_SIZEOF_ULONG TRUE CACHE STRING "Have size of unsigned long")
  set(HAVE_CMAKE_SIZEOF_ULONGLONG TRUE CACHE STRING "Have size of unsigned long long")
endif()
# set(PLM_GIT_REPOSITORY "https://github.com/InsightSoftwareConsortium/plastimatch")
# set(PLM_GIT_TAG        "5036f97b213d37a0a07dd232c827fb5f35049ae4")
# set(PLM_GIT_REPOSITORY "/home/matt/src/plastimatch")
set(PLM_GIT_REPOSITORY "https://github.com/thewtex/plastimatch")
set(PLM_GIT_TAG        "origin/itk-wasm")
option(PLM_CONFIG_ENABLE_DCMTK "Enable DCMTK support" ON)
option(PLM_CONFIG_ENABLE_OPENMP "Enable OpenMP support" OFF)
option(PLM_CONFIG_ENABLE_OPENCL "Enable OpenCL support" OFF)
option(PLM_CONFIG_ENABLE_CUDA "Enable CUDA support" OFF)
option(PLM_CONFIG_ENABLE_PLASTIMATCH "Enable Plastimatch" OFF)
option(PLM_CONFIG_ENABLE_QT "Enable Qt support" OFF)
option(PLM_CONFIG_ENABLE_CLI "Enable CLI support" OFF)
option(PLM_CONFIG_ENABLE_CLP "Enable CLP support" OFF)
option(PLM_CONFIG_ENABLE_DOSE "Enable dose calculation" OFF)
option(PLM_CONFIG_ENABLE_RECONSTRUCT "Enable reconstruction" OFF)
option(PLM_CONFIG_ENABLE_REGISTER "Enable registration" OFF)
option(PLM_CONFIG_ENABLE_SEGMENT "Enable segmentation" OFF)
option(PLM_CONFIG_ENABLE_STANDALONE "Enable standalone build" OFF)
option(PLM_CONFIG_ENABLE_TEST "Enable testing" OFF)
set(PLM_SYSTEM_ITK YES CACHE BOOL "Use system ITK")
set(PLM_SYSTEM_DCMTK YES CACHE BOOL "Use system DCMTK")
option(PLM_BUILD_TESTING "Build tests" OFF)
set(DCMTK_DIR ${ITK_DIR}/Modules/ThirdParty/DCMTK/ITKDCMTK_ExtProject-build)
FetchContent_Declare(
  plastimatch_lib
  GIT_REPOSITORY ${PLM_GIT_REPOSITORY}
  GIT_TAG ${PLM_GIT_TAG}
)
FetchContent_MakeAvailable(plastimatch_lib)

add_executable(write-rt-struct write-rt-struct.cxx)
target_link_libraries(write-rt-struct PUBLIC ${ITK_LIBRARIES} plmbase)

if (NOT WASI) # currently crashes on exit

add_test(
  NAME write-rt-struct-help
  COMMAND write-rt-struct --help
)

add_test(
  NAME write-rt-struct-synth-lung-1
  COMMAND write-rt-struct
    ${CMAKE_CURRENT_SOURCE_DIR}/../test/data/input/rt-struct/synth-lung-1.cxt
    ${CMAKE_CURRENT_BINARY_DIR}/synth-lung-1
)

endif()