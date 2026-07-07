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

// Self-contained generator of the inputs for the resample-bounding-box CTests. It writes a fixed metadata image,
// a moving metadata image, and a transform entirely through the WebAssembly interface (.iwi / .iwt), so no
// image-format IO is required. The --case selector chooses which self-contained input set to emit; the default
// (2d-translation) preserves the original behavior. Each case's expected pipeline output is asserted, at double
// precision, by the in-process resample-bounding-box-test and mirrored by the TypeScript and Python suites.
//
//   --case 2d-translation (default):
//     fixed 16x16, spacing (2,2), origin (10,20)   -> physical span [10,40] x [20,50]
//     translation (10,5)                            -> transformed span [20,50] x [25,55]
//     moving 64x64, spacing (1,1), origin (0,0)     -> continuous index == physical
//     => corners min (20,25) max (50,55); with --padding 1: startIndex (19,24), size (33,33)
//
//   --case 3d-translation:
//     fixed 8x8x8, spacing (2,2,2), origin (10,20,30) -> physical span [10,24] x [20,34] x [30,44]
//     translation (10,5,3)                            -> transformed span [20,34] x [25,39] x [33,47]
//     moving 64x64x64, spacing (1,1,1), origin (0,0,0)
//     => corners min (20,25,33) max (34,39,47); with --padding 1: startIndex (19,24,32), size (17,17,17)
//
//   --case 2d-rotation:
//     fixed 20x10, spacing (1,1), origin (0,0)
//     affine rotation (cos 0.8, sin 0.6) about center (9.5,4.5), translation (10,10) -- non-axis-aligned corners
//     moving 64x64, spacing (1,1), origin (0,0)
//     => corners min (9.2,5.2) max (29.8,23.8); with --padding 1: startIndex (8,4), size (24,22)

#include "itkPipeline.h"
#include "itkOutputImage.h"
#include "itkOutputTransform.h"

#include "itkImage.h"
#include "itkTranslationTransform.h"
#include "itkAffineTransform.h"

#include <array>
#include <string>

namespace
{

// Build a metadata image (buffer allocated + zero-filled) with the given geometry and identity direction. The
// pipeline reads only the metadata, but a real, non-empty buffer keeps the .iwi writer's data array valid.
template <unsigned int VDimension>
typename itk::Image<uint8_t, VDimension>::Pointer
makeMetadataImage(const std::array<itk::SizeValueType, VDimension> & size,
                  const std::array<double, VDimension> &             spacing,
                  const std::array<double, VDimension> &             origin)
{
  using ImageType = itk::Image<uint8_t, VDimension>;
  auto                            image = ImageType::New();
  typename ImageType::SizeType    regionSize;
  typename ImageType::SpacingType imageSpacing;
  typename ImageType::PointType   imageOrigin;
  for (unsigned int d = 0; d < VDimension; ++d)
  {
    regionSize[d] = size[d];
    imageSpacing[d] = spacing[d];
    imageOrigin[d] = origin[d];
  }
  image->SetRegions(typename ImageType::RegionType(regionSize));
  image->SetSpacing(imageSpacing);
  image->SetOrigin(imageOrigin);
  image->Allocate();
  image->FillBuffer(0);
  return image;
}

int
runTranslation2D(itk::wasm::Pipeline & pipeline)
{
  using ImageType = itk::Image<uint8_t, 2>;
  using TransformType = itk::TranslationTransform<double, 2>;

  itk::wasm::OutputImage<ImageType> fixedImage;
  pipeline.add_option("fixed", fixedImage, "Output fixed metadata image")->required()->type_name("OUTPUT_IMAGE");
  itk::wasm::OutputImage<ImageType> movingImage;
  pipeline.add_option("moving", movingImage, "Output moving metadata image")->required()->type_name("OUTPUT_IMAGE");
  itk::wasm::OutputTransform<TransformType> transform;
  pipeline.add_option("transform", transform, "Output translation transform")->required()->type_name("OUTPUT_TRANSFORM");

  ITK_WASM_PARSE(pipeline);

  fixedImage.Set(makeMetadataImage<2>({ 16, 16 }, { 2.0, 2.0 }, { 10.0, 20.0 }));
  movingImage.Set(makeMetadataImage<2>({ 64, 64 }, { 1.0, 1.0 }, { 0.0, 0.0 }));

  auto                            translation = TransformType::New();
  TransformType::OutputVectorType offset;
  offset[0] = 10.0;
  offset[1] = 5.0;
  translation->SetOffset(offset);
  transform.Set(translation);

  return EXIT_SUCCESS;
}

int
runTranslation3D(itk::wasm::Pipeline & pipeline)
{
  using ImageType = itk::Image<uint8_t, 3>;
  using TransformType = itk::TranslationTransform<double, 3>;

  itk::wasm::OutputImage<ImageType> fixedImage;
  pipeline.add_option("fixed", fixedImage, "Output fixed metadata image")->required()->type_name("OUTPUT_IMAGE");
  itk::wasm::OutputImage<ImageType> movingImage;
  pipeline.add_option("moving", movingImage, "Output moving metadata image")->required()->type_name("OUTPUT_IMAGE");
  itk::wasm::OutputTransform<TransformType> transform;
  pipeline.add_option("transform", transform, "Output translation transform")->required()->type_name("OUTPUT_TRANSFORM");

  ITK_WASM_PARSE(pipeline);

  fixedImage.Set(makeMetadataImage<3>({ 8, 8, 8 }, { 2.0, 2.0, 2.0 }, { 10.0, 20.0, 30.0 }));
  movingImage.Set(makeMetadataImage<3>({ 64, 64, 64 }, { 1.0, 1.0, 1.0 }, { 0.0, 0.0, 0.0 }));

  auto                            translation = TransformType::New();
  TransformType::OutputVectorType offset;
  offset[0] = 10.0;
  offset[1] = 5.0;
  offset[2] = 3.0;
  translation->SetOffset(offset);
  transform.Set(translation);

  return EXIT_SUCCESS;
}

int
runRotation2D(itk::wasm::Pipeline & pipeline)
{
  using ImageType = itk::Image<uint8_t, 2>;
  using TransformType = itk::AffineTransform<double, 2>;

  itk::wasm::OutputImage<ImageType> fixedImage;
  pipeline.add_option("fixed", fixedImage, "Output fixed metadata image")->required()->type_name("OUTPUT_IMAGE");
  itk::wasm::OutputImage<ImageType> movingImage;
  pipeline.add_option("moving", movingImage, "Output moving metadata image")->required()->type_name("OUTPUT_IMAGE");
  itk::wasm::OutputTransform<TransformType> transform;
  pipeline.add_option("transform", transform, "Output affine rotation transform")->required()->type_name("OUTPUT_TRANSFORM");

  ITK_WASM_PARSE(pipeline);

  fixedImage.Set(makeMetadataImage<2>({ 20, 10 }, { 1.0, 1.0 }, { 0.0, 0.0 }));
  movingImage.Set(makeMetadataImage<2>({ 64, 64 }, { 1.0, 1.0 }, { 0.0, 0.0 }));

  // Rotation by (cos 0.8, sin 0.6) about the fixed grid center, then a translation to keep the region positive.
  auto                       affine = TransformType::New();
  TransformType::InputPointType center;
  center[0] = 9.5;
  center[1] = 4.5;
  affine->SetCenter(center);
  TransformType::MatrixType matrix;
  matrix(0, 0) = 0.8;
  matrix(0, 1) = -0.6;
  matrix(1, 0) = 0.6;
  matrix(1, 1) = 0.8;
  affine->SetMatrix(matrix);
  TransformType::OutputVectorType translation;
  translation[0] = 10.0;
  translation[1] = 10.0;
  affine->SetTranslation(translation);
  transform.Set(affine);

  return EXIT_SUCCESS;
}

} // namespace

int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline(
    "resample-bounding-box-generate-inputs", "Generate the inputs for the resample-bounding-box tests.", argc, argv);

  // Select which self-contained input set to emit. Scanned from argv directly (like the resample-bounding-box
  // dispatch) so the case is known before the per-case output options are declared for ITK_WASM_PARSE.
  std::string caseName = "2d-translation";
  const auto  argCount = pipeline.get_argc();
  const auto  argValues = pipeline.get_argv();
  for (int ii = 1; ii < argCount; ++ii)
  {
    const std::string arg(argValues[ii]);
    if ((arg == "-c" || arg == "--case") && ii + 1 < argCount)
    {
      caseName = argValues[ii + 1];
    }
    else if (arg.rfind("--case=", 0) == 0)
    {
      caseName = arg.substr(std::string("--case=").size());
    }
  }

  // Declare the selector so ITK_WASM_PARSE in the case runners accepts (and ignores) the consumed --case argument.
  std::string caseOption;
  pipeline.add_option(
    "-c,--case", caseOption, "Which input set to generate: 2d-translation (default), 3d-translation, 2d-rotation");

  if (caseName == "2d-translation")
  {
    return runTranslation2D(pipeline);
  }
  if (caseName == "3d-translation")
  {
    return runTranslation3D(pipeline);
  }
  if (caseName == "2d-rotation")
  {
    return runRotation2D(pipeline);
  }

  CLI::Error err(
    "Runtime error", "Unknown --case '" + caseName + "'. Use 2d-translation, 3d-translation, or 2d-rotation.", 1);
  return pipeline.exit(err);
}
