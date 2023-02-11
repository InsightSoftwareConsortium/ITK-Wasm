Hello Pipeline World!

## Introduction

This example introduces the `itk::wasm::Pipeline`. An `itk::wasm::Pipeline` transforms elegant standalone C++ command line programs into powerful [WebAssembly](https://webassembly.org/) (Wasm) modules with a simple, efficient interface for execution in the browser, other programming languages, and on the command line.

Make sure to complete the [Hello World!](/tutorial/hello_world) example before you start your Hello Pipeline adventure.

## Write the code

First, let's create a new directory to house our project.

```sh
mkdir hello-pipeline
cd hello-pipeline
```

Let's write some code! Populate *hello-pipeline.cxx* first with the headers we need:

```cpp
#include "itkPipeline.h"
#include "itkInputImage.h"
#include "itkImage.h"
```

The *itkPipeline.h* and *itkInputImage.h* headers come from the itk-wasm *WebAssemblyInterface* [ITK module](https://www.kitware.com/advance-itk-with-modules/).

The *itkImage.h* header is [ITK](https://itk.org)'s standard n-dimensional image data structure.

Next, create a standard `main` C command line interface function and an `itk::wasm::Pipeline`:


```cpp
int main(int argc, char * argv[]) {
  // Create the pipeline for parsing arguments. Provide a description.
  itk::wasm::Pipeline pipeline("hello-pipeline", "A hello world itk::wasm::Pipeline", argc, argv);

  return EXIT_SUCCESS;
}
```

The `itk::wasm::Pipeline` extends the most-excellent [CLI11 modern C++ command line parser](https://github.com/CLIUtils/CLI11). In addition to all of CLI11's functionality, `itk::wasm::Pipeline`'s adds:

- Support for execution in Wasm modules along with command line execution
- Support for spatial data structures such as `Image`'s, `Mesh`'s, `PolyData`, and `Transform`'s
- Support for multiple dimensions and pixel types
- Colored help output

Add a standard CLI11 flag to the pipeline:

```cpp
  itk::wasm::Pipeline pipeline("hello-pipeline", "A hello world itk::wasm::Pipeline", argc, argv);


  bool quiet = false;
  pipeline.add_flag("-q,--quiet", quiet, "Do not print image information");
```

Add an input image argument to the pipeline:

```cpp
  pipeline.add_flag("-q,--quiet", quiet, "Do not print image information");


  constexpr unsigned int Dimension = 2;
  using PixelType = unsigned char;
  using ImageType = itk::Image<PixelType, Dimension>;

  // Add a input image argument.
  using InputImageType = itk::wasm::InputImage<ImageType>;
  InputImageType inputImage;
  pipeline.add_option("input-image", inputImage,
    "The input image")->required()->type_name("INPUT_IMAGE");
```

The `inputImage` variable is populated from the filesystem if built as a native executable or a WASI binary run from the command line. When running in the browser or in a wrapped language, `inputImage` is read from WebAssembly memory without file IO.

Parse the command line arguments with the `ITK_WASM_PARSE` macro:

```cpp
  pipeline.add_option("InputImage", inputImage,
    "The input image")->required()->type_name("INPUT_IMAGE");


  ITK_WASM_PARSE(pipeline);
```

If `-q` or `--quiet` is set, the `quiet` variable will be set to `true`. Missing or invalid arguments will print an error and exit. The `-h` and `--help` flags are automatically generated from pipeline arguments to print usage information.

Finally, run our pipeline:
```cpp
  std::cout << "Hello pipeline world!\n" << std::endl;

  if (!quiet)
  {
    // Obtain the itk::Image * from the itk::wasm::InputImage with `.Get()`.
    std::cout << "Input image: " << *inputImage.Get() << std::endl;
  }

  return EXIT_SUCCESS;
```

Next, provide a [CMake](https://cmake.org/) build configuration in *CMakeLists.txt*:

```cmake
cmake_minimum_required(VERSION 3.16)
project(hello-pipeline)

# Use C++17 or newer with itk-wasm
set(CMAKE_CXX_STANDARD 17)

# We always want to build against the WebAssemblyInterface module.
set(itk_components
  WebAssemblyInterface
  )
# WASI or native binaries
if (NOT EMSCRIPTEN)
  # WebAssemblyInterface supports the .iwi, .iwi.cbor itk-wasm format.
  # We can list other ITK IO modules to build against to support other
  # formats when building native executable or WASI WebAssembly.
  # However, this will bloat the size of the WASI WebAssembly binary, so
  # add them judiciously.
  set(itk_components
    WebAssemblyInterface
    ITKIOPNG
    # ITKImageIO # Adds support for all available image IO modules
    )
endif()
find_package(ITK REQUIRED
  COMPONENTS ${itk_components}
  )
include(${ITK_USE_FILE})

add_executable(hello-pipeline hello-pipeline.cxx)
target_link_libraries(hello-pipeline PUBLIC ${ITK_LIBRARIES})
```

## Create WebAssembly binary

[Build the WASI binary](../hello_world.html):

```sh
npx itk-wasm -i itkwasm/wasi build
```

## Run WebAssembly binary

Check the generated help output:

```sh
npx itk-wasm run hello-pipeline.wasi.wasm -- -- --help
```

![Hello pipeline help](./hello_pipeline.png)

The two `--`'s are to separate arguments for the Wasm module from arguments to the `itk-wasm` CLI and the WebAssembly interpreter.

Try running on an [example image](https://data.kitware.com/api/v1/file/63041ac8f64de9b9501e5a22/download).

```
> npx itk-wasm run hello-pipeline.wasi.wasm -- -- cthead1.png

Hello pipeline world!

Input image: Image (0x2b910)
  RTTI typeinfo:   itk::Image<unsigned char, 2u>
  Reference Count: 1
  Modified Time: 54
  Debug: Off
  Object Name:
  Observers:
    none
  Source: (none)
  Source output name: (none)
  Release Data: Off
  Data Released: False
  Global Release Data: Off
  PipelineMTime: 22
  UpdateMTime: 53
  RealTimeStamp: 0 seconds
  LargestPossibleRegion:
    Dimension: 2
    Index: [0, 0]
    Size: [256, 256]
  BufferedRegion:
    Dimension: 2
    Index: [0, 0]
    Size: [256, 256]
  RequestedRegion:
    Dimension: 2
    Index: [0, 0]
    Size: [256, 256]
  Spacing: [1, 1]
  Origin: [0, 0]
  Direction:
1 0
0 1

  IndexToPointMatrix:
1 0
0 1

  PointToIndexMatrix:
1 0
0 1

  Inverse Direction:
1 0
0 1

  PixelContainer:
    ImportImageContainer (0x2ba60)
      RTTI typeinfo:   itk::ImportImageContainer<unsigned long, unsigned char>
      Reference Count: 1
      Modified Time: 50
      Debug: Off
      Object Name:
      Observers:
        none
      Pointer: 0x2c070
      Container manages memory: true
      Size: 65536
      Capacity: 65536
```

And with the `--quiet` flag:

```
> npx itk-wasm run hello-pipeline.wasi.wasm -- -- --quiet cthead1.png

Hello pipeline world!
```

Congratulations! You just executed a C++ pipeline capable of processsing a scientific image in WebAssembly. 🎉
