/*=========================================================================
 *
 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         https://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/
#include "itkCommonEnums.h"
#include "itkImageIOBase.h"
#include "itkImage.h"
#include "itkOutputImageIO.h"
#include "itkOutputTextStream.h"

#ifndef IMAGE_IO_CLASS
#error "IMAGE_IO_CLASS definition must be provided"
#endif

#if IMAGE_IO_CLASS == 0
#include "itkPNGImageIO.h"
#elif IMAGE_IO_CLASS == 1
#include "itkMetaImageIO.h"
#elif IMAGE_IO_CLASS == 2
#include "itkTIFFImageIO.h"
#elif IMAGE_IO_CLASS == 3
#include "itkNiftiImageIO.h"
#elif IMAGE_IO_CLASS == 4
#include "itkJPEGImageIO.h"
#elif IMAGE_IO_CLASS == 5
#include "itkNrrdImageIO.h"
#elif IMAGE_IO_CLASS == 6
#include "itkVTKImageIO.h"
#elif IMAGE_IO_CLASS == 7
#include "itkBMPImageIO.h"
#elif IMAGE_IO_CLASS == 8
#include "itkHDF5ImageIO.h"
#elif IMAGE_IO_CLASS == 9
#include "itkMINCImageIO.h"
#elif IMAGE_IO_CLASS == 10
#include "itkMRCImageIO.h"
#elif IMAGE_IO_CLASS == 11
#include "itkLSMImageIO.h"
#elif IMAGE_IO_CLASS == 12
#include "itkMGHImageIO.h"
#elif IMAGE_IO_CLASS == 13
#include "itkBioRadImageIO.h"
#elif IMAGE_IO_CLASS == 14
#include "itkGiplImageIO.h"
#elif IMAGE_IO_CLASS == 15
#include "itkGE4ImageIO.h"
#elif IMAGE_IO_CLASS == 16
#include "itkGE5ImageIO.h"
#elif IMAGE_IO_CLASS == 17
#include "itkGEAdwImageIO.h"
#elif IMAGE_IO_CLASS == 18
#include "itkGDCMImageIO.h"
#elif IMAGE_IO_CLASS == 19
#include "itkScancoImageIO.h"
#elif IMAGE_IO_CLASS == 20
#include "itkFDFImageIO.h"
#elif IMAGE_IO_CLASS == 21
#elif IMAGE_IO_CLASS == 22
#include "itkWasmZstdImageIO.h"
#else
#error "Unsupported IMAGE_IO_CLASS"
#endif
#include "itkWasmImageIO.h"

#define VALUE(string) #string
#define TO_LITERAL(string) VALUE(string)

#include "itkPipeline.h"
#include "itkOutputImage.h"

template <typename TImageIO>
int readImage(const std::string & inputFileName, itk::wasm::OutputTextStream & couldRead, itk::wasm::OutputImageIO & outputImageIO, bool informationOnly)
{
  using ImageIOType = TImageIO;

  auto imageIO = ImageIOType::New();

  outputImageIO.SetInformationOnly(informationOnly);

  if (imageIO->CanReadFile(inputFileName.c_str()))
  {
    couldRead.Get() << "true\n";
  }
  else
  {
    couldRead.Get() << "false\n";
    return EXIT_FAILURE;
  }

  imageIO->SetFileName(inputFileName);
  outputImageIO.Set(imageIO);

  return EXIT_SUCCESS;
}

int main (int argc, char * argv[])
{
  const char * pipelineName = TO_LITERAL(IMAGE_IO_KEBAB_NAME) "-read-image";
  itk::wasm::Pipeline pipeline(pipelineName, "Read an image file format and convert it to the itk-wasm file format", argc, argv);

  std::string inputFileName;
  pipeline.add_option("serialized-image", inputFileName, "Input image serialized in the file format")->required()->check(CLI::ExistingFile)->type_name("INPUT_BINARY_FILE");

  itk::wasm::OutputTextStream couldRead;
  pipeline.add_option("could-read", couldRead, "Whether the input could be read. If false, the output image is not valid.")->type_name("OUTPUT_JSON");

  itk::wasm::OutputImageIO outputImageIO;
  pipeline.add_option("image", outputImageIO, "Output image")->required()->type_name("OUTPUT_IMAGE");

  bool informationOnly = false;
  pipeline.add_flag("-i,--information-only", informationOnly, "Only read image metadata -- do not read pixel data.");

  ITK_WASM_PARSE(pipeline);

#if IMAGE_IO_CLASS == 0
  return readImage<itk::PNGImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 1
  return readImage<itk::MetaImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 2
  return readImage<itk::TIFFImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 3
  return readImage<itk::NiftiImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 4
  return readImage<itk::JPEGImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 5
  return readImage<itk::NrrdImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 6
  return readImage<itk::VTKImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 7
  return readImage<itk::BMPImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 8
  return readImage<itk::HDF5ImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 9
  return readImage<itk::MINCImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 10
  return readImage<itk::MRCImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 11
  return readImage<itk::LSMImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 12
  return readImage<itk::MGHImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 13
  return readImage<itk::BioRadImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 14
  return readImage<itk::GiplImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 15
  return readImage<itk::GE4ImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 16
  return readImage<itk::GE5ImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 17
  return readImage<itk::GEAdwImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 18
  return readImage<itk::GDCMImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 19
  return readImage<itk::ScancoImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 20
  return readImage<itk::FDFImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 21
  return readImage<itk::WasmImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#elif IMAGE_IO_CLASS == 22
  return readImage<itk::WasmZstdImageIO>(inputFileName, couldRead, outputImageIO, informationOnly);
#else
#error "Unsupported IMAGE_IO_CLASS"
#endif
  return EXIT_SUCCESS;
}