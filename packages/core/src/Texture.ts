/**
 * Represents a texture that can be used for rendering.
 * Wraps a GPUTexture and GPUSampler for WebGPU usage.
 */
export class Texture {
  private _gpuTexture: GPUTexture;
  private _gpuSampler: GPUSampler;
  private _width: number;
  private _height: number;

  /**
   * Creates a new Texture instance.
   * @param gpuTexture - The WebGPU texture object
   * @param gpuSampler - The WebGPU sampler object
   * @param width - Texture width in pixels
   * @param height - Texture height in pixels
   */
  constructor(
    gpuTexture: GPUTexture,
    gpuSampler: GPUSampler,
    width: number,
    height: number
  ) {
    this._gpuTexture = gpuTexture;
    this._gpuSampler = gpuSampler;
    this._width = width;
    this._height = height;
  }

  /**
   * Gets the underlying GPUTexture object.
   */
  get gpuTexture(): GPUTexture {
    return this._gpuTexture;
  }

  /**
   * Gets the underlying GPUSampler object.
   */
  get gpuSampler(): GPUSampler {
    return this._gpuSampler;
  }

  /**
   * Gets the texture width in pixels.
   */
  get width(): number {
    return this._width;
  }

  /**
   * Gets the texture height in pixels.
   */
  get height(): number {
    return this._height;
  }

  /**
   * Loads a texture from a URL.
   * @param device - The WebGPU device
   * @param url - URL to the image file
   * @returns A promise that resolves to a Texture instance
   * @throws {Error} If the network request fails, image format is invalid, or GPU resources cannot be created
   */
  static async fromURL(device: GPUDevice, url: string): Promise<Texture> {
    try {
      // Load the image
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch texture from ${url}: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();

      // Validate content type
      if (!blob.type.startsWith("image/")) {
        throw new Error(
          `Invalid image format from ${url}: expected image/* but got ${blob.type}`
        );
      }

      const imageBitmap = await createImageBitmap(blob);

      // Create the GPU texture
      const texture = device.createTexture({
        size: [imageBitmap.width, imageBitmap.height, 1],
        format: "rgba8unorm",
        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.RENDER_ATTACHMENT,
      });

      // Upload the image data to the GPU
      device.queue.copyExternalImageToTexture(
        { source: imageBitmap },
        { texture: texture },
        [imageBitmap.width, imageBitmap.height]
      );

      // Create a sampler
      const sampler = device.createSampler({
        magFilter: "linear",
        minFilter: "linear",
        mipmapFilter: "linear",
        addressModeU: "repeat",
        addressModeV: "repeat",
      });

      return new Texture(
        texture,
        sampler,
        imageBitmap.width,
        imageBitmap.height
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load texture from ${url}: ${error.message}`);
      }
      throw new Error(`Failed to load texture from ${url}: Unknown error`);
    }
  }

  /**
   * Destroys the GPU texture resources.
   */
  destroy(): void {
    this._gpuTexture.destroy();
  }
}
