// Export UMD wrapper function for different module loaders.
(function(root, factory) {
  // AMD.
  if(typeof(define) == 'function' && define.amd) {
    define([], factory)
  }
  // Node.js style CommonJS.
  else if(typeof(module) == 'object' && module.exports) {
    module.exports = factory()
  }
  else {
    root.Module = factory()
  }

// Define wrapper function
}(this, function() {
  var Module = {}
  //Module['print'] = console.log
  //Module['printErr'] = console.warn
  //Module['print'] = (typeof(console !== "undefined") ? (function(x) { console.log(x) }) : (function(x) {}))
  //Module['printErr'] = (typeof(console !== "undefined") ? (function(x) { console.warn(x) }) : (function(x) {}))

  // Begin emscripten-generated asm.js code.
