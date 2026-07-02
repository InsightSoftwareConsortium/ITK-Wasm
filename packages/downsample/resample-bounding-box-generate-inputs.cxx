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

// Self-contained generator of the inputs for the resample-bounding-box test. It writes a fixed
// metadata image, a moving metadata image, and a translation transform entirely through the
// WebAssembly interface (.iwi / .iwt), so no image-format IO is required.
//
// With these inputs and --padding 1, resample-bounding-box should report, for the moving image:
//   fixed grid:           16 x 16, spacing (2, 2), origin (10, 20)  -> physical span [10,40] x [20,50]
//   translation (10, 5):  transformed span [20,50] x [25,55]
//   moving grid:          64 x 64, spacing (1, 1), origin (0, 0)    -> continuous index == physical
//   => corners:           min (20, 25), max (50, 55)
//   => paddedStartIndex:  (19, 24), paddedSize: (33, 33)
//   => paddedCorners:     min (19, 24), max (51, 56)

#include "itkPipeline.h"
#include "itkOutputImage.h"
#include "itkOutputTransform.h"

#include "itkImage.h"
#include "itkTranslationTransform.h"

int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline(
    "resample-bounding-box-generate-inputs", "Generate the inputs for the resample-bounding-box test.", argc, argv);

  using ImageType = itk::Image<uint8_t, 2>;
  using TransformType = itk::TranslationTransform<double, 2>;

  itk::wasm::OutputImage<ImageType> fixedImage;
  pipeline.add_option("fixed", fixedImage, "Output fixed metadata image")->required()->type_name("OUTPUT_IMAGE");

  itk::wasm::OutputImage<ImageType> movingImage;
  pipeline.add_option("moving", movingImage, "Output moving metadata image")->required()->type_name("OUTPUT_IMAGE");

  itk::wasm::OutputTransform<TransformType> transform;
  pipeline.add_option("transform", transform, "Output translation transform")
    ->required()
    ->type_name("OUTPUT_TRANSFORM");

  ITK_WASM_PARSE(pipeline);

  // Fixed image: 16 x 16, spacing (2, 2), non-zero origin (10, 20), identity direction.
  auto                  fixed = ImageType::New();
  ImageType::SizeType   fixedSize = { { 16, 16 } };
  ImageType::RegionType fixedRegion(fixedSize);
  fixed->SetRegions(fixedRegion);
  ImageType::SpacingType fixedSpacing;
  fixedSpacing[0] = 2.0;
  fixedSpacing[1] = 2.0;
  fixed->SetSpacing(fixedSpacing);
  ImageType::PointType fixedOrigin;
  fixedOrigin[0] = 10.0;
  fixedOrigin[1] = 20.0;
  fixed->SetOrigin(fixedOrigin);
  fixed->Allocate();
  fixed->FillBuffer(0);
  fixedImage.Set(fixed);

  // Moving image: 64 x 64, spacing (1, 1), origin (0, 0); large enough to contain the transformed grid.
  auto                  moving = ImageType::New();
  ImageType::SizeType   movingSize = { { 64, 64 } };
  ImageType::RegionType movingRegion(movingSize);
  moving->SetRegions(movingRegion);
  ImageType::SpacingType movingSpacing;
  movingSpacing.Fill(1.0);
  moving->SetSpacing(movingSpacing);
  ImageType::PointType movingOrigin;
  movingOrigin.Fill(0.0);
  moving->SetOrigin(movingOrigin);
  moving->Allocate();
  moving->FillBuffer(0);
  movingImage.Set(moving);

  // Translation transform: (10, 5).
  auto                            translation = TransformType::New();
  TransformType::OutputVectorType offset;
  offset[0] = 10.0;
  offset[1] = 5.0;
  translation->SetOffset(offset);
  transform.Set(translation);

  return EXIT_SUCCESS;
}
