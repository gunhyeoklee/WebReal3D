import type { Material, VertexBufferLayout } from "./Material";
import { ShaderLib } from "../shaders";

export interface LineColorMaterialOptions {
  /** Per-vertex colors as Float32Array (3 floats per vertex: RGB) */
  colors?: Float32Array;
}

/**
 * Material for rendering lines with per-vertex colors.
 * Uses "line-list" primitive topology.
 */
export class LineColorMaterial implements Material {
  readonly type = "lineColor";
  private _colors: Float32Array;

  constructor(options: LineColorMaterialOptions = {}) {
    this._colors = options.colors ?? new Float32Array(0);
  }

  get colors(): Float32Array {
    return this._colors;
  }

  /**
   * Updates per-vertex colors.
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
    return "line-list";
  }
}
