export type IndexArray = Uint16Array | Uint32Array;

export interface Geometry {
  readonly positions: Float32Array;
  readonly normals: Float32Array;
  readonly indices: IndexArray;
  readonly uvs?: Float32Array;
  readonly tangents?: Float32Array;
  readonly bitangents?: Float32Array;
  readonly vertexCount: number;
  readonly indexCount: number;
}

/**
 * Creates an appropriate index array based on the maximum vertex index.
 * Uses Uint16Array for meshes with <= 65535 vertices (more memory efficient),
 * and Uint32Array for larger meshes.
 *
 * @param indices - Array of vertex indices
 * @returns Uint16Array if max index <= 65535, otherwise Uint32Array
 *
 * @example
 * ```ts
 * const indices = createIndexArray([0, 1, 2, 3, 4, 5]);
 * // Returns Uint16Array for small meshes
 *
 * const largeIndices = createIndexArray(Array.from({ length: 100000 }, (_, i) => i));
 * // Returns Uint32Array for large meshes
 * ```
 */
export function createIndexArray(indices: number[]): IndexArray {
  const maxIndex = indices.length > 0 ? Math.max(...indices) : 0;
  return maxIndex > 65535 ? new Uint32Array(indices) : new Uint16Array(indices);
}

/**
 * Gets the WebGPU index format for the given index array.
 *
 * @param indices - The index array to check
 * @returns 'uint32' for Uint32Array, 'uint16' for Uint16Array
 */
export function getIndexFormat(indices: IndexArray): GPUIndexFormat {
  return indices instanceof Uint32Array ? "uint32" : "uint16";
}
