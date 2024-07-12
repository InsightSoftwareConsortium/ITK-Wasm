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
#ifndef itkImageToWasmImageFilter_hxx
#define itkImageToWasmImageFilter_hxx

#include "itkImageToWasmImageFilter.h"

#include "itkDefaultConvertPixelTraits.h"
#include "itkMetaDataDictionaryJSON.h"

#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"

#include "itkImageJSON.h"

// add the header for typeid
#include <typeinfo>

namespace itk
{

template <typename TImage>
ImageToWasmImageFilter<TImage>
::ImageToWasmImageFilter()
{
  this->SetNumberOfRequiredInputs(1);

  typename WasmImageType::Pointer output = static_cast<WasmImageType *>(this->MakeOutput(0).GetPointer());
  this->ProcessObject::SetNumberOfRequiredOutputs(1);
  this->ProcessObject::SetNthOutput(0, output.GetPointer());
}

template <typename TImage>
ProcessObject::DataObjectPointer
ImageToWasmImageFilter<TImage>
::MakeOutput(ProcessObject::DataObjectPointerArraySizeType)
{
  return WasmImageType::New().GetPointer();
}

template <typename TImage>
ProcessObject::DataObjectPointer
ImageToWasmImageFilter<TImage>
::MakeOutput(const ProcessObject::DataObjectIdentifierType &)
{
  return WasmImageType::New().GetPointer();
}

template <typename TImage>
auto
ImageToWasmImageFilter<TImage>
::GetOutput() -> WasmImageType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<WasmImageType *>(this->GetPrimaryOutput());
}

template <typename TImage>
auto
ImageToWasmImageFilter<TImage>
::GetOutput() const -> const WasmImageType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<const WasmImageType *>(this->GetPrimaryOutput());
}

template <typename TImage>
auto
ImageToWasmImageFilter<TImage>
::GetOutput(unsigned int idx) -> WasmImageType *
{
  auto * out = dynamic_cast<WasmImageType *>(this->ProcessObject::GetOutput(idx));

  if (out == nullptr && this->ProcessObject::GetOutput(idx) != nullptr)
  {
    itkWarningMacro(<< "Unable to convert output number " << idx << " to type " << typeid(WasmImageType).name());
  }
  return out;
}

template <typename TImage>
void
ImageToWasmImageFilter<TImage>
::SetInput(const ImageType * input)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(0, const_cast<ImageType *>(input));
}

template <typename TImage>
void
ImageToWasmImageFilter<TImage>
::SetInput(unsigned int index, const ImageType * image)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(index, const_cast<ImageType *>(image));
}

template <typename TImage>
const typename ImageToWasmImageFilter<TImage>::ImageType *
ImageToWasmImageFilter<TImage>
::GetInput()
{
  return itkDynamicCastInDebugMode<const ImageType *>(this->GetPrimaryInput());
}

template <typename TImage>
const typename ImageToWasmImageFilter<TImage>::ImageType *
ImageToWasmImageFilter<TImage>
::GetInput(unsigned int idx)
{
  return itkDynamicCastInDebugMode<const TImage *>(this->ProcessObject::GetInput(idx));
}

template <typename TImage>
void
ImageToWasmImageFilter<TImage>
::GenerateData()
{
  // Get the input and output pointers
  const ImageType * image = this->GetInput();
  WasmImageType * wasmImage = this->GetOutput();

  wasmImage->SetImage(image);

  constexpr bool inMemory = true;
  const ImageJSON imageJSON = imageToImageJSON<ImageType>(image, wasmImage, inMemory);
  std::string serialized{};
  auto ec = glz::write<glz::opts{ .prettify = true, .concatenate = false }>(imageJSON, serialized);
  if (ec)
  {
    itkExceptionMacro("Failed to serialize ImageJSON");
  }
  wasmImage->SetJSON(serialized);
}

template <typename TImage>
void
ImageToWasmImageFilter<TImage>
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}
} // end namespace itk

#endif
