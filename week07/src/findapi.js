{
  let names = Object.getOwnPropertyNames(window);
  console.log("names.length", names.length);
  let js = new Set();
  let objects = [
    "BigInt",
    "BigInt64Array",
    "BigUint64Array",
    "Infinity",
    "NaN",
    "undefined",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "Array",
    "Date",
    "RegExp",
    "Promise",
    "Proxy",
    "Map",
    "WeakMap",
    "Set",
    "WeakSet",
    "Function",
    "Boolean",
    "String",
    "Number",
    "Symbol",
    "Object",
    "Error",
    "EvalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "DataView",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint16Array",
    "Uint32Array",
    "Uint8ClampedArray",
    "Atomics",
    "JSON",
    "Math",
    "Reflect",
    "escape",
    "unescape",
  ];
  objects.forEach((o) => js.add(o));
  names = names.filter((e) => !js.has(e));

  names = names
    .filter((e) => {
      try {
        return !(window[e].prototype instanceof Node);
      } catch (err) {
        return true;
      }
    })
    .filter((e) => e != "Node");

  let windowprops = new Set();
  objects = [
    "window",
    "self",
    "document",
    "name",
    "location",
    "history",
    "customElements",
    "locationbar",
    "menubar",
    " personalbar",
    "scrollbars",
    "statusbar",
    "toolbar",
    "status",
    "close",
    "closed",
    "stop",
    "focus",
    " blur",
    "frames",
    "length",
    "top",
    "opener",
    "parent",
    "frameElement",
    "open",
    "navigator",
    "applicationCache",
    "alert",
    "confirm",
    "prompt",
    "print",
    "postMessage",
    "console",
  ];
  objects.forEach((o) => windowprops.add(o));
  names = names.filter((e) => !windowprops.has(e));
  names = names.filter((e) => !e.match(/^on/));

  names = names.filter((e) => !e.match(/^webkit/));

  let interfaces = new Set();
  objects = [
    "ApplicationCache",
    "AudioTrack",
    "AudioTrackList",
    "BarProp",
    "BeforeUnloadEvent",
    "BroadcastChannel",
    "CanvasGradient",
    "CanvasPattern",
    "CanvasRenderingContext2D",
    "CloseEvent",
    "CustomElementRegistry",
    "DOMStringList",
    "DOMStringMap",
    "DataTransfer",
    "DataTransferItem",
    "DataTransferItemList",
    "DedicatedWorkerGlobalScope",
    "Document",
    "DragEvent",
    "ErrorEvent",
    "EventSource",
    "External",
    "FormDataEvent",
    "HTMLAllCollection",
    "HashChangeEvent",
    "History",
    "ImageBitmap",
    "ImageBitmapRenderingContext",
    "ImageData",
    "Location",
    "MediaError",
    "MessageChannel",
    "MessageEvent",
    "MessagePort",
    "MimeType",
    "MimeTypeArray",
    "Navigator",
    "OffscreenCanvas",
    "OffscreenCanvasRenderingContext2D",
    "PageTransitionEvent",
    "Path2D",
    "Plugin",
    "PluginArray",
    "PopStateEvent",
    "PromiseRejectionEvent",
    "RadioNodeList",
    "SharedWorker",
    "SharedWorkerGlobalScope",
    "Storage",
    "StorageEvent",
    "TextMetrics",
    "TextTrack",
    "TextTrackCue",
    "TextTrackCueList",
    "TextTrackList",
    "TimeRanges",
    "TrackEvent",
    "ValidityState",
    "VideoTrack",
    "VideoTrackList",
    "WebSocket",
    "Window",
    "Worker",
    "WorkerGlobalScope",
    "WorkerLocation",
    "WorkerNavigator",
  ];
  objects.forEach((o) => interfaces.add(o));

  names = names.filter((e) => !interfaces.has(e));
  names = names.filter((e) => e != "Intl");

  names = filterOut(names, [
    "WebGLVertexArrayObject",
    "WebGLTransformFeedback",
    "WebGLSync",
    "WebGLSampler",
    "WebGLQuery",
    "WebGL2RenderingContext",
    "WebGLContextEvent",
    "WebGLObject",
    "WebGLBuffer",
    "WebGLFramebuffer",
    "WebGLProgram",
    "WebGLRenderbuffer",
    "WebGLShader",
    "WebGLTexture",
    "WebGLUniformLocation",
    "WebGLActiveInfo",
    "WebGLShaderPrecisionFormat",
    "WebGLRenderingContext",
  ]);
  console.log("before readable", names);
  names = filterOut(names, [
    "ReadableStream",
    "ReadableStreamDefaultReader",
    "ReadableStreamBYOBReader",
    "ReadableStreamDefaultController",
    "ReadableByteStreamController",
    "ReadableStreamBYOBRequest",
    "WritableStream",
    "WritableStreamDefaultWriter",
    "WritableStreamDefaultController",
    "TransformStream",
    "TransformStreamDefaultController",
    "ByteLengthQueuingStrategy",
    "CountQueuingStrategy",
  ]);
  names = filterOut(names, [
    "AudioContext",
    "AudioNode",
    "AnalyserNode",
    "AudioBuffer",
    "AudioBufferSourceNode",
    "AudioDestinationNode",
    "AudioParam",
    "AudioListener",
    "AudioWorklet",
    "AudioWorkletGlobalScope",
    "AudioWorkletNode",
    "AudioWorkletProcessor",
    "BiquadFilterNode",
    "ChannelMergerNode",
    "ChannelSplitterNode",
    "ConstantSourceNode",
    "ConvolverNode",
    "DelayNode",
    "DynamicsCompressorNode",
    "GainNode",
    "IIRFilterNode",
    "MediaElementAudioSourceNode",
    "MediaStreamAudioSourceNode",
    "MediaStreamTrackAudioSourceNode",
    "MediaStreamAudioDestinationNode",
    "PannerNode",
    "PeriodicWave",
    "OscillatorNode",
    "StereoPannerNode",
    "WaveShaperNode",
    "ScriptProcessorNode",
    "AudioProcessingEvent",
  ]);

  names = filterOut(names, [
    "TextDecoder",
    "TextEncoder",
    "TextDecoderStream",
    "TextEncoderStream",
  ]);
  names = filterOut(names, ["ServiceWorkerRegistration", "SyncManager"]);

  names = filterOut(names, ["CryptoKey", "SubtleCrypto", "Crypto", "crypto"]);

  names = filterOut(names, ["MediaSource", "SourceBuffer", "SourceBufferList"]);
  names = filterOut(names, ["ScreenOrientation"]);
  console.log("nams left", names);
  function filterOut(names, props) {
    let set = new Set();
    props.forEach((o) => set.add(o));
    return names.filter((e) => !set.has(e));
  }
}
