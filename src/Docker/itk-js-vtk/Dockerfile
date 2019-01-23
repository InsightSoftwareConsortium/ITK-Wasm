FROM insighttoolkit/itk-js:latest
MAINTAINER Insight Software Consortium <community@itk.org>

WORKDIR /

# 2019-01-03 + Emscripten patches
ENV VTK_GIT_TAG 6c0782ec65e2f911f108a02c7666d45337956cce
RUN git clone https://github.com/thewtex/VTK.git && \
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
    -DVTK_NO_PLATFORM_SOCKETS:BOOL=ON \
    ../VTK && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 VTK-build

RUN cd /ITK-build && \
  cmake \
    -DModule_ITKVtkGlue:BOOL=ON \
    -DVTK_DIR=/VTK-build \
    . && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITK-build


ENV DEFAULT_DOCKCROSS_IMAGE kitware/itk-js-vtk
WORKDIR /work
