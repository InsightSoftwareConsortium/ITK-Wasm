/*=========================================================================

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

#include "itkPipeline.h"
#include "itkInputImage.h"
#include "itkOutputImage.h"
#include "itkOutputTextStream.h"

#include "itkImage.h"
#include "itkRescaleIntensityImageFilter.h"
#include "itkExtractImageFilter.h"
#include "itkTestingComparisonImageFilter.h"

#define ITK_TEST_DIMENSION_MAX 6

int main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("compare-images", "Compare images with a tolerance for regression testing.", argc, argv);

  ITK_WASM_PARSE(pipeline);

  return EXIT_SUCCESS;
}
