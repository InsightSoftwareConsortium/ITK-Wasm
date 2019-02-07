FROM insighttoolkit/itk-js:latest
MAINTAINER Insight Software Consortium <community@itk.org>

WORKDIR /

# 2019-01-03 + Emscripten patches
ENV VTK_GIT_TAG 519acbcfba80c6e3861a2254781371cd4dfc78fb
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
    -DVTK_RENDERING_BACKEND:STRING=None \
    -DModule_vtkIOExport:BOOL=ON \
    -DVTK_NO_PLATFORM_SOCKETS:BOOL=ON \
    ../VTK && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 VTK-build

# 2019-01-27
ENV ITKVtkGlue_GIT_TAG 6f3cd6fd697ec19ee12b65041537594bf295c0ca
RUN git clone https://github.com/InsightSoftwareConsortium/ITKVtkGlue.git && \
  cd ITKVtkGlue && \
  git checkout ${ITKVtkGlue_GIT_TAG} && \
  cd ../ && \
  mkdir ITKVtkGlue-build && \
  cd ITKVtkGlue-build && \
  cmake \
    -G Ninja \
    -DCMAKE_BUILD_TYPE:STRING=Release \
    -DBUILD_SHARED_LIBS:BOOL=OFF \
    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
    -DCMAKE_INSTALL_PREFIX:PATH=/install-prefix \
    -DBUILD_TESTING:BOOL=OFF \
    -DITK_DIR:PATH=/ITK-build \
    -DVTK_DIR:PATH=/VTK-build \
    ../ITKVtkGlue && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITK-build

# Build-time metadata as defined at http://label-schema.org
ARG BUILD_DATE
ARG IMAGE=kitware/itk-js-vtk
ARG VERSION=latest
ARG VCS_REF
ARG VCS_URL
LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.name=$IMAGE \
      org.label-schema.version=$VERSION \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url=$VCS_URL \
      org.label-schema.schema-version="1.0"
ENV DEFAULT_DOCKCROSS_IMAGE ${IMAGE}:${VERSION}
WORKDIR /work
WORKDIR /work
