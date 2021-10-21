var mStdout = null
var mStderr = null

Module['resetModuleStdout'] = function() {
  mStdout = ''
}

Module['resetModuleStderr'] = function() {
  mStderr = ''
}

Module['print'] = function(text) {
  console.log(text)
  mStdout += text + '\n'
}

Module['printErr'] = function(text) {
  console.error(text)
  mStderr += text + '\n'
}

Module['getModuleStdout'] = function() {
  return mStdout
}

Module['getModuleStderr'] = function() {
  return mStderr
}
