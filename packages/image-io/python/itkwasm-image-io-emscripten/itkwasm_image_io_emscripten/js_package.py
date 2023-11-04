# Generated file. To retain edits, remove this comment.

from itkwasm.pyodide import JsPackageConfig, JsPackage

from ._version import __version__
default_js_module = """data:text/javascript;charset=utf-8,var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/webworker-promise@0.4.4/node_modules/webworker-promise/src/tiny-emitter.js
var require_tiny_emitter = __commonJS({
  "node_modules/.pnpm/webworker-promise@0.4.4/node_modules/webworker-promise/src/tiny-emitter.js"(exports, module) {
    var TinyEmitter = class {
      constructor() {
        Object.defineProperty(this, "__listeners", {
          value: {},
          enumerable: false,
          writable: false
        });
      }
      emit(eventName, ...args) {
        if (!this.__listeners[eventName])
          return this;
        for (const handler of this.__listeners[eventName]) {
          handler(...args);
        }
        return this;
      }
      once(eventName, handler) {
        const once = (...args) => {
          this.off(eventName, once);
          handler(...args);
        };
        return this.on(eventName, once);
      }
      on(eventName, handler) {
        if (!this.__listeners[eventName])
          this.__listeners[eventName] = [];
        this.__listeners[eventName].push(handler);
        return this;
      }
      off(eventName, handler) {
        if (handler)
          this.__listeners[eventName] = this.__listeners[eventName].filter((h) => h !== handler);
        else
          this.__listeners[eventName] = [];
        return this;
      }
    };
    module.exports = TinyEmitter;
  }
});

// node_modules/.pnpm/webworker-promise@0.4.4/node_modules/webworker-promise/src/index.js
var require_src = __commonJS({
  "node_modules/.pnpm/webworker-promise@0.4.4/node_modules/webworker-promise/src/index.js"(exports, module) {
    var TinyEmitter = require_tiny_emitter();
    var MESSAGE_RESULT = 0;
    var MESSAGE_EVENT = 1;
    var RESULT_SUCCESS = 1;
    var Worker2 = class extends TinyEmitter {
      /**
       *
       * @param worker {Worker}
       */
      constructor(worker) {
        super();
        this._messageId = 1;
        this._messages = /* @__PURE__ */ new Map();
        this._worker = worker;
        this._worker.onmessage = this._onMessage.bind(this);
        this._id = Math.ceil(Math.random() * 1e7);
      }
      terminate() {
        this._worker.terminate();
      }
      /**
       * return true if there is no unresolved jobs
       * @returns {boolean}
       */
      isFree() {
        return this._messages.size === 0;
      }
      jobsLength() {
        return this._messages.size;
      }
      /**
       * @param operationName string
       * @param data any
       * @param transferable array
       * @param onEvent function
       * @returns {Promise}
       */
      exec(operationName, data = null, transferable = [], onEvent) {
        return new Promise((res, rej) => {
          const messageId = this._messageId++;
          this._messages.set(messageId, [res, rej, onEvent]);
          this._worker.postMessage([messageId, data, operationName], transferable || []);
        });
      }
      /**
       *
       * @param data any
       * @param transferable array
       * @param onEvent function
       * @returns {Promise}
       */
      postMessage(data = null, transferable = [], onEvent) {
        return new Promise((res, rej) => {
          const messageId = this._messageId++;
          this._messages.set(messageId, [res, rej, onEvent]);
          this._worker.postMessage([messageId, data], transferable || []);
        });
      }
      emit(eventName, ...args) {
        this._worker.postMessage({ eventName, args });
      }
      _onMessage(e) {
        if (!Array.isArray(e.data) && e.data.eventName) {
          return super.emit(e.data.eventName, ...e.data.args);
        }
        const [type, ...args] = e.data;
        if (type === MESSAGE_EVENT)
          this._onEvent(...args);
        else if (type === MESSAGE_RESULT)
          this._onResult(...args);
        else
          throw new Error(`Wrong message type '${type}'`);
      }
      _onResult(messageId, success, payload) {
        const [res, rej] = this._messages.get(messageId);
        this._messages.delete(messageId);
        return success === RESULT_SUCCESS ? res(payload) : rej(payload);
      }
      _onEvent(messageId, eventName, data) {
        const [, , onEvent] = this._messages.get(messageId);
        if (onEvent) {
          onEvent(eventName, data);
        }
      }
    };
    module.exports = Worker2;
  }
});

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/version.js
var version = "1.0.0-b.152";
var version_default = version;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/itkConfig.js
var itkConfig = {
  pipelineWorkerUrl: `https://cdn.jsdelivr.net/npm/itk-wasm@${version_default}/dist/core/web-workers/bundles/pipeline.min.worker.js`,
  imageIOUrl: `https://cdn.jsdelivr.net/npm/itk-image-io@${version_default}`,
  meshIOUrl: `https://cdn.jsdelivr.net/npm/itk-mesh-io@${version_default}`,
  pipelinesUrl: `https://cdn.jsdelivr.net/npm/itk-wasm@${version_default}/dist/pipelines`
};
var itkConfig_default = itkConfig;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/InterfaceTypes.js
var InterfaceTypes = {
  // Todo: remove Interface prefix after IOTypes has been removed
  TextFile: "InterfaceTextFile",
  BinaryFile: "InterfaceBinaryFile",
  TextStream: "InterfaceTextStream",
  BinaryStream: "InterfaceBinaryStream",
  Image: "InterfaceImage",
  Mesh: "InterfaceMesh",
  PolyData: "InterfacePolyData",
  JsonCompatible: "InterfaceJsonCompatible"
};
var InterfaceTypes_default = InterfaceTypes;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/interface-types/int-types.js
var IntTypes = {
  Int8: "int8",
  UInt8: "uint8",
  Int16: "int16",
  UInt16: "uint16",
  Int32: "int32",
  UInt32: "uint32",
  Int64: "int64",
  UInt64: "uint64",
  SizeValueType: "uint64",
  IdentifierType: "uint64",
  IndexValueType: "int64",
  OffsetValueType: "int64"
};
var int_types_default = IntTypes;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/interface-types/float-types.js
var FloatTypes = {
  Float32: "float32",
  Float64: "float64",
  SpacePrecisionType: "float64"
};
var float_types_default = FloatTypes;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/IOTypes.js
var IOTypes = {
  Text: "Text",
  Binary: "Binary",
  Image: "Image",
  Mesh: "Mesh"
};
var IOTypes_default = IOTypes;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/interface-types/pixel-types.js
var PixelTypes = {
  Unknown: "Unknown",
  Scalar: "Scalar",
  RGB: "RGB",
  RGBA: "RGBA",
  Offset: "Offset",
  Vector: "Vector",
  Point: "Point",
  CovariantVector: "CovariantVector",
  SymmetricSecondRankTensor: "SymmetricSecondRankTensor",
  DiffusionTensor3D: "DiffusionTensor3D",
  Complex: "Complex",
  FixedArray: "FixedArray",
  Array: "Array",
  Matrix: "Matrix",
  VariableLengthVector: "VariableLengthVector",
  VariableSizeMatrix: "VariableSizeMatrix"
};
var pixel_types_default = PixelTypes;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/setMatrixElement.js
function setMatrixElement(matrixData, columns, row, column, value) {
  matrixData[column + row * columns] = value;
}
var setMatrixElement_default = setMatrixElement;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/interface-types/image-type.js
var ImageType = class {
  constructor(dimension = 2, componentType = int_types_default.UInt8, pixelType = pixel_types_default.Scalar, components = 1) {
    this.dimension = dimension;
    this.componentType = componentType;
    this.pixelType = pixelType;
    this.components = components;
  }
};
var image_type_default = ImageType;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/interface-types/image.js
var Image = class {
  constructor(imageType = new image_type_default()) {
    this.imageType = imageType;
    this.name = "image";
    const dimension = imageType.dimension;
    this.origin = new Array(dimension);
    this.origin.fill(0);
    this.spacing = new Array(dimension);
    this.spacing.fill(1);
    this.direction = new Float64Array(dimension * dimension);
    this.direction.fill(0);
    for (let ii = 0; ii < dimension; ii++) {
      setMatrixElement_default(this.direction, dimension, ii, ii, 1);
    }
    this.size = new Array(dimension);
    this.size.fill(0);
    this.metadata = /* @__PURE__ */ new Map();
    this.data = null;
  }
};
var image_default = Image;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/bufferToTypedArray.js
function bufferToTypedArray(wasmType, buffer) {
  let typedArray = null;
  switch (wasmType) {
    case int_types_default.UInt8: {
      typedArray = new Uint8Array(buffer);
      break;
    }
    case int_types_default.Int8: {
      typedArray = new Int8Array(buffer);
      break;
    }
    case int_types_default.UInt16: {
      typedArray = new Uint16Array(buffer);
      break;
    }
    case int_types_default.Int16: {
      typedArray = new Int16Array(buffer);
      break;
    }
    case int_types_default.UInt32: {
      typedArray = new Uint32Array(buffer);
      break;
    }
    case int_types_default.Int32: {
      typedArray = new Int32Array(buffer);
      break;
    }
    case int_types_default.UInt64: {
      if (typeof globalThis.BigUint64Array === "function") {
        typedArray = new BigUint64Array(buffer);
      } else {
        typedArray = new Uint8Array(buffer);
      }
      break;
    }
    case int_types_default.Int64: {
      if (typeof globalThis.BigInt64Array === "function") {
        typedArray = new BigInt64Array(buffer);
      } else {
        typedArray = new Uint8Array(buffer);
      }
      break;
    }
    case float_types_default.Float32: {
      typedArray = new Float32Array(buffer);
      break;
    }
    case float_types_default.Float64: {
      typedArray = new Float64Array(buffer);
      break;
    }
    case "null": {
      typedArray = null;
      break;
    }
    case null: {
      typedArray = null;
      break;
    }
    default:
      throw new Error("Type is not supported as a TypedArray");
  }
  return typedArray;
}
var bufferToTypedArray_default = bufferToTypedArray;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/copyImage.js
function copyImage(image) {
  const copy = new image_default(image.imageType);
  copy.name = image.name;
  copy.origin = Array.from(image.origin);
  copy.spacing = Array.from(image.spacing);
  copy.direction = image.direction.slice();
  copy.size = Array.from(image.size);
  if (image.data !== null) {
    const CTor = image.data.constructor;
    copy.data = new CTor(image.data.length);
    if (copy.data != null) {
      copy.data.set(image.data, 0);
    }
  }
  return copy;
}
var copyImage_default = copyImage;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/stackImages.js
function stackImages(images) {
  if (images.length < 1) {
    throw Error("At least one images is required.");
  }
  const firstImage = images[0];
  if (firstImage.data === null) {
    throw Error("Image data is null.");
  }
  const result = new image_default(firstImage.imageType);
  result.origin = Array.from(firstImage.origin);
  result.spacing = Array.from(firstImage.spacing);
  const dimension = result.imageType.dimension;
  result.direction = firstImage.direction.slice();
  const stackOn = dimension - 1;
  result.size = Array.from(firstImage.size);
  const stackedSize = images.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.size[stackOn];
  }, 0);
  result.size[stackOn] = stackedSize;
  const dataSize = result.size.reduce((accumulator, currentValue) => {
    return accumulator * currentValue;
  }, 1) * result.imageType.components;
  const CTor = firstImage.data.constructor;
  result.data = new CTor(dataSize);
  let offsetBase = result.imageType.components;
  for (let subIndex = 0; subIndex < result.size.length - 1; subIndex++) {
    offsetBase *= result.size[subIndex];
  }
  let stackIndex = 0;
  if (result.data != null) {
    for (let index = 0; index < images.length; index++) {
      result.data.set(images[index].data, offsetBase * stackIndex);
      stackIndex += images[index].size[stackOn];
    }
  } else {
    throw Error("Could not create result image data.");
  }
  return result;
}
var stackImages_default = stackImages;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/castImage.js
function castImage(inputImage, options) {
  const outputImageType = Object.assign({}, inputImage.imageType);
  if (typeof options !== "undefined" && typeof options.pixelType !== "undefined") {
    outputImageType.pixelType = options.pixelType;
    if (options.pixelType === pixel_types_default.Scalar && outputImageType.components !== 1) {
      throw new Error("Cannot cast multi-component image to a scalar image");
    }
  }
  if (typeof options !== "undefined" && typeof options.componentType !== "undefined" && options.componentType !== inputImage.imageType.componentType) {
    outputImageType.componentType = options.componentType;
  }
  const outputImage = new image_default(outputImageType);
  outputImage.name = inputImage.name;
  outputImage.origin = Array.from(inputImage.origin);
  outputImage.spacing = Array.from(inputImage.spacing);
  outputImage.direction = inputImage.direction.slice();
  outputImage.size = Array.from(inputImage.size);
  outputImage.metadata = new Map(JSON.parse(JSON.stringify(Array.from(inputImage.metadata))));
  if (inputImage.data !== null) {
    if (typeof options !== "undefined" && typeof options.componentType !== "undefined" && options.componentType !== inputImage.imageType.componentType) {
      switch (inputImage.imageType.componentType) {
        case int_types_default.UInt8:
        case int_types_default.Int8:
        case int_types_default.UInt16:
        case int_types_default.Int16:
        case int_types_default.UInt32:
        case int_types_default.Int32:
        case float_types_default.Float32:
        case float_types_default.Float64:
          switch (outputImage.imageType.componentType) {
            case int_types_default.UInt8:
              outputImage.data = new Uint8Array(inputImage.data);
              break;
            case int_types_default.Int8:
              outputImage.data = new Int8Array(inputImage.data);
              break;
            case int_types_default.UInt16:
              outputImage.data = new Uint16Array(inputImage.data);
              break;
            case int_types_default.Int16:
              outputImage.data = new Int16Array(inputImage.data);
              break;
            case int_types_default.UInt32:
              outputImage.data = new Uint32Array(inputImage.data);
              break;
            case int_types_default.Int32:
              outputImage.data = new Int32Array(inputImage.data);
              break;
            case float_types_default.Float32:
              outputImage.data = new Float32Array(inputImage.data);
              break;
            case float_types_default.Float64:
              outputImage.data = new Float64Array(inputImage.data);
              break;
            case int_types_default.UInt64:
              outputImage.data = new BigUint64Array(inputImage.data.length);
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = BigInt.asIntN(64, BigInt(inputImage.data[idx]));
              }
              break;
            case int_types_default.Int64:
              outputImage.data = new BigInt64Array(inputImage.data.length);
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = BigInt.asUintN(64, BigInt(inputImage.data[idx]));
              }
              break;
          }
          break;
        case int_types_default.UInt64:
        case int_types_default.Int64:
          switch (outputImage.imageType.componentType) {
            case int_types_default.UInt8:
              outputImage.data = new Uint8Array(inputImage.data.length);
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx]);
              }
              break;
            case int_types_default.Int8:
              outputImage.data = new Int8Array(inputImage.data.length);
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx]);
              }
              break;
            case int_types_default.UInt16:
              outputImage.data = new Uint16Array(inputImage.data.length);
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx]);
              }
              break;
            case int_types_default.Int16:
              outputImage.data = new Int16Array(inputImage.data.length);
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx]);
              }
              break;
            case int_types_default.UInt32:
              outputImage.data = new Uint32Array(inputImage.data.length);
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx]);
              }
              break;
            case int_types_default.Int32:
              outputImage.data = new Int32Array(inputImage.data.length);
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx]);
              }
              break;
            case float_types_default.Float32:
              outputImage.data = new Float32Array(inputImage.data.length);
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx]);
              }
              break;
            case float_types_default.Float64:
              outputImage.data = new Float64Array(inputImage.data.length);
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx]);
              }
              break;
            case int_types_default.UInt64:
              outputImage.data = new BigUint64Array(inputImage.data);
              break;
            case int_types_default.Int64:
              outputImage.data = new BigInt64Array(inputImage.data);
              break;
          }
          break;
      }
    } else {
      const CTor = inputImage.data.constructor;
      outputImage.data = new CTor(inputImage.data.length);
      if (outputImage.data != null) {
        outputImage.data.set(inputImage.data, 0);
      }
    }
  }
  return outputImage;
}
var castImage_default = castImage;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/WorkerPool.js
var __rest = function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var WorkerPool = class {
  /* poolSize is the maximum number of web workers to create in the pool.
   *
   * The function, fcn, should accept null or an existing worker as its first argument.
   * It most also return and object with the used worker on the `webWorker`
   * property.  * Example: runPipeline.
   *
   **/
  constructor(poolSize, fcn) {
    this.fcn = fcn;
    this.workerQueue = new Array(poolSize);
    this.workerQueue.fill(null);
    this.runInfo = [];
  }
  /*
   * Run the tasks specified by the arguments in the taskArgsArray that will
   * be passed to the pool fcn.
   *
   * An optional progressCallback will be called with the number of complete
   * tasks and the total number of tasks as arguments every time a task has
   * completed.
   *
   * Returns an object containing a promise ('promise') to communicate results
   * as well as an id ('runId') which can be used to cancel any remaining pending
   * tasks before they complete.
   */
  runTasks(taskArgsArray, progressCallback = null) {
    const info = {
      taskQueue: [],
      results: [],
      addingTasks: false,
      postponed: false,
      runningWorkers: 0,
      index: 0,
      completedTasks: 0,
      progressCallback,
      canceled: false
    };
    this.runInfo.push(info);
    info.index = this.runInfo.length - 1;
    return {
      promise: new Promise((resolve, reject) => {
        info.resolve = resolve;
        info.reject = reject;
        info.results = new Array(taskArgsArray.length);
        info.completedTasks = 0;
        info.addingTasks = true;
        taskArgsArray.forEach((taskArg, index) => {
          this.addTask(info.index, index, taskArg);
        });
        info.addingTasks = false;
      }),
      runId: info.index
    };
  }
  terminateWorkers() {
    for (let index = 0; index < this.workerQueue.length; index++) {
      const worker = this.workerQueue[index];
      if (worker != null) {
        worker.terminate();
      }
      this.workerQueue[index] = null;
    }
  }
  cancel(runId) {
    const info = this.runInfo[runId];
    if (info !== null && info !== void 0) {
      info.canceled = true;
    }
  }
  addTask(infoIndex, resultIndex, taskArgs) {
    const info = this.runInfo[infoIndex];
    if ((info === null || info === void 0 ? void 0 : info.canceled) === true) {
      info.reject("Remaining tasks canceled");
      this.clearTask(info.index);
      return;
    }
    if (this.workerQueue.length > 0) {
      const worker = this.workerQueue.pop();
      info.runningWorkers++;
      this.fcn(worker, ...taskArgs).then((_a) => {
        var { webWorker } = _a, result = __rest(_a, ["webWorker"]);
        this.workerQueue.push(webWorker);
        if (this.runInfo[infoIndex] !== null) {
          info.runningWorkers--;
          info.results[resultIndex] = result;
          info.completedTasks++;
          if (info.progressCallback != null) {
            info.progressCallback(info.completedTasks, info.results.length);
          }
          if (info.taskQueue.length > 0) {
            const reTask = info.taskQueue.shift();
            this.addTask(infoIndex, reTask[0], reTask[1]);
          } else if (!info.addingTasks && info.runningWorkers === 0) {
            const results = info.results;
            info.resolve(results);
            this.clearTask(info.index);
          }
        }
      }).catch((error) => {
        info.reject(error);
        this.clearTask(info.index);
      });
    } else {
      if (info.runningWorkers !== 0 || info.postponed) {
        info.taskQueue.push([resultIndex, taskArgs]);
      } else {
        info.postponed = true;
        setTimeout(() => {
          info.postponed = false;
          this.addTask(info.index, resultIndex, taskArgs);
        }, 50);
      }
    }
  }
  clearTask(clearIndex) {
    this.runInfo[clearIndex].results = [];
    this.runInfo[clearIndex].taskQueue = [];
    this.runInfo[clearIndex].progressCallback = null;
    this.runInfo[clearIndex].canceled = null;
    this.runInfo[clearIndex].reject = () => {
    };
    this.runInfo[clearIndex].resolve = () => {
    };
  }
};
var WorkerPool_default = WorkerPool;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/getTransferables.js
var haveSharedArrayBuffer = typeof globalThis.SharedArrayBuffer !== "undefined";
function getTransferables(data) {
  if (data === void 0 || data === null) {
    return [];
  }
  const transferables = [];
  for (let i = 0; i < data.length; i++) {
    const transferable = getTransferable(data[i]);
    if (transferable !== null) {
      transferables.push(transferable);
    }
  }
  return transferables;
}
function getTransferable(data) {
  if (data === void 0 || data === null) {
    return null;
  }
  let result = null;
  if (data.buffer !== void 0) {
    result = data.buffer;
  } else if (data.byteLength !== void 0) {
    result = data;
  }
  if (haveSharedArrayBuffer && result instanceof SharedArrayBuffer) {
    return null;
  }
  return result;
}
var getTransferables_default = getTransferables;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/bind.js
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/utils.js
var { toString } = Object.prototype;
var { getPrototypeOf } = Object;
var kindOf = ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
var kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
var typeOfTest = (type) => (thing) => typeof thing === type;
var { isArray } = Array;
var isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
var isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
var isString = typeOfTest("string");
var isFunction = typeOfTest("function");
var isNumber = typeOfTest("number");
var isObject = (thing) => thing !== null && typeof thing === "object";
var isBoolean = (thing) => thing === true || thing === false;
var isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype3 = getPrototypeOf(val);
  return (prototype3 === null || prototype3 === Object.prototype || Object.getPrototypeOf(prototype3) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
var isDate = kindOfTest("Date");
var isFile = kindOfTest("File");
var isBlob = kindOfTest("Blob");
var isFileList = kindOfTest("FileList");
var isStream = (val) => isObject(val) && isFunction(val.pipe);
var isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
  kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
};
var isURLSearchParams = kindOfTest("URLSearchParams");
var trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
var _global = (() => {
  if (typeof globalThis !== "undefined")
    return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
var isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const { caseless } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, { allOwnKeys });
  return a;
};
var stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
var inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null)
    return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
var endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
var toArray = (thing) => {
  if (!thing)
    return null;
  if (isArray(thing))
    return thing;
  let i = thing.length;
  if (!isNumber(i))
    return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
var isTypedArray = ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
var forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];
  const iterator = generator.call(obj);
  let result;
  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
var matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
var isHTMLForm = kindOfTest("HTMLFormElement");
var toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
var isRegExp = kindOfTest("RegExp");
var reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
var freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value))
      return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
var toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
var noop = () => {
};
var toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
};
var ALPHA = "abcdefghijklmnopqrstuvwxyz";
var DIGIT = "0123456789";
var ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
var generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = "";
  const { length } = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length | 0];
  }
  return str;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
}
var toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
var isAsyncFn = kindOfTest("AsyncFunction");
var isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
var utils_default = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
};

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/core/AxiosError.js
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}
utils_default.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils_default.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
var prototype = AxiosError.prototype;
var descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, "isAxiosError", { value: true });
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);
  utils_default.toFlatObject(error, axiosError, function filter2(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  AxiosError.call(axiosError, error.message, code, config, request, response);
  axiosError.cause = error;
  axiosError.name = error.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
var AxiosError_default = AxiosError;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/null.js
var null_default = null;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/toFormData.js
function isVisitable(thing) {
  return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
}
function removeBrackets(key) {
  return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path, key, dots) {
  if (!path)
    return key;
  return path.concat(key).map(function each(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils_default.isArray(arr) && !arr.some(isVisitable);
}
var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options) {
  if (!utils_default.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new (null_default || FormData)();
  options = utils_default.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils_default.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
  if (!utils_default.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null)
      return "";
    if (utils_default.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils_default.isBlob(value)) {
      throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
    }
    if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path) {
    let arr = value;
    if (value && !path && typeof value === "object") {
      if (utils_default.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils_default.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path) {
    if (utils_default.isUndefined(value))
      return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path.join("."));
    }
    stack.push(value);
    utils_default.forEach(value, function each(el, key) {
      const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils_default.isString(key) ? key.trim() : key,
        path,
        exposedHelpers
      );
      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils_default.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
var toFormData_default = toFormData;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/AxiosURLSearchParams.js
function encode(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData_default(params, this, options);
}
var prototype2 = AxiosURLSearchParams.prototype;
prototype2.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype2.toString = function toString2(encoder2) {
  const _encode = encoder2 ? function(value) {
    return encoder2.call(this, value, encode);
  } : encode;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
var AxiosURLSearchParams_default = AxiosURLSearchParams;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/buildURL.js
function encode2(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url, params, options) {
  if (!params) {
    return url;
  }
  const _encode = options && options.encode || encode2;
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/core/InterceptorManager.js
var InterceptorManager = class {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils_default.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
};
var InterceptorManager_default = InterceptorManager;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/defaults/transitional.js
var transitional_default = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/platform/browser/classes/URLSearchParams.js
var URLSearchParams_default = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/platform/browser/classes/FormData.js
var FormData_default = typeof FormData !== "undefined" ? FormData : null;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/platform/browser/classes/Blob.js
var Blob_default = typeof Blob !== "undefined" ? Blob : null;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/platform/browser/index.js
var isStandardBrowserEnv = (() => {
  let product;
  if (typeof navigator !== "undefined" && ((product = navigator.product) === "ReactNative" || product === "NativeScript" || product === "NS")) {
    return false;
  }
  return typeof window !== "undefined" && typeof document !== "undefined";
})();
var isStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
var browser_default = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams_default,
    FormData: FormData_default,
    Blob: Blob_default
  },
  isStandardBrowserEnv,
  isStandardBrowserWebWorkerEnv,
  protocols: ["http", "https", "file", "blob", "url", "data"]
};

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/toURLEncodedForm.js
function toURLEncodedForm(data, options) {
  return toFormData_default(data, new browser_default.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (browser_default.isNode && utils_default.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/formDataToJSON.js
function parsePropPath(name) {
  return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils_default.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils_default.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils_default.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path, value, target[name], index);
    if (result && utils_default.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
    const obj = {};
    utils_default.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
var formDataToJSON_default = formDataToJSON;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/defaults/index.js
function stringifySafely(rawValue, parser, encoder2) {
  if (utils_default.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils_default.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder2 || JSON.stringify)(rawValue);
}
var defaults = {
  transitional: transitional_default,
  adapter: ["xhr", "http"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils_default.isObject(data);
    if (isObjectPayload && utils_default.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils_default.isFormData(data);
    if (isFormData2) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
    }
    if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data)) {
      return data;
    }
    if (utils_default.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils_default.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData_default(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: browser_default.classes.FormData,
    Blob: browser_default.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
utils_default.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
  defaults.headers[method] = {};
});
var defaults_default = defaults;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/parseHeaders.js
var ignoreDuplicateOf = utils_default.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
var parseHeaders_default = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i = line.indexOf(":");
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/core/AxiosHeaders.js
var $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils_default.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils_default.isString(value))
    return;
  if (utils_default.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils_default.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils_default.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
var AxiosHeaders = class {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils_default.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders_default(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils_default.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils_default.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils_default.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils_default.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils_default.forEach(this, (value, header) => {
      const key = utils_default.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils_default.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype3 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype3, _header);
        accessors[lHeader] = true;
      }
    }
    utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
};
AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
utils_default.freezeMethods(AxiosHeaders);
var AxiosHeaders_default = AxiosHeaders;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/core/transformData.js
function transformData(fns, response) {
  const config = this || defaults_default;
  const context = response || config;
  const headers = AxiosHeaders_default.from(context.headers);
  let data = context.data;
  utils_default.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/cancel/isCancel.js
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/cancel/CanceledError.js
function CanceledError(message, config, request) {
  AxiosError_default.call(this, message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config, request);
  this.name = "CanceledError";
}
utils_default.inherits(CanceledError, AxiosError_default, {
  __CANCEL__: true
});
var CanceledError_default = CanceledError;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/core/settle.js
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError_default(
      "Request failed with status code " + response.status,
      [AxiosError_default.ERR_BAD_REQUEST, AxiosError_default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/cookies.js
var cookies_default = browser_default.isStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + "=" + encodeURIComponent(value));
        if (utils_default.isNumber(expires)) {
          cookie.push("expires=" + new Date(expires).toGMTString());
        }
        if (utils_default.isString(path)) {
          cookie.push("path=" + path);
        }
        if (utils_default.isString(domain)) {
          cookie.push("domain=" + domain);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        document.cookie = cookie.join("; ");
      },
      read: function read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove: function remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    };
  }()
) : (
  // Non standard browser env (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv() {
    return {
      write: function write() {
      },
      read: function read() {
        return null;
      },
      remove: function remove() {
      }
    };
  }()
);

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/isAbsoluteURL.js
function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/combineURLs.js
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/core/buildFullPath.js
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/isURLSameOrigin.js
var isURLSameOrigin_default = browser_default.isStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function standardBrowserEnv2() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement("a");
    let originURL;
    function resolveURL(url) {
      let href = url;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute("href", href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
      };
    }
    originURL = resolveURL(window.location.href);
    return function isURLSameOrigin(requestURL) {
      const parsed = utils_default.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv2() {
    return function isURLSameOrigin() {
      return true;
    };
  }()
);

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/parseProtocol.js
function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || "";
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/speedometer.js
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
var speedometer_default = speedometer;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/adapters/xhr.js
function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = speedometer_default(50, 250);
  return (e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e
    };
    data[isDownloadStream ? "download" : "upload"] = true;
    listener(data);
  };
}
var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
var xhr_default = isXHRAdapterSupported && function(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = AxiosHeaders_default.from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }
      if (config.signal) {
        config.signal.removeEventListener("abort", onCanceled);
      }
    }
    let contentType;
    if (utils_default.isFormData(requestData)) {
      if (browser_default.isStandardBrowserEnv || browser_default.isStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false);
      } else if (!requestHeaders.getContentType(/^\s*multipart\/form-data/)) {
        requestHeaders.setContentType("multipart/form-data");
      } else if (utils_default.isString(contentType = requestHeaders.getContentType())) {
        requestHeaders.setContentType(contentType.replace(/^\s*(multipart\/form-data);+/, "$1"));
      }
    }
    let request = new XMLHttpRequest();
    if (config.auth) {
      const username = config.auth.username || "";
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
      requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
    }
    const fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
    request.timeout = config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders_default.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));
      request = null;
    };
    request.onerror = function handleError() {
      reject(new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request));
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = config.transitional || transitional_default;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError_default(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
        config,
        request
      ));
      request = null;
    };
    if (browser_default.isStandardBrowserEnv) {
      const xsrfValue = isURLSameOrigin_default(fullPath) && config.xsrfCookieName && cookies_default.read(config.xsrfCookieName);
      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils_default.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = config.responseType;
    }
    if (typeof config.onDownloadProgress === "function") {
      request.addEventListener("progress", progressEventReducer(config.onDownloadProgress, true));
    }
    if (typeof config.onUploadProgress === "function" && request.upload) {
      request.upload.addEventListener("progress", progressEventReducer(config.onUploadProgress));
    }
    if (config.cancelToken || config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);
        request.abort();
        request = null;
      };
      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(fullPath);
    if (protocol && browser_default.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config));
      return;
    }
    request.send(requestData || null);
  });
};

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/adapters/adapters.js
var knownAdapters = {
  http: null_default,
  xhr: xhr_default
};
utils_default.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
var renderReason = (reason) => `- ${reason}`;
var isResolvedHandle = (adapter) => utils_default.isFunction(adapter) || adapter === null || adapter === false;
var adapters_default = {
  getAdapter: (adapters) => {
    adapters = utils_default.isArray(adapters) ? adapters : [adapters];
    const { length } = adapters;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError_default(`Unknown adapter '${id}'`);
        }
      }
      if (adapter) {
        break;
      }
      rejectedReasons[id || "#" + i] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError_default(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter;
  },
  adapters: knownAdapters
};

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/core/dispatchRequest.js
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError_default(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders_default.from(config.headers);
  config.data = transformData.call(
    config,
    config.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters_default.getAdapter(config.adapter || defaults_default.adapter);
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );
    response.headers = AxiosHeaders_default.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/core/mergeConfig.js
var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? thing.toJSON() : thing;
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, caseless) {
    if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
      return utils_default.merge.call({ caseless }, target, source);
    } else if (utils_default.isPlainObject(source)) {
      return utils_default.merge({}, source);
    } else if (utils_default.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, caseless) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };
  utils_default.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/env/data.js
var VERSION = "1.6.0";

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/validator.js
var validators = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
  };
});
var deprecatedWarnings = {};
validators.transitional = function transitional(validator, version2, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError_default(
        formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")),
        AxiosError_default.ERR_DEPRECATED
      );
    }
    if (version2 && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version2 + " and will be removed in the near future"
        )
      );
    }
    return validator ? validator(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === void 0 || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
    }
  }
}
var validator_default = {
  assertOptions,
  validators
};

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/core/Axios.js
var validators2 = validator_default.validators;
var Axios = class {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_default(),
      response: new InterceptorManager_default()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== void 0) {
      validator_default.assertOptions(transitional2, {
        silentJSONParsing: validators2.transitional(validators2.boolean),
        forcedJSONParsing: validators2.transitional(validators2.boolean),
        clarifyTimeoutError: validators2.transitional(validators2.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils_default.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator_default.assertOptions(paramsSerializer, {
          encode: validators2.function,
          serialize: validators2.function
        }, true);
      }
    }
    config.method = (config.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils_default.merge(
      headers.common,
      headers[config.method]
    );
    headers && utils_default.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    i = 0;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};
utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});
utils_default.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url,
        data
      }));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
var Axios_default = Axios;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/cancel/CancelToken.js
var CancelToken = class _CancelToken {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners)
        return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError_default(message, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new _CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
};
var CancelToken_default = CancelToken;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/spread.js
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/isAxiosError.js
function isAxiosError(payload) {
  return utils_default.isObject(payload) && payload.isAxiosError === true;
}

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/helpers/HttpStatusCode.js
var HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
var HttpStatusCode_default = HttpStatusCode;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/lib/axios.js
function createInstance(defaultConfig) {
  const context = new Axios_default(defaultConfig);
  const instance = bind(Axios_default.prototype.request, context);
  utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
  utils_default.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
var axios = createInstance(defaults_default);
axios.Axios = Axios_default;
axios.CanceledError = CanceledError_default;
axios.CancelToken = CancelToken_default;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData_default;
axios.AxiosError = AxiosError_default;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders_default;
axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters_default.getAdapter;
axios.HttpStatusCode = HttpStatusCode_default;
axios.default = axios;
var axios_default = axios;

// node_modules/.pnpm/axios@1.6.0/node_modules/axios/index.js
var {
  Axios: Axios2,
  AxiosError: AxiosError2,
  CanceledError: CanceledError2,
  isCancel: isCancel2,
  CancelToken: CancelToken2,
  VERSION: VERSION2,
  all: all2,
  Cancel,
  isAxiosError: isAxiosError2,
  spread: spread2,
  toFormData: toFormData2,
  AxiosHeaders: AxiosHeaders2,
  HttpStatusCode: HttpStatusCode2,
  formToJSON,
  getAdapter,
  mergeConfig: mergeConfig2
} = axios_default;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/createWebWorkerPromise.js
var import_webworker_promise = __toESM(require_src(), 1);
async function createWebWorkerPromise(existingWorker, pipelineWorkerUrl3) {
  let workerPromise;
  if (existingWorker != null) {
    const itkWebWorker2 = existingWorker;
    if (itkWebWorker2.workerPromise !== void 0) {
      workerPromise = itkWebWorker2.workerPromise;
    } else {
      workerPromise = new import_webworker_promise.default(existingWorker);
    }
    return await Promise.resolve({ webworkerPromise: workerPromise, worker: existingWorker });
  }
  const workerUrl = typeof pipelineWorkerUrl3 === "undefined" ? itkConfig_default.pipelineWorkerUrl : pipelineWorkerUrl3;
  let worker = null;
  const webWorkersUrl = itkConfig_default.webWorkersUrl;
  if (typeof webWorkersUrl !== "undefined") {
    console.warn("itkConfig webWorkersUrl is deprecated. Please use pipelineWorkerUrl with the full path to the pipeline worker.");
    const min = "min.";
    const webWorkerString = webWorkersUrl;
    if (webWorkerString.startsWith("http")) {
      const response = await axios_default.get(`${webWorkerString}/bundles/pipeline.${min}worker.js`, { responseType: "blob" });
      const workerObjectUrl = URL.createObjectURL(response.data);
      worker = new Worker(workerObjectUrl, { type: "module" });
    } else {
      worker = new Worker(`${webWorkerString}/bundles/pipeline.${min}worker.js`, { type: "module" });
    }
  } else if (workerUrl === null) {
    worker = new Worker(new URL("./web-workers/itk-wasm-pipeline.worker.js", import.meta.url), { type: "module" });
  } else {
    if (workerUrl.startsWith("http")) {
      const response = await axios_default.get(workerUrl, { responseType: "blob" });
      const workerObjectUrl = URL.createObjectURL(response.data);
      worker = new Worker(workerObjectUrl, { type: "module" });
    } else {
      worker = new Worker(workerUrl, { type: "module" });
    }
  }
  const webworkerPromise = new import_webworker_promise.default(worker);
  const itkWebWorker = worker;
  itkWebWorker.workerPromise = webworkerPromise;
  return { webworkerPromise, worker: itkWebWorker };
}
var createWebWorkerPromise_default = createWebWorkerPromise;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/pipeline-worker-url.js
var pipelineWorkerUrl;
function getPipelineWorkerUrl() {
  return pipelineWorkerUrl;
}

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/pipelines-base-url.js
var pipelinesBaseUrl;
function getPipelinesBaseUrl() {
  return pipelinesBaseUrl;
}

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/io/getFileExtension.js
function getFileExtension(filePath) {
  let extension = filePath.slice((filePath.lastIndexOf(".") - 1 >>> 0) + 2);
  if (extension.toLowerCase() === "gz") {
    const index = filePath.slice(0, -3).lastIndexOf(".");
    extension = filePath.slice((index - 1 >>> 0) + 2);
  } else if (extension.toLowerCase() === "cbor") {
    const index = filePath.slice(0, -5).lastIndexOf(".");
    extension = filePath.slice((index - 1 >>> 0) + 2);
  } else if (extension.toLowerCase() === "zst") {
    const index = filePath.slice(0, -10).lastIndexOf(".");
    extension = filePath.slice((index - 1 >>> 0) + 2);
  } else if (extension.toLowerCase() === "zip") {
    const index = filePath.slice(0, -4).lastIndexOf(".");
    extension = filePath.slice((index - 1 >>> 0) + 2);
  }
  return extension;
}
var getFileExtension_default = getFileExtension;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/internal/imageTransferables.js
function imageTransferables(image) {
  return [
    image.data,
    image.direction
  ];
}
var imageTransferables_default = imageTransferables;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/internal/meshTransferables.js
function meshTransferables(mesh) {
  return [
    mesh.points,
    mesh.pointData,
    mesh.cells,
    mesh.cellData
  ];
}
var meshTransferables_default = meshTransferables;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/internal/loadEmscriptenModuleMainThread.js
async function loadEmscriptenModuleMainThread(moduleRelativePathOrURL, baseUrl) {
  let modulePrefix = "unknown";
  if (typeof moduleRelativePathOrURL !== "string") {
    modulePrefix = moduleRelativePathOrURL.href;
  } else if (moduleRelativePathOrURL.startsWith("http")) {
    modulePrefix = moduleRelativePathOrURL;
  } else {
    modulePrefix = `${baseUrl}/${moduleRelativePathOrURL}`;
  }
  if (modulePrefix.endsWith(".js")) {
    modulePrefix = modulePrefix.substring(0, modulePrefix.length - 3);
  }
  if (modulePrefix.endsWith(".wasm")) {
    modulePrefix = modulePrefix.substring(0, modulePrefix.length - 5);
  }
  const wasmBinaryPath = `${modulePrefix}.wasm`;
  const response = await axios_default.get(wasmBinaryPath, { responseType: "arraybuffer" });
  const wasmBinary = response.data;
  const fullModulePath = `${modulePrefix}.js`;
  const result = await import(
    /* webpackIgnore: true */
    /* @vite-ignore */
    fullModulePath
  );
  const instantiated = result.default({ wasmBinary });
  return instantiated;
}
var loadEmscriptenModuleMainThread_default = loadEmscriptenModuleMainThread;

// node_modules/.pnpm/wasm-feature-detect@1.6.1/node_modules/wasm-feature-detect/dist/esm/index.js
var simd = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]));

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/pipeline/internal/runPipelineEmscripten.js
var haveSharedArrayBuffer2 = typeof globalThis.SharedArrayBuffer === "function";
var encoder = new TextEncoder();
var decoder = new TextDecoder("utf-8");
function readFileSharedArray(emscriptenModule, path) {
  const opts = { flags: "r", encoding: "binary" };
  const stream = emscriptenModule.fs_open(path, opts.flags);
  const stat = emscriptenModule.fs_stat(path);
  const length = stat.size;
  let arrayBufferData = null;
  if (haveSharedArrayBuffer2) {
    arrayBufferData = new SharedArrayBuffer(length);
  } else {
    arrayBufferData = new ArrayBuffer(length);
  }
  const array = new Uint8Array(arrayBufferData);
  emscriptenModule.fs_read(stream, array, 0, length, 0);
  emscriptenModule.fs_close(stream);
  return array;
}
function memoryUint8SharedArray(emscriptenModule, byteOffset, length) {
  let arrayBufferData = null;
  if (haveSharedArrayBuffer2) {
    arrayBufferData = new SharedArrayBuffer(length);
  } else {
    arrayBufferData = new ArrayBuffer(length);
  }
  const array = new Uint8Array(arrayBufferData);
  const dataArrayView = new Uint8Array(emscriptenModule.HEAPU8.buffer, byteOffset, length);
  array.set(dataArrayView);
  return array;
}
function setPipelineModuleInputArray(emscriptenModule, dataArray, inputIndex, subIndex) {
  let dataPtr = 0;
  if (dataArray !== null) {
    dataPtr = emscriptenModule.ccall("itk_wasm_input_array_alloc", "number", ["number", "number", "number", "number"], [0, inputIndex, subIndex, dataArray.buffer.byteLength]);
    emscriptenModule.HEAPU8.set(new Uint8Array(dataArray.buffer), dataPtr);
  }
  return dataPtr;
}
function setPipelineModuleInputJSON(emscriptenModule, dataObject, inputIndex) {
  const dataJSON = JSON.stringify(dataObject);
  const jsonPtr = emscriptenModule.ccall("itk_wasm_input_json_alloc", "number", ["number", "number", "number"], [0, inputIndex, dataJSON.length]);
  emscriptenModule.writeAsciiToMemory(dataJSON, jsonPtr, false);
}
function getPipelineModuleOutputArray(emscriptenModule, outputIndex, subIndex, componentType) {
  const dataPtr = emscriptenModule.ccall("itk_wasm_output_array_address", "number", ["number", "number", "number"], [0, outputIndex, subIndex]);
  const dataSize = emscriptenModule.ccall("itk_wasm_output_array_size", "number", ["number", "number", "number"], [0, outputIndex, subIndex]);
  const dataUint8 = memoryUint8SharedArray(emscriptenModule, dataPtr, dataSize);
  const data = bufferToTypedArray_default(componentType, dataUint8.buffer);
  return data;
}
function getPipelineModuleOutputJSON(emscriptenModule, outputIndex) {
  const jsonPtr = emscriptenModule.ccall("itk_wasm_output_json_address", "number", ["number", "number"], [0, outputIndex]);
  const dataJSON = emscriptenModule.AsciiToString(jsonPtr);
  const dataObject = JSON.parse(dataJSON);
  return dataObject;
}
function runPipelineEmscripten(pipelineModule, args, outputs, inputs) {
  if (!(inputs == null) && inputs.length > 0) {
    inputs.forEach(function(input, index) {
      var _a;
      switch (input.type) {
        case InterfaceTypes_default.TextStream: {
          const dataArray = encoder.encode(input.data.data);
          const arrayPtr = setPipelineModuleInputArray(pipelineModule, dataArray, index, 0);
          const dataJSON = { size: dataArray.buffer.byteLength, data: `data:application/vnd.itk.address,0:${arrayPtr}` };
          setPipelineModuleInputJSON(pipelineModule, dataJSON, index);
          break;
        }
        case InterfaceTypes_default.JsonCompatible: {
          const dataArray = encoder.encode(JSON.stringify(input.data));
          const arrayPtr = setPipelineModuleInputArray(pipelineModule, dataArray, index, 0);
          const dataJSON = { size: dataArray.buffer.byteLength, data: `data:application/vnd.itk.address,0:${arrayPtr}` };
          setPipelineModuleInputJSON(pipelineModule, dataJSON, index);
          break;
        }
        case InterfaceTypes_default.BinaryStream: {
          const dataArray = input.data.data;
          const arrayPtr = setPipelineModuleInputArray(pipelineModule, dataArray, index, 0);
          const dataJSON = { size: dataArray.buffer.byteLength, data: `data:application/vnd.itk.address,0:${arrayPtr}` };
          setPipelineModuleInputJSON(pipelineModule, dataJSON, index);
          break;
        }
        case InterfaceTypes_default.TextFile: {
          pipelineModule.fs_writeFile(input.data.path, input.data.data);
          break;
        }
        case InterfaceTypes_default.BinaryFile: {
          pipelineModule.fs_writeFile(input.data.path, input.data.data);
          break;
        }
        case InterfaceTypes_default.Image: {
          const image = input.data;
          const dataPtr = setPipelineModuleInputArray(pipelineModule, image.data, index, 0);
          const directionPtr = setPipelineModuleInputArray(pipelineModule, image.direction, index, 1);
          const metadata = typeof ((_a = image.metadata) === null || _a === void 0 ? void 0 : _a.entries) !== "undefined" ? JSON.stringify(Array.from(image.metadata.entries())) : "[]";
          const imageJSON = {
            imageType: image.imageType,
            name: image.name,
            origin: image.origin,
            spacing: image.spacing,
            direction: `data:application/vnd.itk.address,0:${directionPtr}`,
            size: image.size,
            data: `data:application/vnd.itk.address,0:${dataPtr}`,
            metadata
          };
          setPipelineModuleInputJSON(pipelineModule, imageJSON, index);
          break;
        }
        case InterfaceTypes_default.Mesh: {
          const mesh = input.data;
          const pointsPtr = setPipelineModuleInputArray(pipelineModule, mesh.points, index, 0);
          const cellsPtr = setPipelineModuleInputArray(pipelineModule, mesh.cells, index, 1);
          const pointDataPtr = setPipelineModuleInputArray(pipelineModule, mesh.pointData, index, 2);
          const cellDataPtr = setPipelineModuleInputArray(pipelineModule, mesh.cellData, index, 3);
          const meshJSON = {
            meshType: mesh.meshType,
            name: mesh.name,
            numberOfPoints: mesh.numberOfPoints,
            points: `data:application/vnd.itk.address,0:${pointsPtr}`,
            numberOfCells: mesh.numberOfCells,
            cells: `data:application/vnd.itk.address,0:${cellsPtr}`,
            cellBufferSize: mesh.cellBufferSize,
            numberOfPointPixels: mesh.numberOfPointPixels,
            pointData: `data:application/vnd.itk.address,0:${pointDataPtr}`,
            numberOfCellPixels: mesh.numberOfCellPixels,
            cellData: `data:application/vnd.itk.address,0:${cellDataPtr}`
          };
          setPipelineModuleInputJSON(pipelineModule, meshJSON, index);
          break;
        }
        case InterfaceTypes_default.PolyData: {
          const polyData = input.data;
          const pointsPtr = setPipelineModuleInputArray(pipelineModule, polyData.points, index, 0);
          const verticesPtr = setPipelineModuleInputArray(pipelineModule, polyData.vertices, index, 1);
          const linesPtr = setPipelineModuleInputArray(pipelineModule, polyData.lines, index, 2);
          const polygonsPtr = setPipelineModuleInputArray(pipelineModule, polyData.polygons, index, 3);
          const triangleStripsPtr = setPipelineModuleInputArray(pipelineModule, polyData.triangleStrips, index, 4);
          const pointDataPtr = setPipelineModuleInputArray(pipelineModule, polyData.pointData, index, 5);
          const cellDataPtr = setPipelineModuleInputArray(pipelineModule, polyData.pointData, index, 6);
          const polyDataJSON = {
            polyDataType: polyData.polyDataType,
            name: polyData.name,
            numberOfPoints: polyData.numberOfPoints,
            points: `data:application/vnd.itk.address,0:${pointsPtr}`,
            verticesBufferSize: polyData.verticesBufferSize,
            vertices: `data:application/vnd.itk.address,0:${verticesPtr}`,
            linesBufferSize: polyData.linesBufferSize,
            lines: `data:application/vnd.itk.address,0:${linesPtr}`,
            polygonsBufferSize: polyData.polygonsBufferSize,
            polygons: `data:application/vnd.itk.address,0:${polygonsPtr}`,
            triangleStripsBufferSize: polyData.triangleStripsBufferSize,
            triangleStrips: `data:application/vnd.itk.address,0:${triangleStripsPtr}`,
            numberOfPointPixels: polyData.numberOfPointPixels,
            pointData: `data:application/vnd.itk.address,0:${pointDataPtr}`,
            numberOfCellPixels: polyData.numberOfCellPixels,
            cellData: `data:application/vnd.itk.address,0:${cellDataPtr}`
          };
          setPipelineModuleInputJSON(pipelineModule, polyDataJSON, index);
          break;
        }
        case IOTypes_default.Text: {
          pipelineModule.fs_writeFile(input.path, input.data);
          break;
        }
        case IOTypes_default.Binary: {
          pipelineModule.fs_writeFile(input.path, input.data);
          break;
        }
        case IOTypes_default.Image: {
          const image = input.data;
          const imageJSON = {
            imageType: image.imageType,
            name: image.name,
            origin: image.origin,
            spacing: image.spacing,
            direction: "data:application/vnd.itk.path,data/direction.raw",
            size: image.size,
            data: "data:application/vnd.itk.path,data/data.raw"
          };
          pipelineModule.fs_mkdirs(`${input.path}/data`);
          pipelineModule.fs_writeFile(`${input.path}/index.json`, JSON.stringify(imageJSON));
          if (image.data === null) {
            throw Error("image.data is null");
          }
          pipelineModule.fs_writeFile(`${input.path}/data/data.raw`, new Uint8Array(image.data.buffer));
          pipelineModule.fs_writeFile(`${input.path}/data/direction.raw`, new Uint8Array(image.direction.buffer));
          break;
        }
        case IOTypes_default.Mesh: {
          const mesh = input.data;
          const meshJSON = {
            meshType: mesh.meshType,
            name: mesh.name,
            numberOfPoints: mesh.numberOfPoints,
            points: "data:application/vnd.itk.path,data/points.raw",
            numberOfPointPixels: mesh.numberOfPointPixels,
            pointData: "data:application/vnd.itk.path,data/pointData.raw",
            numberOfCells: mesh.numberOfCells,
            cells: "data:application/vnd.itk.path,data/cells.raw",
            numberOfCellPixels: mesh.numberOfCellPixels,
            cellData: "data:application/vnd.itk.path,data/cellData.raw",
            cellBufferSize: mesh.cellBufferSize
          };
          pipelineModule.fs_mkdirs(`${input.path}/data`);
          pipelineModule.fs_writeFile(`${input.path}/index.json`, JSON.stringify(meshJSON));
          if (meshJSON.numberOfPoints > 0) {
            if (mesh.points === null) {
              throw Error("mesh.points is null");
            }
            pipelineModule.fs_writeFile(`${input.path}/data/points.raw`, new Uint8Array(mesh.points.buffer));
          }
          if (meshJSON.numberOfPointPixels > 0) {
            if (mesh.pointData === null) {
              throw Error("mesh.pointData is null");
            }
            pipelineModule.fs_writeFile(`${input.path}/data/pointData.raw`, new Uint8Array(mesh.pointData.buffer));
          }
          if (meshJSON.numberOfCells > 0) {
            if (mesh.cells === null) {
              throw Error("mesh.cells is null");
            }
            pipelineModule.fs_writeFile(`${input.path}/data/cells.raw`, new Uint8Array(mesh.cells.buffer));
          }
          if (meshJSON.numberOfCellPixels > 0) {
            if (mesh.cellData === null) {
              throw Error("mesh.cellData is null");
            }
            pipelineModule.fs_writeFile(`${input.path}/data/cellData.raw`, new Uint8Array(mesh.cellData.buffer));
          }
          break;
        }
        default:
          throw Error("Unsupported input InterfaceType");
      }
    });
  }
  pipelineModule.resetModuleStdout();
  pipelineModule.resetModuleStderr();
  const stackPtr = pipelineModule.stackSave();
  let returnValue = 0;
  try {
    returnValue = pipelineModule.callMain(args.slice());
  } catch (exception) {
    if (typeof exception === "number") {
      console.log("Exception while running pipeline:");
      console.log("stdout:", pipelineModule.getModuleStdout());
      console.error("stderr:", pipelineModule.getModuleStderr());
      if (typeof pipelineModule.getExceptionMessage !== "undefined") {
        console.error("exception:", pipelineModule.getExceptionMessage(exception));
      } else {
        console.error("Build module in Debug mode for exception message information.");
      }
    }
    throw exception;
  } finally {
    pipelineModule.stackRestore(stackPtr);
  }
  const stdout = pipelineModule.getModuleStdout();
  const stderr = pipelineModule.getModuleStderr();
  const populatedOutputs = [];
  if (!(outputs == null) && outputs.length > 0 && returnValue === 0) {
    outputs.forEach(function(output, index) {
      let outputData = null;
      switch (output.type) {
        case InterfaceTypes_default.TextStream: {
          const dataPtr = pipelineModule.ccall("itk_wasm_output_array_address", "number", ["number", "number", "number"], [0, index, 0]);
          const dataSize = pipelineModule.ccall("itk_wasm_output_array_size", "number", ["number", "number", "number"], [0, index, 0]);
          const dataArrayView = new Uint8Array(pipelineModule.HEAPU8.buffer, dataPtr, dataSize);
          outputData = { data: decoder.decode(dataArrayView) };
          break;
        }
        case InterfaceTypes_default.JsonCompatible: {
          const dataPtr = pipelineModule.ccall("itk_wasm_output_array_address", "number", ["number", "number", "number"], [0, index, 0]);
          const dataSize = pipelineModule.ccall("itk_wasm_output_array_size", "number", ["number", "number", "number"], [0, index, 0]);
          const dataArrayView = new Uint8Array(pipelineModule.HEAPU8.buffer, dataPtr, dataSize);
          outputData = JSON.parse(decoder.decode(dataArrayView));
          break;
        }
        case InterfaceTypes_default.BinaryStream: {
          const dataPtr = pipelineModule.ccall("itk_wasm_output_array_address", "number", ["number", "number", "number"], [0, index, 0]);
          const dataSize = pipelineModule.ccall("itk_wasm_output_array_size", "number", ["number", "number", "number"], [0, index, 0]);
          outputData = { data: memoryUint8SharedArray(pipelineModule, dataPtr, dataSize) };
          break;
        }
        case InterfaceTypes_default.TextFile: {
          outputData = { path: output.data.path, data: pipelineModule.fs_readFile(output.data.path, { encoding: "utf8" }) };
          break;
        }
        case InterfaceTypes_default.BinaryFile: {
          outputData = { path: output.data.path, data: readFileSharedArray(pipelineModule, output.data.path) };
          break;
        }
        case InterfaceTypes_default.Image: {
          const image = getPipelineModuleOutputJSON(pipelineModule, index);
          image.data = getPipelineModuleOutputArray(pipelineModule, index, 0, image.imageType.componentType);
          image.direction = getPipelineModuleOutputArray(pipelineModule, index, 1, float_types_default.Float64);
          image.metadata = new Map(image.metadata);
          outputData = image;
          break;
        }
        case InterfaceTypes_default.Mesh: {
          const mesh = getPipelineModuleOutputJSON(pipelineModule, index);
          if (mesh.numberOfPoints > 0) {
            mesh.points = getPipelineModuleOutputArray(pipelineModule, index, 0, mesh.meshType.pointComponentType);
          } else {
            mesh.points = bufferToTypedArray_default(mesh.meshType.pointComponentType, new ArrayBuffer(0));
          }
          if (mesh.numberOfCells > 0) {
            mesh.cells = getPipelineModuleOutputArray(pipelineModule, index, 1, mesh.meshType.cellComponentType);
          } else {
            mesh.cells = bufferToTypedArray_default(mesh.meshType.cellComponentType, new ArrayBuffer(0));
          }
          if (mesh.numberOfPointPixels > 0) {
            mesh.pointData = getPipelineModuleOutputArray(pipelineModule, index, 2, mesh.meshType.pointPixelComponentType);
          } else {
            mesh.pointData = bufferToTypedArray_default(mesh.meshType.pointPixelComponentType, new ArrayBuffer(0));
          }
          if (mesh.numberOfCellPixels > 0) {
            mesh.cellData = getPipelineModuleOutputArray(pipelineModule, index, 3, mesh.meshType.cellPixelComponentType);
          } else {
            mesh.cellData = bufferToTypedArray_default(mesh.meshType.cellPixelComponentType, new ArrayBuffer(0));
          }
          outputData = mesh;
          break;
        }
        case InterfaceTypes_default.PolyData: {
          const polyData = getPipelineModuleOutputJSON(pipelineModule, index);
          if (polyData.numberOfPoints > 0) {
            polyData.points = getPipelineModuleOutputArray(pipelineModule, index, 0, float_types_default.Float32);
          } else {
            polyData.points = new Float32Array();
          }
          if (polyData.verticesBufferSize > 0) {
            polyData.vertices = getPipelineModuleOutputArray(pipelineModule, index, 1, int_types_default.UInt32);
          } else {
            polyData.vertices = new Uint32Array();
          }
          if (polyData.linesBufferSize > 0) {
            polyData.lines = getPipelineModuleOutputArray(pipelineModule, index, 2, int_types_default.UInt32);
          } else {
            polyData.lines = new Uint32Array();
          }
          if (polyData.polygonsBufferSize > 0) {
            polyData.polygons = getPipelineModuleOutputArray(pipelineModule, index, 3, int_types_default.UInt32);
          } else {
            polyData.polygons = new Uint32Array();
          }
          if (polyData.triangleStripsBufferSize > 0) {
            polyData.triangleStrips = getPipelineModuleOutputArray(pipelineModule, index, 4, int_types_default.UInt32);
          } else {
            polyData.triangleStrips = new Uint32Array();
          }
          if (polyData.numberOfPointPixels > 0) {
            polyData.pointData = getPipelineModuleOutputArray(pipelineModule, index, 5, polyData.polyDataType.pointPixelComponentType);
          } else {
            polyData.pointData = bufferToTypedArray_default(polyData.polyDataType.pointPixelComponentType, new ArrayBuffer(0));
          }
          if (polyData.numberOfCellPixels > 0) {
            polyData.cellData = getPipelineModuleOutputArray(pipelineModule, index, 6, polyData.polyDataType.cellPixelComponentType);
          } else {
            polyData.cellData = bufferToTypedArray_default(polyData.polyDataType.cellPixelComponentType, new ArrayBuffer(0));
          }
          outputData = polyData;
          break;
        }
        case IOTypes_default.Text: {
          if (typeof output.path === "undefined") {
            throw new Error("output.path not defined");
          }
          outputData = pipelineModule.fs_readFile(output.path, { encoding: "utf8" });
          break;
        }
        case IOTypes_default.Binary: {
          if (typeof output.path === "undefined") {
            throw new Error("output.path not defined");
          }
          outputData = readFileSharedArray(pipelineModule, output.path);
          break;
        }
        case IOTypes_default.Image: {
          if (typeof output.path === "undefined") {
            throw new Error("output.path not defined");
          }
          const imageJSON = pipelineModule.fs_readFile(`${output.path}/index.json`, { encoding: "utf8" });
          const image = JSON.parse(imageJSON);
          const dataUint8 = readFileSharedArray(pipelineModule, `${output.path}/data/data.raw`);
          image.data = bufferToTypedArray_default(image.imageType.componentType, dataUint8.buffer);
          const directionUint8 = readFileSharedArray(pipelineModule, `${output.path}/data/direction.raw`);
          image.direction = bufferToTypedArray_default(float_types_default.Float64, directionUint8.buffer);
          outputData = image;
          break;
        }
        case IOTypes_default.Mesh: {
          if (typeof output.path === "undefined") {
            throw new Error("output.path not defined");
          }
          const meshJSON = pipelineModule.fs_readFile(`${output.path}/index.json`, { encoding: "utf8" });
          const mesh = JSON.parse(meshJSON);
          if (mesh.numberOfPoints > 0) {
            const dataUint8Points = readFileSharedArray(pipelineModule, `${output.path}/data/points.raw`);
            mesh.points = bufferToTypedArray_default(mesh.meshType.pointComponentType, dataUint8Points.buffer);
          } else {
            mesh.points = bufferToTypedArray_default(mesh.meshType.pointComponentType, new ArrayBuffer(0));
          }
          if (mesh.numberOfPointPixels > 0) {
            const dataUint8PointData = readFileSharedArray(pipelineModule, `${output.path}/data/pointData.raw`);
            mesh.pointData = bufferToTypedArray_default(mesh.meshType.pointPixelComponentType, dataUint8PointData.buffer);
          } else {
            mesh.pointData = bufferToTypedArray_default(mesh.meshType.pointPixelComponentType, new ArrayBuffer(0));
          }
          if (mesh.numberOfCells > 0) {
            const dataUint8Cells = readFileSharedArray(pipelineModule, `${output.path}/data/cells.raw`);
            mesh.cells = bufferToTypedArray_default(mesh.meshType.cellComponentType, dataUint8Cells.buffer);
          } else {
            mesh.cells = bufferToTypedArray_default(mesh.meshType.cellComponentType, new ArrayBuffer(0));
          }
          if (mesh.numberOfCellPixels > 0) {
            const dataUint8CellData = readFileSharedArray(pipelineModule, `${output.path}/data/cellData.raw`);
            mesh.cellData = bufferToTypedArray_default(mesh.meshType.cellPixelComponentType, dataUint8CellData.buffer);
          } else {
            mesh.cellData = bufferToTypedArray_default(mesh.meshType.cellPixelComponentType, new ArrayBuffer(0));
          }
          outputData = mesh;
          break;
        }
        default:
          throw Error("Unsupported output InterfaceType");
      }
      const populatedOutput = {
        type: output.type,
        data: outputData
      };
      populatedOutputs.push(populatedOutput);
    });
  }
  return { returnValue, stdout, stderr, outputs: populatedOutputs };
}
var runPipelineEmscripten_default = runPipelineEmscripten;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/pipeline/runPipeline.js
var pipelineToModule = /* @__PURE__ */ new Map();
async function loadPipelineModule(pipelinePath) {
  let moduleRelativePathOrURL = pipelinePath;
  let pipeline = pipelinePath;
  if (typeof pipelinePath !== "string") {
    moduleRelativePathOrURL = new URL(pipelinePath.href);
    pipeline = moduleRelativePathOrURL.href;
  }
  if (pipelineToModule.has(pipeline)) {
    return pipelineToModule.get(pipeline);
  } else {
    const pipelineModule = await loadEmscriptenModuleMainThread_default(pipelinePath, itkConfig_default.pipelinesUrl);
    pipelineToModule.set(pipeline, pipelineModule);
    return pipelineModule;
  }
}
async function runPipeline(webWorker, pipelinePath, args, outputs, inputs, options) {
  var _a, _b;
  if (!await simd()) {
    const simdErrorMessage = "WebAssembly SIMD support is required -- please update your browser.";
    alert(simdErrorMessage);
    throw new Error(simdErrorMessage);
  }
  if (webWorker === false) {
    const pipelineModule = await loadPipelineModule(pipelinePath.toString());
    const result2 = runPipelineEmscripten_default(pipelineModule, args, outputs, inputs);
    return result2;
  }
  let worker = webWorker;
  const pipelineWorkerUrl3 = (_a = options === null || options === void 0 ? void 0 : options.pipelineWorkerUrl) !== null && _a !== void 0 ? _a : null;
  const pipelineWorkerUrlString = typeof pipelineWorkerUrl3 !== "string" && typeof (pipelineWorkerUrl3 === null || pipelineWorkerUrl3 === void 0 ? void 0 : pipelineWorkerUrl3.href) !== "undefined" ? pipelineWorkerUrl3.href : pipelineWorkerUrl3;
  const { webworkerPromise, worker: usedWorker } = await createWebWorkerPromise_default(worker, pipelineWorkerUrlString);
  worker = usedWorker;
  const transferables = [];
  if (!(inputs == null) && inputs.length > 0) {
    inputs.forEach(function(input) {
      if (input.type === InterfaceTypes_default.BinaryStream) {
        const dataArray = input.data.data;
        transferables.push(dataArray);
      } else if (input.type === InterfaceTypes_default.BinaryFile) {
        const dataArray = input.data.data;
        transferables.push(dataArray);
      } else if (input.type === InterfaceTypes_default.Image) {
        const image = input.data;
        if (image.data === null) {
          throw Error("image data cannot be null");
        }
        transferables.push(...imageTransferables_default(image));
      } else if (input.type === IOTypes_default.Binary) {
        transferables.push(input.data);
      } else if (input.type === IOTypes_default.Image) {
        const image = input.data;
        if (image.data === null) {
          throw Error("image data cannot be null");
        }
        transferables.push(...imageTransferables_default(image));
      } else if (input.type === IOTypes_default.Mesh) {
        const mesh = input.data;
        transferables.push(...meshTransferables_default(mesh));
      }
    });
  }
  const pipelineBaseUrl = (_b = options === null || options === void 0 ? void 0 : options.pipelineBaseUrl) !== null && _b !== void 0 ? _b : "pipelinesUrl";
  const pipelineBaseUrlString = typeof pipelineBaseUrl !== "string" && typeof (pipelineBaseUrl === null || pipelineBaseUrl === void 0 ? void 0 : pipelineBaseUrl.href) !== "undefined" ? pipelineBaseUrl.href : pipelineBaseUrl;
  const result = await webworkerPromise.postMessage({
    operation: "runPipeline",
    config: itkConfig_default,
    pipelinePath: pipelinePath.toString(),
    pipelineBaseUrl: pipelineBaseUrlString,
    args,
    outputs,
    inputs
  }, getTransferables_default(transferables));
  return {
    returnValue: result.returnValue,
    stdout: result.stdout,
    stderr: result.stderr,
    outputs: result.outputs,
    webWorker: worker
  };
}
var runPipeline_default = runPipeline;

// package.json
var package_default = {
  name: "@itk-wasm/image-io",
  version: "0.4.0",
  description: "Input and output for scientific and medical image file formats.",
  type: "module",
  module: "./dist/index.js",
  types: "./dist/index.d.ts",
  exports: {
    ".": {
      types: "./dist/index.d.js",
      browser: "./dist/index.js",
      node: "./dist/index-node.js",
      default: "./dist/index.js"
    }
  },
  scripts: {
    start: "npm run copyShoelaceAssets && vite -c build/vite.config.js",
    test: "npm run test:node && npm run test:browser",
    "test:node": "ava",
    "test:browser": "npm run test:browser:chrome && npm run test:browser:firefox",
    "test:browser:firefox": "start-server-and-test rollup:start http-get://localhost:5004 cypress:runFirefox",
    "test:browser:chrome": "start-server-and-test rollup:start http-get://localhost:5004 cypress:runChrome",
    "test:browser:debug": "start-server-and-test rollup:start http-get://localhost:5004 cypress:open",
    "cypress:open": "npx cypress open",
    "cypress:runChrome": "npx cypress run --browser chrome",
    "cypress:runFirefox": "npx cypress run --browser firefox",
    build: "npm run build:tsc && npm run build:browser:webWorkers && npm run build:browser:workerEmbedded && npm run build:demo",
    "build:browser:webWorkers": "shx mkdir -p dist/web-workers && shx cp node_modules/itk-wasm/dist/core/web-workers/bundles/* ./dist/web-workers/",
    "build:browser:workerEmbedded": "esbuild --loader:.worker.js=dataurl --bundle --format=esm --outfile=./dist/image-io-worker-embedded.js ./src/index-worker-embedded.ts",
    "build:tsc": "tsc --pretty",
    copyShoelaceAssets: "shx mkdir -p test/browser/demo-app/public && shx cp -r node_modules/@shoelace-style/shoelace/dist/assets test/browser/demo-app/public/",
    "build:demo": "npm run copyShoelaceAssets && vite -c build/vite.config.js build",
    "rollup:start": "npm run copyShoelaceAssets && concurrently npm:rollup:dev npm:rollup:preview",
    "rollup:dev": "vite build --config build/vite-rollup-watch.config.ts",
    "rollup:preview": "vite preview --config build/vite-rollup-watch.config.ts"
  },
  keywords: [
    "itk",
    "wasm",
    "webassembly",
    "wasi"
  ],
  author: "",
  license: "Apache-2.0",
  dependencies: {
    "itk-wasm": "^1.0.0-b.152"
  },
  devDependencies: {
    "@shoelace-style/shoelace": "^2.5.2",
    "@types/node": "^20.2.5",
    ava: "^5.3.1",
    concurrently: "^8.2.1",
    cypress: "^13.3.0",
    esbuild: "^0.19.5",
    shx: "^0.3.4",
    "start-server-and-test": "^2.0.1",
    typescript: "^5.0.4",
    vite: "^4.4.11",
    "vite-plugin-static-copy": "^0.17.0"
  },
  repository: {
    type: "git",
    url: "https://github.com/InsightSoftwareConsortium/itk-wasm"
  },
  ava: {
    files: [
      "test/node/**/*",
      "!test/node/common.js"
    ]
  }
};

// src/pipelines-base-url.ts
var pipelinesBaseUrl2;
var defaultPipelinesBaseUrl = `https://cdn.jsdelivr.net/npm/@itk-wasm/image-io@${package_default.version}/dist/pipelines`;
function setPipelinesBaseUrl(baseUrl) {
  pipelinesBaseUrl2 = baseUrl;
}
function getPipelinesBaseUrl2() {
  if (typeof pipelinesBaseUrl2 !== "undefined") {
    return pipelinesBaseUrl2;
  }
  const itkWasmPipelinesBaseUrl = getPipelinesBaseUrl();
  if (typeof itkWasmPipelinesBaseUrl !== "undefined") {
    return itkWasmPipelinesBaseUrl;
  }
  return defaultPipelinesBaseUrl;
}

// src/pipeline-worker-url.ts
var pipelineWorkerUrl2;
var defaultPipelineWorkerUrl = null;
function setPipelineWorkerUrl(workerUrl) {
  pipelineWorkerUrl2 = workerUrl;
}
function getPipelineWorkerUrl2() {
  if (typeof pipelineWorkerUrl2 !== "undefined") {
    return pipelineWorkerUrl2;
  }
  const itkWasmPipelineWorkerUrl = getPipelineWorkerUrl();
  if (typeof itkWasmPipelineWorkerUrl !== "undefined") {
    return itkWasmPipelineWorkerUrl;
  }
  return defaultPipelineWorkerUrl;
}

// src/mime-to-image-io.ts
var mimeToImageIo = /* @__PURE__ */ new Map([
  ["image/jpeg", "jpeg"],
  ["image/png", "png"],
  ["image/tiff", "tiff"],
  ["image/x-ms-bmp", "bmp"],
  ["image/x-bmp", "bmp"],
  ["image/bmp", "bmp"],
  ["application/dicom", "gdcm"]
]);
var mime_to_image_io_default = mimeToImageIo;

// src/extension-to-image-io.ts
var extensionToImageIo = /* @__PURE__ */ new Map([
  ["bmp", "bmp"],
  ["dcm", "gdcm"],
  ["gipl", "gipl"],
  ["gipl.gz", "gipl"],
  ["hdf5", "hdf5"],
  ["jpg", "jpeg"],
  ["jpeg", "jpeg"],
  ["iwi", "wasm"],
  ["iwi.cbor", "wasm"],
  ["iwi.cbor.zst", "wasmZstd"],
  ["lsm", "lsm"],
  ["mnc", "mnc"],
  ["mnc.gz", "mnc"],
  ["mnc2", "mnc"],
  ["mgh", "mgh"],
  ["mgz", "mgh"],
  ["mgh.gz", "mgh"],
  ["mha", "meta"],
  ["mhd", "meta"],
  ["mrc", "mrc"],
  ["nia", "nifti"],
  ["nii", "nifti"],
  ["nii.gz", "nifti"],
  ["hdr", "nifti"],
  ["nrrd", "nrrd"],
  ["nhdr", "nrrd"],
  ["png", "png"],
  ["pic", "bioRad"],
  ["tif", "tiff"],
  ["tiff", "tiff"],
  ["vtk", "vtk"],
  ["isq", "scanco"],
  ["aim", "scanco"],
  ["fdf", "fdf"]
]);
var extension_to_image_io_default = extensionToImageIo;

// src/png-read-image.ts
async function pngReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "png-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var png_read_image_default = pngReadImage;

// src/png-write-image.ts
async function pngWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "png-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var png_write_image_default = pngWriteImage;

// src/meta-read-image.ts
async function metaReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "meta-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var meta_read_image_default = metaReadImage;

// src/meta-write-image.ts
async function metaWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "meta-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var meta_write_image_default = metaWriteImage;

// src/tiff-read-image.ts
async function tiffReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "tiff-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var tiff_read_image_default = tiffReadImage;

// src/tiff-write-image.ts
async function tiffWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "tiff-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var tiff_write_image_default = tiffWriteImage;

// src/nifti-read-image.ts
async function niftiReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "nifti-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var nifti_read_image_default = niftiReadImage;

// src/nifti-write-image.ts
async function niftiWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "nifti-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var nifti_write_image_default = niftiWriteImage;

// src/jpeg-read-image.ts
async function jpegReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "jpeg-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var jpeg_read_image_default = jpegReadImage;

// src/jpeg-write-image.ts
async function jpegWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "jpeg-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var jpeg_write_image_default = jpegWriteImage;

// src/nrrd-read-image.ts
async function nrrdReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "nrrd-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var nrrd_read_image_default = nrrdReadImage;

// src/nrrd-write-image.ts
async function nrrdWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "nrrd-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var nrrd_write_image_default = nrrdWriteImage;

// src/vtk-read-image.ts
async function vtkReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "vtk-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var vtk_read_image_default = vtkReadImage;

// src/vtk-write-image.ts
async function vtkWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "vtk-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var vtk_write_image_default = vtkWriteImage;

// src/bmp-read-image.ts
async function bmpReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "bmp-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var bmp_read_image_default = bmpReadImage;

// src/bmp-write-image.ts
async function bmpWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "bmp-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var bmp_write_image_default = bmpWriteImage;

// src/hdf5-read-image.ts
async function hdf5ReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "hdf5-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var hdf5_read_image_default = hdf5ReadImage;

// src/hdf5-write-image.ts
async function hdf5WriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "hdf5-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var hdf5_write_image_default = hdf5WriteImage;

// src/minc-read-image.ts
async function mincReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "minc-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var minc_read_image_default = mincReadImage;

// src/minc-write-image.ts
async function mincWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "minc-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var minc_write_image_default = mincWriteImage;

// src/mrc-read-image.ts
async function mrcReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "mrc-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var mrc_read_image_default = mrcReadImage;

// src/mrc-write-image.ts
async function mrcWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "mrc-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var mrc_write_image_default = mrcWriteImage;

// src/lsm-read-image.ts
async function lsmReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "lsm-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var lsm_read_image_default = lsmReadImage;

// src/lsm-write-image.ts
async function lsmWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "lsm-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var lsm_write_image_default = lsmWriteImage;

// src/mgh-read-image.ts
async function mghReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "mgh-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var mgh_read_image_default = mghReadImage;

// src/mgh-write-image.ts
async function mghWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "mgh-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var mgh_write_image_default = mghWriteImage;

// src/bio-rad-read-image.ts
async function bioRadReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "bio-rad-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var bio_rad_read_image_default = bioRadReadImage;

// src/bio-rad-write-image.ts
async function bioRadWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "bio-rad-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var bio_rad_write_image_default = bioRadWriteImage;

// src/gipl-read-image.ts
async function giplReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "gipl-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var gipl_read_image_default = giplReadImage;

// src/gipl-write-image.ts
async function giplWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "gipl-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var gipl_write_image_default = giplWriteImage;

// src/ge-adw-read-image.ts
async function geAdwReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "ge-adw-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var ge_adw_read_image_default = geAdwReadImage;

// src/ge-adw-write-image.ts
async function geAdwWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "ge-adw-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var ge_adw_write_image_default = geAdwWriteImage;

// src/ge4-read-image.ts
async function ge4ReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "ge4-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var ge4_read_image_default = ge4ReadImage;

// src/ge4-write-image.ts
async function ge4WriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "ge4-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var ge4_write_image_default = ge4WriteImage;

// src/ge5-read-image.ts
async function ge5ReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "ge5-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var ge5_read_image_default = ge5ReadImage;

// src/ge5-write-image.ts
async function ge5WriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "ge5-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var ge5_write_image_default = ge5WriteImage;

// src/gdcm-read-image.ts
async function gdcmReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "gdcm-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var gdcm_read_image_default = gdcmReadImage;

// src/gdcm-write-image.ts
async function gdcmWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "gdcm-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var gdcm_write_image_default = gdcmWriteImage;

// src/scanco-read-image.ts
async function scancoReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "scanco-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var scanco_read_image_default = scancoReadImage;

// src/scanco-write-image.ts
async function scancoWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "scanco-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var scanco_write_image_default = scancoWriteImage;

// src/fdf-read-image.ts
async function fdfReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "fdf-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var fdf_read_image_default = fdfReadImage;

// src/wasm-read-image.ts
async function wasmReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "wasm-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var wasm_read_image_default = wasmReadImage;

// src/wasm-write-image.ts
async function wasmWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "wasm-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var wasm_write_image_default = wasmWriteImage;

// src/wasm-zstd-read-image.ts
async function wasmZstdReadImage(webWorker, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.Image }
  ];
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  const inputs = [
    { type: InterfaceTypes_default.BinaryFile, data: serializedImageFile }
  ];
  const args = [];
  const serializedImageName = serializedImageFile.path;
  args.push(serializedImageName);
  const couldReadName = "0";
  args.push(couldReadName);
  const imageName = "1";
  args.push(imageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  const pipelinePath = "wasm-zstd-read-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldRead: outputs[0]?.data,
    image: outputs[1]?.data
  };
  return result;
}
var wasm_zstd_read_image_default = wasmZstdReadImage;

// src/wasm-zstd-write-image.ts
async function wasmZstdWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "wasm-zstd-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var wasm_zstd_write_image_default = wasmZstdWriteImage;

// src/image-io-index.ts
var imageIoIndex = /* @__PURE__ */ new Map([
  ["png", [png_read_image_default, png_write_image_default]],
  ["meta", [meta_read_image_default, meta_write_image_default]],
  ["tiff", [tiff_read_image_default, tiff_write_image_default]],
  ["nifti", [nifti_read_image_default, nifti_write_image_default]],
  ["jpeg", [jpeg_read_image_default, jpeg_write_image_default]],
  ["nrrd", [nrrd_read_image_default, nrrd_write_image_default]],
  ["vtk", [vtk_read_image_default, vtk_write_image_default]],
  ["bmp", [bmp_read_image_default, bmp_write_image_default]],
  ["hdf5", [hdf5_read_image_default, hdf5_write_image_default]],
  ["minc", [minc_read_image_default, minc_write_image_default]],
  ["mrc", [mrc_read_image_default, mrc_write_image_default]],
  ["lsm", [lsm_read_image_default, lsm_write_image_default]],
  ["mgh", [mgh_read_image_default, mgh_write_image_default]],
  ["bioRad", [bio_rad_read_image_default, bio_rad_write_image_default]],
  ["gipl", [gipl_read_image_default, gipl_write_image_default]],
  ["geAdw", [ge_adw_read_image_default, ge_adw_write_image_default]],
  ["ge4", [ge4_read_image_default, ge4_write_image_default]],
  ["ge5", [ge5_read_image_default, ge5_write_image_default]],
  ["gdcm", [gdcm_read_image_default, gdcm_write_image_default]],
  ["scanco", [scanco_read_image_default, scanco_write_image_default]],
  ["fdf", [fdf_read_image_default, null]],
  ["wasm", [wasm_read_image_default, wasm_write_image_default]],
  ["wasmZstd", [wasm_zstd_read_image_default, wasm_zstd_write_image_default]]
]);
var image_io_index_default = imageIoIndex;

// src/read-image.ts
async function readImage(webWorker, serializedImage, options = {}) {
  const mimeType = serializedImage.type ?? "";
  const fileName = serializedImage.name ?? serializedImage.path ?? "fileName";
  const extension = getFileExtension_default(fileName).toLowerCase();
  let usedWebWorker = webWorker;
  let serializedImageFile = serializedImage;
  if (serializedImage instanceof Blob) {
    const serializedImageBuffer = await serializedImage.arrayBuffer();
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) };
  }
  let io = null;
  if (mimeType && mime_to_image_io_default.has(mimeType)) {
    io = mime_to_image_io_default.get(mimeType);
  } else if (extension_to_image_io_default.has(extension)) {
    io = extension_to_image_io_default.get(extension);
  } else {
    for (const readerWriter2 of image_io_index_default.values()) {
      if (readerWriter2[0] !== null) {
        let { webWorker: testWebWorker2, couldRead: couldRead2, image: image2 } = await readerWriter2[0](usedWebWorker, { path: serializedImageFile.path, data: serializedImageFile.data.slice() }, { informationOnly: options.informationOnly });
        usedWebWorker = testWebWorker2;
        if (couldRead2) {
          if (typeof options !== "undefined") {
            image2 = castImage_default(image2, options);
          }
          return { webWorker: usedWebWorker, image: image2 };
        }
      }
    }
  }
  if (!io) {
    throw Error("Could not find IO for: " + fileName);
  }
  const readerWriter = image_io_index_default.get(io);
  const reader = readerWriter[0];
  let { webWorker: testWebWorker, couldRead, image } = await reader(usedWebWorker, serializedImageFile, { informationOnly: options.informationOnly });
  usedWebWorker = testWebWorker;
  if (!couldRead) {
    throw Error("Could not read: " + fileName);
  }
  if (typeof options !== "undefined") {
    image = castImage_default(image, options);
  }
  return { webWorker: usedWebWorker, image };
}
var read_image_default = readImage;

// src/read-image-file-series.ts
var numberOfWorkers = typeof globalThis.navigator?.hardwareConcurrency === "number" ? globalThis.navigator.hardwareConcurrency : 6;
var workerPool = new WorkerPool_default(numberOfWorkers, read_image_default);
async function readImageFileSeries(fileList, options) {
  let zSpacing = 1;
  let zOrigin = 0;
  let sortedSeries = false;
  if (typeof options === "object") {
    if (typeof options.zSpacing !== "undefined") {
      zSpacing = options.zSpacing;
    }
    if (typeof options.zOrigin !== "undefined") {
      zOrigin = options.zOrigin;
    }
    if (typeof options.sortedSeries !== "undefined") {
      sortedSeries = options.sortedSeries;
    }
  }
  const fetchFileDescriptions = Array.from(fileList, async function(file) {
    return await file.arrayBuffer().then(function(arrayBuffer) {
      const fileDescription = {
        name: file.name,
        type: file.type,
        data: arrayBuffer
      };
      return fileDescription;
    });
  });
  const fileDescriptions = await Promise.all(fetchFileDescriptions);
  if (!sortedSeries) {
    fileDescriptions.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }
  const taskArgsArray = [];
  for (let index = 0; index < fileDescriptions.length; index++) {
    taskArgsArray.push([fileDescriptions[index].data, fileDescriptions[index].name]);
  }
  const results = await workerPool.runTasks(taskArgsArray).promise;
  const images = results.map((result) => {
    const image = result.image;
    image.imageType.dimension = 3;
    image.size.push(1);
    image.spacing.push(zSpacing);
    image.origin.push(zOrigin);
    image.direction = new Float64Array(9);
    image.direction.fill(0);
    image.direction[0] = 1;
    image.direction[4] = 1;
    image.direction[8] = 1;
    return image;
  });
  let stacked = stackImages_default(images);
  if (typeof options === "object" && (typeof options.componentType !== "undefined" || typeof options.pixelType !== "undefined")) {
    stacked = castImage_default(stacked, options);
  }
  return { image: stacked, webWorkerPool: workerPool };
}
var read_image_file_series_default = readImageFileSeries;

// src/write-image.ts
async function writeImage(webWorker, image, serializedImage, options = {}) {
  let inputImage = image;
  if (typeof options.componentType !== "undefined" || typeof options.pixelType !== "undefined") {
    inputImage = castImage_default(image, options);
  }
  const mimeType = options.mimeType;
  const extension = getFileExtension_default(serializedImage).toLowerCase();
  let usedWebWorker = webWorker;
  let io = null;
  if (typeof mimeType !== "undefined" && mime_to_image_io_default.has(mimeType)) {
    io = mime_to_image_io_default.get(mimeType);
  } else if (extension_to_image_io_default.has(extension)) {
    io = extension_to_image_io_default.get(extension);
  } else {
    for (const readerWriter2 of image_io_index_default.values()) {
      if (readerWriter2[1] !== null) {
        let { webWorker: testWebWorker2, couldWrite: couldWrite2, serializedImage: serializedImageBuffer2 } = await readerWriter2[1](usedWebWorker, copyImage_default(inputImage), serializedImage, options);
        usedWebWorker = testWebWorker2;
        if (couldWrite2) {
          return { webWorker: usedWebWorker, serializedImage: serializedImageBuffer2 };
        }
      }
    }
  }
  if (!io) {
    throw Error("Could not find IO for: " + serializedImage);
  }
  const readerWriter = image_io_index_default.get(io);
  const writer = readerWriter[1];
  let { webWorker: testWebWorker, couldWrite, serializedImage: serializedImageBuffer } = await writer(usedWebWorker, inputImage, serializedImage, options);
  usedWebWorker = testWebWorker;
  if (!couldWrite) {
    throw Error("Could not write: " + serializedImage);
  }
  const result = {
    webWorker: usedWebWorker,
    serializedImage: serializedImageBuffer
  };
  return result;
}
var write_image_default = writeImage;

// src/fdf-write-image.ts
async function fdfWriteImage(webWorker, image, serializedImage, options = {}) {
  const desiredOutputs = [
    { type: InterfaceTypes_default.JsonCompatible },
    { type: InterfaceTypes_default.BinaryFile, data: { path: serializedImage, data: new Uint8Array() } }
  ];
  const inputs = [
    { type: InterfaceTypes_default.Image, data: image }
  ];
  const args = [];
  const imageName = "0";
  args.push(imageName);
  const couldWriteName = "0";
  args.push(couldWriteName);
  const serializedImageName = serializedImage;
  args.push(serializedImageName);
  args.push("--memory-io");
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push("--information-only");
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push("--use-compression");
  }
  const pipelinePath = "fdf-write-image";
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline_default(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl2(), pipelineWorkerUrl: getPipelineWorkerUrl2() });
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr);
  }
  const result = {
    webWorker: usedWebWorker,
    couldWrite: outputs[0]?.data,
    serializedImage: outputs[1]?.data
  };
  return result;
}
var fdf_write_image_default = fdfWriteImage;

// node_modules/.pnpm/itk-wasm@1.0.0-b.152/node_modules/itk-wasm/dist/core/web-workers/bundles/itk-wasm-pipeline.worker.js
var itk_wasm_pipeline_worker_default = 'data:text/javascript;charset=utf-8,var __create = Object.create;%0Avar __defProp = Object.defineProperty;%0Avar __getOwnPropDesc = Object.getOwnPropertyDescriptor;%0Avar __getOwnPropNames = Object.getOwnPropertyNames;%0Avar __getProtoOf = Object.getPrototypeOf;%0Avar __hasOwnProp = Object.prototype.hasOwnProperty;%0Avar __commonJS = (cb, mod) => function __require() {%0A  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;%0A};%0Avar __copyProps = (to, from, except, desc) => {%0A  if (from && typeof from === "object" || typeof from === "function") {%0A    for (let key of __getOwnPropNames(from))%0A      if (!__hasOwnProp.call(to, key) && key !== except)%0A        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });%0A  }%0A  return to;%0A};%0Avar __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(%0A  // If the importer is in node compatibility mode or this is not an ESM%0A  // file that has been converted to a CommonJS file using a Babel-%0A  // compatible transform (i.e. "__esModule" has not been set), then set%0A  // "default" to the CommonJS "module.exports" for node compatibility.%0A  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,%0A  mod%0A));%0A%0A// node_modules/webworker-promise/lib/tiny-emitter.js%0Avar require_tiny_emitter = __commonJS({%0A  "node_modules/webworker-promise/lib/tiny-emitter.js"(exports, module) {%0A    "use strict";%0A    var _createClass = function() {%0A      function defineProperties(target, props) {%0A        for (var i = 0; i < props.length; i++) {%0A          var descriptor = props[i];%0A          descriptor.enumerable = descriptor.enumerable || false;%0A          descriptor.configurable = true;%0A          if ("value" in descriptor)%0A            descriptor.writable = true;%0A          Object.defineProperty(target, descriptor.key, descriptor);%0A        }%0A      }%0A      return function(Constructor, protoProps, staticProps) {%0A        if (protoProps)%0A          defineProperties(Constructor.prototype, protoProps);%0A        if (staticProps)%0A          defineProperties(Constructor, staticProps);%0A        return Constructor;%0A      };%0A    }();%0A    function _classCallCheck(instance2, Constructor) {%0A      if (!(instance2 instanceof Constructor)) {%0A        throw new TypeError("Cannot call a class as a function");%0A      }%0A    }%0A    var TinyEmitter = function() {%0A      function TinyEmitter2() {%0A        _classCallCheck(this, TinyEmitter2);%0A        Object.defineProperty(this, "__listeners", {%0A          value: {},%0A          enumerable: false,%0A          writable: false%0A        });%0A      }%0A      _createClass(TinyEmitter2, [{%0A        key: "emit",%0A        value: function emit(eventName) {%0A          if (!this.__listeners[eventName])%0A            return this;%0A          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {%0A            args[_key - 1] = arguments[_key];%0A          }%0A          var _iteratorNormalCompletion = true;%0A          var _didIteratorError = false;%0A          var _iteratorError = void 0;%0A          try {%0A            for (var _iterator = this.__listeners[eventName][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {%0A              var handler = _step.value;%0A              handler.apply(void 0, args);%0A            }%0A          } catch (err) {%0A            _didIteratorError = true;%0A            _iteratorError = err;%0A          } finally {%0A            try {%0A              if (!_iteratorNormalCompletion && _iterator.return) {%0A                _iterator.return();%0A              }%0A            } finally {%0A              if (_didIteratorError) {%0A                throw _iteratorError;%0A              }%0A            }%0A          }%0A          return this;%0A        }%0A      }, {%0A        key: "once",%0A        value: function once(eventName, handler) {%0A          var _this = this;%0A          var once2 = function once3() {%0A            _this.off(eventName, once3);%0A            handler.apply(void 0, arguments);%0A          };%0A          return this.on(eventName, once2);%0A        }%0A      }, {%0A        key: "on",%0A        value: function on(eventName, handler) {%0A          if (!this.__listeners[eventName])%0A            this.__listeners[eventName] = [];%0A          this.__listeners[eventName].push(handler);%0A          return this;%0A        }%0A      }, {%0A        key: "off",%0A        value: function off(eventName, handler) {%0A          if (handler)%0A            this.__listeners[eventName] = this.__listeners[eventName].filter(function(h) {%0A              return h !== handler;%0A            });%0A          else%0A            this.__listeners[eventName] = [];%0A          return this;%0A        }%0A      }]);%0A      return TinyEmitter2;%0A    }();%0A    module.exports = TinyEmitter;%0A  }%0A});%0A%0A// node_modules/webworker-promise/lib/register.js%0Avar require_register = __commonJS({%0A  "node_modules/webworker-promise/lib/register.js"(exports, module) {%0A    "use strict";%0A    var _createClass = function() {%0A      function defineProperties(target, props) {%0A        for (var i = 0; i < props.length; i++) {%0A          var descriptor = props[i];%0A          descriptor.enumerable = descriptor.enumerable || false;%0A          descriptor.configurable = true;%0A          if ("value" in descriptor)%0A            descriptor.writable = true;%0A          Object.defineProperty(target, descriptor.key, descriptor);%0A        }%0A      }%0A      return function(Constructor, protoProps, staticProps) {%0A        if (protoProps)%0A          defineProperties(Constructor.prototype, protoProps);%0A        if (staticProps)%0A          defineProperties(Constructor, staticProps);%0A        return Constructor;%0A      };%0A    }();%0A    var _get = function get(object, property, receiver) {%0A      if (object === null)%0A        object = Function.prototype;%0A      var desc = Object.getOwnPropertyDescriptor(object, property);%0A      if (desc === void 0) {%0A        var parent = Object.getPrototypeOf(object);%0A        if (parent === null) {%0A          return void 0;%0A        } else {%0A          return get(parent, property, receiver);%0A        }%0A      } else if ("value" in desc) {%0A        return desc.value;%0A      } else {%0A        var getter = desc.get;%0A        if (getter === void 0) {%0A          return void 0;%0A        }%0A        return getter.call(receiver);%0A      }%0A    };%0A    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {%0A      return typeof obj;%0A    } : function(obj) {%0A      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;%0A    };%0A    function _toConsumableArray(arr) {%0A      if (Array.isArray(arr)) {%0A        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {%0A          arr2[i] = arr[i];%0A        }%0A        return arr2;%0A      } else {%0A        return Array.from(arr);%0A      }%0A    }%0A    function _classCallCheck(instance2, Constructor) {%0A      if (!(instance2 instanceof Constructor)) {%0A        throw new TypeError("Cannot call a class as a function");%0A      }%0A    }%0A    function _possibleConstructorReturn(self2, call) {%0A      if (!self2) {%0A        throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called");%0A      }%0A      return call && (typeof call === "object" || typeof call === "function") ? call : self2;%0A    }%0A    function _inherits(subClass, superClass) {%0A      if (typeof superClass !== "function" && superClass !== null) {%0A        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);%0A      }%0A      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });%0A      if (superClass)%0A        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;%0A    }%0A    function _defineProperty(obj, key, value) {%0A      if (key in obj) {%0A        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });%0A      } else {%0A        obj[key] = value;%0A      }%0A      return obj;%0A    }%0A    var TinyEmitter = require_tiny_emitter();%0A    var MESSAGE_RESULT = 0;%0A    var MESSAGE_EVENT = 1;%0A    var RESULT_ERROR = 0;%0A    var RESULT_SUCCESS = 1;%0A    var DEFAULT_HANDLER = "main";%0A    var isPromise = function isPromise2(o) {%0A      return (typeof o === "undefined" ? "undefined" : _typeof(o)) === "object" && o !== null && typeof o.then === "function" && typeof o.catch === "function";%0A    };%0A    function RegisterPromise(fn) {%0A      var handlers = _defineProperty({}, DEFAULT_HANDLER, fn);%0A      var sendPostMessage = self.postMessage.bind(self);%0A      var server = new (function(_TinyEmitter) {%0A        _inherits(WorkerRegister, _TinyEmitter);%0A        function WorkerRegister() {%0A          _classCallCheck(this, WorkerRegister);%0A          return _possibleConstructorReturn(this, (WorkerRegister.__proto__ || Object.getPrototypeOf(WorkerRegister)).apply(this, arguments));%0A        }%0A        _createClass(WorkerRegister, [{%0A          key: "emit",%0A          value: function emit(eventName) {%0A            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {%0A              args[_key - 1] = arguments[_key];%0A            }%0A            if (args.length == 1 && args[0] instanceof TransferableResponse) {%0A              sendPostMessage({ eventName, args }, args[0].transferable);%0A            } else {%0A              sendPostMessage({ eventName, args });%0A            }%0A            return this;%0A          }%0A        }, {%0A          key: "emitLocally",%0A          value: function emitLocally(eventName) {%0A            var _get2;%0A            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {%0A              args[_key2 - 1] = arguments[_key2];%0A            }%0A            (_get2 = _get(WorkerRegister.prototype.__proto__ || Object.getPrototypeOf(WorkerRegister.prototype), "emit", this)).call.apply(_get2, [this, eventName].concat(args));%0A          }%0A        }, {%0A          key: "operation",%0A          value: function operation(name, handler) {%0A            handlers[name] = handler;%0A            return this;%0A          }%0A        }]);%0A        return WorkerRegister;%0A      }(TinyEmitter))();%0A      var run = function run2(messageId, payload, handlerName) {%0A        var onSuccess = function onSuccess2(result2) {%0A          if (result2 && result2 instanceof TransferableResponse) {%0A            sendResult(messageId, RESULT_SUCCESS, result2.payload, result2.transferable);%0A          } else {%0A            sendResult(messageId, RESULT_SUCCESS, result2);%0A          }%0A        };%0A        var onError = function onError2(e) {%0A          sendResult(messageId, RESULT_ERROR, {%0A            message: e.message,%0A            stack: e.stack%0A          });%0A        };%0A        try {%0A          var result = runFn(messageId, payload, handlerName);%0A          if (isPromise(result)) {%0A            result.then(onSuccess).catch(onError);%0A          } else {%0A            onSuccess(result);%0A          }%0A        } catch (e) {%0A          onError(e);%0A        }%0A      };%0A      var runFn = function runFn2(messageId, payload, handlerName) {%0A        var handler = handlers[handlerName || DEFAULT_HANDLER];%0A        if (!handler)%0A          throw new Error("Not found handler for this request");%0A        return handler(payload, sendEvent.bind(null, messageId));%0A      };%0A      var sendResult = function sendResult2(messageId, success, payload) {%0A        var transferable = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : [];%0A        sendPostMessage([MESSAGE_RESULT, messageId, success, payload], transferable);%0A      };%0A      var sendEvent = function sendEvent2(messageId, eventName, payload) {%0A        if (!eventName)%0A          throw new Error("eventName is required");%0A        if (typeof eventName !== "string")%0A          throw new Error("eventName should be string");%0A        sendPostMessage([MESSAGE_EVENT, messageId, eventName, payload]);%0A      };%0A      self.addEventListener("message", function(_ref) {%0A        var data = _ref.data;%0A        if (Array.isArray(data)) {%0A          run.apply(void 0, _toConsumableArray(data));%0A        } else if (data && data.eventName) {%0A          server.emitLocally.apply(server, [data.eventName].concat(_toConsumableArray(data.args)));%0A        }%0A      });%0A      return server;%0A    }%0A    var TransferableResponse = function TransferableResponse2(payload, transferable) {%0A      _classCallCheck(this, TransferableResponse2);%0A      this.payload = payload;%0A      this.transferable = transferable;%0A    };%0A    module.exports = RegisterPromise;%0A    module.exports.TransferableResponse = TransferableResponse;%0A  }%0A});%0A%0A// dist/core/web-workers/itk-wasm-pipeline.worker.js%0Avar import_register2 = __toESM(require_register(), 1);%0A%0A// node_modules/axios/lib/helpers/bind.js%0Afunction bind(fn, thisArg) {%0A  return function wrap() {%0A    return fn.apply(thisArg, arguments);%0A  };%0A}%0A%0A// node_modules/axios/lib/utils.js%0Avar { toString } = Object.prototype;%0Avar { getPrototypeOf } = Object;%0Avar kindOf = ((cache) => (thing) => {%0A  const str = toString.call(thing);%0A  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());%0A})(/* @__PURE__ */ Object.create(null));%0Avar kindOfTest = (type) => {%0A  type = type.toLowerCase();%0A  return (thing) => kindOf(thing) === type;%0A};%0Avar typeOfTest = (type) => (thing) => typeof thing === type;%0Avar { isArray } = Array;%0Avar isUndefined = typeOfTest("undefined");%0Afunction isBuffer(val) {%0A  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);%0A}%0Avar isArrayBuffer = kindOfTest("ArrayBuffer");%0Afunction isArrayBufferView(val) {%0A  let result;%0A  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {%0A    result = ArrayBuffer.isView(val);%0A  } else {%0A    result = val && val.buffer && isArrayBuffer(val.buffer);%0A  }%0A  return result;%0A}%0Avar isString = typeOfTest("string");%0Avar isFunction = typeOfTest("function");%0Avar isNumber = typeOfTest("number");%0Avar isObject = (thing) => thing !== null && typeof thing === "object";%0Avar isBoolean = (thing) => thing === true || thing === false;%0Avar isPlainObject = (val) => {%0A  if (kindOf(val) !== "object") {%0A    return false;%0A  }%0A  const prototype3 = getPrototypeOf(val);%0A  return (prototype3 === null || prototype3 === Object.prototype || Object.getPrototypeOf(prototype3) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);%0A};%0Avar isDate = kindOfTest("Date");%0Avar isFile = kindOfTest("File");%0Avar isBlob = kindOfTest("Blob");%0Avar isFileList = kindOfTest("FileList");%0Avar isStream = (val) => isObject(val) && isFunction(val.pipe);%0Avar isFormData = (thing) => {%0A  let kind;%0A  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance%0A  kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));%0A};%0Avar isURLSearchParams = kindOfTest("URLSearchParams");%0Avar trim = (str) => str.trim ? str.trim() : str.replace(/^[\\s\\uFEFF\\xA0]+|[\\s\\uFEFF\\xA0]+$/g, "");%0Afunction forEach(obj, fn, { allOwnKeys = false } = {}) {%0A  if (obj === null || typeof obj === "undefined") {%0A    return;%0A  }%0A  let i;%0A  let l;%0A  if (typeof obj !== "object") {%0A    obj = [obj];%0A  }%0A  if (isArray(obj)) {%0A    for (i = 0, l = obj.length; i < l; i++) {%0A      fn.call(null, obj[i], i, obj);%0A    }%0A  } else {%0A    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);%0A    const len = keys.length;%0A    let key;%0A    for (i = 0; i < len; i++) {%0A      key = keys[i];%0A      fn.call(null, obj[key], key, obj);%0A    }%0A  }%0A}%0Afunction findKey(obj, key) {%0A  key = key.toLowerCase();%0A  const keys = Object.keys(obj);%0A  let i = keys.length;%0A  let _key;%0A  while (i-- > 0) {%0A    _key = keys[i];%0A    if (key === _key.toLowerCase()) {%0A      return _key;%0A    }%0A  }%0A  return null;%0A}%0Avar _global = (() => {%0A  if (typeof globalThis !== "undefined")%0A    return globalThis;%0A  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;%0A})();%0Avar isContextDefined = (context) => !isUndefined(context) && context !== _global;%0Afunction merge() {%0A  const { caseless } = isContextDefined(this) && this || {};%0A  const result = {};%0A  const assignValue = (val, key) => {%0A    const targetKey = caseless && findKey(result, key) || key;%0A    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {%0A      result[targetKey] = merge(result[targetKey], val);%0A    } else if (isPlainObject(val)) {%0A      result[targetKey] = merge({}, val);%0A    } else if (isArray(val)) {%0A      result[targetKey] = val.slice();%0A    } else {%0A      result[targetKey] = val;%0A    }%0A  };%0A  for (let i = 0, l = arguments.length; i < l; i++) {%0A    arguments[i] && forEach(arguments[i], assignValue);%0A  }%0A  return result;%0A}%0Avar extend = (a, b, thisArg, { allOwnKeys } = {}) => {%0A  forEach(b, (val, key) => {%0A    if (thisArg && isFunction(val)) {%0A      a[key] = bind(val, thisArg);%0A    } else {%0A      a[key] = val;%0A    }%0A  }, { allOwnKeys });%0A  return a;%0A};%0Avar stripBOM = (content) => {%0A  if (content.charCodeAt(0) === 65279) {%0A    content = content.slice(1);%0A  }%0A  return content;%0A};%0Avar inherits = (constructor, superConstructor, props, descriptors2) => {%0A  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);%0A  constructor.prototype.constructor = constructor;%0A  Object.defineProperty(constructor, "super", {%0A    value: superConstructor.prototype%0A  });%0A  props && Object.assign(constructor.prototype, props);%0A};%0Avar toFlatObject = (sourceObj, destObj, filter2, propFilter) => {%0A  let props;%0A  let i;%0A  let prop;%0A  const merged = {};%0A  destObj = destObj || {};%0A  if (sourceObj == null)%0A    return destObj;%0A  do {%0A    props = Object.getOwnPropertyNames(sourceObj);%0A    i = props.length;%0A    while (i-- > 0) {%0A      prop = props[i];%0A      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {%0A        destObj[prop] = sourceObj[prop];%0A        merged[prop] = true;%0A      }%0A    }%0A    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);%0A  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);%0A  return destObj;%0A};%0Avar endsWith = (str, searchString, position) => {%0A  str = String(str);%0A  if (position === void 0 || position > str.length) {%0A    position = str.length;%0A  }%0A  position -= searchString.length;%0A  const lastIndex = str.indexOf(searchString, position);%0A  return lastIndex !== -1 && lastIndex === position;%0A};%0Avar toArray = (thing) => {%0A  if (!thing)%0A    return null;%0A  if (isArray(thing))%0A    return thing;%0A  let i = thing.length;%0A  if (!isNumber(i))%0A    return null;%0A  const arr = new Array(i);%0A  while (i-- > 0) {%0A    arr[i] = thing[i];%0A  }%0A  return arr;%0A};%0Avar isTypedArray = ((TypedArray) => {%0A  return (thing) => {%0A    return TypedArray && thing instanceof TypedArray;%0A  };%0A})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));%0Avar forEachEntry = (obj, fn) => {%0A  const generator = obj && obj[Symbol.iterator];%0A  const iterator = generator.call(obj);%0A  let result;%0A  while ((result = iterator.next()) && !result.done) {%0A    const pair = result.value;%0A    fn.call(obj, pair[0], pair[1]);%0A  }%0A};%0Avar matchAll = (regExp, str) => {%0A  let matches;%0A  const arr = [];%0A  while ((matches = regExp.exec(str)) !== null) {%0A    arr.push(matches);%0A  }%0A  return arr;%0A};%0Avar isHTMLForm = kindOfTest("HTMLFormElement");%0Avar toCamelCase = (str) => {%0A  return str.toLowerCase().replace(%0A    /[-_\\s]([a-z\\d])(\\w*)/g,%0A    function replacer(m, p1, p2) {%0A      return p1.toUpperCase() + p2;%0A    }%0A  );%0A};%0Avar hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);%0Avar isRegExp = kindOfTest("RegExp");%0Avar reduceDescriptors = (obj, reducer) => {%0A  const descriptors2 = Object.getOwnPropertyDescriptors(obj);%0A  const reducedDescriptors = {};%0A  forEach(descriptors2, (descriptor, name) => {%0A    if (reducer(descriptor, name, obj) !== false) {%0A      reducedDescriptors[name] = descriptor;%0A    }%0A  });%0A  Object.defineProperties(obj, reducedDescriptors);%0A};%0Avar freezeMethods = (obj) => {%0A  reduceDescriptors(obj, (descriptor, name) => {%0A    if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {%0A      return false;%0A    }%0A    const value = obj[name];%0A    if (!isFunction(value))%0A      return;%0A    descriptor.enumerable = false;%0A    if ("writable" in descriptor) {%0A      descriptor.writable = false;%0A      return;%0A    }%0A    if (!descriptor.set) {%0A      descriptor.set = () => {%0A        throw Error("Can not rewrite read-only method \'" + name + "\'");%0A      };%0A    }%0A  });%0A};%0Avar toObjectSet = (arrayOrString, delimiter) => {%0A  const obj = {};%0A  const define = (arr) => {%0A    arr.forEach((value) => {%0A      obj[value] = true;%0A    });%0A  };%0A  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));%0A  return obj;%0A};%0Avar noop = () => {%0A};%0Avar toFiniteNumber = (value, defaultValue) => {%0A  value = +value;%0A  return Number.isFinite(value) ? value : defaultValue;%0A};%0Avar ALPHA = "abcdefghijklmnopqrstuvwxyz";%0Avar DIGIT = "0123456789";%0Avar ALPHABET = {%0A  DIGIT,%0A  ALPHA,%0A  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT%0A};%0Avar generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {%0A  let str = "";%0A  const { length } = alphabet;%0A  while (size--) {%0A    str += alphabet[Math.random() * length | 0];%0A  }%0A  return str;%0A};%0Afunction isSpecCompliantForm(thing) {%0A  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);%0A}%0Avar toJSONObject = (obj) => {%0A  const stack = new Array(10);%0A  const visit = (source, i) => {%0A    if (isObject(source)) {%0A      if (stack.indexOf(source) >= 0) {%0A        return;%0A      }%0A      if (!("toJSON" in source)) {%0A        stack[i] = source;%0A        const target = isArray(source) ? [] : {};%0A        forEach(source, (value, key) => {%0A          const reducedValue = visit(value, i + 1);%0A          !isUndefined(reducedValue) && (target[key] = reducedValue);%0A        });%0A        stack[i] = void 0;%0A        return target;%0A      }%0A    }%0A    return source;%0A  };%0A  return visit(obj, 0);%0A};%0Avar isAsyncFn = kindOfTest("AsyncFunction");%0Avar isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);%0Avar utils_default = {%0A  isArray,%0A  isArrayBuffer,%0A  isBuffer,%0A  isFormData,%0A  isArrayBufferView,%0A  isString,%0A  isNumber,%0A  isBoolean,%0A  isObject,%0A  isPlainObject,%0A  isUndefined,%0A  isDate,%0A  isFile,%0A  isBlob,%0A  isRegExp,%0A  isFunction,%0A  isStream,%0A  isURLSearchParams,%0A  isTypedArray,%0A  isFileList,%0A  forEach,%0A  merge,%0A  extend,%0A  trim,%0A  stripBOM,%0A  inherits,%0A  toFlatObject,%0A  kindOf,%0A  kindOfTest,%0A  endsWith,%0A  toArray,%0A  forEachEntry,%0A  matchAll,%0A  isHTMLForm,%0A  hasOwnProperty,%0A  hasOwnProp: hasOwnProperty,%0A  // an alias to avoid ESLint no-prototype-builtins detection%0A  reduceDescriptors,%0A  freezeMethods,%0A  toObjectSet,%0A  toCamelCase,%0A  noop,%0A  toFiniteNumber,%0A  findKey,%0A  global: _global,%0A  isContextDefined,%0A  ALPHABET,%0A  generateString,%0A  isSpecCompliantForm,%0A  toJSONObject,%0A  isAsyncFn,%0A  isThenable%0A};%0A%0A// node_modules/axios/lib/core/AxiosError.js%0Afunction AxiosError(message, code, config, request, response) {%0A  Error.call(this);%0A  if (Error.captureStackTrace) {%0A    Error.captureStackTrace(this, this.constructor);%0A  } else {%0A    this.stack = new Error().stack;%0A  }%0A  this.message = message;%0A  this.name = "AxiosError";%0A  code && (this.code = code);%0A  config && (this.config = config);%0A  request && (this.request = request);%0A  response && (this.response = response);%0A}%0Autils_default.inherits(AxiosError, Error, {%0A  toJSON: function toJSON() {%0A    return {%0A      // Standard%0A      message: this.message,%0A      name: this.name,%0A      // Microsoft%0A      description: this.description,%0A      number: this.number,%0A      // Mozilla%0A      fileName: this.fileName,%0A      lineNumber: this.lineNumber,%0A      columnNumber: this.columnNumber,%0A      stack: this.stack,%0A      // Axios%0A      config: utils_default.toJSONObject(this.config),%0A      code: this.code,%0A      status: this.response && this.response.status ? this.response.status : null%0A    };%0A  }%0A});%0Avar prototype = AxiosError.prototype;%0Avar descriptors = {};%0A[%0A  "ERR_BAD_OPTION_VALUE",%0A  "ERR_BAD_OPTION",%0A  "ECONNABORTED",%0A  "ETIMEDOUT",%0A  "ERR_NETWORK",%0A  "ERR_FR_TOO_MANY_REDIRECTS",%0A  "ERR_DEPRECATED",%0A  "ERR_BAD_RESPONSE",%0A  "ERR_BAD_REQUEST",%0A  "ERR_CANCELED",%0A  "ERR_NOT_SUPPORT",%0A  "ERR_INVALID_URL"%0A  // eslint-disable-next-line func-names%0A].forEach((code) => {%0A  descriptors[code] = { value: code };%0A});%0AObject.defineProperties(AxiosError, descriptors);%0AObject.defineProperty(prototype, "isAxiosError", { value: true });%0AAxiosError.from = (error, code, config, request, response, customProps) => {%0A  const axiosError = Object.create(prototype);%0A  utils_default.toFlatObject(error, axiosError, function filter2(obj) {%0A    return obj !== Error.prototype;%0A  }, (prop) => {%0A    return prop !== "isAxiosError";%0A  });%0A  AxiosError.call(axiosError, error.message, code, config, request, response);%0A  axiosError.cause = error;%0A  axiosError.name = error.name;%0A  customProps && Object.assign(axiosError, customProps);%0A  return axiosError;%0A};%0Avar AxiosError_default = AxiosError;%0A%0A// node_modules/axios/lib/helpers/null.js%0Avar null_default = null;%0A%0A// node_modules/axios/lib/helpers/toFormData.js%0Afunction isVisitable(thing) {%0A  return utils_default.isPlainObject(thing) || utils_default.isArray(thing);%0A}%0Afunction removeBrackets(key) {%0A  return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;%0A}%0Afunction renderKey(path, key, dots) {%0A  if (!path)%0A    return key;%0A  return path.concat(key).map(function each(token, i) {%0A    token = removeBrackets(token);%0A    return !dots && i ? "[" + token + "]" : token;%0A  }).join(dots ? "." : "");%0A}%0Afunction isFlatArray(arr) {%0A  return utils_default.isArray(arr) && !arr.some(isVisitable);%0A}%0Avar predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {%0A  return /^is[A-Z]/.test(prop);%0A});%0Afunction toFormData(obj, formData, options) {%0A  if (!utils_default.isObject(obj)) {%0A    throw new TypeError("target must be an object");%0A  }%0A  formData = formData || new (null_default || FormData)();%0A  options = utils_default.toFlatObject(options, {%0A    metaTokens: true,%0A    dots: false,%0A    indexes: false%0A  }, false, function defined(option, source) {%0A    return !utils_default.isUndefined(source[option]);%0A  });%0A  const metaTokens = options.metaTokens;%0A  const visitor = options.visitor || defaultVisitor;%0A  const dots = options.dots;%0A  const indexes = options.indexes;%0A  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;%0A  const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);%0A  if (!utils_default.isFunction(visitor)) {%0A    throw new TypeError("visitor must be a function");%0A  }%0A  function convertValue(value) {%0A    if (value === null)%0A      return "";%0A    if (utils_default.isDate(value)) {%0A      return value.toISOString();%0A    }%0A    if (!useBlob && utils_default.isBlob(value)) {%0A      throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");%0A    }%0A    if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {%0A      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);%0A    }%0A    return value;%0A  }%0A  function defaultVisitor(value, key, path) {%0A    let arr = value;%0A    if (value && !path && typeof value === "object") {%0A      if (utils_default.endsWith(key, "{}")) {%0A        key = metaTokens ? key : key.slice(0, -2);%0A        value = JSON.stringify(value);%0A      } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {%0A        key = removeBrackets(key);%0A        arr.forEach(function each(el, index) {%0A          !(utils_default.isUndefined(el) || el === null) && formData.append(%0A            // eslint-disable-next-line no-nested-ternary%0A            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",%0A            convertValue(el)%0A          );%0A        });%0A        return false;%0A      }%0A    }%0A    if (isVisitable(value)) {%0A      return true;%0A    }%0A    formData.append(renderKey(path, key, dots), convertValue(value));%0A    return false;%0A  }%0A  const stack = [];%0A  const exposedHelpers = Object.assign(predicates, {%0A    defaultVisitor,%0A    convertValue,%0A    isVisitable%0A  });%0A  function build(value, path) {%0A    if (utils_default.isUndefined(value))%0A      return;%0A    if (stack.indexOf(value) !== -1) {%0A      throw Error("Circular reference detected in " + path.join("."));%0A    }%0A    stack.push(value);%0A    utils_default.forEach(value, function each(el, key) {%0A      const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(%0A        formData,%0A        el,%0A        utils_default.isString(key) ? key.trim() : key,%0A        path,%0A        exposedHelpers%0A      );%0A      if (result === true) {%0A        build(el, path ? path.concat(key) : [key]);%0A      }%0A    });%0A    stack.pop();%0A  }%0A  if (!utils_default.isObject(obj)) {%0A    throw new TypeError("data must be an object");%0A  }%0A  build(obj);%0A  return formData;%0A}%0Avar toFormData_default = toFormData;%0A%0A// node_modules/axios/lib/helpers/AxiosURLSearchParams.js%0Afunction encode(str) {%0A  const charMap = {%0A    "!": "%2521",%0A    "\'": "%2527",%0A    "(": "%2528",%0A    ")": "%2529",%0A    "~": "%257E",%0A    "%2520": "+",%0A    "%2500": "\\0"%0A  };%0A  return encodeURIComponent(str).replace(/[!\'()~]|%2520|%2500/g, function replacer(match) {%0A    return charMap[match];%0A  });%0A}%0Afunction AxiosURLSearchParams(params, options) {%0A  this._pairs = [];%0A  params && toFormData_default(params, this, options);%0A}%0Avar prototype2 = AxiosURLSearchParams.prototype;%0Aprototype2.append = function append(name, value) {%0A  this._pairs.push([name, value]);%0A};%0Aprototype2.toString = function toString2(encoder2) {%0A  const _encode = encoder2 ? function(value) {%0A    return encoder2.call(this, value, encode);%0A  } : encode;%0A  return this._pairs.map(function each(pair) {%0A    return _encode(pair[0]) + "=" + _encode(pair[1]);%0A  }, "").join("&");%0A};%0Avar AxiosURLSearchParams_default = AxiosURLSearchParams;%0A%0A// node_modules/axios/lib/helpers/buildURL.js%0Afunction encode2(val) {%0A  return encodeURIComponent(val).replace(/%253A/gi, ":").replace(/%2524/g, "$").replace(/%252C/gi, ",").replace(/%2520/g, "+").replace(/%255B/gi, "[").replace(/%255D/gi, "]");%0A}%0Afunction buildURL(url, params, options) {%0A  if (!params) {%0A    return url;%0A  }%0A  const _encode = options && options.encode || encode2;%0A  const serializeFn = options && options.serialize;%0A  let serializedParams;%0A  if (serializeFn) {%0A    serializedParams = serializeFn(params, options);%0A  } else {%0A    serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, options).toString(_encode);%0A  }%0A  if (serializedParams) {%0A    const hashmarkIndex = url.indexOf("%23");%0A    if (hashmarkIndex !== -1) {%0A      url = url.slice(0, hashmarkIndex);%0A    }%0A    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;%0A  }%0A  return url;%0A}%0A%0A// node_modules/axios/lib/core/InterceptorManager.js%0Avar InterceptorManager = class {%0A  constructor() {%0A    this.handlers = [];%0A  }%0A  /**%0A   * Add a new interceptor to the stack%0A   *%0A   * @param {Function} fulfilled The function to handle `then` for a `Promise`%0A   * @param {Function} rejected The function to handle `reject` for a `Promise`%0A   *%0A   * @return {Number} An ID used to remove interceptor later%0A   */%0A  use(fulfilled, rejected, options) {%0A    this.handlers.push({%0A      fulfilled,%0A      rejected,%0A      synchronous: options ? options.synchronous : false,%0A      runWhen: options ? options.runWhen : null%0A    });%0A    return this.handlers.length - 1;%0A  }%0A  /**%0A   * Remove an interceptor from the stack%0A   *%0A   * @param {Number} id The ID that was returned by `use`%0A   *%0A   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise%0A   */%0A  eject(id) {%0A    if (this.handlers[id]) {%0A      this.handlers[id] = null;%0A    }%0A  }%0A  /**%0A   * Clear all interceptors from the stack%0A   *%0A   * @returns {void}%0A   */%0A  clear() {%0A    if (this.handlers) {%0A      this.handlers = [];%0A    }%0A  }%0A  /**%0A   * Iterate over all the registered interceptors%0A   *%0A   * This method is particularly useful for skipping over any%0A   * interceptors that may have become `null` calling `eject`.%0A   *%0A   * @param {Function} fn The function to call for each interceptor%0A   *%0A   * @returns {void}%0A   */%0A  forEach(fn) {%0A    utils_default.forEach(this.handlers, function forEachHandler(h) {%0A      if (h !== null) {%0A        fn(h);%0A      }%0A    });%0A  }%0A};%0Avar InterceptorManager_default = InterceptorManager;%0A%0A// node_modules/axios/lib/defaults/transitional.js%0Avar transitional_default = {%0A  silentJSONParsing: true,%0A  forcedJSONParsing: true,%0A  clarifyTimeoutError: false%0A};%0A%0A// node_modules/axios/lib/platform/browser/classes/URLSearchParams.js%0Avar URLSearchParams_default = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default;%0A%0A// node_modules/axios/lib/platform/browser/classes/FormData.js%0Avar FormData_default = typeof FormData !== "undefined" ? FormData : null;%0A%0A// node_modules/axios/lib/platform/browser/classes/Blob.js%0Avar Blob_default = typeof Blob !== "undefined" ? Blob : null;%0A%0A// node_modules/axios/lib/platform/browser/index.js%0Avar isStandardBrowserEnv = (() => {%0A  let product;%0A  if (typeof navigator !== "undefined" && ((product = navigator.product) === "ReactNative" || product === "NativeScript" || product === "NS")) {%0A    return false;%0A  }%0A  return typeof window !== "undefined" && typeof document !== "undefined";%0A})();%0Avar isStandardBrowserWebWorkerEnv = (() => {%0A  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef%0A  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";%0A})();%0Avar browser_default = {%0A  isBrowser: true,%0A  classes: {%0A    URLSearchParams: URLSearchParams_default,%0A    FormData: FormData_default,%0A    Blob: Blob_default%0A  },%0A  isStandardBrowserEnv,%0A  isStandardBrowserWebWorkerEnv,%0A  protocols: ["http", "https", "file", "blob", "url", "data"]%0A};%0A%0A// node_modules/axios/lib/helpers/toURLEncodedForm.js%0Afunction toURLEncodedForm(data, options) {%0A  return toFormData_default(data, new browser_default.classes.URLSearchParams(), Object.assign({%0A    visitor: function(value, key, path, helpers) {%0A      if (browser_default.isNode && utils_default.isBuffer(value)) {%0A        this.append(key, value.toString("base64"));%0A        return false;%0A      }%0A      return helpers.defaultVisitor.apply(this, arguments);%0A    }%0A  }, options));%0A}%0A%0A// node_modules/axios/lib/helpers/formDataToJSON.js%0Afunction parsePropPath(name) {%0A  return utils_default.matchAll(/\\w+|\\[(\\w*)]/g, name).map((match) => {%0A    return match[0] === "[]" ? "" : match[1] || match[0];%0A  });%0A}%0Afunction arrayToObject(arr) {%0A  const obj = {};%0A  const keys = Object.keys(arr);%0A  let i;%0A  const len = keys.length;%0A  let key;%0A  for (i = 0; i < len; i++) {%0A    key = keys[i];%0A    obj[key] = arr[key];%0A  }%0A  return obj;%0A}%0Afunction formDataToJSON(formData) {%0A  function buildPath(path, value, target, index) {%0A    let name = path[index++];%0A    const isNumericKey = Number.isFinite(+name);%0A    const isLast = index >= path.length;%0A    name = !name && utils_default.isArray(target) ? target.length : name;%0A    if (isLast) {%0A      if (utils_default.hasOwnProp(target, name)) {%0A        target[name] = [target[name], value];%0A      } else {%0A        target[name] = value;%0A      }%0A      return !isNumericKey;%0A    }%0A    if (!target[name] || !utils_default.isObject(target[name])) {%0A      target[name] = [];%0A    }%0A    const result = buildPath(path, value, target[name], index);%0A    if (result && utils_default.isArray(target[name])) {%0A      target[name] = arrayToObject(target[name]);%0A    }%0A    return !isNumericKey;%0A  }%0A  if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {%0A    const obj = {};%0A    utils_default.forEachEntry(formData, (name, value) => {%0A      buildPath(parsePropPath(name), value, obj, 0);%0A    });%0A    return obj;%0A  }%0A  return null;%0A}%0Avar formDataToJSON_default = formDataToJSON;%0A%0A// node_modules/axios/lib/defaults/index.js%0Avar DEFAULT_CONTENT_TYPE = {%0A  "Content-Type": void 0%0A};%0Afunction stringifySafely(rawValue, parser, encoder2) {%0A  if (utils_default.isString(rawValue)) {%0A    try {%0A      (parser || JSON.parse)(rawValue);%0A      return utils_default.trim(rawValue);%0A    } catch (e) {%0A      if (e.name !== "SyntaxError") {%0A        throw e;%0A      }%0A    }%0A  }%0A  return (encoder2 || JSON.stringify)(rawValue);%0A}%0Avar defaults = {%0A  transitional: transitional_default,%0A  adapter: ["xhr", "http"],%0A  transformRequest: [function transformRequest(data, headers) {%0A    const contentType = headers.getContentType() || "";%0A    const hasJSONContentType = contentType.indexOf("application/json") > -1;%0A    const isObjectPayload = utils_default.isObject(data);%0A    if (isObjectPayload && utils_default.isHTMLForm(data)) {%0A      data = new FormData(data);%0A    }%0A    const isFormData2 = utils_default.isFormData(data);%0A    if (isFormData2) {%0A      if (!hasJSONContentType) {%0A        return data;%0A      }%0A      return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;%0A    }%0A    if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data)) {%0A      return data;%0A    }%0A    if (utils_default.isArrayBufferView(data)) {%0A      return data.buffer;%0A    }%0A    if (utils_default.isURLSearchParams(data)) {%0A      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);%0A      return data.toString();%0A    }%0A    let isFileList2;%0A    if (isObjectPayload) {%0A      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {%0A        return toURLEncodedForm(data, this.formSerializer).toString();%0A      }%0A      if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {%0A        const _FormData = this.env && this.env.FormData;%0A        return toFormData_default(%0A          isFileList2 ? { "files[]": data } : data,%0A          _FormData && new _FormData(),%0A          this.formSerializer%0A        );%0A      }%0A    }%0A    if (isObjectPayload || hasJSONContentType) {%0A      headers.setContentType("application/json", false);%0A      return stringifySafely(data);%0A    }%0A    return data;%0A  }],%0A  transformResponse: [function transformResponse(data) {%0A    const transitional2 = this.transitional || defaults.transitional;%0A    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;%0A    const JSONRequested = this.responseType === "json";%0A    if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {%0A      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;%0A      const strictJSONParsing = !silentJSONParsing && JSONRequested;%0A      try {%0A        return JSON.parse(data);%0A      } catch (e) {%0A        if (strictJSONParsing) {%0A          if (e.name === "SyntaxError") {%0A            throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);%0A          }%0A          throw e;%0A        }%0A      }%0A    }%0A    return data;%0A  }],%0A  /**%0A   * A timeout in milliseconds to abort a request. If set to 0 (default) a%0A   * timeout is not created.%0A   */%0A  timeout: 0,%0A  xsrfCookieName: "XSRF-TOKEN",%0A  xsrfHeaderName: "X-XSRF-TOKEN",%0A  maxContentLength: -1,%0A  maxBodyLength: -1,%0A  env: {%0A    FormData: browser_default.classes.FormData,%0A    Blob: browser_default.classes.Blob%0A  },%0A  validateStatus: function validateStatus(status) {%0A    return status >= 200 && status < 300;%0A  },%0A  headers: {%0A    common: {%0A      "Accept": "application/json, text/plain, */*"%0A    }%0A  }%0A};%0Autils_default.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {%0A  defaults.headers[method] = {};%0A});%0Autils_default.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {%0A  defaults.headers[method] = utils_default.merge(DEFAULT_CONTENT_TYPE);%0A});%0Avar defaults_default = defaults;%0A%0A// node_modules/axios/lib/helpers/parseHeaders.js%0Avar ignoreDuplicateOf = utils_default.toObjectSet([%0A  "age",%0A  "authorization",%0A  "content-length",%0A  "content-type",%0A  "etag",%0A  "expires",%0A  "from",%0A  "host",%0A  "if-modified-since",%0A  "if-unmodified-since",%0A  "last-modified",%0A  "location",%0A  "max-forwards",%0A  "proxy-authorization",%0A  "referer",%0A  "retry-after",%0A  "user-agent"%0A]);%0Avar parseHeaders_default = (rawHeaders) => {%0A  const parsed = {};%0A  let key;%0A  let val;%0A  let i;%0A  rawHeaders && rawHeaders.split("\\n").forEach(function parser(line) {%0A    i = line.indexOf(":");%0A    key = line.substring(0, i).trim().toLowerCase();%0A    val = line.substring(i + 1).trim();%0A    if (!key || parsed[key] && ignoreDuplicateOf[key]) {%0A      return;%0A    }%0A    if (key === "set-cookie") {%0A      if (parsed[key]) {%0A        parsed[key].push(val);%0A      } else {%0A        parsed[key] = [val];%0A      }%0A    } else {%0A      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;%0A    }%0A  });%0A  return parsed;%0A};%0A%0A// node_modules/axios/lib/core/AxiosHeaders.js%0Avar $internals = Symbol("internals");%0Afunction normalizeHeader(header) {%0A  return header && String(header).trim().toLowerCase();%0A}%0Afunction normalizeValue(value) {%0A  if (value === false || value == null) {%0A    return value;%0A  }%0A  return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);%0A}%0Afunction parseTokens(str) {%0A  const tokens = /* @__PURE__ */ Object.create(null);%0A  const tokensRE = /([^\\s,;=]+)\\s*(?:=\\s*([^,;]+))?/g;%0A  let match;%0A  while (match = tokensRE.exec(str)) {%0A    tokens[match[1]] = match[2];%0A  }%0A  return tokens;%0A}%0Avar isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!%23$%&\'*+.]+$/.test(str.trim());%0Afunction matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {%0A  if (utils_default.isFunction(filter2)) {%0A    return filter2.call(this, value, header);%0A  }%0A  if (isHeaderNameFilter) {%0A    value = header;%0A  }%0A  if (!utils_default.isString(value))%0A    return;%0A  if (utils_default.isString(filter2)) {%0A    return value.indexOf(filter2) !== -1;%0A  }%0A  if (utils_default.isRegExp(filter2)) {%0A    return filter2.test(value);%0A  }%0A}%0Afunction formatHeader(header) {%0A  return header.trim().toLowerCase().replace(/([a-z\\d])(\\w*)/g, (w, char, str) => {%0A    return char.toUpperCase() + str;%0A  });%0A}%0Afunction buildAccessors(obj, header) {%0A  const accessorName = utils_default.toCamelCase(" " + header);%0A  ["get", "set", "has"].forEach((methodName) => {%0A    Object.defineProperty(obj, methodName + accessorName, {%0A      value: function(arg1, arg2, arg3) {%0A        return this[methodName].call(this, header, arg1, arg2, arg3);%0A      },%0A      configurable: true%0A    });%0A  });%0A}%0Avar AxiosHeaders = class {%0A  constructor(headers) {%0A    headers && this.set(headers);%0A  }%0A  set(header, valueOrRewrite, rewrite) {%0A    const self2 = this;%0A    function setHeader(_value, _header, _rewrite) {%0A      const lHeader = normalizeHeader(_header);%0A      if (!lHeader) {%0A        throw new Error("header name must be a non-empty string");%0A      }%0A      const key = utils_default.findKey(self2, lHeader);%0A      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {%0A        self2[key || _header] = normalizeValue(_value);%0A      }%0A    }%0A    const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));%0A    if (utils_default.isPlainObject(header) || header instanceof this.constructor) {%0A      setHeaders(header, valueOrRewrite);%0A    } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {%0A      setHeaders(parseHeaders_default(header), valueOrRewrite);%0A    } else {%0A      header != null && setHeader(valueOrRewrite, header, rewrite);%0A    }%0A    return this;%0A  }%0A  get(header, parser) {%0A    header = normalizeHeader(header);%0A    if (header) {%0A      const key = utils_default.findKey(this, header);%0A      if (key) {%0A        const value = this[key];%0A        if (!parser) {%0A          return value;%0A        }%0A        if (parser === true) {%0A          return parseTokens(value);%0A        }%0A        if (utils_default.isFunction(parser)) {%0A          return parser.call(this, value, key);%0A        }%0A        if (utils_default.isRegExp(parser)) {%0A          return parser.exec(value);%0A        }%0A        throw new TypeError("parser must be boolean|regexp|function");%0A      }%0A    }%0A  }%0A  has(header, matcher) {%0A    header = normalizeHeader(header);%0A    if (header) {%0A      const key = utils_default.findKey(this, header);%0A      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));%0A    }%0A    return false;%0A  }%0A  delete(header, matcher) {%0A    const self2 = this;%0A    let deleted = false;%0A    function deleteHeader(_header) {%0A      _header = normalizeHeader(_header);%0A      if (_header) {%0A        const key = utils_default.findKey(self2, _header);%0A        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {%0A          delete self2[key];%0A          deleted = true;%0A        }%0A      }%0A    }%0A    if (utils_default.isArray(header)) {%0A      header.forEach(deleteHeader);%0A    } else {%0A      deleteHeader(header);%0A    }%0A    return deleted;%0A  }%0A  clear(matcher) {%0A    const keys = Object.keys(this);%0A    let i = keys.length;%0A    let deleted = false;%0A    while (i--) {%0A      const key = keys[i];%0A      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {%0A        delete this[key];%0A        deleted = true;%0A      }%0A    }%0A    return deleted;%0A  }%0A  normalize(format) {%0A    const self2 = this;%0A    const headers = {};%0A    utils_default.forEach(this, (value, header) => {%0A      const key = utils_default.findKey(headers, header);%0A      if (key) {%0A        self2[key] = normalizeValue(value);%0A        delete self2[header];%0A        return;%0A      }%0A      const normalized = format ? formatHeader(header) : String(header).trim();%0A      if (normalized !== header) {%0A        delete self2[header];%0A      }%0A      self2[normalized] = normalizeValue(value);%0A      headers[normalized] = true;%0A    });%0A    return this;%0A  }%0A  concat(...targets) {%0A    return this.constructor.concat(this, ...targets);%0A  }%0A  toJSON(asStrings) {%0A    const obj = /* @__PURE__ */ Object.create(null);%0A    utils_default.forEach(this, (value, header) => {%0A      value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);%0A    });%0A    return obj;%0A  }%0A  [Symbol.iterator]() {%0A    return Object.entries(this.toJSON())[Symbol.iterator]();%0A  }%0A  toString() {%0A    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\\n");%0A  }%0A  get [Symbol.toStringTag]() {%0A    return "AxiosHeaders";%0A  }%0A  static from(thing) {%0A    return thing instanceof this ? thing : new this(thing);%0A  }%0A  static concat(first, ...targets) {%0A    const computed = new this(first);%0A    targets.forEach((target) => computed.set(target));%0A    return computed;%0A  }%0A  static accessor(header) {%0A    const internals = this[$internals] = this[$internals] = {%0A      accessors: {}%0A    };%0A    const accessors = internals.accessors;%0A    const prototype3 = this.prototype;%0A    function defineAccessor(_header) {%0A      const lHeader = normalizeHeader(_header);%0A      if (!accessors[lHeader]) {%0A        buildAccessors(prototype3, _header);%0A        accessors[lHeader] = true;%0A      }%0A    }%0A    utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);%0A    return this;%0A  }%0A};%0AAxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);%0Autils_default.freezeMethods(AxiosHeaders.prototype);%0Autils_default.freezeMethods(AxiosHeaders);%0Avar AxiosHeaders_default = AxiosHeaders;%0A%0A// node_modules/axios/lib/core/transformData.js%0Afunction transformData(fns, response) {%0A  const config = this || defaults_default;%0A  const context = response || config;%0A  const headers = AxiosHeaders_default.from(context.headers);%0A  let data = context.data;%0A  utils_default.forEach(fns, function transform(fn) {%0A    data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);%0A  });%0A  headers.normalize();%0A  return data;%0A}%0A%0A// node_modules/axios/lib/cancel/isCancel.js%0Afunction isCancel(value) {%0A  return !!(value && value.__CANCEL__);%0A}%0A%0A// node_modules/axios/lib/cancel/CanceledError.js%0Afunction CanceledError(message, config, request) {%0A  AxiosError_default.call(this, message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config, request);%0A  this.name = "CanceledError";%0A}%0Autils_default.inherits(CanceledError, AxiosError_default, {%0A  __CANCEL__: true%0A});%0Avar CanceledError_default = CanceledError;%0A%0A// node_modules/axios/lib/core/settle.js%0Afunction settle(resolve, reject, response) {%0A  const validateStatus2 = response.config.validateStatus;%0A  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {%0A    resolve(response);%0A  } else {%0A    reject(new AxiosError_default(%0A      "Request failed with status code " + response.status,%0A      [AxiosError_default.ERR_BAD_REQUEST, AxiosError_default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],%0A      response.config,%0A      response.request,%0A      response%0A    ));%0A  }%0A}%0A%0A// node_modules/axios/lib/helpers/cookies.js%0Avar cookies_default = browser_default.isStandardBrowserEnv ? (%0A  // Standard browser envs support document.cookie%0A  function standardBrowserEnv() {%0A    return {%0A      write: function write(name, value, expires, path, domain, secure) {%0A        const cookie = [];%0A        cookie.push(name + "=" + encodeURIComponent(value));%0A        if (utils_default.isNumber(expires)) {%0A          cookie.push("expires=" + new Date(expires).toGMTString());%0A        }%0A        if (utils_default.isString(path)) {%0A          cookie.push("path=" + path);%0A        }%0A        if (utils_default.isString(domain)) {%0A          cookie.push("domain=" + domain);%0A        }%0A        if (secure === true) {%0A          cookie.push("secure");%0A        }%0A        document.cookie = cookie.join("; ");%0A      },%0A      read: function read(name) {%0A        const match = document.cookie.match(new RegExp("(^|;\\\\s*)(" + name + ")=([^;]*)"));%0A        return match ? decodeURIComponent(match[3]) : null;%0A      },%0A      remove: function remove(name) {%0A        this.write(name, "", Date.now() - 864e5);%0A      }%0A    };%0A  }()%0A) : (%0A  // Non standard browser env (web workers, react-native) lack needed support.%0A  function nonStandardBrowserEnv() {%0A    return {%0A      write: function write() {%0A      },%0A      read: function read() {%0A        return null;%0A      },%0A      remove: function remove() {%0A      }%0A    };%0A  }()%0A);%0A%0A// node_modules/axios/lib/helpers/isAbsoluteURL.js%0Afunction isAbsoluteURL(url) {%0A  return /^([a-z][a-z\\d+\\-.]*:)?\\/\\//i.test(url);%0A}%0A%0A// node_modules/axios/lib/helpers/combineURLs.js%0Afunction combineURLs(baseURL, relativeURL) {%0A  return relativeURL ? baseURL.replace(/\\/+$/, "") + "/" + relativeURL.replace(/^\\/+/, "") : baseURL;%0A}%0A%0A// node_modules/axios/lib/core/buildFullPath.js%0Afunction buildFullPath(baseURL, requestedURL) {%0A  if (baseURL && !isAbsoluteURL(requestedURL)) {%0A    return combineURLs(baseURL, requestedURL);%0A  }%0A  return requestedURL;%0A}%0A%0A// node_modules/axios/lib/helpers/isURLSameOrigin.js%0Avar isURLSameOrigin_default = browser_default.isStandardBrowserEnv ? (%0A  // Standard browser envs have full support of the APIs needed to test%0A  // whether the request URL is of the same origin as current location.%0A  function standardBrowserEnv2() {%0A    const msie = /(msie|trident)/i.test(navigator.userAgent);%0A    const urlParsingNode = document.createElement("a");%0A    let originURL;%0A    function resolveURL(url) {%0A      let href = url;%0A      if (msie) {%0A        urlParsingNode.setAttribute("href", href);%0A        href = urlParsingNode.href;%0A      }%0A      urlParsingNode.setAttribute("href", href);%0A      return {%0A        href: urlParsingNode.href,%0A        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",%0A        host: urlParsingNode.host,%0A        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\\?/, "") : "",%0A        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^%23/, "") : "",%0A        hostname: urlParsingNode.hostname,%0A        port: urlParsingNode.port,%0A        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname%0A      };%0A    }%0A    originURL = resolveURL(window.location.href);%0A    return function isURLSameOrigin(requestURL) {%0A      const parsed = utils_default.isString(requestURL) ? resolveURL(requestURL) : requestURL;%0A      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;%0A    };%0A  }()%0A) : (%0A  // Non standard browser envs (web workers, react-native) lack needed support.%0A  function nonStandardBrowserEnv2() {%0A    return function isURLSameOrigin() {%0A      return true;%0A    };%0A  }()%0A);%0A%0A// node_modules/axios/lib/helpers/parseProtocol.js%0Afunction parseProtocol(url) {%0A  const match = /^([-+\\w]{1,25})(:?\\/\\/|:)/.exec(url);%0A  return match && match[1] || "";%0A}%0A%0A// node_modules/axios/lib/helpers/speedometer.js%0Afunction speedometer(samplesCount, min) {%0A  samplesCount = samplesCount || 10;%0A  const bytes = new Array(samplesCount);%0A  const timestamps = new Array(samplesCount);%0A  let head = 0;%0A  let tail = 0;%0A  let firstSampleTS;%0A  min = min !== void 0 ? min : 1e3;%0A  return function push(chunkLength) {%0A    const now = Date.now();%0A    const startedAt = timestamps[tail];%0A    if (!firstSampleTS) {%0A      firstSampleTS = now;%0A    }%0A    bytes[head] = chunkLength;%0A    timestamps[head] = now;%0A    let i = tail;%0A    let bytesCount = 0;%0A    while (i !== head) {%0A      bytesCount += bytes[i++];%0A      i = i % samplesCount;%0A    }%0A    head = (head + 1) % samplesCount;%0A    if (head === tail) {%0A      tail = (tail + 1) % samplesCount;%0A    }%0A    if (now - firstSampleTS < min) {%0A      return;%0A    }%0A    const passed = startedAt && now - startedAt;%0A    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;%0A  };%0A}%0Avar speedometer_default = speedometer;%0A%0A// node_modules/axios/lib/adapters/xhr.js%0Afunction progressEventReducer(listener, isDownloadStream) {%0A  let bytesNotified = 0;%0A  const _speedometer = speedometer_default(50, 250);%0A  return (e) => {%0A    const loaded = e.loaded;%0A    const total = e.lengthComputable ? e.total : void 0;%0A    const progressBytes = loaded - bytesNotified;%0A    const rate = _speedometer(progressBytes);%0A    const inRange = loaded <= total;%0A    bytesNotified = loaded;%0A    const data = {%0A      loaded,%0A      total,%0A      progress: total ? loaded / total : void 0,%0A      bytes: progressBytes,%0A      rate: rate ? rate : void 0,%0A      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,%0A      event: e%0A    };%0A    data[isDownloadStream ? "download" : "upload"] = true;%0A    listener(data);%0A  };%0A}%0Avar isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";%0Avar xhr_default = isXHRAdapterSupported && function(config) {%0A  return new Promise(function dispatchXhrRequest(resolve, reject) {%0A    let requestData = config.data;%0A    const requestHeaders = AxiosHeaders_default.from(config.headers).normalize();%0A    const responseType = config.responseType;%0A    let onCanceled;%0A    function done() {%0A      if (config.cancelToken) {%0A        config.cancelToken.unsubscribe(onCanceled);%0A      }%0A      if (config.signal) {%0A        config.signal.removeEventListener("abort", onCanceled);%0A      }%0A    }%0A    if (utils_default.isFormData(requestData)) {%0A      if (browser_default.isStandardBrowserEnv || browser_default.isStandardBrowserWebWorkerEnv) {%0A        requestHeaders.setContentType(false);%0A      } else {%0A        requestHeaders.setContentType("multipart/form-data;", false);%0A      }%0A    }%0A    let request = new XMLHttpRequest();%0A    if (config.auth) {%0A      const username = config.auth.username || "";%0A      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";%0A      requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));%0A    }%0A    const fullPath = buildFullPath(config.baseURL, config.url);%0A    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);%0A    request.timeout = config.timeout;%0A    function onloadend() {%0A      if (!request) {%0A        return;%0A      }%0A      const responseHeaders = AxiosHeaders_default.from(%0A        "getAllResponseHeaders" in request && request.getAllResponseHeaders()%0A      );%0A      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;%0A      const response = {%0A        data: responseData,%0A        status: request.status,%0A        statusText: request.statusText,%0A        headers: responseHeaders,%0A        config,%0A        request%0A      };%0A      settle(function _resolve(value) {%0A        resolve(value);%0A        done();%0A      }, function _reject(err) {%0A        reject(err);%0A        done();%0A      }, response);%0A      request = null;%0A    }%0A    if ("onloadend" in request) {%0A      request.onloadend = onloadend;%0A    } else {%0A      request.onreadystatechange = function handleLoad() {%0A        if (!request || request.readyState !== 4) {%0A          return;%0A        }%0A        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {%0A          return;%0A        }%0A        setTimeout(onloadend);%0A      };%0A    }%0A    request.onabort = function handleAbort() {%0A      if (!request) {%0A        return;%0A      }%0A      reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));%0A      request = null;%0A    };%0A    request.onerror = function handleError() {%0A      reject(new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request));%0A      request = null;%0A    };%0A    request.ontimeout = function handleTimeout() {%0A      let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";%0A      const transitional2 = config.transitional || transitional_default;%0A      if (config.timeoutErrorMessage) {%0A        timeoutErrorMessage = config.timeoutErrorMessage;%0A      }%0A      reject(new AxiosError_default(%0A        timeoutErrorMessage,%0A        transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,%0A        config,%0A        request%0A      ));%0A      request = null;%0A    };%0A    if (browser_default.isStandardBrowserEnv) {%0A      const xsrfValue = (config.withCredentials || isURLSameOrigin_default(fullPath)) && config.xsrfCookieName && cookies_default.read(config.xsrfCookieName);%0A      if (xsrfValue) {%0A        requestHeaders.set(config.xsrfHeaderName, xsrfValue);%0A      }%0A    }%0A    requestData === void 0 && requestHeaders.setContentType(null);%0A    if ("setRequestHeader" in request) {%0A      utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {%0A        request.setRequestHeader(key, val);%0A      });%0A    }%0A    if (!utils_default.isUndefined(config.withCredentials)) {%0A      request.withCredentials = !!config.withCredentials;%0A    }%0A    if (responseType && responseType !== "json") {%0A      request.responseType = config.responseType;%0A    }%0A    if (typeof config.onDownloadProgress === "function") {%0A      request.addEventListener("progress", progressEventReducer(config.onDownloadProgress, true));%0A    }%0A    if (typeof config.onUploadProgress === "function" && request.upload) {%0A      request.upload.addEventListener("progress", progressEventReducer(config.onUploadProgress));%0A    }%0A    if (config.cancelToken || config.signal) {%0A      onCanceled = (cancel) => {%0A        if (!request) {%0A          return;%0A        }%0A        reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);%0A        request.abort();%0A        request = null;%0A      };%0A      config.cancelToken && config.cancelToken.subscribe(onCanceled);%0A      if (config.signal) {%0A        config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);%0A      }%0A    }%0A    const protocol = parseProtocol(fullPath);%0A    if (protocol && browser_default.protocols.indexOf(protocol) === -1) {%0A      reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config));%0A      return;%0A    }%0A    request.send(requestData || null);%0A  });%0A};%0A%0A// node_modules/axios/lib/adapters/adapters.js%0Avar knownAdapters = {%0A  http: null_default,%0A  xhr: xhr_default%0A};%0Autils_default.forEach(knownAdapters, (fn, value) => {%0A  if (fn) {%0A    try {%0A      Object.defineProperty(fn, "name", { value });%0A    } catch (e) {%0A    }%0A    Object.defineProperty(fn, "adapterName", { value });%0A  }%0A});%0Avar adapters_default = {%0A  getAdapter: (adapters) => {%0A    adapters = utils_default.isArray(adapters) ? adapters : [adapters];%0A    const { length } = adapters;%0A    let nameOrAdapter;%0A    let adapter;%0A    for (let i = 0; i < length; i++) {%0A      nameOrAdapter = adapters[i];%0A      if (adapter = utils_default.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter) {%0A        break;%0A      }%0A    }%0A    if (!adapter) {%0A      if (adapter === false) {%0A        throw new AxiosError_default(%0A          `Adapter ${nameOrAdapter} is not supported by the environment`,%0A          "ERR_NOT_SUPPORT"%0A        );%0A      }%0A      throw new Error(%0A        utils_default.hasOwnProp(knownAdapters, nameOrAdapter) ? `Adapter \'${nameOrAdapter}\' is not available in the build` : `Unknown adapter \'${nameOrAdapter}\'`%0A      );%0A    }%0A    if (!utils_default.isFunction(adapter)) {%0A      throw new TypeError("adapter is not a function");%0A    }%0A    return adapter;%0A  },%0A  adapters: knownAdapters%0A};%0A%0A// node_modules/axios/lib/core/dispatchRequest.js%0Afunction throwIfCancellationRequested(config) {%0A  if (config.cancelToken) {%0A    config.cancelToken.throwIfRequested();%0A  }%0A  if (config.signal && config.signal.aborted) {%0A    throw new CanceledError_default(null, config);%0A  }%0A}%0Afunction dispatchRequest(config) {%0A  throwIfCancellationRequested(config);%0A  config.headers = AxiosHeaders_default.from(config.headers);%0A  config.data = transformData.call(%0A    config,%0A    config.transformRequest%0A  );%0A  if (["post", "put", "patch"].indexOf(config.method) !== -1) {%0A    config.headers.setContentType("application/x-www-form-urlencoded", false);%0A  }%0A  const adapter = adapters_default.getAdapter(config.adapter || defaults_default.adapter);%0A  return adapter(config).then(function onAdapterResolution(response) {%0A    throwIfCancellationRequested(config);%0A    response.data = transformData.call(%0A      config,%0A      config.transformResponse,%0A      response%0A    );%0A    response.headers = AxiosHeaders_default.from(response.headers);%0A    return response;%0A  }, function onAdapterRejection(reason) {%0A    if (!isCancel(reason)) {%0A      throwIfCancellationRequested(config);%0A      if (reason && reason.response) {%0A        reason.response.data = transformData.call(%0A          config,%0A          config.transformResponse,%0A          reason.response%0A        );%0A        reason.response.headers = AxiosHeaders_default.from(reason.response.headers);%0A      }%0A    }%0A    return Promise.reject(reason);%0A  });%0A}%0A%0A// node_modules/axios/lib/core/mergeConfig.js%0Avar headersToObject = (thing) => thing instanceof AxiosHeaders_default ? thing.toJSON() : thing;%0Afunction mergeConfig(config1, config2) {%0A  config2 = config2 || {};%0A  const config = {};%0A  function getMergedValue(target, source, caseless) {%0A    if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {%0A      return utils_default.merge.call({ caseless }, target, source);%0A    } else if (utils_default.isPlainObject(source)) {%0A      return utils_default.merge({}, source);%0A    } else if (utils_default.isArray(source)) {%0A      return source.slice();%0A    }%0A    return source;%0A  }%0A  function mergeDeepProperties(a, b, caseless) {%0A    if (!utils_default.isUndefined(b)) {%0A      return getMergedValue(a, b, caseless);%0A    } else if (!utils_default.isUndefined(a)) {%0A      return getMergedValue(void 0, a, caseless);%0A    }%0A  }%0A  function valueFromConfig2(a, b) {%0A    if (!utils_default.isUndefined(b)) {%0A      return getMergedValue(void 0, b);%0A    }%0A  }%0A  function defaultToConfig2(a, b) {%0A    if (!utils_default.isUndefined(b)) {%0A      return getMergedValue(void 0, b);%0A    } else if (!utils_default.isUndefined(a)) {%0A      return getMergedValue(void 0, a);%0A    }%0A  }%0A  function mergeDirectKeys(a, b, prop) {%0A    if (prop in config2) {%0A      return getMergedValue(a, b);%0A    } else if (prop in config1) {%0A      return getMergedValue(void 0, a);%0A    }%0A  }%0A  const mergeMap = {%0A    url: valueFromConfig2,%0A    method: valueFromConfig2,%0A    data: valueFromConfig2,%0A    baseURL: defaultToConfig2,%0A    transformRequest: defaultToConfig2,%0A    transformResponse: defaultToConfig2,%0A    paramsSerializer: defaultToConfig2,%0A    timeout: defaultToConfig2,%0A    timeoutMessage: defaultToConfig2,%0A    withCredentials: defaultToConfig2,%0A    adapter: defaultToConfig2,%0A    responseType: defaultToConfig2,%0A    xsrfCookieName: defaultToConfig2,%0A    xsrfHeaderName: defaultToConfig2,%0A    onUploadProgress: defaultToConfig2,%0A    onDownloadProgress: defaultToConfig2,%0A    decompress: defaultToConfig2,%0A    maxContentLength: defaultToConfig2,%0A    maxBodyLength: defaultToConfig2,%0A    beforeRedirect: defaultToConfig2,%0A    transport: defaultToConfig2,%0A    httpAgent: defaultToConfig2,%0A    httpsAgent: defaultToConfig2,%0A    cancelToken: defaultToConfig2,%0A    socketPath: defaultToConfig2,%0A    responseEncoding: defaultToConfig2,%0A    validateStatus: mergeDirectKeys,%0A    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)%0A  };%0A  utils_default.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {%0A    const merge2 = mergeMap[prop] || mergeDeepProperties;%0A    const configValue = merge2(config1[prop], config2[prop], prop);%0A    utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);%0A  });%0A  return config;%0A}%0A%0A// node_modules/axios/lib/env/data.js%0Avar VERSION = "1.4.0";%0A%0A// node_modules/axios/lib/helpers/validator.js%0Avar validators = {};%0A["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {%0A  validators[type] = function validator(thing) {%0A    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;%0A  };%0A});%0Avar deprecatedWarnings = {};%0Avalidators.transitional = function transitional(validator, version, message) {%0A  function formatMessage(opt, desc) {%0A    return "[Axios v" + VERSION + "] Transitional option \'" + opt + "\'" + desc + (message ? ". " + message : "");%0A  }%0A  return (value, opt, opts) => {%0A    if (validator === false) {%0A      throw new AxiosError_default(%0A        formatMessage(opt, " has been removed" + (version ? " in " + version : "")),%0A        AxiosError_default.ERR_DEPRECATED%0A      );%0A    }%0A    if (version && !deprecatedWarnings[opt]) {%0A      deprecatedWarnings[opt] = true;%0A      console.warn(%0A        formatMessage(%0A          opt,%0A          " has been deprecated since v" + version + " and will be removed in the near future"%0A        )%0A      );%0A    }%0A    return validator ? validator(value, opt, opts) : true;%0A  };%0A};%0Afunction assertOptions(options, schema, allowUnknown) {%0A  if (typeof options !== "object") {%0A    throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);%0A  }%0A  const keys = Object.keys(options);%0A  let i = keys.length;%0A  while (i-- > 0) {%0A    const opt = keys[i];%0A    const validator = schema[opt];%0A    if (validator) {%0A      const value = options[opt];%0A      const result = value === void 0 || validator(value, opt, options);%0A      if (result !== true) {%0A        throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);%0A      }%0A      continue;%0A    }%0A    if (allowUnknown !== true) {%0A      throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);%0A    }%0A  }%0A}%0Avar validator_default = {%0A  assertOptions,%0A  validators%0A};%0A%0A// node_modules/axios/lib/core/Axios.js%0Avar validators2 = validator_default.validators;%0Avar Axios = class {%0A  constructor(instanceConfig) {%0A    this.defaults = instanceConfig;%0A    this.interceptors = {%0A      request: new InterceptorManager_default(),%0A      response: new InterceptorManager_default()%0A    };%0A  }%0A  /**%0A   * Dispatch a request%0A   *%0A   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)%0A   * @param {?Object} config%0A   *%0A   * @returns {Promise} The Promise to be fulfilled%0A   */%0A  request(configOrUrl, config) {%0A    if (typeof configOrUrl === "string") {%0A      config = config || {};%0A      config.url = configOrUrl;%0A    } else {%0A      config = configOrUrl || {};%0A    }%0A    config = mergeConfig(this.defaults, config);%0A    const { transitional: transitional2, paramsSerializer, headers } = config;%0A    if (transitional2 !== void 0) {%0A      validator_default.assertOptions(transitional2, {%0A        silentJSONParsing: validators2.transitional(validators2.boolean),%0A        forcedJSONParsing: validators2.transitional(validators2.boolean),%0A        clarifyTimeoutError: validators2.transitional(validators2.boolean)%0A      }, false);%0A    }%0A    if (paramsSerializer != null) {%0A      if (utils_default.isFunction(paramsSerializer)) {%0A        config.paramsSerializer = {%0A          serialize: paramsSerializer%0A        };%0A      } else {%0A        validator_default.assertOptions(paramsSerializer, {%0A          encode: validators2.function,%0A          serialize: validators2.function%0A        }, true);%0A      }%0A    }%0A    config.method = (config.method || this.defaults.method || "get").toLowerCase();%0A    let contextHeaders;%0A    contextHeaders = headers && utils_default.merge(%0A      headers.common,%0A      headers[config.method]%0A    );%0A    contextHeaders && utils_default.forEach(%0A      ["delete", "get", "head", "post", "put", "patch", "common"],%0A      (method) => {%0A        delete headers[method];%0A      }%0A    );%0A    config.headers = AxiosHeaders_default.concat(contextHeaders, headers);%0A    const requestInterceptorChain = [];%0A    let synchronousRequestInterceptors = true;%0A    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {%0A      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {%0A        return;%0A      }%0A      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;%0A      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);%0A    });%0A    const responseInterceptorChain = [];%0A    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {%0A      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);%0A    });%0A    let promise;%0A    let i = 0;%0A    let len;%0A    if (!synchronousRequestInterceptors) {%0A      const chain = [dispatchRequest.bind(this), void 0];%0A      chain.unshift.apply(chain, requestInterceptorChain);%0A      chain.push.apply(chain, responseInterceptorChain);%0A      len = chain.length;%0A      promise = Promise.resolve(config);%0A      while (i < len) {%0A        promise = promise.then(chain[i++], chain[i++]);%0A      }%0A      return promise;%0A    }%0A    len = requestInterceptorChain.length;%0A    let newConfig = config;%0A    i = 0;%0A    while (i < len) {%0A      const onFulfilled = requestInterceptorChain[i++];%0A      const onRejected = requestInterceptorChain[i++];%0A      try {%0A        newConfig = onFulfilled(newConfig);%0A      } catch (error) {%0A        onRejected.call(this, error);%0A        break;%0A      }%0A    }%0A    try {%0A      promise = dispatchRequest.call(this, newConfig);%0A    } catch (error) {%0A      return Promise.reject(error);%0A    }%0A    i = 0;%0A    len = responseInterceptorChain.length;%0A    while (i < len) {%0A      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);%0A    }%0A    return promise;%0A  }%0A  getUri(config) {%0A    config = mergeConfig(this.defaults, config);%0A    const fullPath = buildFullPath(config.baseURL, config.url);%0A    return buildURL(fullPath, config.params, config.paramsSerializer);%0A  }%0A};%0Autils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData2(method) {%0A  Axios.prototype[method] = function(url, config) {%0A    return this.request(mergeConfig(config || {}, {%0A      method,%0A      url,%0A      data: (config || {}).data%0A    }));%0A  };%0A});%0Autils_default.forEach(["post", "put", "patch"], function forEachMethodWithData2(method) {%0A  function generateHTTPMethod(isForm) {%0A    return function httpMethod(url, data, config) {%0A      return this.request(mergeConfig(config || {}, {%0A        method,%0A        headers: isForm ? {%0A          "Content-Type": "multipart/form-data"%0A        } : {},%0A        url,%0A        data%0A      }));%0A    };%0A  }%0A  Axios.prototype[method] = generateHTTPMethod();%0A  Axios.prototype[method + "Form"] = generateHTTPMethod(true);%0A});%0Avar Axios_default = Axios;%0A%0A// node_modules/axios/lib/cancel/CancelToken.js%0Avar CancelToken = class _CancelToken {%0A  constructor(executor) {%0A    if (typeof executor !== "function") {%0A      throw new TypeError("executor must be a function.");%0A    }%0A    let resolvePromise;%0A    this.promise = new Promise(function promiseExecutor(resolve) {%0A      resolvePromise = resolve;%0A    });%0A    const token = this;%0A    this.promise.then((cancel) => {%0A      if (!token._listeners)%0A        return;%0A      let i = token._listeners.length;%0A      while (i-- > 0) {%0A        token._listeners[i](cancel);%0A      }%0A      token._listeners = null;%0A    });%0A    this.promise.then = (onfulfilled) => {%0A      let _resolve;%0A      const promise = new Promise((resolve) => {%0A        token.subscribe(resolve);%0A        _resolve = resolve;%0A      }).then(onfulfilled);%0A      promise.cancel = function reject() {%0A        token.unsubscribe(_resolve);%0A      };%0A      return promise;%0A    };%0A    executor(function cancel(message, config, request) {%0A      if (token.reason) {%0A        return;%0A      }%0A      token.reason = new CanceledError_default(message, config, request);%0A      resolvePromise(token.reason);%0A    });%0A  }%0A  /**%0A   * Throws a `CanceledError` if cancellation has been requested.%0A   */%0A  throwIfRequested() {%0A    if (this.reason) {%0A      throw this.reason;%0A    }%0A  }%0A  /**%0A   * Subscribe to the cancel signal%0A   */%0A  subscribe(listener) {%0A    if (this.reason) {%0A      listener(this.reason);%0A      return;%0A    }%0A    if (this._listeners) {%0A      this._listeners.push(listener);%0A    } else {%0A      this._listeners = [listener];%0A    }%0A  }%0A  /**%0A   * Unsubscribe from the cancel signal%0A   */%0A  unsubscribe(listener) {%0A    if (!this._listeners) {%0A      return;%0A    }%0A    const index = this._listeners.indexOf(listener);%0A    if (index !== -1) {%0A      this._listeners.splice(index, 1);%0A    }%0A  }%0A  /**%0A   * Returns an object that contains a new `CancelToken` and a function that, when called,%0A   * cancels the `CancelToken`.%0A   */%0A  static source() {%0A    let cancel;%0A    const token = new _CancelToken(function executor(c) {%0A      cancel = c;%0A    });%0A    return {%0A      token,%0A      cancel%0A    };%0A  }%0A};%0Avar CancelToken_default = CancelToken;%0A%0A// node_modules/axios/lib/helpers/spread.js%0Afunction spread(callback) {%0A  return function wrap(arr) {%0A    return callback.apply(null, arr);%0A  };%0A}%0A%0A// node_modules/axios/lib/helpers/isAxiosError.js%0Afunction isAxiosError(payload) {%0A  return utils_default.isObject(payload) && payload.isAxiosError === true;%0A}%0A%0A// node_modules/axios/lib/helpers/HttpStatusCode.js%0Avar HttpStatusCode = {%0A  Continue: 100,%0A  SwitchingProtocols: 101,%0A  Processing: 102,%0A  EarlyHints: 103,%0A  Ok: 200,%0A  Created: 201,%0A  Accepted: 202,%0A  NonAuthoritativeInformation: 203,%0A  NoContent: 204,%0A  ResetContent: 205,%0A  PartialContent: 206,%0A  MultiStatus: 207,%0A  AlreadyReported: 208,%0A  ImUsed: 226,%0A  MultipleChoices: 300,%0A  MovedPermanently: 301,%0A  Found: 302,%0A  SeeOther: 303,%0A  NotModified: 304,%0A  UseProxy: 305,%0A  Unused: 306,%0A  TemporaryRedirect: 307,%0A  PermanentRedirect: 308,%0A  BadRequest: 400,%0A  Unauthorized: 401,%0A  PaymentRequired: 402,%0A  Forbidden: 403,%0A  NotFound: 404,%0A  MethodNotAllowed: 405,%0A  NotAcceptable: 406,%0A  ProxyAuthenticationRequired: 407,%0A  RequestTimeout: 408,%0A  Conflict: 409,%0A  Gone: 410,%0A  LengthRequired: 411,%0A  PreconditionFailed: 412,%0A  PayloadTooLarge: 413,%0A  UriTooLong: 414,%0A  UnsupportedMediaType: 415,%0A  RangeNotSatisfiable: 416,%0A  ExpectationFailed: 417,%0A  ImATeapot: 418,%0A  MisdirectedRequest: 421,%0A  UnprocessableEntity: 422,%0A  Locked: 423,%0A  FailedDependency: 424,%0A  TooEarly: 425,%0A  UpgradeRequired: 426,%0A  PreconditionRequired: 428,%0A  TooManyRequests: 429,%0A  RequestHeaderFieldsTooLarge: 431,%0A  UnavailableForLegalReasons: 451,%0A  InternalServerError: 500,%0A  NotImplemented: 501,%0A  BadGateway: 502,%0A  ServiceUnavailable: 503,%0A  GatewayTimeout: 504,%0A  HttpVersionNotSupported: 505,%0A  VariantAlsoNegotiates: 506,%0A  InsufficientStorage: 507,%0A  LoopDetected: 508,%0A  NotExtended: 510,%0A  NetworkAuthenticationRequired: 511%0A};%0AObject.entries(HttpStatusCode).forEach(([key, value]) => {%0A  HttpStatusCode[value] = key;%0A});%0Avar HttpStatusCode_default = HttpStatusCode;%0A%0A// node_modules/axios/lib/axios.js%0Afunction createInstance(defaultConfig) {%0A  const context = new Axios_default(defaultConfig);%0A  const instance2 = bind(Axios_default.prototype.request, context);%0A  utils_default.extend(instance2, Axios_default.prototype, context, { allOwnKeys: true });%0A  utils_default.extend(instance2, context, null, { allOwnKeys: true });%0A  instance2.create = function create(instanceConfig) {%0A    return createInstance(mergeConfig(defaultConfig, instanceConfig));%0A  };%0A  return instance2;%0A}%0Avar axios = createInstance(defaults_default);%0Aaxios.Axios = Axios_default;%0Aaxios.CanceledError = CanceledError_default;%0Aaxios.CancelToken = CancelToken_default;%0Aaxios.isCancel = isCancel;%0Aaxios.VERSION = VERSION;%0Aaxios.toFormData = toFormData_default;%0Aaxios.AxiosError = AxiosError_default;%0Aaxios.Cancel = axios.CanceledError;%0Aaxios.all = function all(promises) {%0A  return Promise.all(promises);%0A};%0Aaxios.spread = spread;%0Aaxios.isAxiosError = isAxiosError;%0Aaxios.mergeConfig = mergeConfig;%0Aaxios.AxiosHeaders = AxiosHeaders_default;%0Aaxios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);%0Aaxios.HttpStatusCode = HttpStatusCode_default;%0Aaxios.default = axios;%0Avar axios_default = axios;%0A%0A// node_modules/axios/index.js%0Avar {%0A  Axios: Axios2,%0A  AxiosError: AxiosError2,%0A  CanceledError: CanceledError2,%0A  isCancel: isCancel2,%0A  CancelToken: CancelToken2,%0A  VERSION: VERSION2,%0A  all: all2,%0A  Cancel,%0A  isAxiosError: isAxiosError2,%0A  spread: spread2,%0A  toFormData: toFormData2,%0A  AxiosHeaders: AxiosHeaders2,%0A  HttpStatusCode: HttpStatusCode2,%0A  formToJSON,%0A  mergeConfig: mergeConfig2%0A} = axios_default;%0A%0A// node_modules/@thewtex/zstddec/dist/zstddec.modern.js%0Avar init;%0Avar instance;%0Avar heap;%0Avar IMPORT_OBJECT = {%0A  env: {%0A    emscripten_notify_memory_growth: function(index) {%0A      heap = new Uint8Array(instance.exports.memory.buffer);%0A    }%0A  }%0A};%0Avar ZSTDDecoder = class {%0A  init() {%0A    if (init)%0A      return init;%0A    if (typeof fetch !== "undefined") {%0A      init = fetch("data:application/wasm;base64," + wasm).then((response) => response.arrayBuffer()).then((arrayBuffer) => WebAssembly.instantiate(arrayBuffer, IMPORT_OBJECT)).then(this._init);%0A    } else {%0A      init = WebAssembly.instantiate(Buffer.from(wasm, "base64"), IMPORT_OBJECT).then(this._init);%0A    }%0A    return init;%0A  }%0A  _init(result) {%0A    instance = result.instance;%0A    IMPORT_OBJECT.env.emscripten_notify_memory_growth(0);%0A  }%0A  decode(array, uncompressedSize = 0) {%0A    if (!instance)%0A      throw new Error(`ZSTDDecoder: Await .init() before decoding.`);%0A    const compressedSize = array.byteLength;%0A    const compressedPtr = instance.exports.malloc(compressedSize);%0A    heap.set(array, compressedPtr);%0A    uncompressedSize = uncompressedSize || Number(instance.exports.ZSTD_findDecompressedSize(compressedPtr, compressedSize));%0A    const uncompressedPtr = instance.exports.malloc(uncompressedSize);%0A    const actualSize = instance.exports.ZSTD_decompress(uncompressedPtr, uncompressedSize, compressedPtr, compressedSize);%0A    const dec = heap.slice(uncompressedPtr, uncompressedPtr + actualSize);%0A    instance.exports.free(compressedPtr);%0A    instance.exports.free(uncompressedPtr);%0A    return dec;%0A  }%0A};%0Avar wasm = "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IARrdnE2AgAgARAPGiAAIAJBCGo2AgQLzgEBBn9Bun8hCgJAIAIoAgQiCCACKAIAIglqIg0gASAAa0sNAEFsIQogCSAEIAMoAgAiC2tLDQAgACAJaiIEIAIoAggiDGshAiAAIAFBIGsiACALIAlBABAgIAMgCSALajYCAAJAAkAgBCAFayAMTwRAIAIhBQwBCyAMIAQgBmtLDQIgByAHIAIgBWsiAmoiASAIak8EQCAEIAEgCBAKGgwCCyACIAhqIQggBCABQQAgAmsQCiACayEECyAEIAAgBSAIQQEQIAsgDSEKCyAKC8cEAQJ/IAAgA2ohBgJAIANBB0wEQANAIAAgBk8NAiAAIAItAAA6AAAgAEEBaiEAIAJBAWohAgwACwALIARBAUYEQAJAIAAgAmsiBUEHTQRAIAAgAi0AADoAACAAIAItAAE6AAEgACACLQACOgACIAAgAi0AAzoAAyAAIAIgBUECdCIFQcAeaigCAGoiAigAADYABCACIAVB4B5qKAIAayECDAELIAAgAikAADcAAAsgAkEIaiECIABBCGohAAsgASAGTwRAIAAgA2ohASAEQQFHIAAgAmtBD0pyRQRAA0AgACACKQAANwAAIAJBCGohAiAAQQhqIgAgAUkNAAwDCwALIAAgAikAADcAACAAIAIpAAg3AAggA0ERSQ0BIABBEGohAANAIAAgAikAEDcAACAAIAIpABg3AAggACACKQAgNwAQIAAgAikAKDcAGCACQSBqIQIgAEEgaiIAIAFJDQALDAELAkAgACABSwRAIAAhAQwBCyABIABrIQUCQCAEQQFHIAAgAmtBD0pyRQRAIAIhAwNAIAAgAykAADcAACADQQhqIQMgAEEIaiIAIAFJDQALDAELIAAgAikAADcAACAAIAIpAAg3AAggBUERSA0AIABBEGohACACIQMDQCAAIAMpABA3AAAgACADKQAYNwAIIAAgAykAIDcAECAAIAMpACg3ABggA0EgaiEDIABBIGoiACABSQ0ACwsgAiAFaiECCwNAIAEgBk8NASABIAItAAA6AAAgAUEBaiEBIAJBAWohAgwACwALC64HAgV/AX4jAEGAAWsiESQAIBEgAzYCfEF/IQ8CQAJAAkACQAJAIAIOBAEAAwIECyAGRQRAQbh/IQ8MBAtBbCEPIAUtAAAiAiADSw0DIAggAkEC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IAggH2shBgNAAkAgBiAPTgRAQQAhAwNAIANBA0YNAiAFIANBAnQiAmpBrNABaiACIARqKAJkNgIAIANBAWohAwwACwALAkACQAJAIAQoAtwBIgMgBEHwAGogBkEHcUEMbGoiCCgCACIMaiIQIBdLDQAgByAIKAIEIgsgDGoiCmogIUsNACAKQSBqIBYgB2tNDQELIAQgCCgCCDYCKCAEIAgpAgA3AyAgByAWIARBIGogBEHcAWogFyASIBggGhAfIQoMAQsgByAMaiECIAgoAgghCCAHIAMpAAA3AAAgByADKQAINwAIAkAgDEERSQ0AIAcgAykAEDcAECAHIAMpABg3ABggDEEQa0ERSA0AIANBEGohAyAHQSBqIQwDQCAMIAMpABA3AAAgDCADKQAYNwAIIAwgAykAIDcAECAMIAMpACg3ABggA0EgaiEDIAxBIGoiDCACSQ0ACwsgAiAIayEDIAQgEDYC3AEgAiASayAISQRAIAggAiAYa0sNByAaIBogAyASayIDaiIMIAtqTwRAIAIgDCALEAoaDAILIAMgC2ohCyACIAxBACADaxAKIANrIQIgEiEDCyAIQRBPBEAgAiADKQAANwAAIAIgAykACDcACCALQRFIDQEgAiALaiEIIAJBEGohAgNAIAIgAykAEDcAACACIAMpABg3AAggAiADKQAgNwAQIAIgAykAKDcAGCADQSBqIQMgAkEgaiICIAhJDQALDAELAkAgCEEHTQRAIAIgAy0AADoAACACIAMtAAE6AAEgAiADLQACOgACIAIgAy0AAzoAAyACIAMgCEECdCIIQcAeaigCAGoiAygAADYABCADIAhB4B5qKAIAayEDDAELIAIgAykAADcAAAsgC0EJSQ0AIAIgC2ohDCACQQhqIgggA0EIaiIDa0EPTARAA0AgCCADKQAANwAAIANBCGohAyAIQQhqIgggDEkNAAwCCwALIAggAykAADcAACAIIAMpAAg3AAggC0EZSA0AIAJBGGohAgNAIAIgAykAEDcAACACIAMpABg3AAggAiADKQAgNwAQIAIgAykAKDcAGCADQSBqIQMgAkEgaiICIAxJDQALCyAKQYh/SwRAIAohCQwGBSAGQQFqIQYgByAKaiEHDAILAAsLIAQoAtwBIQMLQbp/IQkgFyADayICIBYgB2tLDQIgBwR/IAcgAyACEAIgAmoFQQALIA5rIQkMAgsgBUEANgKc6wELIAQgBSgC8OoBIgM2AtwBIAkgDmohDCADIAUoAoDrAWohEAJAIA9FBEAgDiEGDAELIAUoArjpASENIAUoArTpASETIAUoArDpASESIAVBATYChOoBQQAhAwNAIANBA0cEQCAEIANBAnQiAmogAiAFakGs0AFqKAIANgKcASADQQFqIQMMAQsLQWwhCSAEQfAAaiICIAcgBhANQYh/Sw0BIDEgAiAFKAIAEB4gMCACIAUoAggQHiAvIAIgBSgCBBAeIAxBIGshGCAOIQYDQCAEKAKIASAEKAKEAUEDdGopAgAiQKciCkEQdiIZQf8BcSELIAQoApgBIAQoApQBQQN0aikCACJBpyIWQRB2Ih9B/wFxIRogBCgCkAEgBCgCjAFBA3RqKQIAIkJCIIinIQcgQUIgiCBAQiCIpyEDAkAgQkIQiKciCEH/AXEiAkECTwRAAkAgAkEZSSA/QoGAgBBUckUEQCAEQSAgBCgCdCIIayIRIAIgAiARSxsiFyAIajYCdCAHIAQoAnAgCHRBACAXa3YgAiAXayIXdGohCCAEQfAAahAPGiACIBFNDQEgBCAEKAJ0IgIgF2o2AnQgBCgCcCACdEEAIBdrdiAIaiEIDAELIAQgAiAEKAJ0IhFqNgJ0IAQoAnAgEXRBACAIa3YgB2ohCCAEQfAAahAPGgsgBCkCnAEhRCAEIAg2ApwBIAQgRDcCoAEMAQsCQCACRQRAIAMEQCAEKAKcASEIDAMLIAQoAqABIQgMAQsgBCAEKAJ0IgJBAWo2AnQCfyAHIANFaiAEKAJwIAJ0QR92aiICQQNGBEAgBCgCnAFBAWsMAQsgAkECdCAEaigCnAELIgdFIAdqIQggAkEBRwRAIAQgBCgCoAE2AqQBCwsgBCAEKAKcATYCoAEgBCAINgKcAQunIQIgQUKAgPwHg1BFBEAgBCAEKAJ0IgcgGmo2AnQgBCgCcCAHdEEAIB9rdiACaiECCyALIBpqQRRPBEAgBEHwAGoQDxoLIEBCgID8B4NQRQRAIAQgBCgCdCIHIAtqNgJ0IAQoAnAgB3RBACAZa3YgA2ohAwsgBEHwAGoQDxogBCAEKAJwIgdBACAKQRh2IgsgBCgCdGoiGmt2IAtBAnRBoB1qKAIAcSAKQf//A3FqNgKEASAEIBogFkEYdiIKaiILNgJ0IAQgCkECdEGgHWooAgAgB0EAIAtrdnEgFkH//wNxajYClAEgBEHwAGoQDxogBCBCpyIHQRh2IgogBCgCdGoiCzYCdCAEIApBAnRBoB1qKAIAIAQoAnBBACALa3ZxIAdB//8DcWo2AowBIAQgAzYCOCAEIAI2AjwgBCAINgJAAkACQAJAIAQoAtwBIgsgA2oiFiAQSw0AIAYgAiADaiIKaiAYSw0AIApBIGogDCAGa00NAQsgBCAEQUBrKAIANgIIIAQgBCkDODcDACAGIAwgBCAEQdwBaiAQIBIgEyANEB8hCgwBCyADIAZqIQcgBiALKQAANwAAIAYgCykACDcACAJAIANBEUkNACAGIAspABA3ABAgBiALKQAYNwAYIANBEGtBEUgNACALQRBqIQMgBkEgaiELA0AgCyADKQAQNwAAIAsgAykAGDcACCALIAMpACA3ABAgCyADKQAoNwAYIANBIGohAyALQSBqIgsgB0kNAAsLIAcgCGshAyAEIBY2AtwBIAcgEmsgCEkEQCAIIAcgE2tLDQQgDSANIAMgEmsiA2oiCyACak8EQCAHIAsgAhAKGgwCCyAHIAtBACADaxAKIAQgAiADaiICNgI8IANrIQcgEiEDCyAIQRBPBEAgByADKQAANwAAIAcgAykACDcACCACQRFIDQEgAiAHaiEIIAdBEGohAgNAIAIgAykAEDcAACACIAMpABg3AAggAiADKQAgNwAQIAIgAykAKDcAGCADQSBqIQMgAkEgaiICIAhJDQALDAELAkAgCEEHTQRAIAcgAy0AADoAACAHIAMtAAE6AAEgByADLQACOgACIAcgAy0AAzoAAyAHIAMgCEECdCIIQcAeaigCAGoiAygAADYABCADIAhB4B5qKAIAayEDDAELIAcgAykAADcAAAsgAkEJSQ0AIAIgB2ohCyAHQQhqIgggA0EIaiIDa0EPTARAA0AgCCADKQAANwAAIANBCGohAyAIQQhqIgggC0kNAAwCCwALIAggAykAADcAACAIIAMpAAg3AAggAkEZSA0AIAdBGGohAgNAIAIgAykAEDcAACACIAMpABg3AAggAiADKQAgNwAQIAIgAykAKDcAGCADQSBqIQMgAkEgaiICIAtJDQALCyAKQYh/SwRAIAohCQwDCyAGIApqIQYgBEHwAGoQDyEDIA9B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";%0A%0A// dist/core/internal/loadEmscriptenModuleWebWorker.js%0Avar decoder = new ZSTDDecoder();%0Avar decoderInitialized = false;%0Aasync function loadEmscriptenModuleWebWorker(moduleRelativePathOrURL, baseUrl) {%0A  let modulePrefix = null;%0A  if (typeof moduleRelativePathOrURL !== "string") {%0A    modulePrefix = moduleRelativePathOrURL.href;%0A  } else if (moduleRelativePathOrURL.startsWith("http")) {%0A    modulePrefix = moduleRelativePathOrURL;%0A  } else {%0A    modulePrefix = `${baseUrl}/${moduleRelativePathOrURL}`;%0A  }%0A  if (modulePrefix.endsWith(".js")) {%0A    modulePrefix = modulePrefix.substring(0, modulePrefix.length - 3);%0A  }%0A  if (modulePrefix.endsWith(".wasm")) {%0A    modulePrefix = modulePrefix.substring(0, modulePrefix.length - 5);%0A  }%0A  const wasmBinaryPath = `${modulePrefix}.wasm`;%0A  const response = await axios_default.get(`${wasmBinaryPath}.zst`, { responseType: "arraybuffer" });%0A  if (!decoderInitialized) {%0A    await decoder.init();%0A    decoderInitialized = true;%0A  }%0A  const decompressedArray = decoder.decode(new Uint8Array(response.data));%0A  const wasmBinary = decompressedArray.buffer;%0A  const modulePath = `${modulePrefix}.js`;%0A  const result = await import(%0A    /* webpackIgnore: true */%0A    /* @vite-ignore */%0A    modulePath%0A  );%0A  const emscriptenModule = result.default({ wasmBinary });%0A  return emscriptenModule;%0A}%0Avar loadEmscriptenModuleWebWorker_default = loadEmscriptenModuleWebWorker;%0A%0A// dist/core/web-workers/load-pipeline-module.js%0Avar pipelineToModule = /* @__PURE__ */ new Map();%0Aasync function loadPipelineModule(pipelinePath, baseUrl) {%0A  let moduleRelativePathOrURL = pipelinePath;%0A  let pipeline = pipelinePath;%0A  let pipelineModule = null;%0A  if (typeof pipelinePath !== "string") {%0A    moduleRelativePathOrURL = new URL(pipelinePath.href);%0A    pipeline = moduleRelativePathOrURL.href;%0A  }%0A  if (pipelineToModule.has(pipeline)) {%0A    pipelineModule = pipelineToModule.get(pipeline);%0A  } else {%0A    pipelineToModule.set(pipeline, await loadEmscriptenModuleWebWorker_default(moduleRelativePathOrURL, baseUrl));%0A    pipelineModule = pipelineToModule.get(pipeline);%0A  }%0A  return pipelineModule;%0A}%0Avar load_pipeline_module_default = loadPipelineModule;%0A%0A// dist/io/internal/MimeToImageIO.js%0Avar mimeToIO = /* @__PURE__ */ new Map([%0A  ["image/jpeg", "JPEGImageIO"],%0A  ["image/png", "PNGImageIO"],%0A  ["image/tiff", "TIFFImageIO"],%0A  ["image/x-ms-bmp", "BMPImageIO"],%0A  ["image/x-bmp", "BMPImageIO"],%0A  ["image/bmp", "BMPImageIO"],%0A  ["application/dicom", "GDCMImageIO"]%0A]);%0Avar MimeToImageIO_default = mimeToIO;%0A%0A// dist/io/extensionToImageIO.js%0Avar extensionToIO = /* @__PURE__ */ new Map([%0A  ["bmp", "BMPImageIO"],%0A  ["BMP", "BMPImageIO"],%0A  ["dcm", "GDCMImageIO"],%0A  ["DCM", "GDCMImageIO"],%0A  ["gipl", "GiplImageIO"],%0A  ["gipl.gz", "GiplImageIO"],%0A  ["hdf5", "HDF5ImageIO"],%0A  ["jpg", "JPEGImageIO"],%0A  ["JPG", "JPEGImageIO"],%0A  ["jpeg", "JPEGImageIO"],%0A  ["JPEG", "JPEGImageIO"],%0A  ["iwi", "WasmImageIO"],%0A  ["iwi.cbor", "WasmImageIO"],%0A  ["iwi.cbor.zst", "WasmZstdImageIO"],%0A  ["lsm", "LSMImageIO"],%0A  ["mnc", "MINCImageIO"],%0A  ["MNC", "MINCImageIO"],%0A  ["mnc.gz", "MINCImageIO"],%0A  ["MNC.GZ", "MINCImageIO"],%0A  ["mnc2", "MINCImageIO"],%0A  ["MNC2", "MINCImageIO"],%0A  ["mgh", "MGHImageIO"],%0A  ["mgz", "MGHImageIO"],%0A  ["mgh.gz", "MGHImageIO"],%0A  ["mha", "MetaImageIO"],%0A  ["mhd", "MetaImageIO"],%0A  ["mrc", "MRCImageIO"],%0A  ["nia", "NiftiImageIO"],%0A  ["nii", "NiftiImageIO"],%0A  ["nii.gz", "NiftiImageIO"],%0A  ["hdr", "NiftiImageIO"],%0A  ["nrrd", "NrrdImageIO"],%0A  ["NRRD", "NrrdImageIO"],%0A  ["nhdr", "NrrdImageIO"],%0A  ["NHDR", "NrrdImageIO"],%0A  ["png", "PNGImageIO"],%0A  ["PNG", "PNGImageIO"],%0A  ["pic", "BioRadImageIO"],%0A  ["PIC", "BioRadImageIO"],%0A  ["tif", "TIFFImageIO"],%0A  ["TIF", "TIFFImageIO"],%0A  ["tiff", "TIFFImageIO"],%0A  ["TIFF", "TIFFImageIO"],%0A  ["vtk", "VTKImageIO"],%0A  ["VTK", "VTKImageIO"],%0A  ["isq", "ScancoImageIO"],%0A  ["ISQ", "ScancoImageIO"],%0A  ["fdf", "FDFImageIO"],%0A  ["FDF", "FDFImageIO"]%0A]);%0Avar extensionToImageIO_default = extensionToIO;%0A%0A// dist/io/getFileExtension.js%0Afunction getFileExtension(filePath) {%0A  let extension = filePath.slice((filePath.lastIndexOf(".") - 1 >>> 0) + 2);%0A  if (extension.toLowerCase() === "gz") {%0A    const index = filePath.slice(0, -3).lastIndexOf(".");%0A    extension = filePath.slice((index - 1 >>> 0) + 2);%0A  } else if (extension.toLowerCase() === "cbor") {%0A    const index = filePath.slice(0, -5).lastIndexOf(".");%0A    extension = filePath.slice((index - 1 >>> 0) + 2);%0A  } else if (extension.toLowerCase() === "zst") {%0A    const index = filePath.slice(0, -10).lastIndexOf(".");%0A    extension = filePath.slice((index - 1 >>> 0) + 2);%0A  } else if (extension.toLowerCase() === "zip") {%0A    const index = filePath.slice(0, -4).lastIndexOf(".");%0A    extension = filePath.slice((index - 1 >>> 0) + 2);%0A  }%0A  return extension;%0A}%0Avar getFileExtension_default = getFileExtension;%0A%0A// dist/io/internal/ImageIOIndex.js%0Avar ImageIOIndex = ["PNGImageIO", "MetaImageIO", "TIFFImageIO", "NiftiImageIO", "JPEGImageIO", "NrrdImageIO", "VTKImageIO", "BMPImageIO", "HDF5ImageIO", "MINCImageIO", "MRCImageIO", "LSMImageIO", "MGHImageIO", "BioRadImageIO", "GiplImageIO", "GEAdwImageIO", "GE4ImageIO", "GE5ImageIO", "GDCMImageIO", "ScancoImageIO", "FDFImageIO", "WasmImageIO", "WasmZstdImageIO"];%0Avar ImageIOIndex_default = ImageIOIndex;%0A%0A// dist/core/InterfaceTypes.js%0Avar InterfaceTypes = {%0A  // Todo: remove Interface prefix after IOTypes has been removed%0A  TextFile: "InterfaceTextFile",%0A  BinaryFile: "InterfaceBinaryFile",%0A  TextStream: "InterfaceTextStream",%0A  BinaryStream: "InterfaceBinaryStream",%0A  Image: "InterfaceImage",%0A  Mesh: "InterfaceMesh",%0A  PolyData: "InterfacePolyData",%0A  JsonCompatible: "InterfaceJsonCompatible"%0A};%0Avar InterfaceTypes_default = InterfaceTypes;%0A%0A// dist/core/IOTypes.js%0Avar IOTypes = {%0A  Text: "Text",%0A  Binary: "Binary",%0A  Image: "Image",%0A  Mesh: "Mesh"%0A};%0Avar IOTypes_default = IOTypes;%0A%0A// dist/core/interface-types/int-types.js%0Avar IntTypes = {%0A  Int8: "int8",%0A  UInt8: "uint8",%0A  Int16: "int16",%0A  UInt16: "uint16",%0A  Int32: "int32",%0A  UInt32: "uint32",%0A  Int64: "int64",%0A  UInt64: "uint64",%0A  SizeValueType: "uint64",%0A  IdentifierType: "uint64",%0A  IndexValueType: "int64",%0A  OffsetValueType: "int64"%0A};%0Avar int_types_default = IntTypes;%0A%0A// dist/core/interface-types/float-types.js%0Avar FloatTypes = {%0A  Float32: "float32",%0A  Float64: "float64",%0A  SpacePrecisionType: "float64"%0A};%0Avar float_types_default = FloatTypes;%0A%0A// dist/core/bufferToTypedArray.js%0Afunction bufferToTypedArray(wasmType, buffer) {%0A  let typedArray = null;%0A  switch (wasmType) {%0A    case int_types_default.UInt8: {%0A      typedArray = new Uint8Array(buffer);%0A      break;%0A    }%0A    case int_types_default.Int8: {%0A      typedArray = new Int8Array(buffer);%0A      break;%0A    }%0A    case int_types_default.UInt16: {%0A      typedArray = new Uint16Array(buffer);%0A      break;%0A    }%0A    case int_types_default.Int16: {%0A      typedArray = new Int16Array(buffer);%0A      break;%0A    }%0A    case int_types_default.UInt32: {%0A      typedArray = new Uint32Array(buffer);%0A      break;%0A    }%0A    case int_types_default.Int32: {%0A      typedArray = new Int32Array(buffer);%0A      break;%0A    }%0A    case int_types_default.UInt64: {%0A      if (typeof globalThis.BigUint64Array === "function") {%0A        typedArray = new BigUint64Array(buffer);%0A      } else {%0A        typedArray = new Uint8Array(buffer);%0A      }%0A      break;%0A    }%0A    case int_types_default.Int64: {%0A      if (typeof globalThis.BigInt64Array === "function") {%0A        typedArray = new BigInt64Array(buffer);%0A      } else {%0A        typedArray = new Uint8Array(buffer);%0A      }%0A      break;%0A    }%0A    case float_types_default.Float32: {%0A      typedArray = new Float32Array(buffer);%0A      break;%0A    }%0A    case float_types_default.Float64: {%0A      typedArray = new Float64Array(buffer);%0A      break;%0A    }%0A    case "null": {%0A      typedArray = null;%0A      break;%0A    }%0A    case null: {%0A      typedArray = null;%0A      break;%0A    }%0A    default:%0A      throw new Error("Type is not supported as a TypedArray");%0A  }%0A  return typedArray;%0A}%0Avar bufferToTypedArray_default = bufferToTypedArray;%0A%0A// dist/pipeline/internal/runPipelineEmscripten.js%0Avar haveSharedArrayBuffer = typeof globalThis.SharedArrayBuffer === "function";%0Avar encoder = new TextEncoder();%0Avar decoder2 = new TextDecoder("utf-8");%0Afunction readFileSharedArray(emscriptenModule, path) {%0A  const opts = { flags: "r", encoding: "binary" };%0A  const stream = emscriptenModule.fs_open(path, opts.flags);%0A  const stat = emscriptenModule.fs_stat(path);%0A  const length = stat.size;%0A  let arrayBufferData = null;%0A  if (haveSharedArrayBuffer) {%0A    arrayBufferData = new SharedArrayBuffer(length);%0A  } else {%0A    arrayBufferData = new ArrayBuffer(length);%0A  }%0A  const array = new Uint8Array(arrayBufferData);%0A  emscriptenModule.fs_read(stream, array, 0, length, 0);%0A  emscriptenModule.fs_close(stream);%0A  return array;%0A}%0Afunction memoryUint8SharedArray(emscriptenModule, byteOffset, length) {%0A  let arrayBufferData = null;%0A  if (haveSharedArrayBuffer) {%0A    arrayBufferData = new SharedArrayBuffer(length);%0A  } else {%0A    arrayBufferData = new ArrayBuffer(length);%0A  }%0A  const array = new Uint8Array(arrayBufferData);%0A  const dataArrayView = new Uint8Array(emscriptenModule.HEAPU8.buffer, byteOffset, length);%0A  array.set(dataArrayView);%0A  return array;%0A}%0Afunction setPipelineModuleInputArray(emscriptenModule, dataArray, inputIndex, subIndex) {%0A  let dataPtr = 0;%0A  if (dataArray !== null) {%0A    dataPtr = emscriptenModule.ccall("itk_wasm_input_array_alloc", "number", ["number", "number", "number", "number"], [0, inputIndex, subIndex, dataArray.buffer.byteLength]);%0A    emscriptenModule.HEAPU8.set(new Uint8Array(dataArray.buffer), dataPtr);%0A  }%0A  return dataPtr;%0A}%0Afunction setPipelineModuleInputJSON(emscriptenModule, dataObject, inputIndex) {%0A  const dataJSON = JSON.stringify(dataObject);%0A  const jsonPtr = emscriptenModule.ccall("itk_wasm_input_json_alloc", "number", ["number", "number", "number"], [0, inputIndex, dataJSON.length]);%0A  emscriptenModule.writeAsciiToMemory(dataJSON, jsonPtr, false);%0A}%0Afunction getPipelineModuleOutputArray(emscriptenModule, outputIndex, subIndex, componentType) {%0A  const dataPtr = emscriptenModule.ccall("itk_wasm_output_array_address", "number", ["number", "number", "number"], [0, outputIndex, subIndex]);%0A  const dataSize = emscriptenModule.ccall("itk_wasm_output_array_size", "number", ["number", "number", "number"], [0, outputIndex, subIndex]);%0A  const dataUint8 = memoryUint8SharedArray(emscriptenModule, dataPtr, dataSize);%0A  const data = bufferToTypedArray_default(componentType, dataUint8.buffer);%0A  return data;%0A}%0Afunction getPipelineModuleOutputJSON(emscriptenModule, outputIndex) {%0A  const jsonPtr = emscriptenModule.ccall("itk_wasm_output_json_address", "number", ["number", "number"], [0, outputIndex]);%0A  const dataJSON = emscriptenModule.AsciiToString(jsonPtr);%0A  const dataObject = JSON.parse(dataJSON);%0A  return dataObject;%0A}%0Afunction runPipelineEmscripten(pipelineModule, args, outputs, inputs) {%0A  if (!(inputs == null) && inputs.length > 0) {%0A    inputs.forEach(function(input, index) {%0A      var _a;%0A      switch (input.type) {%0A        case InterfaceTypes_default.TextStream: {%0A          const dataArray = encoder.encode(input.data.data);%0A          const arrayPtr = setPipelineModuleInputArray(pipelineModule, dataArray, index, 0);%0A          const dataJSON = { size: dataArray.buffer.byteLength, data: `data:application/vnd.itk.address,0:${arrayPtr}` };%0A          setPipelineModuleInputJSON(pipelineModule, dataJSON, index);%0A          break;%0A        }%0A        case InterfaceTypes_default.JsonCompatible: {%0A          const dataArray = encoder.encode(JSON.stringify(input.data));%0A          const arrayPtr = setPipelineModuleInputArray(pipelineModule, dataArray, index, 0);%0A          const dataJSON = { size: dataArray.buffer.byteLength, data: `data:application/vnd.itk.address,0:${arrayPtr}` };%0A          setPipelineModuleInputJSON(pipelineModule, dataJSON, index);%0A          break;%0A        }%0A        case InterfaceTypes_default.BinaryStream: {%0A          const dataArray = input.data.data;%0A          const arrayPtr = setPipelineModuleInputArray(pipelineModule, dataArray, index, 0);%0A          const dataJSON = { size: dataArray.buffer.byteLength, data: `data:application/vnd.itk.address,0:${arrayPtr}` };%0A          setPipelineModuleInputJSON(pipelineModule, dataJSON, index);%0A          break;%0A        }%0A        case InterfaceTypes_default.TextFile: {%0A          pipelineModule.fs_writeFile(input.data.path, input.data.data);%0A          break;%0A        }%0A        case InterfaceTypes_default.BinaryFile: {%0A          pipelineModule.fs_writeFile(input.data.path, input.data.data);%0A          break;%0A        }%0A        case InterfaceTypes_default.Image: {%0A          const image = input.data;%0A          const dataPtr = setPipelineModuleInputArray(pipelineModule, image.data, index, 0);%0A          const directionPtr = setPipelineModuleInputArray(pipelineModule, image.direction, index, 1);%0A          const metadata = typeof ((_a = image.metadata) === null || _a === void 0 ? void 0 : _a.entries) !== "undefined" ? JSON.stringify(Array.from(image.metadata.entries())) : "[]";%0A          const imageJSON = {%0A            imageType: image.imageType,%0A            name: image.name,%0A            origin: image.origin,%0A            spacing: image.spacing,%0A            direction: `data:application/vnd.itk.address,0:${directionPtr}`,%0A            size: image.size,%0A            data: `data:application/vnd.itk.address,0:${dataPtr}`,%0A            metadata%0A          };%0A          setPipelineModuleInputJSON(pipelineModule, imageJSON, index);%0A          break;%0A        }%0A        case InterfaceTypes_default.Mesh: {%0A          const mesh = input.data;%0A          const pointsPtr = setPipelineModuleInputArray(pipelineModule, mesh.points, index, 0);%0A          const cellsPtr = setPipelineModuleInputArray(pipelineModule, mesh.cells, index, 1);%0A          const pointDataPtr = setPipelineModuleInputArray(pipelineModule, mesh.pointData, index, 2);%0A          const cellDataPtr = setPipelineModuleInputArray(pipelineModule, mesh.cellData, index, 3);%0A          const meshJSON = {%0A            meshType: mesh.meshType,%0A            name: mesh.name,%0A            numberOfPoints: mesh.numberOfPoints,%0A            points: `data:application/vnd.itk.address,0:${pointsPtr}`,%0A            numberOfCells: mesh.numberOfCells,%0A            cells: `data:application/vnd.itk.address,0:${cellsPtr}`,%0A            cellBufferSize: mesh.cellBufferSize,%0A            numberOfPointPixels: mesh.numberOfPointPixels,%0A            pointData: `data:application/vnd.itk.address,0:${pointDataPtr}`,%0A            numberOfCellPixels: mesh.numberOfCellPixels,%0A            cellData: `data:application/vnd.itk.address,0:${cellDataPtr}`%0A          };%0A          setPipelineModuleInputJSON(pipelineModule, meshJSON, index);%0A          break;%0A        }%0A        case InterfaceTypes_default.PolyData: {%0A          const polyData = input.data;%0A          const pointsPtr = setPipelineModuleInputArray(pipelineModule, polyData.points, index, 0);%0A          const verticesPtr = setPipelineModuleInputArray(pipelineModule, polyData.vertices, index, 1);%0A          const linesPtr = setPipelineModuleInputArray(pipelineModule, polyData.lines, index, 2);%0A          const polygonsPtr = setPipelineModuleInputArray(pipelineModule, polyData.polygons, index, 3);%0A          const triangleStripsPtr = setPipelineModuleInputArray(pipelineModule, polyData.triangleStrips, index, 4);%0A          const pointDataPtr = setPipelineModuleInputArray(pipelineModule, polyData.pointData, index, 5);%0A          const cellDataPtr = setPipelineModuleInputArray(pipelineModule, polyData.pointData, index, 6);%0A          const polyDataJSON = {%0A            polyDataType: polyData.polyDataType,%0A            name: polyData.name,%0A            numberOfPoints: polyData.numberOfPoints,%0A            points: `data:application/vnd.itk.address,0:${pointsPtr}`,%0A            verticesBufferSize: polyData.verticesBufferSize,%0A            vertices: `data:application/vnd.itk.address,0:${verticesPtr}`,%0A            linesBufferSize: polyData.linesBufferSize,%0A            lines: `data:application/vnd.itk.address,0:${linesPtr}`,%0A            polygonsBufferSize: polyData.polygonsBufferSize,%0A            polygons: `data:application/vnd.itk.address,0:${polygonsPtr}`,%0A            triangleStripsBufferSize: polyData.triangleStripsBufferSize,%0A            triangleStrips: `data:application/vnd.itk.address,0:${triangleStripsPtr}`,%0A            numberOfPointPixels: polyData.numberOfPointPixels,%0A            pointData: `data:application/vnd.itk.address,0:${pointDataPtr}`,%0A            numberOfCellPixels: polyData.numberOfCellPixels,%0A            cellData: `data:application/vnd.itk.address,0:${cellDataPtr}`%0A          };%0A          setPipelineModuleInputJSON(pipelineModule, polyDataJSON, index);%0A          break;%0A        }%0A        case IOTypes_default.Text: {%0A          pipelineModule.fs_writeFile(input.path, input.data);%0A          break;%0A        }%0A        case IOTypes_default.Binary: {%0A          pipelineModule.fs_writeFile(input.path, input.data);%0A          break;%0A        }%0A        case IOTypes_default.Image: {%0A          const image = input.data;%0A          const imageJSON = {%0A            imageType: image.imageType,%0A            name: image.name,%0A            origin: image.origin,%0A            spacing: image.spacing,%0A            direction: "data:application/vnd.itk.path,data/direction.raw",%0A            size: image.size,%0A            data: "data:application/vnd.itk.path,data/data.raw"%0A          };%0A          pipelineModule.fs_mkdirs(`${input.path}/data`);%0A          pipelineModule.fs_writeFile(`${input.path}/index.json`, JSON.stringify(imageJSON));%0A          if (image.data === null) {%0A            throw Error("image.data is null");%0A          }%0A          pipelineModule.fs_writeFile(`${input.path}/data/data.raw`, new Uint8Array(image.data.buffer));%0A          pipelineModule.fs_writeFile(`${input.path}/data/direction.raw`, new Uint8Array(image.direction.buffer));%0A          break;%0A        }%0A        case IOTypes_default.Mesh: {%0A          const mesh = input.data;%0A          const meshJSON = {%0A            meshType: mesh.meshType,%0A            name: mesh.name,%0A            numberOfPoints: mesh.numberOfPoints,%0A            points: "data:application/vnd.itk.path,data/points.raw",%0A            numberOfPointPixels: mesh.numberOfPointPixels,%0A            pointData: "data:application/vnd.itk.path,data/pointData.raw",%0A            numberOfCells: mesh.numberOfCells,%0A            cells: "data:application/vnd.itk.path,data/cells.raw",%0A            numberOfCellPixels: mesh.numberOfCellPixels,%0A            cellData: "data:application/vnd.itk.path,data/cellData.raw",%0A            cellBufferSize: mesh.cellBufferSize%0A          };%0A          pipelineModule.fs_mkdirs(`${input.path}/data`);%0A          pipelineModule.fs_writeFile(`${input.path}/index.json`, JSON.stringify(meshJSON));%0A          if (meshJSON.numberOfPoints > 0) {%0A            if (mesh.points === null) {%0A              throw Error("mesh.points is null");%0A            }%0A            pipelineModule.fs_writeFile(`${input.path}/data/points.raw`, new Uint8Array(mesh.points.buffer));%0A          }%0A          if (meshJSON.numberOfPointPixels > 0) {%0A            if (mesh.pointData === null) {%0A              throw Error("mesh.pointData is null");%0A            }%0A            pipelineModule.fs_writeFile(`${input.path}/data/pointData.raw`, new Uint8Array(mesh.pointData.buffer));%0A          }%0A          if (meshJSON.numberOfCells > 0) {%0A            if (mesh.cells === null) {%0A              throw Error("mesh.cells is null");%0A            }%0A            pipelineModule.fs_writeFile(`${input.path}/data/cells.raw`, new Uint8Array(mesh.cells.buffer));%0A          }%0A          if (meshJSON.numberOfCellPixels > 0) {%0A            if (mesh.cellData === null) {%0A              throw Error("mesh.cellData is null");%0A            }%0A            pipelineModule.fs_writeFile(`${input.path}/data/cellData.raw`, new Uint8Array(mesh.cellData.buffer));%0A          }%0A          break;%0A        }%0A        default:%0A          throw Error("Unsupported input InterfaceType");%0A      }%0A    });%0A  }%0A  pipelineModule.resetModuleStdout();%0A  pipelineModule.resetModuleStderr();%0A  const stackPtr = pipelineModule.stackSave();%0A  let returnValue = 0;%0A  try {%0A    returnValue = pipelineModule.callMain(args.slice());%0A  } catch (exception) {%0A    if (typeof exception === "number") {%0A      console.log("Exception while running pipeline:");%0A      console.log("stdout:", pipelineModule.getModuleStdout());%0A      console.error("stderr:", pipelineModule.getModuleStderr());%0A      if (typeof pipelineModule.getExceptionMessage !== "undefined") {%0A        console.error("exception:", pipelineModule.getExceptionMessage(exception));%0A      } else {%0A        console.error("Build module in Debug mode for exception message information.");%0A      }%0A    }%0A    throw exception;%0A  } finally {%0A    pipelineModule.stackRestore(stackPtr);%0A  }%0A  const stdout = pipelineModule.getModuleStdout();%0A  const stderr = pipelineModule.getModuleStderr();%0A  const populatedOutputs = [];%0A  if (!(outputs == null) && outputs.length > 0 && returnValue === 0) {%0A    outputs.forEach(function(output, index) {%0A      let outputData = null;%0A      switch (output.type) {%0A        case InterfaceTypes_default.TextStream: {%0A          const dataPtr = pipelineModule.ccall("itk_wasm_output_array_address", "number", ["number", "number", "number"], [0, index, 0]);%0A          const dataSize = pipelineModule.ccall("itk_wasm_output_array_size", "number", ["number", "number", "number"], [0, index, 0]);%0A          const dataArrayView = new Uint8Array(pipelineModule.HEAPU8.buffer, dataPtr, dataSize);%0A          outputData = { data: decoder2.decode(dataArrayView) };%0A          break;%0A        }%0A        case InterfaceTypes_default.JsonCompatible: {%0A          const dataPtr = pipelineModule.ccall("itk_wasm_output_array_address", "number", ["number", "number", "number"], [0, index, 0]);%0A          const dataSize = pipelineModule.ccall("itk_wasm_output_array_size", "number", ["number", "number", "number"], [0, index, 0]);%0A          const dataArrayView = new Uint8Array(pipelineModule.HEAPU8.buffer, dataPtr, dataSize);%0A          outputData = JSON.parse(decoder2.decode(dataArrayView));%0A          break;%0A        }%0A        case InterfaceTypes_default.BinaryStream: {%0A          const dataPtr = pipelineModule.ccall("itk_wasm_output_array_address", "number", ["number", "number", "number"], [0, index, 0]);%0A          const dataSize = pipelineModule.ccall("itk_wasm_output_array_size", "number", ["number", "number", "number"], [0, index, 0]);%0A          outputData = { data: memoryUint8SharedArray(pipelineModule, dataPtr, dataSize) };%0A          break;%0A        }%0A        case InterfaceTypes_default.TextFile: {%0A          outputData = { path: output.data.path, data: pipelineModule.fs_readFile(output.data.path, { encoding: "utf8" }) };%0A          break;%0A        }%0A        case InterfaceTypes_default.BinaryFile: {%0A          outputData = { path: output.data.path, data: readFileSharedArray(pipelineModule, output.data.path) };%0A          break;%0A        }%0A        case InterfaceTypes_default.Image: {%0A          const image = getPipelineModuleOutputJSON(pipelineModule, index);%0A          image.data = getPipelineModuleOutputArray(pipelineModule, index, 0, image.imageType.componentType);%0A          image.direction = getPipelineModuleOutputArray(pipelineModule, index, 1, float_types_default.Float64);%0A          image.metadata = new Map(image.metadata);%0A          outputData = image;%0A          break;%0A        }%0A        case InterfaceTypes_default.Mesh: {%0A          const mesh = getPipelineModuleOutputJSON(pipelineModule, index);%0A          if (mesh.numberOfPoints > 0) {%0A            mesh.points = getPipelineModuleOutputArray(pipelineModule, index, 0, mesh.meshType.pointComponentType);%0A          } else {%0A            mesh.points = bufferToTypedArray_default(mesh.meshType.pointComponentType, new ArrayBuffer(0));%0A          }%0A          if (mesh.numberOfCells > 0) {%0A            mesh.cells = getPipelineModuleOutputArray(pipelineModule, index, 1, mesh.meshType.cellComponentType);%0A          } else {%0A            mesh.cells = bufferToTypedArray_default(mesh.meshType.cellComponentType, new ArrayBuffer(0));%0A          }%0A          if (mesh.numberOfPointPixels > 0) {%0A            mesh.pointData = getPipelineModuleOutputArray(pipelineModule, index, 2, mesh.meshType.pointPixelComponentType);%0A          } else {%0A            mesh.pointData = bufferToTypedArray_default(mesh.meshType.pointPixelComponentType, new ArrayBuffer(0));%0A          }%0A          if (mesh.numberOfCellPixels > 0) {%0A            mesh.cellData = getPipelineModuleOutputArray(pipelineModule, index, 3, mesh.meshType.cellPixelComponentType);%0A          } else {%0A            mesh.cellData = bufferToTypedArray_default(mesh.meshType.cellPixelComponentType, new ArrayBuffer(0));%0A          }%0A          outputData = mesh;%0A          break;%0A        }%0A        case InterfaceTypes_default.PolyData: {%0A          const polyData = getPipelineModuleOutputJSON(pipelineModule, index);%0A          if (polyData.numberOfPoints > 0) {%0A            polyData.points = getPipelineModuleOutputArray(pipelineModule, index, 0, float_types_default.Float32);%0A          } else {%0A            polyData.points = new Float32Array();%0A          }%0A          if (polyData.verticesBufferSize > 0) {%0A            polyData.vertices = getPipelineModuleOutputArray(pipelineModule, index, 1, int_types_default.UInt32);%0A          } else {%0A            polyData.vertices = new Uint32Array();%0A          }%0A          if (polyData.linesBufferSize > 0) {%0A            polyData.lines = getPipelineModuleOutputArray(pipelineModule, index, 2, int_types_default.UInt32);%0A          } else {%0A            polyData.lines = new Uint32Array();%0A          }%0A          if (polyData.polygonsBufferSize > 0) {%0A            polyData.polygons = getPipelineModuleOutputArray(pipelineModule, index, 3, int_types_default.UInt32);%0A          } else {%0A            polyData.polygons = new Uint32Array();%0A          }%0A          if (polyData.triangleStripsBufferSize > 0) {%0A            polyData.triangleStrips = getPipelineModuleOutputArray(pipelineModule, index, 4, int_types_default.UInt32);%0A          } else {%0A            polyData.triangleStrips = new Uint32Array();%0A          }%0A          if (polyData.numberOfPointPixels > 0) {%0A            polyData.pointData = getPipelineModuleOutputArray(pipelineModule, index, 5, polyData.polyDataType.pointPixelComponentType);%0A          } else {%0A            polyData.pointData = bufferToTypedArray_default(polyData.polyDataType.pointPixelComponentType, new ArrayBuffer(0));%0A          }%0A          if (polyData.numberOfCellPixels > 0) {%0A            polyData.cellData = getPipelineModuleOutputArray(pipelineModule, index, 6, polyData.polyDataType.cellPixelComponentType);%0A          } else {%0A            polyData.cellData = bufferToTypedArray_default(polyData.polyDataType.cellPixelComponentType, new ArrayBuffer(0));%0A          }%0A          outputData = polyData;%0A          break;%0A        }%0A        case IOTypes_default.Text: {%0A          if (typeof output.path === "undefined") {%0A            throw new Error("output.path not defined");%0A          }%0A          outputData = pipelineModule.fs_readFile(output.path, { encoding: "utf8" });%0A          break;%0A        }%0A        case IOTypes_default.Binary: {%0A          if (typeof output.path === "undefined") {%0A            throw new Error("output.path not defined");%0A          }%0A          outputData = readFileSharedArray(pipelineModule, output.path);%0A          break;%0A        }%0A        case IOTypes_default.Image: {%0A          if (typeof output.path === "undefined") {%0A            throw new Error("output.path not defined");%0A          }%0A          const imageJSON = pipelineModule.fs_readFile(`${output.path}/index.json`, { encoding: "utf8" });%0A          const image = JSON.parse(imageJSON);%0A          const dataUint8 = readFileSharedArray(pipelineModule, `${output.path}/data/data.raw`);%0A          image.data = bufferToTypedArray_default(image.imageType.componentType, dataUint8.buffer);%0A          const directionUint8 = readFileSharedArray(pipelineModule, `${output.path}/data/direction.raw`);%0A          image.direction = bufferToTypedArray_default(float_types_default.Float64, directionUint8.buffer);%0A          outputData = image;%0A          break;%0A        }%0A        case IOTypes_default.Mesh: {%0A          if (typeof output.path === "undefined") {%0A            throw new Error("output.path not defined");%0A          }%0A          const meshJSON = pipelineModule.fs_readFile(`${output.path}/index.json`, { encoding: "utf8" });%0A          const mesh = JSON.parse(meshJSON);%0A          if (mesh.numberOfPoints > 0) {%0A            const dataUint8Points = readFileSharedArray(pipelineModule, `${output.path}/data/points.raw`);%0A            mesh.points = bufferToTypedArray_default(mesh.meshType.pointComponentType, dataUint8Points.buffer);%0A          } else {%0A            mesh.points = bufferToTypedArray_default(mesh.meshType.pointComponentType, new ArrayBuffer(0));%0A          }%0A          if (mesh.numberOfPointPixels > 0) {%0A            const dataUint8PointData = readFileSharedArray(pipelineModule, `${output.path}/data/pointData.raw`);%0A            mesh.pointData = bufferToTypedArray_default(mesh.meshType.pointPixelComponentType, dataUint8PointData.buffer);%0A          } else {%0A            mesh.pointData = bufferToTypedArray_default(mesh.meshType.pointPixelComponentType, new ArrayBuffer(0));%0A          }%0A          if (mesh.numberOfCells > 0) {%0A            const dataUint8Cells = readFileSharedArray(pipelineModule, `${output.path}/data/cells.raw`);%0A            mesh.cells = bufferToTypedArray_default(mesh.meshType.cellComponentType, dataUint8Cells.buffer);%0A          } else {%0A            mesh.cells = bufferToTypedArray_default(mesh.meshType.cellComponentType, new ArrayBuffer(0));%0A          }%0A          if (mesh.numberOfCellPixels > 0) {%0A            const dataUint8CellData = readFileSharedArray(pipelineModule, `${output.path}/data/cellData.raw`);%0A            mesh.cellData = bufferToTypedArray_default(mesh.meshType.cellPixelComponentType, dataUint8CellData.buffer);%0A          } else {%0A            mesh.cellData = bufferToTypedArray_default(mesh.meshType.cellPixelComponentType, new ArrayBuffer(0));%0A          }%0A          outputData = mesh;%0A          break;%0A        }%0A        default:%0A          throw Error("Unsupported output InterfaceType");%0A      }%0A      const populatedOutput = {%0A        type: output.type,%0A        data: outputData%0A      };%0A      populatedOutputs.push(populatedOutput);%0A    });%0A  }%0A  return { returnValue, stdout, stderr, outputs: populatedOutputs };%0A}%0Avar runPipelineEmscripten_default = runPipelineEmscripten;%0A%0A// dist/core/web-workers/load-image-io-pipeline-module.js%0Avar __await = function(v) {%0A  return this instanceof __await ? (this.v = v, this) : new __await(v);%0A};%0Avar __asyncGenerator = function(thisArg, _arguments, generator) {%0A  if (!Symbol.asyncIterator)%0A    throw new TypeError("Symbol.asyncIterator is not defined.");%0A  var g = generator.apply(thisArg, _arguments || []), i, q = [];%0A  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {%0A    return this;%0A  }, i;%0A  function verb(n) {%0A    if (g[n])%0A      i[n] = function(v) {%0A        return new Promise(function(a, b) {%0A          q.push([n, v, a, b]) > 1 || resume(n, v);%0A        });%0A      };%0A  }%0A  function resume(n, v) {%0A    try {%0A      step(g[n](v));%0A    } catch (e) {%0A      settle2(q[0][3], e);%0A    }%0A  }%0A  function step(r) {%0A    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle2(q[0][2], r);%0A  }%0A  function fulfill(value) {%0A    resume("next", value);%0A  }%0A  function reject(value) {%0A    resume("throw", value);%0A  }%0A  function settle2(f, v) {%0A    if (f(v), q.shift(), q.length)%0A      resume(q[0][0], q[0][1]);%0A  }%0A};%0Avar __asyncValues = function(o) {%0A  if (!Symbol.asyncIterator)%0A    throw new TypeError("Symbol.asyncIterator is not defined.");%0A  var m = o[Symbol.asyncIterator], i;%0A  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {%0A    return this;%0A  }, i);%0A  function verb(n) {%0A    i[n] = o[n] && function(v) {%0A      return new Promise(function(resolve, reject) {%0A        v = o[n](v), settle2(resolve, reject, v.done, v.value);%0A      });%0A    };%0A  }%0A  function settle2(resolve, reject, d, v) {%0A    Promise.resolve(v).then(function(v2) {%0A      resolve({ value: v2, done: d });%0A    }, reject);%0A  }%0A};%0Afunction availableIOModules(input) {%0A  return __asyncGenerator(this, arguments, function* availableIOModules_1() {%0A    for (let idx = 0; idx < ImageIOIndex_default.length; idx++) {%0A      const trialIO = ImageIOIndex_default[idx] + "-read-image";%0A      const ioModule = yield __await(load_pipeline_module_default(trialIO, input.config.imageIOUrl));%0A      yield yield __await(ioModule);%0A    }%0A  });%0A}%0Aasync function loadImageIOPipelineModule(input, postfix) {%0A  var e_1, _a;%0A  if (input.mimeType && MimeToImageIO_default.has(input.mimeType)) {%0A    const io = MimeToImageIO_default.get(input.mimeType) + postfix;%0A    const ioModule = await load_pipeline_module_default(io, input.config.imageIOUrl);%0A    return ioModule;%0A  }%0A  const extension = getFileExtension_default(input.fileName);%0A  if (extensionToImageIO_default.has(extension)) {%0A    const io = extensionToImageIO_default.get(extension) + postfix;%0A    const ioModule = await load_pipeline_module_default(io, input.config.imageIOUrl);%0A    return ioModule;%0A  }%0A  for (let idx = 0; idx < ImageIOIndex_default.length; ++idx) {%0A    let idx2 = 0;%0A    try {%0A      for (var _b = (e_1 = void 0, __asyncValues(availableIOModules(input))), _c; _c = await _b.next(), !_c.done; ) {%0A        const pipelineModule = _c.value;%0A        try {%0A          const { returnValue, outputs } = await runPipelineEmscripten_default(pipelineModule, input.args, input.outputs, input.inputs);%0A          if (returnValue === 0) {%0A            return pipelineModule;%0A          }%0A        } catch (error) {%0A        }%0A        idx2++;%0A      }%0A    } catch (e_1_1) {%0A      e_1 = { error: e_1_1 };%0A    } finally {%0A      try {%0A        if (_c && !_c.done && (_a = _b.return))%0A          await _a.call(_b);%0A      } finally {%0A        if (e_1)%0A          throw e_1.error;%0A      }%0A    }%0A  }%0A  throw Error(`Could not find IO for: ${input.fileName}`);%0A}%0Avar load_image_io_pipeline_module_default = loadImageIOPipelineModule;%0A%0A// dist/io/internal/MimeToMeshIO.js%0Avar mimeToIO2 = /* @__PURE__ */ new Map([]);%0Avar MimeToMeshIO_default = mimeToIO2;%0A%0A// dist/io/extensionToMeshIO.js%0Avar extensionToIO2 = /* @__PURE__ */ new Map([%0A  ["vtk", "VTKPolyDataMeshIO"],%0A  ["VTK", "VTKPolyDataMeshIO"],%0A  ["byu", "BYUMeshIO"],%0A  ["BYU", "BYUMeshIO"],%0A  ["fsa", "FreeSurferAsciiMeshIO"],%0A  ["FSA", "FreeSurferAsciiMeshIO"],%0A  ["fsb", "FreeSurferBinaryMeshIO"],%0A  ["FSB", "FreeSurferBinaryMeshIO"],%0A  ["obj", "OBJMeshIO"],%0A  ["OBJ", "OBJMeshIO"],%0A  ["off", "OFFMeshIO"],%0A  ["OFF", "OFFMeshIO"],%0A  ["stl", "STLMeshIO"],%0A  ["STL", "STLMeshIO"],%0A  ["swc", "SWCMeshIO"],%0A  ["SWC", "SWCMeshIO"],%0A  ["iwm", "WasmMeshIO"],%0A  ["iwm.cbor", "WasmMeshIO"],%0A  ["iwm.cbor.zst", "WasmZstdMeshIO"]%0A]);%0Avar extensionToMeshIO_default = extensionToIO2;%0A%0A// dist/io/internal/MeshIOIndex.js%0Avar MeshIOIndex = ["BYUMeshIO", "FreeSurferAsciiMeshIO", "FreeSurferBinaryMeshIO", "OBJMeshIO", "OFFMeshIO", "STLMeshIO", "SWCMeshIO", "VTKPolyDataMeshIO", "WasmMeshIO", "WasmZstdMeshIO"];%0Avar MeshIOIndex_default = MeshIOIndex;%0A%0A// dist/core/web-workers/load-mesh-io-pipeline-module.js%0Avar __await2 = function(v) {%0A  return this instanceof __await2 ? (this.v = v, this) : new __await2(v);%0A};%0Avar __asyncGenerator2 = function(thisArg, _arguments, generator) {%0A  if (!Symbol.asyncIterator)%0A    throw new TypeError("Symbol.asyncIterator is not defined.");%0A  var g = generator.apply(thisArg, _arguments || []), i, q = [];%0A  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {%0A    return this;%0A  }, i;%0A  function verb(n) {%0A    if (g[n])%0A      i[n] = function(v) {%0A        return new Promise(function(a, b) {%0A          q.push([n, v, a, b]) > 1 || resume(n, v);%0A        });%0A      };%0A  }%0A  function resume(n, v) {%0A    try {%0A      step(g[n](v));%0A    } catch (e) {%0A      settle2(q[0][3], e);%0A    }%0A  }%0A  function step(r) {%0A    r.value instanceof __await2 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle2(q[0][2], r);%0A  }%0A  function fulfill(value) {%0A    resume("next", value);%0A  }%0A  function reject(value) {%0A    resume("throw", value);%0A  }%0A  function settle2(f, v) {%0A    if (f(v), q.shift(), q.length)%0A      resume(q[0][0], q[0][1]);%0A  }%0A};%0Avar __asyncValues2 = function(o) {%0A  if (!Symbol.asyncIterator)%0A    throw new TypeError("Symbol.asyncIterator is not defined.");%0A  var m = o[Symbol.asyncIterator], i;%0A  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {%0A    return this;%0A  }, i);%0A  function verb(n) {%0A    i[n] = o[n] && function(v) {%0A      return new Promise(function(resolve, reject) {%0A        v = o[n](v), settle2(resolve, reject, v.done, v.value);%0A      });%0A    };%0A  }%0A  function settle2(resolve, reject, d, v) {%0A    Promise.resolve(v).then(function(v2) {%0A      resolve({ value: v2, done: d });%0A    }, reject);%0A  }%0A};%0Afunction availableIOModules2(input) {%0A  return __asyncGenerator2(this, arguments, function* availableIOModules_1() {%0A    for (let idx = 0; idx < MeshIOIndex_default.length; idx++) {%0A      const trialIO = MeshIOIndex_default[idx] + "-read-mesh";%0A      const ioModule = yield __await2(load_pipeline_module_default(trialIO, input.config.meshIOUrl));%0A      yield yield __await2(ioModule);%0A    }%0A  });%0A}%0Aasync function loadMeshIOPipelineModule(input, postfix) {%0A  var e_1, _a;%0A  if (input.mimeType && MimeToMeshIO_default.has(input.mimeType)) {%0A    const io = MimeToMeshIO_default.get(input.mimeType) + postfix;%0A    const ioModule = await load_pipeline_module_default(io, input.config.meshIOUrl);%0A    return ioModule;%0A  }%0A  const extension = getFileExtension_default(input.fileName);%0A  if (extensionToMeshIO_default.has(extension)) {%0A    const io = extensionToMeshIO_default.get(extension) + postfix;%0A    const ioModule = await load_pipeline_module_default(io, input.config.meshIOUrl);%0A    return ioModule;%0A  }%0A  for (let idx = 0; idx < MeshIOIndex_default.length; ++idx) {%0A    let idx2 = 0;%0A    try {%0A      for (var _b = (e_1 = void 0, __asyncValues2(availableIOModules2(input))), _c; _c = await _b.next(), !_c.done; ) {%0A        const pipelineModule = _c.value;%0A        try {%0A          const { returnValue, outputs } = await runPipelineEmscripten_default(pipelineModule, input.args, input.outputs, input.inputs);%0A          if (returnValue === 0) {%0A            return pipelineModule;%0A          }%0A        } catch (error) {%0A        }%0A        idx2++;%0A      }%0A    } catch (e_1_1) {%0A      e_1 = { error: e_1_1 };%0A    } finally {%0A      try {%0A        if (_c && !_c.done && (_a = _b.return))%0A          await _a.call(_b);%0A      } finally {%0A        if (e_1)%0A          throw e_1.error;%0A      }%0A    }%0A  }%0A  throw Error(`Could not find IO for: ${input.fileName}`);%0A}%0Avar load_mesh_io_pipeline_module_default = loadMeshIOPipelineModule;%0A%0A// dist/core/web-workers/run-pipeline.js%0Avar import_register = __toESM(require_register(), 1);%0A%0A// dist/core/getTransferables.js%0Avar haveSharedArrayBuffer2 = typeof globalThis.SharedArrayBuffer !== "undefined";%0Afunction getTransferables(data) {%0A  if (data === void 0 || data === null) {%0A    return [];%0A  }%0A  const transferables = [];%0A  for (let i = 0; i < data.length; i++) {%0A    const transferable = getTransferable(data[i]);%0A    if (transferable !== null) {%0A      transferables.push(transferable);%0A    }%0A  }%0A  return transferables;%0A}%0Afunction getTransferable(data) {%0A  if (data === void 0 || data === null) {%0A    return null;%0A  }%0A  let result = null;%0A  if (data.buffer !== void 0) {%0A    result = data.buffer;%0A  } else if (data.byteLength !== void 0) {%0A    result = data;%0A  }%0A  if (haveSharedArrayBuffer2 && result instanceof SharedArrayBuffer) {%0A    return null;%0A  }%0A  return result;%0A}%0Avar getTransferables_default = getTransferables;%0A%0A// dist/core/internal/imageTransferables.js%0Afunction imageTransferables(image) {%0A  return [%0A    image.data,%0A    image.direction%0A  ];%0A}%0Avar imageTransferables_default = imageTransferables;%0A%0A// dist/core/internal/meshTransferables.js%0Afunction meshTransferables(mesh) {%0A  return [%0A    mesh.points,%0A    mesh.pointData,%0A    mesh.cells,%0A    mesh.cellData%0A  ];%0A}%0Avar meshTransferables_default = meshTransferables;%0A%0A// dist/core/internal/polyDataTransferables.js%0Afunction polyDataTransferables(polyData) {%0A  return [%0A    polyData.points,%0A    polyData.vertices,%0A    polyData.lines,%0A    polyData.polygons,%0A    polyData.triangleStrips,%0A    polyData.pointData,%0A    polyData.cellData%0A  ];%0A}%0Avar polyDataTransferables_default = polyDataTransferables;%0A%0A// dist/core/web-workers/run-pipeline.js%0Aasync function runPipeline(pipelineModule, args, outputs, inputs) {%0A  const result = runPipelineEmscripten_default(pipelineModule, args, outputs, inputs);%0A  const transferables = [];%0A  if (result.outputs) {%0A    result.outputs.forEach(function(output) {%0A      if (output.type === InterfaceTypes_default.BinaryStream || output.type === InterfaceTypes_default.BinaryFile) {%0A        const binary = output.data;%0A        transferables.push(binary);%0A      } else if (output.type === InterfaceTypes_default.Image) {%0A        const image = output.data;%0A        transferables.push(...imageTransferables_default(image));%0A      } else if (output.type === InterfaceTypes_default.Mesh) {%0A        const mesh = output.data;%0A        transferables.push(...meshTransferables_default(mesh));%0A      } else if (output.type === InterfaceTypes_default.PolyData) {%0A        const polyData = output.data;%0A        transferables.push(...polyDataTransferables_default(polyData));%0A      } else if (output.type === IOTypes_default.Binary) {%0A        const binary = output.data;%0A        transferables.push(binary);%0A      } else if (output.type === IOTypes_default.Image) {%0A        const image = output.data;%0A        transferables.push(...imageTransferables_default(image));%0A      } else if (output.type === IOTypes_default.Mesh) {%0A        const mesh = output.data;%0A        transferables.push(...meshTransferables_default(mesh));%0A      }%0A    });%0A  }%0A  return new import_register.default.TransferableResponse(result, getTransferables_default(transferables));%0A}%0Avar run_pipeline_default = runPipeline;%0A%0A// dist/core/web-workers/itk-wasm-pipeline.worker.js%0A(0, import_register2.default)(async function(input) {%0A  let pipelineModule = null;%0A  if (input.operation === "runPipeline") {%0A    const pipelineBaseUrl = typeof input.config[input.pipelineBaseUrl] === "undefined" ? input.pipelineBaseUrl : input.config[input.pipelineBaseUrl];%0A    pipelineModule = await load_pipeline_module_default(input.pipelinePath, pipelineBaseUrl);%0A  } else if (input.operation === "readImage") {%0A    pipelineModule = await load_image_io_pipeline_module_default(input, "-read-image");%0A  } else if (input.operation === "writeImage") {%0A    pipelineModule = await load_image_io_pipeline_module_default(input, "-write-image");%0A  } else if (input.operation === "readMesh") {%0A    pipelineModule = await load_mesh_io_pipeline_module_default(input, "-read-mesh");%0A  } else if (input.operation === "writeMesh") {%0A    pipelineModule = await load_mesh_io_pipeline_module_default(input, "-write-mesh");%0A  } else if (input.operation === "meshToPolyData") {%0A    pipelineModule = await load_pipeline_module_default("mesh-to-polydata", input.config.meshIOUrl);%0A  } else if (input.operation === "polyDataToMesh") {%0A    pipelineModule = await load_pipeline_module_default("polydata-to-mesh", input.config.meshIOUrl);%0A  } else if (input.operation === "readDICOMImageSeries") {%0A    pipelineModule = await load_pipeline_module_default("read-image-dicom-file-series", input.config.imageIOUrl);%0A  } else if (input.operation === "readDICOMTags") {%0A    pipelineModule = await load_pipeline_module_default("read-dicom-tags", input.config.imageIOUrl);%0A  } else {%0A    throw new Error("Unknown worker operation");%0A  }%0A  return run_pipeline_default(pipelineModule, input.args, input.outputs, input.inputs);%0A});%0A';

// src/index-worker-embedded.ts
setPipelineWorkerUrl(itk_wasm_pipeline_worker_default);
export {
  bio_rad_read_image_default as bioRadReadImage,
  bio_rad_write_image_default as bioRadWriteImage,
  bmp_read_image_default as bmpReadImage,
  bmp_write_image_default as bmpWriteImage,
  fdf_read_image_default as fdfReadImage,
  fdf_write_image_default as fdfWriteImage,
  gdcm_read_image_default as gdcmReadImage,
  gdcm_write_image_default as gdcmWriteImage,
  ge4_read_image_default as ge4ReadImage,
  ge4_write_image_default as ge4WriteImage,
  ge5_read_image_default as ge5ReadImage,
  ge5_write_image_default as ge5WriteImage,
  ge_adw_read_image_default as geAdwReadImage,
  ge_adw_write_image_default as geAdwWriteImage,
  getPipelineWorkerUrl2 as getPipelineWorkerUrl,
  getPipelinesBaseUrl2 as getPipelinesBaseUrl,
  gipl_read_image_default as giplReadImage,
  gipl_write_image_default as giplWriteImage,
  hdf5_read_image_default as hdf5ReadImage,
  hdf5_write_image_default as hdf5WriteImage,
  jpeg_read_image_default as jpegReadImage,
  jpeg_write_image_default as jpegWriteImage,
  lsm_read_image_default as lsmReadImage,
  lsm_write_image_default as lsmWriteImage,
  meta_read_image_default as metaReadImage,
  meta_write_image_default as metaWriteImage,
  mgh_read_image_default as mghReadImage,
  mgh_write_image_default as mghWriteImage,
  minc_read_image_default as mincReadImage,
  minc_write_image_default as mincWriteImage,
  mrc_read_image_default as mrcReadImage,
  mrc_write_image_default as mrcWriteImage,
  nifti_read_image_default as niftiReadImage,
  nifti_write_image_default as niftiWriteImage,
  nrrd_read_image_default as nrrdReadImage,
  nrrd_write_image_default as nrrdWriteImage,
  png_read_image_default as pngReadImage,
  png_write_image_default as pngWriteImage,
  read_image_default as readImage,
  read_image_file_series_default as readImageFileSeries,
  scanco_read_image_default as scancoReadImage,
  scanco_write_image_default as scancoWriteImage,
  setPipelineWorkerUrl,
  setPipelinesBaseUrl,
  tiff_read_image_default as tiffReadImage,
  tiff_write_image_default as tiffWriteImage,
  vtk_read_image_default as vtkReadImage,
  vtk_write_image_default as vtkWriteImage,
  wasm_read_image_default as wasmReadImage,
  wasm_write_image_default as wasmWriteImage,
  wasm_zstd_read_image_default as wasmZstdReadImage,
  wasm_zstd_write_image_default as wasmZstdWriteImage,
  write_image_default as writeImage
};
"""
default_config = JsPackageConfig(default_js_module)
js_package = JsPackage(default_config)
