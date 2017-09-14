FROM dockcross/browser-asmjs:latest
MAINTAINER Insight Software Consortium <community@itk.org>

RUN mkdir -p /usr/src/ITKBridgeJavaScript-build
WORKDIR /usr/src

# 2017-07-29
ENV ITK_GIT_TAG 743e518e90fffb6e1fb2458dcf39a381e3e438e8
ENV CFLAGS="-Wno-warn-absolute-paths --memory-init-file 0 -s DISABLE_EXCEPTION_CATCHING=0 -s ALLOW_MEMORY_GROWTH=1"
ENV CXXFLAGS="${CFLAGS} -std=c++11"
RUN git clone https://github.com/InsightSoftwareConsortium/ITK.git && \
  cd ITK && \
  git checkout ${ITK_GIT_TAG} && \
  cd ../ && \
  mkdir ITK-build && \
  cd ITK-build && \
  cmake \
    -G Ninja \
    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
    -DCMAKE_INSTALL_PREFIX:PATH=/usr \
    -DBUILD_EXAMPLES:BOOL=OFF \
    -DBUILD_TESTING:BOOL=OFF \
    -DITK_LEGACY_REMOVE:BOOL=ON \
    -DITK_BUILD_DEFAULT_MODULES:BOOL=OFF \
    -DITKGroup_IO:BOOL=ON \
    -DModule_IOMINC:BOOL=ON \
    -DModule_IOMGH:BOOL=ON \
    -DModule_ITKImageFunction:BOOL=ON \
    ../ITK && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITK-build

ENV DEFAULT_DOCKCROSS_IMAGE insighttoolkit/bridgejavascript
WORKDIR /work
