/** Given an absolute path to a file, mount its containing directory in the
 * Emscripten virtual filesystem. Only relevant when within the Node.js
 * environment. If the containing directory already exists with the
 * Emscripten filesystem, it will not be mounted. */
Module.mountContainingDir = function (filePath) {
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
Module.unmountContainingDir = function (filePath) {
  if (!ENVIRONMENT_IS_NODE) {
    return
  }
  var path = require('path')
  var containingDir = path.dirname(filePath)
  FS.unmount(containingDir)
}

Module.fs_mkdirs = function (dirs) {
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

Module.fs_readFile = function (path, opts) {
  return FS.readFile(path, opts)
}

Module.fs_writeFile = function (path, data, opts) {
  return FS.writeFile(path, data, opts)
}

Module.fs_unlink = function (path) {
  return FS.unlink(path)
}

Module.fs_open = function (path, flags, mode) {
  return FS.open(path, flags, mode)
}

Module.fs_stat = function (path) {
  return FS.stat(path)
}

Module.fs_read = function (stream, buffer, offset, length, position) {
  return FS.read(stream, buffer, offset, length, position)
}

Module.fs_close = function (stream) {
  return FS.close(stream)
}
