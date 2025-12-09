import { Matrix4, Vector3 } from "@web-real/math";
import { Object3D } from "../scene/Object3D";

/**
 * Abstract base class for all camera types in the rendering system.
 *
 * @example
 * ```ts
 * // Create a perspective camera (concrete implementation)
 * const camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
 * camera.setPosition(0, 5, 10);
 * camera.lookAt(new Vector3(0, 0, 0));
 * ```
 */
export abstract class Camera extends Object3D {
  protected _target: Vector3 = new Vector3(0, 0, 0);
  protected _up: Vector3 = new Vector3(0, 1, 0);

  /**
   * Calculates the view matrix based on camera's world position and orientation.
   * @returns The view matrix for transforming world space to camera space
   */
  get viewMatrix(): Matrix4 {
    const e = this.worldMatrix.data;
    const worldPosition = new Vector3(e[12], e[13], e[14]);
    return Matrix4.lookAt(worldPosition, this._target, this._up);
  }

  /**
   * Gets the projection matrix for this camera.
   * @returns The projection matrix for transforming camera space to clip space
   */
  abstract get projectionMatrix(): Matrix4;

  /**
   * Sets the camera to look at a target position.
   * @param target - The point in world space to look at
   * @returns This camera instance for method chaining
   */
  lookAt(target: Vector3): this {
    this._target.set(target.x, target.y, target.z);
    return this;
  }

  /**
   * Sets the up vector direction for the camera.
   * @param up - The up direction vector in world space (default: positive Y-axis)
   * @returns This camera instance for method chaining
   */
  setUp(up: Vector3): this {
    this._up.set(up.x, up.y, up.z);
    return this;
  }

  get target(): Vector3 {
    return this._target;
  }

  get up(): Vector3 {
    return this._up;
  }
}
