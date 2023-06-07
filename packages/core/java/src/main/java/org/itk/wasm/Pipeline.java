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

import static io.github.kawamuray.wasmtime.WasmValType.I32;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;

import io.github.kawamuray.wasmtime.Config;
import io.github.kawamuray.wasmtime.Engine;
import io.github.kawamuray.wasmtime.Extern;
import io.github.kawamuray.wasmtime.Linker;
import io.github.kawamuray.wasmtime.Memory;
import io.github.kawamuray.wasmtime.Module;
import io.github.kawamuray.wasmtime.Store;
import io.github.kawamuray.wasmtime.WasmFunctions;
import io.github.kawamuray.wasmtime.WasmFunctions.Consumer0;
import io.github.kawamuray.wasmtime.WasmFunctions.Consumer1;
import io.github.kawamuray.wasmtime.WasmFunctions.Function0;
import io.github.kawamuray.wasmtime.WasmFunctions.Function1;
import io.github.kawamuray.wasmtime.WasmFunctions.Function2;
import io.github.kawamuray.wasmtime.WasmFunctions.Function3;
import io.github.kawamuray.wasmtime.WasmFunctions.Function4;
import io.github.kawamuray.wasmtime.wasi.WasiCtx;
import io.github.kawamuray.wasmtime.wasi.WasiCtxBuilder;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Pipeline {

  private Config config;
  private Engine engine;
  private Linker linker;
  private Module module;
  private String moduleName;

  /** TEMP */
  public Pipeline() throws IOException {
    this("../python/itkwasm/test/input/stdout-stderr-test.wasi.wasm");
  }

  public Pipeline(String path) throws IOException {
    this(readBytes(path));
  }

  public Pipeline(byte[] wasmBytes) {
    config = new Config();
    config.wasmBulkMemory(true);
    config.wasmSimd(true);
    //config.wasmMemory64(true);
    engine = new Engine(config);

    linker = new Linker(engine);
    //linker.allowShadowing(true);
    module = new Module(engine, wasmBytes);
  }

  public List<PipelineOutput<?>> run(List<String> args, List<PipelineOutput<?>> outputs, List<PipelineInput<?>> inputs) {
    try (RunInstance ri = new RunInstance(args, outputs, inputs)) {
      int returnCode = ri.delayedStart();

      List<PipelineOutput<?>> populatedOutputs = new ArrayList<>();
      if (!outputs.isEmpty() && returnCode == 0) {
        for (int index = 0; index < outputs.size(); index++) {
          PipelineOutput<?> output = outputs.get(index);
          if (output.type == InterfaceTypes.TextStream) {
            int dataPtr = ri.outputArrayAddress(0, index, 0);
            int dataLen = ri.outputArraySize(0, index, 0);
            byte[] dataBytes = ri.wasmTimeLift(dataPtr, dataLen);
            String dataString = str(dataBytes);
            TextStream textStream = new TextStream(dataString);
            populatedOutputs.add(new PipelineOutput<>(InterfaceTypes.TextStream, textStream));
          } else if (output.type == InterfaceTypes.BinaryStream) {
            int dataPtr = ri.outputArrayAddress(0, index, 0);
            int dataLen = ri.outputArraySize(0, index, 0);
            byte[] dataBytes = ri.wasmTimeLift(dataPtr, dataLen);
            BinaryStream binaryStream = new BinaryStream(dataBytes);
            populatedOutputs.add(new PipelineOutput<>(InterfaceTypes.BinaryStream, binaryStream));
          } else {
            throw new IllegalArgumentException("Unexpected/not yet supported output.type " + output.type);
          }
        }
      }

      return populatedOutputs;
    }
  }

  private static String purePosixPath(Path p) {
    // TODO -- ensure path is POSIX style, not Windows
    return p.toString();
  }

  private static String str(byte[] bytes) {
    return new String(bytes, StandardCharsets.UTF_8);
  }
  private static byte[] bytes(String str) {
    return str.getBytes(StandardCharsets.UTF_8);
  }

  private static byte[] readBytes(String filename) throws IOException {
    //try (InputStream is = Main.class.getResourceAsStream(filename)) {
    try (InputStream is = new FileInputStream(filename)) {
      ByteArrayOutputStream buffer = new ByteArrayOutputStream();
      int nRead;
      byte[] buf = new byte[16384];
      while ((nRead = is.read(buf, 0, buf.length)) != -1) {
        buffer.write(buf, 0, nRead);
      }
      return buffer.toByteArray();
    }
  }

  private Extern extern(Store<Engine> store, String name) {
    return linker.get(store, moduleName, name).get();
  }
  private Consumer0 consumer0(Store<Engine> store, String name) {
    return WasmFunctions.consumer(store, extern(store, name).func());
  }
  private Consumer1<Integer> consumer1(Store<Engine> store, String name) {
    return WasmFunctions.consumer(store, extern(store, name).func(), I32);
  }
  private Function0<Integer> func0(Store<Engine> store, String name) {
    return WasmFunctions.func(store, extern(store, name).func(), I32);
  }
  private Function1<Integer, Integer> func1(Store<Engine> store, String name) {
    return WasmFunctions.func(store, extern(store, name).func(), I32, I32);
  }
  private Function2<Integer, Integer, Integer> func2(Store<Engine> store, String name) {
    return WasmFunctions.func(store, extern(store, name).func(), I32, I32, I32);
  }
  private Function3<Integer, Integer, Integer, Integer> func3(Store<Engine> store, String name) {
    return WasmFunctions.func(store, extern(store, name).func(), I32, I32, I32, I32);
  }
  private Function4<Integer, Integer, Integer, Integer, Integer> func4(Store<Engine> store, String name) {
    return WasmFunctions.func(store, extern(store, name).func(), I32, I32, I32, I32, I32);
  }

  public class RunInstance implements AutoCloseable {

    private Store<Engine> store;

    private Consumer0 main;
    private Consumer0 initialize;
    private Function0<Integer> delayedStart;
    private Consumer1<Integer> delayedExit;
    private Function4<Integer, Integer, Integer, Integer, Integer> inputArrayAlloc;
    private Function3<Integer, Integer, Integer, Integer> inputJsonAlloc;
    private Function2<Integer, Integer, Integer> outputJsonAddress;
    private Function2<Integer, Integer, Integer> outputJsonSize;
    private Function3<Integer, Integer, Integer, Integer> outputArrayAddress;
    private Function3<Integer, Integer, Integer, Integer> outputArraySize;
    private Consumer0 freeAll;
    private Memory memory;

    public RunInstance(List<String> args, List<PipelineOutput<?>> outputs,
      List<PipelineInput<?>> inputs)
    {
      WasiCtx wasiConfig = new WasiCtxBuilder()
          .inheritEnv()
          .inheritStderr()
          .inheritStdin()
          .inheritStdout()
          .args(args).build();

      Set<String> preopenDirectories = new HashSet<>();
      for (PipelineInput<?> input : inputs) {
        if (input.type == InterfaceTypes.TextFile || input.type == InterfaceTypes.BinaryFile) {
          // TODO: enable once TextFile/BinaryFile exists
          //Path path = ((TextFile) input.data).path;
          Path path = null;
          preopenDirectories.add(purePosixPath(path.getParent()));
        }
      }
      for (PipelineOutput<?> output : outputs) {
        if (output.type == InterfaceTypes.TextFile || output.type == InterfaceTypes.BinaryFile) {
          // TODO: enable once TextFile/BinaryFile exists
          //Path path = ((TextFile) input.data).path;
          Path path = null;
          preopenDirectories.add(purePosixPath(path.getParent()));
        }
      }

      for (String preopen : preopenDirectories) {
        Path p = Paths.get(preopen);
        wasiConfig.pushPreopenDir(p, preopen);
      }

      store = new Store<>(engine, wasiConfig);

      WasiCtx.addToLinker(linker);

      // TODO: Decide how to name this more appropriately.
      moduleName = "instance1";

      linker.module(store, moduleName, module);

      main = consumer0(store, "");
      initialize = consumer0(store, "_initialize");
      delayedStart = func0(store, "itk_wasm_delayed_start");
      delayedExit = consumer1(store, "itk_wasm_delayed_exit");
      inputArrayAlloc = func4(store, "itk_wasm_input_array_alloc");
      inputJsonAlloc = func3(store, "itk_wasm_input_json_alloc");
      outputJsonAddress = func2(store, "itk_wasm_output_json_address");
      outputJsonSize = func2(store, "itk_wasm_output_json_size");
      outputArrayAddress = func3(store, "itk_wasm_output_array_address");
      outputArraySize = func3(store, "itk_wasm_output_array_size");
      freeAll = consumer0(store, "itk_wasm_free_all");
      memory = extern(store, "memory").memory();
    }

    public Integer delayedStart() { return delayedStart.call(); }
    public void delayedExit(Integer i) { delayedExit.accept(i); }
    public Integer inputArrayAlloc(Integer i1, Integer i2, Integer i3, Integer i4) { return inputArrayAlloc.call(i1, i2, i3, i4); }
    public Integer inputJsonAlloc(Integer i1, Integer i2, Integer i3) { return inputJsonAlloc.call(i1, i2, i3); }
    public Integer outputJsonAddress(Integer i1, Integer i2) { return outputJsonAddress.call(i1, i2); }
    public Integer outputJsonSize(Integer i1, Integer i2) { return outputJsonSize.call(i1, i2); }
    public Integer outputArrayAddress(Integer i1, Integer i2, Integer i3) { return outputArrayAddress.call(i1, i2, i3); }
    public Integer outputArraySize(Integer i1, Integer i2, Integer i3) { return outputArraySize.call(i1, i2, i3); }
    public void freeAll() { freeAll.accept(); }

    public ByteBuffer memoryBuffer(int offset, int length) {
      ByteBuffer buffer = memory.buffer(store);
      buffer.position(offset);
      buffer.limit(length);
      return buffer.slice();
    }
    public int memorySize() { return memory.size(store); }

    @Override
    public void close() {
      store.close();
    }

    private byte[] wasmTimeLift(int offset, int length) {
      if (offset + length > memorySize()) {
        throw new IndexOutOfBoundsException("Attempting to lift out of bounds");
      }
      ByteBuffer byteBuffer = memoryBuffer(offset, length);
      byte[] data = new byte[byteBuffer.remaining()];
      byteBuffer.get(data);
      return data;
    }

    private void wasmTimeLower(int offset, byte[] data) {
      int size = data.length;
      if (offset + size > memorySize()) {
        throw new IndexOutOfBoundsException("Attempting to lower out of bounds");
      }
      ByteBuffer byteBuffer = memoryBuffer(offset, size);
      byteBuffer.put(data);
    }

    private int setInputArray(byte[] dataArray, int inputIndex, int subIndex) {
      int dataPtr = 0;
      if (dataArray != null) {
        dataPtr = inputArrayAlloc(0, inputIndex, subIndex, dataArray.length);
        wasmTimeLower(dataPtr, dataArray);
      }
      return dataPtr;
    }

    private void setInputJson(Map<String, Object> dataObject, int inputIndex) {
      Gson gson = new GsonBuilder().create();
      JsonElement jsonElement = gson.toJsonTree(dataObject);
      byte[] dataJson = bytes(jsonElement.toString());
      int jsonPtr = inputJsonAlloc(0, inputIndex, dataJson.length);
      wasmTimeLower(jsonPtr, dataJson);
    }

    private Map<String, Object> getOutputJson(int outputIndex) {
      int jsonPtr = outputJsonAddress(0, outputIndex);
      int jsonLen = outputJsonSize(0, outputIndex);
      byte[] jsonBytes = wasmTimeLift(jsonPtr, jsonLen);
      String jsonString = str(jsonBytes);
      Gson gson = new GsonBuilder().create();
      return gson.fromJson(jsonString, new TypeToken<Map<String, Object>>() {});
    }
  }
}
