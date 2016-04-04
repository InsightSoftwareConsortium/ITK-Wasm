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
#ifndef itkNodeJSEmscripten_h
#define itkNodeJSEmscripten_h

#include <string>

namespace itk
{

/** \class NodeJSEmscripten
 *
 * \brief Utilites for exposing the local filesystem when running in Node.js.
 *
 * \ingroup BridgeJavaScript
 */
class NodeJSEmscripten
{
public:
  /** Given an absolute path to a file, mount its containing directory in the
   * Emscripten virtual filesystem. Only relevant when within the Node.js
   * environment. If the containing directory already exists with the
   * Emscripten filesystem, it will not be mounted. */
  static void MountContainingDirectory( std::string filePath );

  /** Given an absolute path to a file, unmount its containing directory in the
   * Emscripten virtual filesystem. */
  static void UnmountContainingDirectory( std::string filePath );
};

} // end namespace itk
#endif
