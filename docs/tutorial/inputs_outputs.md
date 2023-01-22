# Pipeline Inputs and Outputs

## Introduction

This example dives deeper into `itk::wasm::Pipeline` image inputs and outputs and how they are handled. We will create a pipeline to smooth an image with a median filter, run the Wasm from the command line, in Node.js.

Make sure to complete the [Hello Pipeline!](/tutorial/hello_pipeline) example before you start your filtering journey.

## Write the code

First, let's create a new directory to house our project.

```sh
mkdir inputs-outputs
cd inputs-outputs
```

Let's write some code! Populate *inputs-outputs.cxx* with the headers we need:

```cpp
#include "itkPipeline.h"
#include "itkInputImage.h"
#include "itkOutputImage.h"

#include "itkImage.h"
#include "itkMedianImageFilter.h"
```

The *itkImage.h* header is [ITK](https://itk.org)'s standard n-dimensional image data structure and the *itkMedianImageFilter.h* also comes from ITK.

The *itkPipeline.h*, *itkInputImage.h*, and *itkOutputImage.h* headers come from the itk-wasm *WebAssemblyInterface* ITK module. These will help process arguments, injest input images, and produce output images, respectively.

Next, create a standard `main` C command line interface function and an `itk::wasm::Pipeline`:

```cpp
int main(int argc, char * argv[]) {
  // Create the pipeline for parsing arguments. Provide a description.
  itk::wasm::Pipeline pipeline("median-filter", "Smooth an image with a median filter", argc, argv);

  return EXIT_SUCCESS;
}
```
Add options to the pipeline that define our inputs, outputs, and processing parameters.

```cpp
  itk::wasm::Pipeline pipeline("median-filter", "Smooth an image with a median filter", argc, argv);


  constexpr unsigned int Dimension = 2;
  using PixelType = unsigned char;
  using ImageType = itk::Image<PixelType, Dimension>;


  // Add a flag to specify the radius of the median filter.
  unsigned int radius = 1;
  pipeline.add_option("-r,--radius", radius, "Kernel radius in pixels");

  // Add a input image argument.
  using InputImageType = itk::wasm::InputImage<ImageType>;
  InputImageType inputImage;
  pipeline.add_option("input-image", inputImage,
    "The input image")->required()->type_name("INPUT_IMAGE");

  // Add an output image argument.
  using OutputImageType = itk::wasm::OutputImage<ImageType>;
  OutputImageType outputImage;
  pipeline.add_option("output-image", outputImage,
    "The output image")->required()->type_name("OUTPUT_IMAGE");
```

The `inputImage` variable is populated from the filesystem if built as a native executable or a WASI binary run from the command line. When running in the browser or in a wrapped language, `inputImage` is read from WebAssembly memory without file IO.

When the program completes, `outputImage` is written to the filesystem if built as a native executable or a WASI binary run from the command line. When running in the browser or in a wrapped language, `outputImage` is read from WebAssembly memory without file IO.

Parse the command line arguments with the `ITK_WASM_PARSE` macro:

```cpp
  pipeline.add_option("output-image", outputImage,
    "The output image")->required()->type_name("OUTPUT_IMAGE");


  ITK_WASM_PARSE(pipeline);
```

The `-h` and `--help` flags are automatically generated from pipeline arguments to print usage information.

![inputs-outputs help](./inputs_outputs_help.png)

Finally, process our data: 
```cpp
  using FilterType = itk::MedianImageFilter< ImageType, ImageType >;
  auto filter = FilterType::New();
  filter->SetInput(inputImage.Get());
  filter->SetRadius(radius);
  filter->Update();
```

Set the output image before the program completes:

```cpp
  outputImage.Set(filter->GetOutput());

  return EXIT_SUCCESS;
```

Next, provide a [CMake](https://cmake.org/) build configuration at *CMakeLists.txt*:

```cmake
cmake_minimum_required(VERSION 3.16)
project(inputs-outputs)

# Use C++17 or newer with itk-wasm
set(CMAKE_CXX_STANDARD 17)

# We always want to build against the WebAssemblyInterface module.
set(itk_components
  WebAssemblyInterface
  ITKSmoothing # provides itkMedianImageFilter.h
  )
# WASI or native binaries
if (NOT EMSCRIPTEN)
  # WebAssemblyInterface supports the .iwi, .iwi.cbor itk-wasm format.
  # We can list other ITK IO modules to build against to support other
  # formats when building native executable or WASI WebAssembly.
  # However, this will bloat the size of the WASI WebAssembly binary, so
  # add them judiciously.
  set(itk_components
    ${itk_components}
    ITKIOPNG
    # ITKImageIO # Adds support for all available image IO modules
    )
endif()
find_package(ITK REQUIRED
  COMPONENTS ${itk_components}
  )
include(${ITK_USE_FILE})

add_executable(inputs-outputs inputs-outputs.cxx)
target_link_libraries(inputs-outputs PUBLIC ${ITK_LIBRARIES})
```

## Create WebAssembly binary

[Build the WASI binary](/tutorial/hello_world):

```sh
npx itk-wasm -b wasi-build -i itkwasm/wasi build
```

Try running on an [example image](https://data.kitware.com/api/v1/file/63041ac8f64de9b9501e5a22/download).

## Run WebAssembly binary

```sh
npx itk-wasm -b wasi-build run inputs-outputs.wasi.wasm -- -- --radius 2 cthead1.png smoothed.png
```

The input image:

![input image](./cthead1.png)

has been smoothed:

![smoothed](./smoothed.png)

## Run in Node.js

To run in the Node.js JavaScript environment, first build with the Emscripten toolchain.

```sh
npx itk-wasm build
```

In our Node.js JavaScript script, we will load the file with dedicated image IO WebAssembly modules. These are provided by the `itk-image-io` package.

```sh
npm install -g itk-image-io
```

Next, let's create a script to call our pipeline, *index.mjs*. Start the script with our imports.

```js
import path from 'path'
import { runPipelineNode,
         readImageLocalFile,
         writeImageLocalFile,
         InterfaceTypes } from 'itk-wasm'
```

To switch from filesystem to WebAssembly memory IO, pass the `--memory-io` flag.  This flag is supported by all `itk::wasm::Pipeline`'s. Skip the two `node ./index.mjs` arguments from Node invocation.

```js
const args = ['--memory-io'].concat(process.argv.slice(2))
```

When using memory IO, interface types, such as images, are specified in the pipeline arguments with integer strings. Inputs and output integer identifiers both start counting from zero.

```js
// Assume we have input and output images as the last arguments
const inputFile = args[args.length-2]
const inputImage = await readImageLocalFile(inputFile)
// '0' is the index of the first input corresponding to the `inputs` array below
args[args.length-2] = '0'

const outputFile = args[args.length-1]
// '0' is the index of the first output corresponding to the `desiredOutputs` below
args[args.length-1] = '0'
```

Input images can be read with `readImageLocalFile`. We specify the type and value of the pipeline input interface types. With pipeline outputs, only the type is specified.

```js
const inputs = [
  { type: InterfaceTypes.Image, data: inputImage }
]
const desiredOutputs = [
  { type: InterfaceTypes.Image }
]
```

Run the pipeline.

```js
// Path to the Emscripten WebAssembly module without extensions
const pipelinePath = path.resolve('emscripten-build', 'inputs-outputs')
const { stdout, stderr, outputs } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
```

And handle the outputs.

```js
await writeImageLocalFile(outputs[0].data, outputFile)
```

Invoke the script.

```sh
npx node ./index.mjs --radius 2 ./cthead1.png smoothed.png
```

Congratulations! You just executed a C++ pipeline capable of processsing a scientific image in Node.js. 🎉