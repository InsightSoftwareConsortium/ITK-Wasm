FROM insighttoolkit/itk-js-base:latest
MAINTAINER Insight Software Consortium <community@itk.org>

WORKDIR /

# 2018-01-31
ENV VTK_GIT_TAG 5e4514f0eba6190c678c61fe25c9b2240135bdcf
RUN git clone https://github.com/Kitware/VTK.git && \
  cd VTK && \
  git checkout ${VTK_GIT_TAG} && \
  cd ../ && \
  mkdir VTK-build && \
  cd VTK-build && \
  cmake \
    -G Ninja \
    -DCMAKE_BUILD_TYPE:STRING=Release \
    -DBUILD_SHARED_LIBS:BOOL=OFF \
    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
    -DCMAKE_INSTALL_PREFIX:PATH=/install-prefix \
    -DBUILD_EXAMPLES:BOOL=OFF \
    -DBUILD_TESTING:BOOL=OFF \
    ../VTK && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 VTK-build

RUN cd /ITK-build && \
  cmake \
    -DModule_ITKVtkGlue:BOOL=ON \
    -DVTK_DIR=/VTK-build \
    . && \
  ninja


ENV DEFAULT_DOCKCROSS_IMAGE kitware/itk-js-vtk
WORKDIR /work
