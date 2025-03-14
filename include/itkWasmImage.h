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
#ifndef itkWasmImage_h
#define itkWasmImage_h

#include "itkWasmDataObject.h"

namespace itk
{
/**
 *\class WasmImage
 * \brief JSON representation for an itk::ImageBase
 *
 * JSON representation for an itk::ImageBase for interfacing across programming languages and runtimes.
 *
 * Pixel and Direction binary array buffer's are stored as strings with memory addresses or paths on disks or a virtual
 *filesystem.
 *
 * Arrays:
 *
 * - 0: Pixel buffer `data`
 * - 1: Orientation `direction`
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TImage>
class ITK_TEMPLATE_EXPORT WasmImage : public WasmDataObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(WasmImage);

  /** Standard class type aliases. */
  using Self = WasmImage;
  using Superclass = WasmDataObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  itkNewMacro(Self);
  /** Run-time type information (and related methods). */
  itkOverrideGetNameOfClassMacro(WasmImage);

  using ImageType = TImage;

  void
  SetImage(const ImageType * image)
  {
    this->SetDataObject(const_cast<ImageType *>(image));
  }

  const ImageType *
  GetImage() const
  {
    return static_cast<const ImageType *>(this->GetDataObject());
  }

protected:
  WasmImage() = default;
  ~WasmImage() override = default;
};

} // namespace itk

#endif
