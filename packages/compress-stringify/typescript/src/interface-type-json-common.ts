import { Image, Mesh, PolyData } from "itk-wasm";

export interface ImageJson extends Omit<Image, "direction" | "data"> {
  direction: string;
  data: string | null;
}

export interface MeshJson
  extends Omit<Mesh, "points" | "pointData" | "cells" | "cellData"> {
  points: string | null;
  cells: string | null;
  pointData: string | null;
  cellData: string | null;
}

export interface PolyDataJson
  extends Omit<
    PolyData,
    | "points"
    | "vertices"
    | "lines"
    | "polygons"
    | "triangleStrips"
    | "pointData"
    | "cellData"
  > {
  points: string | null;
  vertices: string | null;
  lines: string | null;
  polygons: string | null;
  triangleStrips: string | null;
  pointData: string | null;
  cellData: string | null;
}
