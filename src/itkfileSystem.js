const BrowserFS = require('browserfs')

/** A singleton global virtual root fileSystem shared across the itk package. */
const fileSystem = new BrowserFS.FileSystem.MountableFileSystem()
BrowserFS.initialize(fileSystem)

module.exports = fileSystem
