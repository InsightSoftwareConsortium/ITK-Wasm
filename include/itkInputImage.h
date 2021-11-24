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
#ifndef itkInputImage_h
#define itkInputImage_h

#include "itkPipeline.h"

#ifndef ITK_WASM_NO_FILESYSTEM_IO
#include "itkImageFileReader.h"
#endif
#ifndef ITK_WASM_NO_MEMORY_IO
#include "itkWASMImage.h"
#endif

namespace itk
{
namespace wasm
{

/**
 *\class InputImage
 * \brief Input image for an itk::wasm::Pipeline
 *
 * This image is read from the filesystem or memory when ITK_WASM_PARSE_ARGS is called.
 * 
 * Call `GetImage()` to get the TImage * to use an input to a pipeline.
 * 
 * \ingroup WebAssemblyInterface
 */
template <typename TImage>
class ITK_TEMPLATE_EXPORT InputImage
{
public:
  using ImageType = TImage;

  void SetImage(const ImageType * image) {
    this->m_Image = image;
  }

  const ImageType * GetImage() const {
    return this->m_Image.GetPointer();
  }

  InputImage() = default;
  ~InputImage() = default;
protected:
  typename TImage::ConstPointer m_Image;
};

template <typename TImage>
bool lexical_cast(const std::string &input, InputImage<TImage> &inputImage)
{
  if (wasm::Pipeline::GetUseMemoryIO())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    std::cout << "yes memory io" << std::endl;
#else
    return false;
#endif
  }
  else
  {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    auto image = itk::ReadImage<TImage>(input);
    inputImage.SetImage(image);
    std::cout << "no memory io" << std::endl;
#else
    return false;
#endif
  }
  std::cout << "called InputImage lexical cast" << std::endl;
  return true;
}

} // end namespace wasm
} // end namespace itk

#endif
