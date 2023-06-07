import static io.github.kawamuray.wasmtime.WasmValType.I32;

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

    public Pipeline(byte[] wasmBytes) throws IOException {
        config = new Config();
        config.wasmBulkMemory(true);
        config.wasmSimd(true);
        //config.wasmMemory64(true);
        engine = new Engine(config);

        linker = new Linker(engine);
        //linker.allowShadowing(true);
        module = new Module(engine, wasmBytes);
    }

    public List<PipelineOutput> run(List<String> args, List<PipelineOutput> outputs, List<PipelineInput> inputs) throws Exception {
        WasiCtx wasiConfig = new WasiCtxBuilder()
					.inheritEnv()
					.inheritStderr()
					.inheritStdin()
					.inheritStdout()
					.args(args).build();

        Set<String> preopenDirectories = new HashSet<>();
        /*
        TODO -- ensure these paths are POSIX style, not Windows
        for (int index = 0; index < inputs.size(); index++) {
            PipelineInput<?> input = inputs.get(index);
            if (input.type == InterfaceTypes.TextFile || input.type == InterfaceTypes.BinaryFile) {
                Path parentPath = Path.of(input.data.getPath()).getParent();
                if (parentPath != null) {
                    preopenDirectories.add(parentPath.toString());
                }
            }
        }
        for (int index = 0; index < outputs.size(); index++) {
            PipelineOutput output = outputs.get(index);
            if (output.type == InterfaceTypes.TextFile || output.type == InterfaceTypes.BinaryFile) {
                Path parentPath = Path.of(output.data.getPath()).getParent();
                if (parentPath != null) {
                    preopenDirectories.add(parentPath.toString());
                }
            }
        }
        */
        //
        for (String preopen : preopenDirectories) {
        	wasiConfig.pushPreopenDir(Path.of(preopen), preopen);
        }

        Store<Engine> store = new Store<>(engine, wasiConfig);

        WasiCtx.addToLinker(linker);

        // TODO: Decide how to name this more appropriately.
        moduleName = "instance1";

				linker.module(store, moduleName, module);

				Consumer0 main = consumer0(store, "");
				Consumer0 initialize = consumer0(store, "_initialize");
				Function0<Integer> delayedStart = func0(store, "itk_wasm_delayed_start");
				Consumer1<Integer> delayedExit = consumer1(store, "itk_wasm_delayed_exit");
				Function4<Integer, Integer, Integer, Integer, Integer> inputArrayAlloc = func4(store, "itk_wasm_input_array_alloc");
				Function3<Integer, Integer, Integer, Integer> inputJsonAlloc = func3(store, "itk_wasm_input_json_alloc");
				Function2<Integer, Integer, Integer> outputJsonAddress = func2(store, "itk_wasm_output_json_address");
				Function2<Integer, Integer, Integer> outputJsonSize = func2(store, "itk_wasm_output_json_size");
				Function3<Integer, Integer, Integer, Integer> outputArrayAddress = func3(store, "itk_wasm_output_array_address");
				Function3<Integer, Integer, Integer, Integer> outputArraySize = func3(store, "itk_wasm_output_array_size");
				Consumer0 freeAll = consumer0(store, "itk_wasm_free_all");
				Memory memory = extern(store, "memory").memory();

        int returnCode = delayedStart.call();

        List<PipelineOutput> populatedOutputs = new ArrayList<>();
        if (!outputs.isEmpty() && returnCode == 0) {
            for (int index = 0; index < outputs.size(); index++) {
                PipelineOutput output = outputs.get(index);
                if (output.type == InterfaceTypes.TextStream) {
                    Pointer dataPtr = outputArrayAddress.invokeP(store, 0, index, 0);
                    long dataLen = outputArraySize.invokeL(store, 0, index, 0);
                    byte[] dataBytes = wasmTimeLift(dataPtr, dataLen);
                    String dataString = new String(dataBytes, StandardCharsets.UTF_8);
                    TextStream textStream = new TextStream(dataString);
                    populatedOutputs.add(new PipelineOutput(InterfaceTypes.TextStream, textStream));
                } else if (output.type == InterfaceTypes.BinaryStream) {
                    Pointer dataPtr = outputArrayAddress.invokeP(store, 0, index, 0);
                    long dataLen = outputArraySize.invokeL(store, 0, index, 0);
                    byte[] dataBytes = wasmTimeLift(dataPtr, dataLen);
                    BinaryStream binaryStream = new BinaryStream(dataBytes);
                    populatedOutputs.add(new PipelineOutput(InterfaceTypes.BinaryStream, binaryStream));
                } else {
                    throw new IllegalArgumentException("Unexpected/not yet supported output.type " + output.type);
                }
            }
        }

        DelayedExit delayedExit = instance.getExports(store).get("itk_wasm_delayed_exit");
        delayedExit.invokeV(store, returnCode);

        return populatedOutputs;
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

    private byte[] wasmTimeLift(Pointer ptr, long size) {
        long ptrValue = Pointer.nativeValue(ptr);
        if (ptrValue + size > memory.capacity()) {
            throw new IndexOutOfBoundsException("Attempting to lift out of bounds");
        }
        ByteBuffer byteBuffer = memory.getByteBuffer(ptrValue, size);
        byte[] data = new byte[byteBuffer.remaining()];
        byteBuffer.get(data);
        return data;
    }

    private void wasmTimeLower(Pointer ptr, byte[] data) {
        long ptrValue = Pointer.nativeValue(ptr);
        long size = data.length;
        if (ptrValue + size > memory.capacity()) {
            throw new IndexOutOfBoundsException("Attempting to lower out of bounds");
        }
        ByteBuffer byteBuffer = memory.getByteBuffer(ptrValue, size);
        byteBuffer.put(data);
    }

    private Pointer setInputArray(byte[] dataArray, int inputIndex, int subIndex) {
        Pointer dataPtr = new Memory(dataArray.length);
        dataPtr.write(0, dataArray, 0, dataArray.length);
        Pointer resultPtr = inputArrayAlloc.invokeP(store, 0, inputIndex, subIndex, dataArray.length);
        wasmTimeLower(resultPtr, dataArray);
        return resultPtr;
    }

    private void setInputJson(Map<String, Object> dataObject, int inputIndex) throws JsonProcessingException {
        byte[] dataJson = objectMapper.writeValueAsBytes(dataObject);
        Pointer jsonPtr = inputJsonAlloc.invokeP(store, 0, inputIndex, dataJson.length);
        wasmTimeLower(jsonPtr, dataJson);
    }

    private Map<String, Object> getOutputJson(int outputIndex) throws IOException {
        Pointer jsonPtr = outputJsonAddress.invokeP(store, 0, outputIndex);
        long jsonLen = outputJsonSize.invokeL(store, 0, outputIndex);
        byte[] jsonBytes = wasmTimeLift(jsonPtr, jsonLen);
        String jsonString = new String(jsonBytes, StandardCharsets.UTF_8);
        return objectMapper.readValue(jsonString, Map.class);
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
}
