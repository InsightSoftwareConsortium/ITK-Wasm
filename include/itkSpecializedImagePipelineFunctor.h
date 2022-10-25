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
#ifndef itkSpecializedImagePipelineFunctor_h
#define itkSpecializedImagePipelineFunctor_h
#include "itkPipeline.h"
#include "itkImage.h"
#include "itkVectorImage.h"

namespace itk
{

namespace wasm
{

/** \class SpecializedImagePipelineFunctor
 *
 * \brief Internal class to dispatch for pipeline execution on itk::Image or itk::VectorImage.
 *
 * \ingroup ITKWebAssemblyInterface
*/
template<template <typename TImage> class TPipelineFunctor, unsigned int VDimension, typename TPixel>
class
SpecializedImagePipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using ImageType = itk::Image<TPixel, VDimension>;

    using PipelineType = TPipelineFunctor<ImageType>;
    return PipelineType()(pipeline);
  }
};

/** \class SpecializedImagePipelineFunctor
 *
 * \brief Internal class to dispatch for pipeline execution on itk::Image or itk::VectorImage.
 * 
 * \ingroup ITKWebAssemblyInterface
*/
template<template <typename TImage> class TPipelineFunctor, unsigned int VDimension, typename TComponent>
class
SpecializedImagePipelineFunctor<TPipelineFunctor, VDimension, itk::VariableLengthVector<TComponent>>
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using ImageType = itk::VectorImage<TComponent, VDimension>;

    using PipelineType = TPipelineFunctor<ImageType>;
    return PipelineType()(pipeline);
  }
};

} // end namespace wasm
} // end namespace itk

#endif
