cmake_minimum_required(VERSION 2.8.2)
project(CLPExample1)

set(MODULE_NAME CLPExample1)

find_package(SlicerExecutionModel REQUIRED)
include(${SlicerExecutionModel_USE_FILE})

find_package(ITK REQUIRED)
set(ITK_NO_IO_FACTORY_REGISTER_MANAGER 1) # See Libs/ITKFactoryRegistration/CMakeLists.txt
include(${ITK_USE_FILE})

find_package(VTK REQUIRED)

#-----------------------------------------------------------------------------
set(MODULE_INCLUDE_DIRECTORIES
  )

set(MODULE_SRCS
  )

set(MODULE_TARGET_LIBRARIES
  ${ITK_LIBRARIES}
  ${VTK_LIBRARIES}
  )

#-----------------------------------------------------------------------------
SEMMacroBuildCLI(
  NAME ${MODULE_NAME}
  TARGET_LIBRARIES ${MODULE_TARGET_LIBRARIES}
  INCLUDE_DIRECTORIES ${MODULE_INCLUDE_DIRECTORIES}
  ADDITIONAL_SRCS ${MODULE_SRCS}
  )
