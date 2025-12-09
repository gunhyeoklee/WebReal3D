import { Color } from "@web-real/math";
import type { Material, VertexBufferLayout } from "./Material";
import { ShaderLib } from "../shaders";

export interface BasicMaterialOptions {
  color?: [number, number, number] | Color;
}

/**
 * Basic material for rendering solid-colored geometry with normals.
 * Uses "triangle-list" primitive topology.
 *
 * @example
 * ```ts
 * const material = new BasicMaterial({
 *   color: [0.0, 0.5, 1.0] // Blue
 * });
 * ```
 */
export class BasicMaterial implements Material {
  readonly type = "basic";
  /** RGBA color (Color instance, 0-1 range) */
  readonly color: Color;

  /**
   * Creates a new BasicMaterial instance.
   * @param options - Configuration options (default: white color)
   */
  constructor(options: BasicMaterialOptions = {}) {
    this.color = options.color
      ? Color.from(options.color)
      : new Color(1.0, 1.0, 1.0);
  }

  /**
   * Gets the vertex shader code for basic rendering.
   * @returns WGSL vertex shader code
   */
  getVertexShader(): string {
    return ShaderLib.get(this.type).vertex;
  }

  /**
   * Gets the fragment shader code for basic rendering.
   * @returns WGSL fragment shader code
   */
  getFragmentShader(): string {
    return ShaderLib.get(this.type).fragment;
  }

  /**
   * Gets the vertex buffer layout for position and normal attributes.
   * @returns Vertex buffer layout with 24-byte stride
   */
  getVertexBufferLayout(): VertexBufferLayout {
    return {
      // position(vec3f) + normal(vec3f) = 6 floats × 4 bytes = 24 bytes
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
          format: "float32x3", // normal
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
   * Gets the primitive topology for rendering triangles.
   * @returns "triangle-list"
   */
  getPrimitiveTopology(): GPUPrimitiveTopology {
    return "triangle-list";
  }

  /**
   * Writes the material color to the uniform buffer.
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
