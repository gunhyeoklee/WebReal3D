import { Matrix4 } from "@web-real/math";
import { Camera } from "./Camera";

export interface PerspectiveCameraOptions {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

/**
 * Represents a perspective camera with adjustable field of view and clipping planes.
 *
 * @example
 * ```ts
 * const camera = new PerspectiveCamera({ fov: 75, aspect: 16/9, near: 0.1, far: 1000 });
 * camera.setPosition(0, 5, 10);
 * camera.lookAt(0, 0, 0);
 * camera.updateAspect(canvas); // Auto-track canvas resizing
 * ```
 */
export class PerspectiveCamera extends Camera {
  public fov: number;
  public aspect: number;
  public near: number;
  public far: number;

  private _resizeObserver: ResizeObserver | null = null;

  /**
   * Creates a new PerspectiveCamera instance.
   * @param options - Camera configuration options (all optional)
   */
  constructor(options: PerspectiveCameraOptions = {}) {
    super();
    this.fov = options.fov ?? 60;
    this.aspect = options.aspect ?? 1;
    this.near = options.near ?? 0.1;
    this.far = options.far ?? 100;
  }

  /**
   * Calculates the projection matrix from current camera parameters.
   * @returns A Matrix4 representing the perspective projection
   */
  get projectionMatrix(): Matrix4 {
    const fovRad = (this.fov * Math.PI) / 180;
    return Matrix4.perspective(fovRad, this.aspect, this.near, this.far);
  }

  /**
   * Updates the aspect ratio to match the canvas and automatically tracks canvas resize events.
   * @param canvas - The canvas element to synchronize aspect ratio with
   * @returns This camera instance for method chaining
   */
  updateAspect(canvas: HTMLCanvasElement): this {
    this.disposeResizeObserver();

    this.aspect = canvas.width / canvas.height;

    this._resizeObserver = new ResizeObserver(() => {
      this.aspect = canvas.width / canvas.height;
    });

    this._resizeObserver.observe(canvas);

    return this;
  }

  /**
   * Stops observing canvas size changes.
   */
  disposeResizeObserver(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  /**
   * Releases any resources owned by the camera.
   */
  dispose(): void {
    this.disposeResizeObserver();
  }
}
