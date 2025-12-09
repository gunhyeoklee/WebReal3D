import { Vector3 } from "./Vector3";
import { BoundingBox } from "./BoundingBox";

/**
 * Represents a bounding sphere for 3D objects.
 *
 * @example
 * ```ts
 * const positions = new Float32Array([0, 0, 0, 1, 1, 1, -1, -1, -1]);
 * const sphere = BoundingSphere.fromPositions(positions);
 * const point = new Vector3(0.5, 0.5, 0.5);
 * console.log(sphere.containsPoint(point)); // true
 * ```
 */
export class BoundingSphere {
  /** Center point of the sphere */
  public center: Vector3;
  /** Radius of the sphere */
  public radius: number;

  /**
   * Creates a new BoundingSphere.
   * @param center - Center point (defaults to origin)
   * @param radius - Radius (defaults to -1, indicating empty sphere)
   */
  constructor(center = new Vector3(), radius = -1) {
    this.center = center;
    this.radius = radius;
  }

  /**
   * Creates a BoundingSphere from vertex positions.
   * @param positions - Vertex positions as Float32Array with stride 3 (x, y, z)
   * @returns A BoundingSphere that contains all positions
   */
  static fromPositions(positions: Float32Array): BoundingSphere {
    if (positions.length === 0) {
      return new BoundingSphere();
    }

    // First, compute AABB
    const box = BoundingBox.fromPositions(positions);
    const center = box.getCenter();

    // Find the maximum distance from center to any vertex
    // Reuse a single Vector3 to avoid memory allocation in the loop
    let maxRadiusSquared = 0;
    const point = new Vector3();
    for (let i = 0; i < positions.length; i += 3) {
      point.set(positions[i], positions[i + 1], positions[i + 2]);
      const distSquared = center.distanceToSquared(point);
      maxRadiusSquared = Math.max(maxRadiusSquared, distSquared);
    }

    return new BoundingSphere(center, Math.sqrt(maxRadiusSquared));
  }

  /**
   * Creates a BoundingSphere from a BoundingBox.
   * @param box - The bounding box to convert
   * @returns A BoundingSphere centered at the box center
   */
  static fromBoundingBox(box: BoundingBox): BoundingSphere {
    const center = box.getCenter();
    const size = box.getSize();
    const radius = size.length * 0.5;
    return new BoundingSphere(center, radius);
  }

  /**
   * Tests if a point is inside the bounding sphere.
   * @param point - The point to test
   * @returns True if the point is inside or on the boundary
   */
  containsPoint(point: Vector3): boolean {
    return this.center.distanceToSquared(point) <= this.radius * this.radius;
  }

  /**
   * Tests if this sphere intersects another sphere.
   * @param sphere - The other bounding sphere
   * @returns True if the spheres overlap
   */
  intersectsSphere(sphere: BoundingSphere): boolean {
    const radiusSum = this.radius + sphere.radius;
    return (
      this.center.distanceToSquared(sphere.center) <= radiusSum * radiusSum
    );
  }

  /**
   * Creates a copy of this bounding sphere.
   * @returns A new BoundingSphere with the same center and radius
   */
  clone(): BoundingSphere {
    return new BoundingSphere(this.center.clone(), this.radius);
  }

  /**
   * Checks if the sphere is empty (has negative radius).
   * @returns True if the sphere has a negative radius
   */
  isEmpty(): boolean {
    return this.radius < 0;
  }
}
