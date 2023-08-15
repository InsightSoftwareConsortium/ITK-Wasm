# API Overview

This documentation provides more detailed information about the *itk-wasm* JavaScript and TypeScript interface.

The **Interface Types** section describes data structures produced and consumed
by both the *Input/Output* and *Processing Pipelines* functions.

The **Input/Output** sections describes functions who facilitate reading and
writing data from the local filesystem, when executed in the Node.js runtime,
or from native browser data types, encountered when executed in a web browser
JavaScript runtime.

The **Processing Pipelines** sections describes how to execute processing
pipelines written as C/C++ command line executables in Node.js or the browser.

```{toctree}
:maxdepth: 1
:caption: 🌐 JavaScript/TypeScript

browser_io.md
browser_pipelines.md
node_io.md
node_pipelines.md
```