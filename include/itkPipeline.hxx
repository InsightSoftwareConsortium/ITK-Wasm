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
#ifndef itkPipeline_hxx
#define itkPipeline_hxx

#include "itkPipeline.h"
#ifndef ITK_WASM_NO_FILESYSTEM_IO
#include <rang.hpp>
#endif

namespace itk
{
namespace wasm
{

std::string
ITKFormatter
::make_description(const CLI::App * app) const
{
  // Based on GooFit
#ifndef ITK_WASM_NO_FILESYSTEM_IO
  std::cout << rang::fg::reset << rang::fgB::blue << rang::style::italic << rang::style::dim << "       Welcome to";
  // Just in case, for clang format:
  // clang-format off
  std::string splash = R"raw(
__/\\\\\\\\\\\__/\\\\\\\\\\\\\\\__/\\\________/\\\_        
_\/////\\\///__\///////\\\/////__\/\\\_____/\\\//__       
_____\/\\\___________\/\\\_______\/\\\__/\\\//_____      
  _____\/\\\___________\/\\\_______\/\\\\\\//\\\_____     
  _____\/\\\___________\/\\\_______\/\\\//_\//\\\____    
    _____\/\\\___________\/\\\_______\/\\\____\//\\\___   
    _____\/\\\___________\/\\\_______\/\\\_____\//\\\__  
      __/\\\\\\\\\\\_______\/\\\_______\/\\\______\//\\\_ 
      _\///////////________\///________\///________\///__
)raw";
  // clang-format on

  std::cout << rang::fg::reset << rang::style::bold;
  bool cur_yellow = false;
  for(int i = 0; i < splash.size(); i++) {
      const char splash_char = splash[i];
      bool is_letter = splash_char == '/' || splash_char == '\\';

      if(is_letter && !cur_yellow) {
          std::cout << rang::fg::reset << rang::fgB::yellow;
          cur_yellow = true;
      } else if(!is_letter && cur_yellow) {
          std::cout << rang::fg::reset << rang::fgB::blue;
          cur_yellow = false;
      }
      std::cout << splash[i];
      if(splash[i] == '\n')
          std::cout << std::flush;
  }
  std::cout << rang::style::reset << rang::bg::reset << rang::fg::reset;
  std::cout << std::endl;
#else
  std::cout << "       Welcome to ITK\n" << std::endl;
#endif
  return this->::CLI::Formatter::make_description(app);
}

Pipeline
::Pipeline(std::string description, int argc, char **argv):
  App(description)
{
  auto fmt = std::make_shared<ITKFormatter>();
  this->formatter(fmt);
}

auto
Pipeline
::exit(const CLI::Error &e) -> int
{
#ifndef ITK_WASM_NO_FILESYSTEM_IO
  std::cout << (e.get_exit_code() == 0 ? rang::fgB::blue : rang::fgB::red);
#endif
  int rval = CLI::App::exit(e);
#ifndef ITK_WASM_NO_FILESYSTEM_IO
  std::cout << rang::fg::reset;
#endif
  return rval;
}

Pipeline
::~Pipeline()
{

}

} // end namespace wasm
} // end namespace itk

#endif
