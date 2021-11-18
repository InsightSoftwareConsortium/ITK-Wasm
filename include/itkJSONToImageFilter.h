/*=========================================================================
 *
 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/
#ifndef itkJSONToImageFilter_h
#define itkJSONToImageFilter_h

#include "itkProcessObject.h"
#include "itkImageJSON.h"

namespace itk
{
/**
 *\class JSONToImageFilter
 * \brief Convert an ImageJSON to an Image object.
 * 
 * \ingroup WebAssemblyInterface
 */
template <typename TImage>
class ITK_TEMPLATE_EXPORT JSONToImageFilter : public ProcessObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(JSONToImageFilter);

  /** Standard class type aliases. */
  using Self = JSONToImageFilter;
  using Superclass = ProcessObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(JSONToImageFilter, ProcessObject);

  using DataObjectIdentifierType = Superclass::DataObjectIdentifierType;
  using DataObjectPointerArraySizeType = Superclass::DataObjectPointerArraySizeType;

  using ImageType = TImage;
  using ImageJSONType = ImageJSON<ImageType>;

  /** Set/Get the path input of this process object.  */
  using Superclass::SetInput;
  virtual void
  SetInput(const ImageJSONType * image);

  virtual void
  SetInput(unsigned int, const ImageJSONType * image);

  const ImageJSONType *
  GetInput();

  const ImageJSONType *
  GetInput(unsigned int idx);

  ImageType *
  GetOutput();
  const ImageType *
  GetOutput() const;

  ImageType *
  GetOutput(unsigned int idx);

protected:
  JSONToImageFilter();
  ~JSONToImageFilter() override = default;

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
#  include "itkJSONToImageFilter.hxx"
#endif

#endif
