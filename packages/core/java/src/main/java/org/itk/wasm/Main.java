/*-
 * #%L
 * Java bindings for itk-wasm.
 * %%
 * Copyright (C) 2023 ITK developers.
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package org.itk.wasm;

import io.github.kawamuray.wasmtime.Engine;
import io.github.kawamuray.wasmtime.Extern;
import io.github.kawamuray.wasmtime.Func;
import io.github.kawamuray.wasmtime.Instance;
import io.github.kawamuray.wasmtime.Module;
import io.github.kawamuray.wasmtime.Store;
import io.github.kawamuray.wasmtime.WasmFunctions;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Collection;

public class Main {
  public static void main(String... args) throws IOException {
    // Configure the initial compilation environment, creating the global
    // `Store` structure. Note that you can also tweak configuration settings
    // with a `Config` and an `Engine` if desired.
    System.err.println("Initializing...");
    try (Store<Void> store = Store.withoutData()) {
      // Compile the wasm binary into an in-memory instance of a `Module`.
      System.err.println("Compiling module...");
      try (Engine engine = store.engine();
          Module module = new Module(engine, readWAT("hello.wat")))
      {
        // Here we handle the imports of the module, which in this case is our
        // `HelloCallback` type and its associated implementation of `Callback.
        System.err.println("Creating callback...");
        try (Func helloFunc = WasmFunctions.wrap(store, () -> {
          System.err.println("CB!! Calling back...");
          System.err.println("CB!! > Hello World!");
        })) {
          // Once we've got that all set up we can then move to the instantiation
          // phase, pairing together a compiled module as well as a set of imports.
          // Note that this is where the wasm `start` function, if any, would run.
          System.err.println("Instantiating module...");
          Collection<Extern> imports = Arrays.asList(Extern.fromFunc(helloFunc));
          try (Instance instance = new Instance(store, module, imports)) {
            // Next we poke around a bit to extract the `run` function from the module.
            System.err.println("Extracting export...");
            try (Func f = instance.getFunc(store, "run").get()) {
              WasmFunctions.Consumer0 fn = WasmFunctions.consumer(store, f);

              // And last but not least we can call it!
              System.err.println("Calling export...");
              fn.accept();

              System.err.println("Done.");
            }
          }
        }
      }
    }
  }

  private static byte[] readWAT(String filename) throws IOException {
    try (InputStream is = new FileInputStream("/home/curtis/code/kitware/itk-wasm/packages/core/java/src/main/resources/org/itk/wasm/" + filename)) {
    //try (InputStream is = Main.class.getResourceAsStream(filename)) {
      ByteArrayOutputStream buffer = new ByteArrayOutputStream();
      int nRead;
      byte[] buf = new byte[16384];
      while ((nRead = is.read(buf, 0, buf.length)) != -1) {
        buffer.write(buf, 0, nRead);
      }
      return buffer.toByteArray();
    }
  }
}
