/*=========================================================================
 *
 *  Copyright Insight Software Consortium
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
#ifndef itkJSImageIO_h
#define itkJSImageIO_h

#include <itkImage.h>
#include <itkImageFileReader.h>
#include <itkImageFileWriter.h>
#include <itkLinearInterpolateImageFunction.h>


class itkJSImageIO
{
public:
  static const int Dimension = 3;
  typedef unsigned short                         PixelType;
  typedef itk::Image< PixelType, Dimension >     InputImageType;
  typedef typename InputImageType::Pointer       InputImagePointerType;
  typedef typename InputImageType::IndexType     InputImageIndexType;
  typedef typename InputImageType::SpacingType   SpacingType;
  typedef typename InputImageType::PointType     PointType;
  typedef typename InputImageType::RegionType    RegionType;
  typedef typename InputImageType::SizeType      SizeType;
  typedef typename InputImageType::DirectionType DirectionType;

  typedef itk::ImageFileReader< InputImageType > ImageFileReader;
  typedef itk::ImageFileWriter< InputImageType > ImageFileWriter;

  typedef itk::LinearInterpolateImageFunction< InputImageType > InterpolateFunctionType;
  typedef typename InterpolateFunctionType::Pointer InterpolateFunctionPointerType;

  itkJSImageIO();

  void Initialize();

  void MountDirectory(const std::string filename);

  void ReadImage(std::string filename);

  void WriteImage(std::string filename);

  int GetBufferPointer()
  {
    int buffer = (int)this->GetImage()->GetBufferPointer();
    return buffer/sizeof(PixelType);
  }

  int GetBufferSize()
  {
    return (int)this->GetImage()->GetPixelContainer()->Size();
  }

  int GetSpacing()
  {
    int ptr = (int)((int)(m_Spacing))/sizeof(double);
    return ptr;
  }

  int GetOrigin()
  {
    int ptr = (int)((int)m_Origin)/sizeof(double);
    return ptr;
  }

  int GetPixel(int i, int j, int k)
  {
    InputImageIndexType index;
    index[0] = i;
    index[1] = j;
    index[2] = k;
    return this->GetImage()->GetPixel(index);
  }

  int GetPixelWorld(double x, double y, double z)
  {
    PointType point;
    point[0] = x;
    point[1] = y;
    point[2] = z;
    return this->GetInterpolator()->Evaluate(point);
  }

  void SetPixel(int x, int y, int z, int value)
  {
    InputImageIndexType index;
    index[0] = x;
    index[1] = y;
    index[2] = z;
    this->GetImage()->SetPixel(index, value);
  }

  int GetDimensions()
  {
    int ptr = (int)((int)m_Size)/sizeof(int);
    return ptr;
  }

  int GetDirection()
  {
    int ptr = (int)((int)m_Direction)/sizeof(double);
    return ptr;
  }

  int GetDataType()
  {
    if(typeid(PixelType).name() == typeid(unsigned short).name()){
      return 512;
    }
    return 16;
  }

  InputImagePointerType GetImage() const { return m_Image; }
  void SetImage(InputImagePointerType image){ m_Image = image; }

  InterpolateFunctionPointerType GetInterpolator() const { return m_Interpolate; }
  void SetInterpolator(InterpolateFunctionPointerType interpolate){ m_Interpolate = interpolate; }

private:
  std::string m_Filename;
  InputImagePointerType m_Image;
  double m_Spacing[3];
  double m_Origin[3];
  double m_Direction[9];
  int m_Size[3];

  InterpolateFunctionPointerType m_Interpolate;
};

#endif
