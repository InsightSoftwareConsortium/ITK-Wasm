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
#include "itkCompositeTransform.h"
#include "itkRigid2DTransform.h"
#include "itkAffineTransform.h"
#include "itkOutputTransform.h"
#include "itkPipeline.h"
#include <cmath>

int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("composite-transform-test", "A test for creating and writing composite transforms", argc, argv);

  using ParametersValueType = float;
  constexpr unsigned int Dimension = 2;

  // Define transform types
  using CompositeTransformType = itk::CompositeTransform<ParametersValueType, Dimension>;
  using Rigid2DTransformType = itk::Rigid2DTransform<ParametersValueType>;
  using AffineTransformType = itk::AffineTransform<ParametersValueType, Dimension>;

  using OutputTransformType = itk::wasm::OutputTransform<CompositeTransformType>;
  OutputTransformType outputTransform;
  pipeline.add_option("output-transform", outputTransform, "The output composite transform")
    ->required()
    ->type_name("OUTPUT_TRANSFORM");

  ITK_WASM_PARSE(pipeline);

  // Create the composite transform
  auto compositeTransform = CompositeTransformType::New();

  // Create and configure the Rigid2D transform
  auto rigid2DTransform = Rigid2DTransformType::New();

  // Set non-trivial parameters for Rigid2D transform
  // Rotation angle of 30 degrees and translation of (5.0, 3.0)
  const double angleInRadians = 30.0 * std::atan(1.0) * 4.0 / 180.0; // 30 degrees to radians
  rigid2DTransform->SetAngle(angleInRadians);

  // Set center of rotation (fixed parameters)
  Rigid2DTransformType::CenterType center;
  center[0] = 10.0;
  center[1] = 15.0;
  rigid2DTransform->SetCenter(center);

  // Set translation
  Rigid2DTransformType::TranslationType translation;
  translation[0] = 5.0;
  translation[1] = 3.0;
  rigid2DTransform->SetTranslation(translation);

  // Create and configure the Affine transform
  auto affineTransform = AffineTransformType::New();

  // Set non-trivial matrix parameters
  AffineTransformType::MatrixType matrix;
  matrix(0, 0) = 1.2; matrix(0, 1) = 0.3;
  matrix(1, 0) = 0.2; matrix(1, 1) = 1.1;
  affineTransform->SetMatrix(matrix);

  // Set center for affine transform (fixed parameters)
  AffineTransformType::CenterType affineCenter;
  affineCenter[0] = 20.0;
  affineCenter[1] = 25.0;
  affineTransform->SetCenter(affineCenter);

  // Set translation for affine transform
  AffineTransformType::TranslationType affineTranslation;
  affineTranslation[0] = 2.5;
  affineTranslation[1] = 1.8;
  affineTransform->SetTranslation(affineTranslation);

  // Add transforms to the composite transform in order
  compositeTransform->AppendTransform(rigid2DTransform);
  compositeTransform->AppendTransform(affineTransform);

  // Optimize the composite transform
  compositeTransform->FlattenTransformQueue();

  // Set the output transform
  outputTransform.Set(compositeTransform);

  return EXIT_SUCCESS;
}
