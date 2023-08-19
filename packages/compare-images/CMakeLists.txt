cmake_minimum_required(VERSION 3.16)
project(itkwasm-dicom)

set(CMAKE_CXX_STANDARD 17)

find_package(ITK REQUIRED
 COMPONENTS
   WebAssemblyInterface
   ITKImageIntensity
   ITKTestKernel
 )
include(${ITK_USE_FILE})

add_executable(compare-images compare-images.cxx)
target_link_libraries(compare-images PUBLIC ${ITK_LIBRARIES})