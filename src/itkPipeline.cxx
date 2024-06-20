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
#include "itkPipeline.h"
#ifndef ITK_WASM_NO_FILESYSTEM_IO
#include <rang.hpp>
#endif
#include "CLI/Formatter.hpp"

namespace itk
{
namespace wasm
{

Pipeline
::Pipeline(std::string name, std::string description, int argc, char **argv):
  App(description, name),
  m_argc(argc),
  m_argv(argv),
  m_Version("0.1.0")
{
  this->footer("Enjoy ITK!");

  this->positionals_at_end(false);

  this->add_flag("--memory-io", m_UseMemoryIO, "Use itk-wasm memory IO")->group("");
  this->set_version_flag("--version", m_Version);

  // Set m_UseMemoryIO before it is used by other memory parsers
  this->preparse_callback([this](size_t arg)
   {
   m_UseMemoryIO = false;
    for (int ii = 0; ii < this->m_argc; ++ii)
    {
      const std::string arg(this->m_argv[ii]);
      if (arg == "--memory-io")
      {
        m_UseMemoryIO = true;
      }
    }
   });

#ifndef ITK_WASM_NO_FILESYSTEM_IO
#ifdef __wasi__
  rang::setControlMode(rang::control::Force);
#endif
#endif
}

auto
Pipeline
::exit(const CLI::Error &e) -> int
{
  /// Avoid printing anything if this is a CLI::RuntimeError
  if(e.get_name() == "RuntimeError")
      return e.get_exit_code();

  if(e.get_name() == "CallForHelp" || e.get_name() == "CallForAllHelp")
  {
    std::string outputString;
    if(e.get_name() == "CallForHelp")
    {
      outputString = help();
    }
    else
    {
      outputString = help("", CLI::AppFormatMode::All);
    }

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
    std::istringstream stream(outputString);
    std::string line;
    bool description = true;
    bool usage = false;
    bool positionals = false;
    bool options = false;
    bool optionGroup = false;
    while (std::getline(stream, line)) {
      if (description) {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::fgB::magenta << rang::style::bold;
#endif
        std::cout << line << std::endl;
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::fg::reset << rang::style::reset;
#endif
        description = false;
        usage = true;
      } else if(usage) {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::fg::yellow;
#endif
        std::cout << line.substr(0, 6);
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::fg::reset;
        std::cout << rang::fg::magenta;
#endif
        size_t optionsLoc = line.find("[OPTIONS]");
        size_t stop = optionsLoc - 7;
        size_t start = optionsLoc + 9;
        if (optionsLoc == std::string::npos)
        {
          stop = line.find("[");
          start = stop;
        }
        std::cout << line.substr(6, stop);
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::style::bold;
        std::cout << rang::fg::cyan;
#endif
        std::cout << line.substr(start);
        if (optionsLoc != std::string::npos)
        {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
          std::cout << rang::fg::green;
#endif
          // Options should be passed after positions so the pipeline can be
          // specialized based on the type of the positionals
          std::cout << " [OPTIONS]";
        }
        std::cout << std::endl;
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::fg::reset << rang::style::reset;
#endif
        usage = false;
      } else if(positionals) {
        if (line == "") {
          std::cout << line << std::endl;
          positionals = false;
        } else {
          const size_t loc = line.find(' ', 3);
#ifndef ITK_WASM_NO_FILESYSTEM_IO
          std::cout << rang::fg::cyan;
#endif
          std::cout << line.substr(0, loc);
#ifndef ITK_WASM_NO_FILESYSTEM_IO
          std::cout << rang::fg::reset;
#endif
          std::cout << line.substr(loc) << std::endl;
        }
      } else if(options) {
        if (line == "") {
          std::cout << line << std::endl;
          options = false;
        } else {
          const size_t loc = line.find(' ', 3);
#ifndef ITK_WASM_NO_FILESYSTEM_IO
          std::cout << rang::fg::green;
#endif
          std::cout << line.substr(0, loc);
#ifndef ITK_WASM_NO_FILESYSTEM_IO
          std::cout << rang::fg::reset;
#endif
          if (loc != std::string::npos) {
            std::cout << line.substr(loc) << std::endl;
          }
        }
      } else if(optionGroup) {
        if (line == "") {
          std::cout << line << std::endl;
          optionGroup = false;
        } else {
          const size_t loc = line.find(' ', 3);
#ifndef ITK_WASM_NO_FILESYSTEM_IO
          std::cout << rang::fg::green;
#endif
          std::cout << line.substr(0, loc);
#ifndef ITK_WASM_NO_FILESYSTEM_IO
          std::cout << rang::fg::reset;
#endif
          std::cout << line.substr(loc) << std::endl;
        }
      } else if(line == "Positionals:") {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::fg::yellow;
#endif
        std::cout << line << std::endl;
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::fg::reset;
#endif
        positionals = true;
      } else if(line == "Options:") {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::fg::yellow;
#endif
        std::cout << line << std::endl;
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::fg::reset;
#endif
        options = true;
      } else if(line == "Enjoy ITK!") {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::fg::blue << rang::style::italic;
#endif
        std::cout << line << std::endl;
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::fg::reset << rang::style::reset;
#endif
        options = true;
      } else if(!line.empty() && line.back() == ':') {
        optionGroup = true;
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::fg::yellow;
#endif
        std::cout << line << std::endl;
#ifndef ITK_WASM_NO_FILESYSTEM_IO
        std::cout << rang::fg::reset;
#endif
      } else {
        std::cout << line << std::endl;
      }
    }
    return e.get_exit_code();
  }
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

struct CLIOptionJSON
{
  std::string description;
  std::string name;
  std::string type;
  bool required;
  int itemsExpected;
  int itemsExpectedMin;
  int itemsExpectedMax;
  std::string defaultStr;
};

struct InterfaceJSON
{
  std::string description;
  std::string name;
  std::string version;
  std::vector<CLIOptionJSON> inputs;
  std::vector<CLIOptionJSON> outputs;
  std::vector<CLIOptionJSON> parameters;
};

void
Pipeline
::interface_json()
{

  InterfaceJSON interfaceJSON;

  interfaceJSON.description = this->get_description();
  interfaceJSON.name = this->get_name();
  interfaceJSON.version = this->version();

  for(CLI::Option *opt : this->get_options({})) {
    CLIOptionJSON optionJSON;
    optionJSON.description = opt->get_description();
    const auto singleName = opt->get_single_name();
    if (singleName == "help")
    {
      continue;
    }
    optionJSON.name = opt->get_single_name();
    optionJSON.required = opt->get_required();
    optionJSON.itemsExpected = opt->get_items_expected();
    optionJSON.itemsExpectedMin = opt->get_items_expected_min();
    optionJSON.itemsExpectedMax = opt->get_items_expected_max();
    optionJSON.type = opt->get_type_name();
    if (!opt->get_items_expected())
    {
      optionJSON.type = "BOOL";
    }
    if (!opt->get_default_str().empty())
    {
      optionJSON.defaultStr = opt->get_default_str();
    }
    if (opt->get_positional())
    {
      if (optionJSON.type.rfind("OUTPUT", 0) != std::string::npos)
      {
        interfaceJSON.outputs.push_back(optionJSON);
      }
      else
      {
        interfaceJSON.inputs.push_back(optionJSON);
      }
    }
    else
    {
      opt->capture_default_str();
      // flag
      if (!opt->get_items_expected())
      {
        opt->default_str("false");
      }
      if (!opt->get_default_str().empty())
      {
        optionJSON.defaultStr = opt->get_default_str();
      }
      interfaceJSON.parameters.push_back(optionJSON);
    }
  }

  std::string serialized{};
  auto ec = glz::write<glz::opts{ .prettify = true, .concatenate = false }>(interfaceJSON, serialized);
  if (ec)
  {
    const std::string descriptiveError = glz::format_error(ec, serialized);
    std::cerr << "Error during interface JSON serialization: " << descriptiveError << std::endl;
    return;
  }
  std::cout << serialized << std::endl;
}

bool Pipeline::m_UseMemoryIO{false};

} // end namespace wasm
} // end namespace itk

template <>
struct glz::meta<itk::wasm::CLIOptionJSON> {
   using T = itk::wasm::CLIOptionJSON;
   static constexpr auto value = glz::object(
      "description", &T::description,
      "name", &T::name,
      "type", &T::type,
      "required", &T::required,
      "itemsExpected", &T::itemsExpected,
      "itemsExpectedMin", &T::itemsExpectedMin,
      "itemsExpectedMax", &T::itemsExpectedMax,
      "default", &T::defaultStr
   );
};
