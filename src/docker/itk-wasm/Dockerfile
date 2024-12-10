ARG BASE_IMAGE=quay.io/itkwasm/emscripten-base
ARG BASE_TAG=latest

FROM $BASE_IMAGE:$BASE_TAG
MAINTAINER Insight Software Consortium <community@itk.org>
ARG BASE_IMAGE
ARG CMAKE_BUILD_TYPE=Release

WORKDIR /

ADD ITKWebAssemblyInterfaceModuleCopy /ITKWebAssemblyInterface
COPY ITKWebAssemblyInterface.cmake /usr/src/
RUN mv /usr/src/ITKWebAssemblyInterface.cmake /usr/share/cmake-*/Modules/
# For non-default toolchain file location
ENV EMSCRIPTEN /emsdk/upstream/emscripten
ENV CMAKE_TOOLCHAIN_FILE_DOCKCROSS ${CMAKE_TOOLCHAIN_FILE}
ENV CMAKE_TOOLCHAIN_FILE_ITK /ITKWebAssemblyInterface/toolchain.cmake
RUN cp ${CMAKE_TOOLCHAIN_FILE} ${CMAKE_TOOLCHAIN_FILE_ITK}
RUN echo "include(ITKWebAssemblyInterface)" >> ${CMAKE_TOOLCHAIN_FILE_ITK}
ENV CMAKE_TOOLCHAIN_FILE ${CMAKE_TOOLCHAIN_FILE_ITK}
RUN cd / && \
  mkdir ITKWebAssemblyInterface-build && \
  cd ITKWebAssemblyInterface-build && \
  cmake \
    -G Ninja \
    -DITK_DIR=/ITK-build \
    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE_DOCKCROSS} \
    -DBUILD_TESTING:BOOL=OFF \
    -DSANITIZE:BOOL=OFF \
    -DSIZEOF_SIZE_T:INTERNAL=4 \
    -DITK_WASM_NO_INTERFACE_LINK:BOOL=1 \
    -DCMAKE_BUILD_TYPE:STRING=$CMAKE_BUILD_TYPE \
      ../ITKWebAssemblyInterface && \
  ninja && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITKWebAssemblyInterface-build && \
  chmod -R 777 /ITK-build

COPY web-build /usr/local/bin/

# Trigger Emscripten to cache builds of required system libraries
ADD median-filter-pipelineCopy /median-filter-pipelineCopy
RUN if [ $BASE_IMAGE = "itkwasm/emscripten-base" ]; then cd /median-filter-pipelineCopy; /usr/local/bin/web-build emscripten-build -DCMAKE_EXE_LINKER_FLAGS='-flto=thin -s DISABLE_EXCEPTION_CATCHING=0'; rm -rf ./web-build; /usr/local/bin/web-build emscripten-build -DCMAKE_EXE_LINKER_FLAGS='-flto -s DISABLE_EXCEPTION_CATCHING=0'; rm -rf ./web-build; /usr/local/bin/web-build emscripten-build -DCMAKE_EXE_LINKER_FLAGS='-fno-lto -s DISABLE_EXCEPTION_CATCHING=1'; rm -rf /median-filter-pipelineCopy; chmod -R 777 /emsdk/upstream/emscripten/cache; fi

# Build-time metadata as defined at http://label-schema.org
ARG BUILD_DATE
ARG IMAGE=quay.io/itkwasm/emscripten
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
