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
#ifndef itkWasmImageToImageFilter_h
#define itkWasmImageToImageFilter_h

#include "itkProcessObject.h"
#include "itkWasmImage.h"

namespace itk
{
/**
 *\class WasmImageToImageFilter
 * \brief Convert an WasmImage to an Image object.
 *
 * TImage must match the type stored in the JSON representation or an exception will be shown.
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TImage>
class ITK_TEMPLATE_EXPORT WasmImageToImageFilter : public ProcessObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(WasmImageToImageFilter);

  /** Standard class type aliases. */
  using Self = WasmImageToImageFilter;
  using Superclass = ProcessObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkOverrideGetNameOfClassMacro(WasmImageToImageFilter);

  using DataObjectIdentifierType = Superclass::DataObjectIdentifierType;
  using DataObjectPointerArraySizeType = Superclass::DataObjectPointerArraySizeType;

  using ImageType = TImage;
  using WasmImageType = WasmImage<ImageType>;

  /** Set/Get the path input of this process object.  */
  using Superclass::SetInput;
  virtual void
  SetInput(const WasmImageType * image);

  virtual void
  SetInput(unsigned int, const WasmImageType * image);

  const WasmImageType *
  GetInput();

  const WasmImageType *
  GetInput(unsigned int idx);

  ImageType *
  GetOutput();
  const ImageType *
  GetOutput() const;

  ImageType *
  GetOutput(unsigned int idx);

protected:
  WasmImageToImageFilter();
  ~WasmImageToImageFilter() override = default;

  ProcessObject::DataObjectPointer
  MakeOutput(ProcessObject::DataObjectPointerArraySizeType idx) override;
  ProcessObject::DataObjectPointer
  MakeOutput(const ProcessObject::DataObjectIdentifierType &) override;

  void
  GenerateOutputInformation() override
  {} // do nothing
  void
  GenerateData() override;

  void
  PrintSelf(std::ostream & os, Indent indent) const override;
};
} // end namespace itk

#ifndef ITK_MANUAL_INSTANTIATION
#  include "itkWasmImageToImageFilter.hxx"
#endif

#endif
