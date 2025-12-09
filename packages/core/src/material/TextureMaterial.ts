import type { Material, VertexBufferLayout } from "./Material";
import { ShaderLib } from "../shaders";
import type { Texture } from "../texture";

/**
 * Options for creating a TextureMaterial.
 */
export interface TextureMaterialOptions {
  texture: Texture;
}

/**
 * A material that renders geometry with a texture map.
 *
 * @example
 * ```ts
 * const texture = await Texture.load(device, '/path/to/image.png');
 * const material = new TextureMaterial({ texture });
 * const mesh = new Mesh(geometry, material);
 * ```
 */
export class TextureMaterial implements Material {
  readonly type = "texture";
  readonly texture: Texture;

  /**
   * Creates a new TextureMaterial instance.
   * @param options - Configuration options including the texture to use
   */
  constructor(options: TextureMaterialOptions) {
    this.texture = options.texture;
  }

  /**
   * Returns the WGSL vertex shader code for texture rendering.
   * @returns The vertex shader source code
   */
  getVertexShader(): string {
    return ShaderLib.get(this.type).vertex;
  }

  /**
   * Returns the WGSL fragment shader code for texture rendering.
   * @returns The fragment shader source code
   */
  getFragmentShader(): string {
    return ShaderLib.get(this.type).fragment;
  }

  /**
   * Returns the vertex buffer layout for position, normal, and UV attributes.
   * @returns The vertex buffer layout with 32-byte stride
   */
  getVertexBufferLayout(): VertexBufferLayout {
    return {
      // position(vec3f) + normal(vec3f) + uv(vec2f) = 8 floats × 4 bytes = 32 bytes
      arrayStride: 32,
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
        {
          shaderLocation: 2,
          offset: 24,
          format: "float32x2", // uv
        },
      ],
    };
  }

  /**
   * Returns the uniform buffer size for MVP matrix.
   * @returns The buffer size in bytes (64 bytes for mat4x4f)
   */
  getUniformBufferSize(): number {
    return 64;
  }

  /**
   * Returns the primitive topology for rendering.
   * @returns The topology type (triangle-list)
   */
  getPrimitiveTopology(): GPUPrimitiveTopology {
    return "triangle-list";
  }

  /**
   * Returns the texture used by this material.
   * @returns The texture instance
   */
  getTexture(): Texture {
    return this.texture;
  }

  /**
   * Returns all textures used by this material.
   * @returns An array containing the single texture
   */
  getTextures(): Texture[] {
    return [this.texture];
  }
}
