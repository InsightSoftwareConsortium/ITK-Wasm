title: Debugging
---

### Native host debugging

itk.js makes it possible to use the same C++ and CMake build configuration code to create a native host binary, and *reuse the exact same code* for the web.

Use your favorite host native toolchain, testing tools, and debuggers to develop your processing pipeline before deploying to the web.

### Node.js debugging

itk.js generates Node.js compatible modules. Tests are preferrably written as Node.js scripts because they can be executed without starting up a browser and parallelize well with tools like [`ava`](High performance spatial analysis in a Web Browser or Node.js).

### Browser debugging

Chrome supports debugging C/C++ generated WebAssembly alongside JavaScript in Chrome DevTools starting with Chrome >=89 (google-chrome-beta at the time of this writing). We also currently have to install the [wasm-debugging-extension](https://goo.gle/wasm-debugging-extension).

After the above requirements have been installed, we also need to enable WebAssembly debugging in DevTools. Open Chrome DevTools, click the gear (⚙) icon in the top right corner of DevTools pane, go to the **Experiments** panel and tick **WebAssembly Debugging: Enable DWARF support**. After exitting DevTools settings, click on the suggested **Reload** button.
