import { Color } from "@web-real/math";
import type { Material, VertexBufferLayout } from "./Material";
import { ShaderLib } from "../shaders";

export interface LineMaterialOptions {
  color?: [number, number, number] | Color;
}

/**
 * Material for rendering lines with a single solid color.
 * Uses "line-list" primitive topology.
 *
 * @example
 * ```ts
 * const material = new LineMaterial({
 *   color: [1.0, 0.5, 0.0] // Orange line
 * });
 * ```
 */
export class LineMaterial implements Material {
  readonly type = "line";
  /** Color with RGBA components (Color instance, 0-1 range) */
  readonly color: Color;

  /**
   * Creates a new LineMaterial instance.
   * @param options - Configuration options (default: white color)
   */
  constructor(options: LineMaterialOptions = {}) {
    this.color = options.color
      ? Color.from(options.color)
      : new Color(1.0, 1.0, 1.0);
  }

  /**
   * Gets the vertex shader code for line rendering.
   * @returns WGSL vertex shader code
   */
  getVertexShader(): string {
    return ShaderLib.get(this.type).vertex;
  }

  /**
   * Gets the fragment shader code for line rendering.
   * @returns WGSL fragment shader code
   */
  getFragmentShader(): string {
    return ShaderLib.get(this.type).fragment;
  }

  /**
   * Gets the vertex buffer layout for position-only vertices.
   * @returns Vertex buffer layout with 12-byte stride
   */
  getVertexBufferLayout(): VertexBufferLayout {
    return {
      // position(vec3f) = 3 floats × 4 bytes = 12 bytes
      arrayStride: 12,
      attributes: [
        {
          shaderLocation: 0,
          offset: 0,
          format: "float32x3", // position
        },
      ],
    };
  }

  /**
   * Gets the uniform buffer size for MVP matrix and color.
   * @returns 80 bytes (64 for MVP + 16 for color)
   */
  getUniformBufferSize(): number {
    return 80;
  }

  /**
   * Gets the primitive topology for rendering lines.
   * @returns "line-list"
   */
  getPrimitiveTopology(): GPUPrimitiveTopology {
    return "line-list";
  }

  /**
   * Writes the line color to the uniform buffer.
   * @param buffer - DataView of the uniform buffer
   * @param offset - Byte offset to start writing (default: 64 after MVP matrix)
   */
  writeUniformData(buffer: DataView, offset: number = 64): void {
    buffer.setFloat32(offset, this.color.r, true);
    buffer.setFloat32(offset + 4, this.color.g, true);
    buffer.setFloat32(offset + 8, this.color.b, true);
    buffer.setFloat32(offset + 12, this.color.a, true);
  }
}
