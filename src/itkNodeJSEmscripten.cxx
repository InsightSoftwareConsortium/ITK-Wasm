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
#include "itkNodeJSEmscripten.h"

#include <emscripten.h>

namespace itk
{

void
NodeJSEmscripten
::MountContainingDirectory( std::string filePath )
{
  EM_ASM_({
      if( !ENVIRONMENT_IS_NODE ) {
        return;
      }
      var filePath = Pointer_stringify( $0 );
      var path = require( 'path' );
      var containingDir = path.dirname( filePath );
      // If the directory already exists, abort
      if( FS.isDir( containingDir ) || containingDir === '/' ) {
        return;
      }

      var currentDir = path.sep;
      var splitContainingDir = containingDir.split( path.sep );
      for( var ii = 1; ii < splitContainingDir.length; ++ii ) {
        currentDir += splitContainingDir[ii];
        if( !FS.isDir( currentDir ) ) {
          FS.mkdir( currentDir );
        }
        currentDir += path.sep;
      }
      FS.mount( NODEFS, { root: currentDir }, containingDir );
    }, filePath.c_str()
  );
}

void
NodeJSEmscripten
::UnmountContainingDirectory( std::string filePath )
{
  EM_ASM_({
      if(! ENVIRONMENT_IS_NODE) {
        return;
      }
      var filePath = Pointer_stringify( $0 );
      var path = require( 'path' );
      var containingDir = path.dirname( filePath );
      FS.unmount( containingDir );
    }, filePath.c_str()
  );
}

} // end namespace itk
