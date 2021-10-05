// Emscripten-generated asm.js code ends.

/** \brief Utilites for exposing the local filesystem when running in Node.js. */

/** Given an absolute path to a file, mount its containing directory in the
 * Emscripten virtual filesystem. Only relevant when within the Node.js
 * environment. If the containing directory already exists with the
 * Emscripten filesystem, it will not be mounted. */
Module.mountContainingDirectory = function (filePath) {
  if (!ENVIRONMENT_IS_NODE) {
    return
  }
  var path = require('path')
  var containingDir = path.dirname(filePath)
  // If the directory already exists, abort
  if (FS.isDir(containingDir) || containingDir === '/') {
    return
  }

  var currentDir = '/'
  var splitContainingDir = containingDir.split(path.sep)
  for (var ii = 1; ii < splitContainingDir.length; ii++) {
    currentDir += splitContainingDir[ii]
    if (!FS.analyzePath(currentDir).exists) {
      FS.mkdir(currentDir)
    }
    currentDir += '/'
  }
  FS.mount(NODEFS, { root: containingDir }, currentDir)
  return currentDir + path.basename(filePath)
}

/** Given an absolute path to a file, unmount its containing directory in the
 * Emscripten virtual filesystem. */
Module.unmountContainingDirectory = function (filePath) {
  if (!ENVIRONMENT_IS_NODE) {
    return
  }
  var path = require('path')
  var containingDir = path.dirname(filePath)
  FS.unmount(containingDir)
}

Module.mkdirs = function (dirs) {
  var currentDir = '/'
  var splitDirs = dirs.split('/')

  for (var ii = 1; ii < splitDirs.length; ++ii) {
    currentDir += splitDirs[ii]
    if (!FS.analyzePath(currentDir).exists) {
      FS.mkdir(currentDir)
    }
    currentDir += '/'
  }
}

//Module.readFile = function (path, opts) {
  //return FS.readFile(path, opts)
//}

//Module.writeFile = function (path, data, opts) {
  //return FS.writeFile(path, data, opts)
//}

//Module.unlink = function (path) {
  //return FS.unlink(path)
//}

//Module.open = function (path, flags, mode) {
  //return FS.open(path, flags, mode)
//}

//Module.stat = function (path) {
  //return FS.stat(path)
//}

//Module.read = function (stream, buffer, offset, length, position) {
  //return FS.read(stream, buffer, offset, length, position)
//}

//Module.close = function (stream) {
  //return FS.close(stream)
//}
