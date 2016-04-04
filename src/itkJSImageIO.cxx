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

#include "itkJSImageIO.h"

#include <emscripten.h>
#include <emscripten/bind.h>

// Binding code
EMSCRIPTEN_BINDINGS(itk_js_image_io) {
  emscripten::class_<itkJSImageIO>("itkJSImageIO")
    .constructor<>()
    .function("ReadImage", &itkJSImageIO::ReadImage)
    .function("WriteImage", &itkJSImageIO::WriteImage)
    .function("MountDirectory", &itkJSImageIO::MountDirectory)
    .function("GetBufferPointer", &itkJSImageIO::GetBufferPointer)
    .function("GetBufferSize", &itkJSImageIO::GetBufferSize)
    .function("GetSpacing", &itkJSImageIO::GetSpacing)
    .function("GetOrigin", &itkJSImageIO::GetOrigin)
    .function("GetDimensions", &itkJSImageIO::GetDimensions)
    .function("GetDirection", &itkJSImageIO::GetDirection)
    .function("GetPixel", &itkJSImageIO::GetPixel)
    .function("GetPixelWorld", &itkJSImageIO::GetPixelWorld)
    .function("SetPixel", &itkJSImageIO::SetPixel)
    .function("GetDataType", &itkJSImageIO::GetDataType)
    ;
}

itkJSImageIO::itkJSImageIO()
{
  m_Interpolate = InterpolateFunctionType::New();
}

/*
* This function should only be used when executing in NODE.js in order to mount
* a path in the filesystem to the NODEFS system.
*
*/
void
itkJSImageIO
::MountDirectory(const std::string filename)
{

  EM_ASM_({

      var path = require('path');
      var fs = require('fs');
      var allpath = Pointer_stringify($0);
      var dir = path.dirname(allpath);

      var currentdir = path.sep;
      var sepdirs = dir.split(path.sep);

      for(var i = 0; i < sepdirs.length; i++){
        currentdir += sepdirs[i];
        try{
          FS.mkdir(currentdir);
        }catch(e){
          //console.error(e);
        }
        currentdir += path.sep;
      }
      try{
        FS.mount(NODEFS, { root: currentdir }, dir);
      }catch(e){
        //console.error(e);
      }

    }, filename.c_str()
  );

}

/*
* This function reads an image from the NODEFS or IDBS system and sets up the different attributes in itkJSImageIO
* If executing in the browser, you must save the image first using FS.write(filename, buffer).
* If executing inside NODE.js use mound directory with the image filename.
*/
void
itkJSImageIO
::ReadImage(std::string filename)
{
  try
    {
    ImageFileReader::Pointer reader = ImageFileReader::New();
    reader->SetFileName(filename.c_str());
    reader->Update();

    this->SetImage(reader->GetOutput());
    m_Interpolate->SetInputImage(this->GetImage());

    this->Initialize();
    }
  catch( itk::ExceptionObject & err )
    {
    std::cerr << err << std::endl;
    }
}

/*
* After reading the image, it sets up different attributes
*/
void
itkJSImageIO
::Initialize()
{
  SizeType size = this->GetImage()->GetLargestPossibleRegion().GetSize();
  m_Size[0] = size[0];
  m_Size[1] = size[1];
  m_Size[2] = size[2];

  SpacingType spacing = this->GetImage()->GetSpacing();
  m_Spacing[0] = spacing[0];
  m_Spacing[1] = spacing[1];
  m_Spacing[2] = spacing[2];

  PointType origin = this->GetImage()->GetOrigin();
  m_Origin[0] = origin[0];
  m_Origin[1] = origin[1];
  m_Origin[2] = origin[2];

  DirectionType direction = this->GetImage()->GetDirection();
  for(int i = 0; i < Dimension*Dimension; ++i)
    {
    m_Direction[i] = direction[i/Dimension][i%Dimension];
    }
}

/*
* Write the image to to the file system.
*/
void
itkJSImageIO
::WriteImage(std::string filename)
{
  try
    {

    ImageFileWriter::Pointer writer = ImageFileWriter::New();
    writer->SetFileName(filename.c_str());
    writer->SetInput(this->GetImage());
    writer->Update();
    }
  catch(itk::ExceptionObject & err)
    {
    std::cerr << err << std::endl;
    }
}
