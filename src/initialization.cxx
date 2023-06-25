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
// itk-wasm reactor-like initialization to lower values before _start
// Based on wasi-libc.


#ifdef __cplusplus
extern "C" {
#endif // __cplusplus

#include <wasi/api.h>
extern void __wasm_call_ctors(void);
extern int __main_void(void);
extern void __wasm_call_dtors(void);

// No longer present with WASI SDK 19 -> 20 ?
//extern void _initialize(void);
// https://github.com/WebAssembly/wasi-libc/blob/bd950eb128bff337153de217b11270f948d04bb4/libc-bottom-half/crt/crt1-reactor.c#L8
#if defined(_REENTRANT)
#include <stdatomic.h>
extern void __wasi_init_tp(void);
#endif
extern void __wasm_call_ctors(void);

//__attribute__((export_name("_initialize")))
void _initialize_local(void) {
#if defined(_REENTRANT)
    static volatile atomic_int initialized = 0;
    int expected = 0;
    if (!atomic_compare_exchange_strong(&initialized, &expected, 1)) {
        __builtin_trap();
    }

    __wasi_init_tp();
#else
    static volatile int initialized = 0;
    if (initialized != 0) {
        __builtin_trap();
    }
    initialized = 1;
#endif

    // The linker synthesizes this to call constructors.
    __wasm_call_ctors();
}

__attribute__((export_name("itk_wasm_delayed_exit")))
void itk_wasm_delayed_exit(int returnCode)
{
  // Call atexit functions, destructors, stdio cleanup, etc.
  __wasm_call_dtors();

  // If main exited successfully, just return, otherwise call
  // `__wasi_proc_exit`.
  if (returnCode != 0) {
    __wasi_proc_exit(returnCode);
  }
}

__attribute__((export_name("itk_wasm_delayed_start")))
int itk_wasm_delayed_start(void)
{
  // Call `__main_void` which will either be the application's zero-argument
  // `__main_void` function or a libc routine which obtains the command-line
  // arguments and calls `__main_argv_argc`.
  const int r = __main_void();

  return r;
}

__attribute__((export_name("")))
void _start(void)
{
  //_initialize();
  _initialize_local();

  const int returnCode = itk_wasm_delayed_start();

  itk_wasm_delayed_exit(returnCode);
}


#ifdef __cplusplus
}
#endif // __cplusplus
