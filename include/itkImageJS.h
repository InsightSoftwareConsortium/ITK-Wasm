
#ifndef _itkImageJS_
#define _itkImageJS_

#include <assert.h>
#include <stdio.h>
#include <string.h>
#include <emscripten.h>
#include <bind.h>

#include <itkImage.h>
#include <itkImageFileReader.h>
#include <itkImageFileWriter.h>
#include <itkLinearInterpolateImageFunction.h>

using namespace std;
using namespace emscripten;


class itkImageJS {
public:

  static const int dimension = 3;
  typedef unsigned short PixelType;
  typedef itk::Image< PixelType, dimension > InputImageType;
  typedef typename InputImageType::Pointer InputImagePointerType;
  typedef typename InputImageType::IndexType InputImageIndexType;
  typedef typename InputImageType::SpacingType SpacingType;
  typedef typename InputImageType::PointType PointType;
  typedef typename InputImageType::RegionType RegionType;
  typedef typename InputImageType::SizeType SizeType;
  typedef typename InputImageType::DirectionType DirectionType;
  
  typedef itk::ImageFileReader< InputImageType > ImageFileReader;
  typedef itk::ImageFileWriter< InputImageType > ImageFileWriter;

  typedef itk::LinearInterpolateImageFunction< InputImageType > InterpolateFunctionType;
  typedef typename InterpolateFunctionType::Pointer InterpolateFunctionPointerType;

  itkImageJS();

  void Initialize();

  void MountDirectory(const string filename);

  void ReadImage(string filename);

  void WriteImage(string filename);

  int GetBufferPointer(){
    int buffer = (int)this->GetImage()->GetBufferPointer();
    return buffer/sizeof(PixelType);
  }

  int GetBufferSize(){
    return (int)this->GetImage()->GetPixelContainer()->Size();
  }

  int GetSpacing(){
    int ptr = (int)((int)(m_Spacing))/sizeof(double);
    return ptr;
  }

  int GetOrigin(){
    int ptr = (int)((int)m_Origin)/sizeof(double);
    return ptr;
  }

  int GetPixel(int i, int j, int k){
    InputImageIndexType index;
    index[0] = i;
    index[1] = j;
    index[2] = k;
    return this->GetImage()->GetPixel(index);
  }

  int GetPixelWorld(double x, double y, double z){
    PointType point;
    point[0] = x;
    point[1] = y;
    point[2] = z;
    return this->GetInterpolator()->Evaluate(point);
  }

  void SetPixel(int x, int y, int z, int value){
    InputImageIndexType index;
    index[0] = x;
    index[1] = y;
    index[2] = z;
    this->GetImage()->SetPixel(index, value);
  }

  int GetDimensions(){
    int ptr = (int)((int)m_Size)/sizeof(int);
    return ptr;
  }

  int GetDirection(){
    int ptr = (int)((int)m_Direction)/sizeof(double);
    return ptr;
  }

  int GetDataType(){
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
  string m_Filename;
  InputImagePointerType m_Image;
  double m_Spacing[3];
  double m_Origin[3];
  double m_Direction[9];
  int m_Size[3];

  InterpolateFunctionPointerType m_Interpolate;
};

#endif