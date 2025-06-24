// Type declarations for global window objects used in tests
declare global {
  interface Window {
    compressStringify: any;
    imageIo: any;
    meshIo: any;
    compareImages: any;
    compareMeshes: any;
    meshToPolyData: any;
  }
}

export {};
