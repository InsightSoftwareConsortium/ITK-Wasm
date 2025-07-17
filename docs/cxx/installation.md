# Installation

## Getting Started with create-itk-wasm

The best way to get started with ITK-Wasm C++ development is using `create-itk-wasm`, which scaffolds a complete development environment. This tool sets up:

- **Native C++ binary build** - Traditional compiled executables for development and testing
- **Docker Emscripten toolchain build** - WebAssembly compilation for browser environments
- **WASI toolchain build** - WebAssembly System Interface for server-side and Node.js execution
- **Binding infrastructure** - Automatic generation of TypeScript and Python language bindings

To create a new ITK-Wasm project, install Node.js and Docker, then run:

```sh
npx create-itk-wasm my-project
cd my-project
```

This creates a complete project structure with example pipelines and build configurations.

## C++ Architecture Overview

ITK-Wasm C++ pipelines are built on a robust architecture consisting of several key components:

### ITKWebAssemblyInterface Module

The core foundation is the `ITKWebAssemblyInterface` module, which provides:
- Serialization and deserialization of spatial data structures to/from WebAssembly memory
- Type-safe interfaces for images, meshes, point sets, and transforms
- Efficient data transfer mechanisms between WebAssembly and host environments

### CLI11 Integration

Command-line interfaces are built using [CLI11](https://github.com/CLIUtils/CLI11), providing:
- Modern C++ argument parsing
- Automatic help generation
- Type-safe parameter handling
- Consistent interface patterns across all pipelines

### Pipeline Structure

Each ITK-Wasm pipeline follows a standardized pattern:
1. Parse command-line arguments with CLI11
2. Load input data using ITKWebAssemblyInterface
3. Process data
4. Serialize outputs for return to the calling environment

## Learn More

For comprehensive technical details and research background, see the SciPy 2024 paper:

> McCormick, M., Elliott, P. (2024). ITK-Wasm: High-Performance Spatial Analysis Across Programming Languages and Hardware Architectures. Proceedings of the 23rd Python in Science Conference (SciPy 2024), 268-279. https://doi.org/10.25080/TCFJ5130

## Next Steps

For hands-on guidance on building your first ITK-Wasm pipeline, see [the tutorial Introduction](../tutorial/hello_world?id=introduction).
