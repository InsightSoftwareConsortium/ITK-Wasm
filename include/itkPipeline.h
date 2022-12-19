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
#ifndef itkPipeline_h
#define itkPipeline_h

#include <CLI/App.hpp>
#include <CLI/Config.hpp>
#include <CLI/Error.hpp>

#include "itkMacro.h"
#include "itkImage.h"
#include "itkVectorImage.h"

#include "rapidjson/document.h"

#include "WebAssemblyInterfaceExport.h"


// Short circuit help output without raising an exception (currently not
// available in WASI)
#define ITK_WASM_PARSE(pipeline) \
    try { \
        const auto iwpArgc = (pipeline).get_argc(); \
        const auto iwpArgv = (pipeline).get_argv(); \
        for (int ii = 0; ii < iwpArgc; ++ii) \
          { \
            const std::string arg(iwpArgv[ii]); \
            if (arg == "-h" || arg == "--help") \
            { \
              (pipeline).exit(CLI::CallForAllHelp()); \
              std::exit(0); \
            } \
            if (arg == "--interface-json") \
            { \
              (pipeline).interface_json(); \
              std::exit(0); \
            } \
          } \
        (pipeline).parse(); \
    } catch(const CLI::ParseError &e) { \
        return (pipeline).exit(e); \
    }

// Parse options while allowing extra flags, not exiting with help flags, and clearning parse state after finished.
// Use this to parse some positionals or options before all options have been added.
#define ITK_WASM_PRE_PARSE(pipeline) \
    try { \
        (pipeline).set_help_flag(); \
        (pipeline).allow_extras(true); \
        (pipeline).parse(); \
    } catch(const CLI::CallForHelp &e) { \
    } catch(const CLI::CallForAllHelp &e) { \
    } catch(const CLI::ParseError &e) { \
        return (pipeline).exit(e); \
    } \
    (pipeline).allow_extras(false); \
    (pipeline).set_help_flag("-h,--help", "Print this help message and exit"); \
    (pipeline).clear();

#define ITK_WASM_CATCH_EXCEPTION(pipeline, command) \
  try \
  { \
    command; \
  } \
  catch (const itk::ExceptionObject & excp) \
  { \
    std::ostringstream ostrm; \
    ostrm << excp; \
    ostrm << "  In " __FILE__ ", line " << __LINE__ << std::endl; \
    CLI::Error err("Runtime error", ostrm.str(), 1); \
    return (pipeline).exit(err); \
  } \
  catch (const std::exception & excp) \
  { \
    std::ostringstream ostrm; \
    ostrm << excp.what(); \
    ostrm << "  In " __FILE__ ", line " << __LINE__ << std::endl; \
    CLI::Error err("Runtime error", ostrm.str(), 1); \
    return (pipeline).exit(err); \
  }

namespace itk
{
namespace wasm
{

// Importing into the itk namespace the main classes from CLI11
using CLI::App;
using CLI::ExistingDirectory;
using CLI::ExistingFile;
using CLI::ExitCodes;
using CLI::FileError;
using CLI::NonexistentPath;
using CLI::Option;
using CLI::ParseError;
using CLI::Success;
using CLI::Config;

/**
 * @brief Create a rapidjson kArrayType value from an STL style container.
 *
 * @tparam Iteratorable Any container type that supports STL style iterator.
 * @param container Container object.
 * @param allocator Rapidjson allocator.
 * @return rapidjson::Value rapidjson Value of kArrayType which contains all
 *  the values from the input container.
 */
template<typename Iteratorable>
rapidjson::Value getArrayJson(Iteratorable container, rapidjson::Document::AllocatorType& allocator)
{
  rapidjson::Value value(rapidjson::kArrayType);
  for(auto iter = container.begin(); iter != container.end(); ++iter)
  {
    value.PushBack(rapidjson::Value(*iter), allocator);
  }
  return value;
}

class WebAssemblyInterface_EXPORT Pipeline: public CLI::App
{
public:
    /** Make a new Pipeline application. `name` should be CamelCase by convention. */
    Pipeline(std::string name, std::string description, int argc, char **argv);

    /** Exit. */
    auto exit(const CLI::Error &e) -> int;

    void parse() {
        CLI::App::parse(m_argc, m_argv);
    }

    static auto get_use_memory_io()
    {
      return m_UseMemoryIO;
    }

    int get_argc() const
    {
      return m_argc;
    }

    char ** get_argv() const
    {
      return m_argv;
    }

    void interface_json();

    ~Pipeline() override;
private:
    static bool m_UseMemoryIO;
    int m_argc;
    char **m_argv;
};


} // end namespace wasm
} // end namespace itk

#endif
