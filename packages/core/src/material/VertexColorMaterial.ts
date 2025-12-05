import { Color } from "@web-real/math";
import type { Material, VertexBufferLayout } from "./Material";
import { ShaderLib } from "../shaders";

const DEFAULT_FACE_COLORS: Color[] = [
  Color.fromHex("#ff4d4d"), // Front - Red
  Color.fromHex("#4dff4d"), // Back - Green
  Color.fromHex("#4d4dff"), // Top - Blue
  Color.fromHex("#ffff4d"), // Bottom - Yellow
  Color.fromHex("#ff4dff"), // Right - Magenta
  Color.fromHex("#4dffff"), // Left - Cyan
];

export interface VertexColorMaterialOptions {
  colors?: Float32Array;
  faceColors?: Color[];
  verticesPerFace?: number;
}

export class VertexColorMaterial implements Material {
  readonly type = "vertexColor";

  private _colors: Float32Array;

  constructor(options: VertexColorMaterialOptions = {}) {
    if (options.colors) {
      this._colors = options.colors;
    } else {
      const faceColors = options.faceColors ?? DEFAULT_FACE_COLORS;
      const verticesPerFace = options.verticesPerFace ?? 4;
      this._colors = this.expandFaceColors(faceColors, verticesPerFace);
    }
  }

  private expandFaceColors(
    faceColors: Color[],
    verticesPerFace: number
  ): Float32Array {
    const colors: number[] = [];
    for (const color of faceColors) {
      for (let i = 0; i < verticesPerFace; i++) {
        colors.push(color.r, color.g, color.b);
      }
    }
    return new Float32Array(colors);
  }

  get colors(): Float32Array {
    return this._colors;
  }

  /**
   * Updates face colors and regenerates per-vertex colors.
   * @param faceColors - Array of Color objects for each face
   * @param verticesPerFace - Number of vertices per face (default: 4)
   */
  setFaceColors(faceColors: Color[], verticesPerFace: number = 4): void {
    this._colors = this.expandFaceColors(faceColors, verticesPerFace);
  }

  /**
   * Updates per-vertex colors directly.
   * @param colors - Float32Array of RGB values (3 floats per vertex)
   */
  setColors(colors: Float32Array): void {
    this._colors = colors;
  }

  getVertexShader(): string {
    return ShaderLib.get(this.type).vertex;
  }

  getFragmentShader(): string {
    return ShaderLib.get(this.type).fragment;
  }

  getVertexBufferLayout(): VertexBufferLayout {
    return {
      // position(vec3f) + color(vec3f) = 6 floats × 4 bytes = 24 bytes
      arrayStride: 24,
      attributes: [
        {
          shaderLocation: 0,
          offset: 0,
          format: "float32x3", // position
        },
        {
          shaderLocation: 1,
          offset: 12,
          format: "float32x3", // color
        },
      ],
    };
  }

  // Only needs MVP matrix (64 bytes).
  getUniformBufferSize(): number {
    return 64;
  }

  getPrimitiveTopology(): GPUPrimitiveTopology {
    return "triangle-list";
  }
}
