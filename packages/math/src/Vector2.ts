/**
 * Represents a 2D vector with x and y components.
 *
 * @example
 * ```ts
 * const v1 = new Vector2(3, 4);
 * const v2 = new Vector2(1, 2);
 * const sum = v1.add(v2); // Vector2(4, 6)
 * const length = v1.length; // 5
 * ```
 */
export class Vector2 {
  private _data: Float32Array;

  /**
   * Creates a new Vector2 instance.
   * @param x - The x component (default: 0)
   * @param y - The y component (default: 0)
   */
  constructor(x = 0, y = 0) {
    this._data = new Float32Array([x, y]);
  }

  get x(): number {
    return this._data[0];
  }
  set x(value: number) {
    this._data[0] = value;
  }

  get y(): number {
    return this._data[1];
  }
  set y(value: number) {
    this._data[1] = value;
  }

  /**
   * Gets the underlying Float32Array data.
   * @returns The internal Float32Array containing x and y components
   */
  get data(): Float32Array {
    return this._data;
  }

  /**
   * Calculates the length (magnitude) of this vector.
   * @returns The Euclidean length of the vector
   */
  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Adds another vector to this vector and returns a new Vector2.
   * @param v - The vector to add
   * @returns A new Vector2 representing the sum
   */
  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  /**
   * Subtracts another vector from this vector and returns a new Vector2.
   * @param v - The vector to subtract
   * @returns A new Vector2 representing the difference
   */
  sub(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /**
   * Multiplies this vector by a scalar value and returns a new Vector2.
   * @param s - The scalar value to multiply by
   * @returns A new Vector2 scaled by the given factor
   */
  scale(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s);
  }

  /**
   * Calculates the dot product of this vector with another.
   * @param v - The vector to compute dot product with
   * @returns The scalar dot product value
   */
  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Normalizes this vector to unit length.
   * @returns A new Vector2 with length 1 in the same direction, or zero vector if length is 0
   */
  normalize(): Vector2 {
    const len = this.length;

    if (len === 0) {
      return new Vector2();
    }

    return this.scale(1 / len);
  }

  /**
   * Calculates the distance from this vector to another.
   * @param v - The target vector
   * @returns The Euclidean distance between the two vectors
   */
  distanceTo(v: Vector2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Creates a copy of this vector.
   * @returns A new Vector2 with the same x and y values
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Sets the x and y components of this vector.
   * @param x - The new x component
   * @param y - The new y component
   * @returns This vector instance for method chaining
   */
  set(x: number, y: number): this {
    this._data[0] = x;
    this._data[1] = y;
    return this;
  }

  /**
   * Returns a string representation of this vector.
   * @returns A string in the format "Vector2(x, y)"
   */
  toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }
}
