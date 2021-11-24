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
#ifndef itkWASMOutputImage_h
#define itkWASMOutputImage_h

#ifndef ITK_WASM_NO_FILESYSTEM_IO
#include "itkImageFileWriter.h"
#endif

namespace itk
{
/**
 *\class WASMOutputImage
 * \brief Output image for an itk::wasm::Pipeline
 *
 * This image is written to the filesystem or memory when it goes out of scope.
 * 
 * Call `GetImage()` to get the TImage * to use an input to a pipeline.
 * 
 * \ingroup WebAssemblyInterface
 */
template <typename TImage>
class ITK_TEMPLATE_EXPORT WASMOutputImage
{
public:
  using ImageType = TImage;

  void SetImage(const ImageType * image) {
    this->m_Image = image;
  }

  const ImageType * GetImage() const {
    return this->m_Image.GetPointer();
  }

  void SetUseMemoryIO(bool useMemoryIO)
  {
    this->m_UseMemoryIO = useMemoryIO;
  }

  void SetIdentifier(const std::string & identifier)
  {
    this->m_Identifier = identifier;
  }

  WASMOutputImage() = default;
  ~WASMOutputImage() {
    if(m_UseMemoryIO)
    {

    }
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    else
    {
    if (!this->m_Image.IsNull())
      {
      itk::WriteImage(this->m_Image, this->m_Identifier);
      }
    }
#else
    else
    {
    throw std::logic_error("Filesystem IO not supported");
    }
#endif
  }
protected:
  typename TImage::ConstPointer m_Image;

  bool m_UseMemoryIO{false};

  std::string m_Identifier;
};
} // namespace itk

#endif
