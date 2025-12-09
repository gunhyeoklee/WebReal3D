import type { Material, VertexBufferLayout } from "./Material";
import { ShaderLib } from "../shaders";

export interface LineColorMaterialOptions {
  /** Per-vertex colors as Float32Array (3 floats per vertex: RGB) */
  colors?: Float32Array;
}

/**
 * Material for rendering lines with per-vertex colors.
 * Uses "line-list" primitive topology.
 *
 * @example
 * ```ts
 * const colors = new Float32Array([1, 0, 0, 0, 1, 0]); // Red to green
 * const material = new LineColorMaterial({ colors });
 * ```
 */
export class LineColorMaterial implements Material {
  readonly type = "lineColor";
  private _colors: Float32Array;

  /**
   * Creates a new LineColorMaterial instance.
   * @param options - Configuration options with per-vertex colors
   */
  constructor(options: LineColorMaterialOptions = {}) {
    this._colors = options.colors ?? new Float32Array(0);
  }

  get colors(): Float32Array {
    return this._colors;
  }

  /**
   * Updates the per-vertex color data.
   * @param colors - Float32Array of RGB values (3 floats per vertex)
   */
  setColors(colors: Float32Array): void {
    this._colors = colors;
  }

  /**
   * Gets the vertex shader code for colored line rendering.
   * @returns WGSL vertex shader code
   */
  getVertexShader(): string {
    return ShaderLib.get(this.type).vertex;
  }

  /**
   * Gets the fragment shader code for colored line rendering.
   * @returns WGSL fragment shader code
   */
  getFragmentShader(): string {
    return ShaderLib.get(this.type).fragment;
  }

  /**
   * Gets the vertex buffer layout for position and color attributes.
   * @returns Vertex buffer layout with 24-byte stride
   */
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

  /**
   * Gets the uniform buffer size for MVP matrix only.
   * @returns 64 bytes (no additional color data needed)
   */
  getUniformBufferSize(): number {
    return 64;
  }

  /**
   * Gets the primitive topology for rendering lines.
   * @returns "line-list"
   */
  getPrimitiveTopology(): GPUPrimitiveTopology {
    return "line-list";
  }
}
