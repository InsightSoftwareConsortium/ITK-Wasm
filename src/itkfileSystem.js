const BrowserFS = require('browserfs')

/** A singleton global virtual fileSystem shared across the itk package. */
const fileSystem = new BrowserFS.MountableFileSystem()

module.exports = fileSystem
