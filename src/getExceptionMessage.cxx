#include <emscripten/bind.h>

// https://emscripten.org/docs/porting/Debugging.html?highlight=debugging#handling-c-exceptions-from-javascript
std::string getExceptionMessage(intptr_t exceptionPtr) {
  return std::string(reinterpret_cast<std::exception *>(exceptionPtr)->what());
}

EMSCRIPTEN_BINDINGS(itk_js_debug_bindings) {
  emscripten::function("getExceptionMessage", &getExceptionMessage);
}
