title: Overview
---

*itk.js* combines [Emscripten](http://emscripten.org/) and [ITK](https://www.itk.org/) to enable high-performance spatial analysis in a JavaScript runtime environment.

The project provides tools to a) build C/C++ code to JavaScript ([asm.js](http://asmjs.org/)) and [WebAssembly](http://webassembly.org/), b) bridge local filesystems, native JavaScript data structures, and traditional file formats, c) transfer data efficently in and out of the Emscripten runtime, and d) asynchronously execute processing pipelines in a background thread. *itk.js* can be used to execute [ITK](https://www.itk.org/), [VTK](https://www.vtk.org/) or arbitrary C++ codes in the browser or on a workstation / server with Node.js.
