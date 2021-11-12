itk-wasm
========

[![Build, test](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/build-test.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/build-test.yml)
[![CircleCI](https://img.shields.io/circleci/project/github/InsightSoftwareConsortium/itk-wasm/master.svg)](https://circleci.com/gh/InsightSoftwareConsortium/itk-wasm)
[![DOI](https://zenodo.org/badge/45812381.svg)](https://zenodo.org/badge/latestdoi/45812381)

*itk-wasm* combines [ITK](https://www.itk.org/) and
[WebAssembly](http://webassembly.org/) to enable high-performance spatial
analysis in a web browser, Node.js, and reproducible execution across
programming languages and hardware architectures.

The project provides tools to a) build C/C++ code to
[WebAssembly](http://webassembly.org/), b) bridge local filesystems,
JavaScript/Typescript data structures, and traditional file formats, c)
transfer data efficiently in and out of the WebAssembly runtime, and d)
asynchronous, parallel execution of processing pipelines in a worker pool.
*itk-wasm* can be used to execute [ITK](https://www.itk.org/),
[VTK](https://www.vtk.org/) or arbitrary C++ codes in the browser, on a
workstation / server with [Node.js](https://nodejs.org/), or standalone
execution and wrapped in [WASI](https://wasi.dev/) runtimes.

For more information, please see [the project
documentation](https://insightsoftwareconsortium.github.io/itk-wasm/).
