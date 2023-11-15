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
#ifndef downsampleSigma_h
#define downsampleSigma_h

#include <vector>
#include <cmath>

using SigmaType = std::vector<double>;
using ShrinkFactorsType = std::vector<unsigned int>;

/** Compute gaussian kernel sigma values in pixel units for downsampling.
 *
 * sigma = sqrt((k^2 - 1^2)/(2*sqrt(2*ln(2)))^2)
 *
 *   Ref https://discourse.itk.org/t/resampling-to-isotropic-signal-processing-theory/1403/16
 *   https://doi.org/10.1007/978-3-319-24571-3_81
 *   http://discovery.ucl.ac.uk/1469251/1/scale-factor-point-5.pdf
 *
 *   Note: If input spacing / output sigma in physical units, the function would be
 *      sigma = sqrt((input_spacing^2*(k^2 - 1^2))/(2*sqrt(2*ln(2)))^2)
 */
auto downsampleSigma(const ShrinkFactorsType & scaleFactors)
{
  // denominator = (2 * ((2 * math.log(2)) ** 0.5)) ** 2
  constexpr double denominator = 5.545177444479562; 

  SigmaType sigma;
  for (auto k : scaleFactors)
  {
    sigma.push_back(std::sqrt((k * k - 1) / denominator));
  }

  return sigma;
}

#endif