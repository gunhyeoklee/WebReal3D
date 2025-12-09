import { Matrix4 } from "@web-real/math";
import { Camera } from "./Camera";

export interface OrthographicCameraOptions {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  near?: number;
  far?: number;
  zoom?: number;
}

/**
 * Represents an orthographic camera with parallel projection and zoom support.
 *
 * @example
 * ```ts
 * const camera = new OrthographicCamera({ zoom: 2 });
 * camera.setViewport(800, 600);
 * camera.position.set(0, 0, 5);
 * const matrix = camera.projectionMatrix; // Get projection matrix
 * ```
 */
export class OrthographicCamera extends Camera {
  public left: number;
  public right: number;
  public top: number;
  public bottom: number;
  public near: number;
  public far: number;
  public zoom: number;

  private _resizeObserver: ResizeObserver | null = null;

  /**
   * Creates a new OrthographicCamera instance.
   * @param options - Camera configuration options (default: centered unit viewport)
   */
  constructor(options: OrthographicCameraOptions = {}) {
    super();
    this.left = options.left ?? -1;
    this.right = options.right ?? 1;
    this.top = options.top ?? 1;
    this.bottom = options.bottom ?? -1;
    this.near = options.near ?? 0.1;
    this.far = options.far ?? 100;
    this.zoom = options.zoom ?? 1;
  }

  /**
   * Calculates the orthographic projection matrix with zoom applied.
   * @returns The projection matrix for this camera
   */
  get projectionMatrix(): Matrix4 {
    const scale = 1 / this.zoom;

    const cx = (this.left + this.right) / 2;
    const cy = (this.top + this.bottom) / 2;
    const width = (this.right - this.left) * scale;
    const height = (this.top - this.bottom) * scale;

    const left = cx - width / 2;
    const right = cx + width / 2;
    const bottom = cy - height / 2;
    const top = cy + height / 2;

    return Matrix4.orthographic(left, right, bottom, top, this.near, this.far);
  }

  /**
   * Centers the view box using the provided dimensions.
   * @param width - The viewport width in pixels
   * @param height - The viewport height in pixels
   * @returns This camera instance for method chaining
   */
  setViewport(width: number, height: number): this {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    this.left = -halfWidth;
    this.right = halfWidth;
    this.top = halfHeight;
    this.bottom = -halfHeight;
    return this;
  }

  /**
   * Mirrors the canvas size and observes future resizes automatically.
   * @param canvas - The canvas element to synchronize with
   * @returns This camera instance for method chaining
   */
  updateViewport(canvas: HTMLCanvasElement): this {
    this.disposeResizeObserver();

    this.setViewport(canvas.width, canvas.height);

    this._resizeObserver = new ResizeObserver(() => {
      this.setViewport(canvas.width, canvas.height);
    });

    this._resizeObserver.observe(canvas);

    return this;
  }

  /**
   * Disconnects the resize observer if active.
   */
  disposeResizeObserver(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  /**
   * Cleans up any observers before disposal.
   */
  dispose(): void {
    this.disposeResizeObserver();
  }
}
