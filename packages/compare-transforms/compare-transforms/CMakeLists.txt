add_executable(compare-transforms compare-transforms.cxx)
target_link_libraries(compare-transforms PUBLIC ${ITK_LIBRARIES})

add_test(NAME compare-transforms-help COMMAND compare-transforms --help)

add_test(NAME compare-transforms-same
  COMMAND compare-transforms
  ${CMAKE_CURRENT_SOURCE_DIR}/../test/data/input/translation.iwt.cbor
  same-metrics.json
  --baseline-transforms ${CMAKE_CURRENT_SOURCE_DIR}/../test/data/input/translation.iwt.cbor
)
