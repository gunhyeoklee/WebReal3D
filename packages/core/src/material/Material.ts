import type { Texture } from "../texture";
import type { Camera } from "../camera/Camera";
import type { Scene } from "../scene/Scene";
import type { Mesh } from "../scene/Mesh";
import type { Light } from "../light/Light";

/**
 * Defines the layout of vertex data in a GPU buffer.
 */
export interface VertexBufferLayout {
  arrayStride: number;
  attributes: {
    shaderLocation: number;
    offset: number;
    format: GPUVertexFormat;
  }[];
}

/**
 * Context information passed to materials during rendering.
 */
export interface RenderContext {
  camera: Camera;
  scene: Scene;
  mesh: Mesh;
  /** Lights collected from the scene (collected once per frame by Renderer) */
  lights: Light[];
}

/**
 * Interface for materials that define how geometry is rendered.
 * Materials provide shaders, vertex layouts, and uniform data for the rendering pipeline.
 */
export interface Material {
  /** Unique identifier for the material type */
  readonly type: string;

  /**
   * Gets the vertex shader code for this material.
   * @returns WGSL shader code as a string
   */
  getVertexShader(): string;

  /**
   * Gets the fragment shader code for this material.
   * @returns WGSL shader code as a string
   */
  getFragmentShader(): string;

  /**
   * Gets the vertex buffer layout describing vertex attribute structure.
   * @returns Vertex buffer layout configuration
   */
  getVertexBufferLayout(): VertexBufferLayout;

  /**
   * Gets the required size in bytes for the uniform buffer.
   * @returns Size in bytes
   */
  getUniformBufferSize(): number;

  /**
   * Gets the primitive topology for rendering.
   * @returns GPU primitive topology (e.g., "triangle-list", "line-list")
   */
  getPrimitiveTopology(): GPUPrimitiveTopology;

  /**
   * Writes material-specific uniform data to the buffer.
   * @param buffer - DataView of the uniform buffer
   * @param offset - Byte offset to start writing (default varies by material, typically 64 after MVP matrix)
   * @param context - Optional rendering context with camera, scene, and mesh information
   */
  writeUniformData?(
    buffer: DataView,
    offset: number,
    context?: RenderContext
  ): void;

  /**
   * Gets textures for multi-texture materials.
   * @param device - Optional GPUDevice for creating default/dummy textures
   * @returns Array of Texture objects to be bound to the shader
   */
  getTextures?(device?: GPUDevice): Texture[];
}
