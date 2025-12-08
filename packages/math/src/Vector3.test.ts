import { describe, it, expect } from "vitest";
import { Vector3 } from "./Vector3";

describe("Vector3", () => {
  describe("constructor", () => {
    it("should initialize with default values (0, 0, 0)", () => {
      const v = new Vector3();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    it("should initialize with given values", () => {
      const v = new Vector3(1, 2, 3);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });
  });

  describe("getters and setters", () => {
    it("should get and set x, y, z values", () => {
      const v = new Vector3();
      v.x = 5;
      v.y = 10;
      v.z = 15;
      expect(v.x).toBe(5);
      expect(v.y).toBe(10);
      expect(v.z).toBe(15);
    });

    it("should return Float32Array data", () => {
      const v = new Vector3(1, 2, 3);
      expect(v.data).toBeInstanceOf(Float32Array);
      expect(v.data[0]).toBe(1);
      expect(v.data[1]).toBe(2);
      expect(v.data[2]).toBe(3);
    });
  });

  describe("length", () => {
    it("should calculate length of zero vector", () => {
      const v = new Vector3(0, 0, 0);
      expect(v.length).toBe(0);
    });

    it("should calculate length of unit vectors", () => {
      expect(new Vector3(1, 0, 0).length).toBe(1);
      expect(new Vector3(0, 1, 0).length).toBe(1);
      expect(new Vector3(0, 0, 1).length).toBe(1);
    });

    it("should calculate length correctly", () => {
      const v = new Vector3(3, 4, 0);
      expect(v.length).toBe(5);
    });

    it("should calculate 3D length correctly", () => {
      const v = new Vector3(1, 2, 2);
      expect(v.length).toBe(3);
    });
  });

  describe("add", () => {
    it("should add two vectors", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(4, 5, 6);
      const result = v1.add(v2);
      expect(result.x).toBe(5);
      expect(result.y).toBe(7);
      expect(result.z).toBe(9);
    });

    it("should return a new vector (not mutate original)", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(4, 5, 6);
      const result = v1.add(v2);
      expect(v1.x).toBe(1);
      expect(v1.y).toBe(2);
      expect(v1.z).toBe(3);
      expect(result).not.toBe(v1);
    });
  });

  describe("sub", () => {
    it("should subtract two vectors", () => {
      const v1 = new Vector3(5, 7, 9);
      const v2 = new Vector3(1, 2, 3);
      const result = v1.sub(v2);
      expect(result.x).toBe(4);
      expect(result.y).toBe(5);
      expect(result.z).toBe(6);
    });

    it("should return a new vector (not mutate original)", () => {
      const v1 = new Vector3(5, 7, 9);
      const v2 = new Vector3(1, 2, 3);
      const result = v1.sub(v2);
      expect(v1.x).toBe(5);
      expect(result).not.toBe(v1);
    });
  });

  describe("scale", () => {
    it("should scale vector by a scalar", () => {
      const v = new Vector3(1, 2, 3);
      const result = v.scale(2);
      expect(result.x).toBe(2);
      expect(result.y).toBe(4);
      expect(result.z).toBe(6);
    });

    it("should handle negative scaling", () => {
      const v = new Vector3(1, 2, 3);
      const result = v.scale(-1);
      expect(result.x).toBe(-1);
      expect(result.y).toBe(-2);
      expect(result.z).toBe(-3);
    });

    it("should handle zero scaling", () => {
      const v = new Vector3(1, 2, 3);
      const result = v.scale(0);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(0);
    });
  });

  describe("dot", () => {
    it("should calculate dot product", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(4, 5, 6);
      expect(v1.dot(v2)).toBe(32); // 1*4 + 2*5 + 3*6 = 32
    });

    it("should return 0 for perpendicular vectors", () => {
      const v1 = new Vector3(1, 0, 0);
      const v2 = new Vector3(0, 1, 0);
      expect(v1.dot(v2)).toBe(0);
    });

    it("should return positive for same direction vectors", () => {
      const v1 = new Vector3(1, 0, 0);
      const v2 = new Vector3(2, 0, 0);
      expect(v1.dot(v2)).toBeGreaterThan(0);
    });

    it("should return negative for opposite direction vectors", () => {
      const v1 = new Vector3(1, 0, 0);
      const v2 = new Vector3(-1, 0, 0);
      expect(v1.dot(v2)).toBeLessThan(0);
    });
  });

  describe("cross", () => {
    it("should calculate cross product", () => {
      const v1 = new Vector3(1, 0, 0);
      const v2 = new Vector3(0, 1, 0);
      const result = v1.cross(v2);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(1);
    });

    it("should follow right-hand rule", () => {
      const x = new Vector3(1, 0, 0);
      const y = new Vector3(0, 1, 0);
      const z = new Vector3(0, 0, 1);

      // x × y = z
      const xy = x.cross(y);
      expect(xy.x).toBeCloseTo(0);
      expect(xy.y).toBeCloseTo(0);
      expect(xy.z).toBeCloseTo(1);

      // y × z = x
      const yz = y.cross(z);
      expect(yz.x).toBeCloseTo(1);
      expect(yz.y).toBeCloseTo(0);
      expect(yz.z).toBeCloseTo(0);

      // z × x = y
      const zx = z.cross(x);
      expect(zx.x).toBeCloseTo(0);
      expect(zx.y).toBeCloseTo(1);
      expect(zx.z).toBeCloseTo(0);
    });

    it("should return zero vector for parallel vectors", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(2, 4, 6);
      const result = v1.cross(v2);
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(0);
      expect(result.z).toBeCloseTo(0);
    });

    it("should be anti-commutative (a × b = -(b × a))", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(4, 5, 6);
      const ab = v1.cross(v2);
      const ba = v2.cross(v1);
      expect(ab.x).toBeCloseTo(-ba.x);
      expect(ab.y).toBeCloseTo(-ba.y);
      expect(ab.z).toBeCloseTo(-ba.z);
    });
  });

  describe("normalize", () => {
    it("should normalize vector to unit length", () => {
      const v = new Vector3(3, 4, 0);
      const result = v.normalize();
      expect(result.length).toBeCloseTo(1);
      expect(result.x).toBeCloseTo(0.6);
      expect(result.y).toBeCloseTo(0.8);
      expect(result.z).toBeCloseTo(0);
    });

    it("should return zero vector when normalizing zero vector", () => {
      const v = new Vector3(0, 0, 0);
      const result = v.normalize();
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(0);
    });

    it("should not mutate original vector", () => {
      const v = new Vector3(3, 4, 0);
      v.normalize();
      expect(v.x).toBe(3);
      expect(v.y).toBe(4);
      expect(v.z).toBe(0);
    });
  });

  describe("clone", () => {
    it("should create an independent copy", () => {
      const v = new Vector3(1, 2, 3);
      const clone = v.clone();
      expect(clone.x).toBe(1);
      expect(clone.y).toBe(2);
      expect(clone.z).toBe(3);
    });

    it("should not affect original when clone is modified", () => {
      const v = new Vector3(1, 2, 3);
      const clone = v.clone();
      clone.x = 100;
      expect(v.x).toBe(1);
    });

    it("should return a different instance", () => {
      const v = new Vector3(1, 2, 3);
      const clone = v.clone();
      expect(clone).not.toBe(v);
    });
  });

  describe("set", () => {
    it("should set x, y, z values", () => {
      const v = new Vector3();
      v.set(1, 2, 3);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });

    it("should return this for chaining", () => {
      const v = new Vector3();
      const result = v.set(1, 2, 3);
      expect(result).toBe(v);
    });
  });

  describe("toString", () => {
    it("should return string representation", () => {
      const v = new Vector3(1, 2, 3);
      expect(v.toString()).toBe("Vector3(1, 2, 3)");
    });

    it("should handle decimal values", () => {
      const v = new Vector3(1.5, 2.5, 3.5);
      expect(v.toString()).toBe("Vector3(1.5, 2.5, 3.5)");
    });
  });

  describe("distanceTo", () => {
    it("should calculate distance between two vectors", () => {
      const v1 = new Vector3(0, 0, 0);
      const v2 = new Vector3(3, 4, 0);
      expect(v1.distanceTo(v2)).toBe(5);
    });

    it("should calculate 3D distance correctly", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(4, 6, 8);
      // sqrt((4-1)^2 + (6-2)^2 + (8-3)^2) = sqrt(9 + 16 + 25) = sqrt(50)
      expect(v1.distanceTo(v2)).toBeCloseTo(Math.sqrt(50));
    });

    it("should return 0 for same vectors", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(1, 2, 3);
      expect(v1.distanceTo(v2)).toBe(0);
    });

    it("should be symmetric", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(4, 5, 6);
      expect(v1.distanceTo(v2)).toBeCloseTo(v2.distanceTo(v1));
    });
  });

  describe("distanceToSquared", () => {
    it("should calculate squared distance between two vectors", () => {
      const v1 = new Vector3(0, 0, 0);
      const v2 = new Vector3(3, 4, 0);
      expect(v1.distanceToSquared(v2)).toBe(25); // 3^2 + 4^2 = 25
    });

    it("should calculate 3D squared distance correctly", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(4, 6, 8);
      // (4-1)^2 + (6-2)^2 + (8-3)^2 = 9 + 16 + 25 = 50
      expect(v1.distanceToSquared(v2)).toBe(50);
    });

    it("should return 0 for same vectors", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(1, 2, 3);
      expect(v1.distanceToSquared(v2)).toBe(0);
    });

    it("should be symmetric", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(4, 5, 6);
      expect(v1.distanceToSquared(v2)).toBe(v2.distanceToSquared(v1));
    });

    it("should avoid sqrt computation", () => {
      const v1 = new Vector3(0, 0, 0);
      const v2 = new Vector3(1, 1, 1);
      const distSq = v1.distanceToSquared(v2);
      const dist = v1.distanceTo(v2);
      expect(distSq).toBeCloseTo(dist * dist);
    });
  });

  describe("Vector3.min", () => {
    it("should return component-wise minimum", () => {
      const v1 = new Vector3(1, 5, 3);
      const v2 = new Vector3(4, 2, 6);
      const result = Vector3.min(v1, v2);
      expect(result.x).toBe(1);
      expect(result.y).toBe(2);
      expect(result.z).toBe(3);
    });

    it("should handle negative values", () => {
      const v1 = new Vector3(-1, 5, -3);
      const v2 = new Vector3(4, -2, 6);
      const result = Vector3.min(v1, v2);
      expect(result.x).toBe(-1);
      expect(result.y).toBe(-2);
      expect(result.z).toBe(-3);
    });

    it("should handle equal values", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(1, 2, 3);
      const result = Vector3.min(v1, v2);
      expect(result.x).toBe(1);
      expect(result.y).toBe(2);
      expect(result.z).toBe(3);
    });

    it("should return a new vector", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(4, 5, 6);
      const result = Vector3.min(v1, v2);
      expect(result).not.toBe(v1);
      expect(result).not.toBe(v2);
    });

    it("should be commutative", () => {
      const v1 = new Vector3(1, 5, 3);
      const v2 = new Vector3(4, 2, 6);
      const result1 = Vector3.min(v1, v2);
      const result2 = Vector3.min(v2, v1);
      expect(result1.x).toBe(result2.x);
      expect(result1.y).toBe(result2.y);
      expect(result1.z).toBe(result2.z);
    });
  });

  describe("Vector3.max", () => {
    it("should return component-wise maximum", () => {
      const v1 = new Vector3(1, 5, 3);
      const v2 = new Vector3(4, 2, 6);
      const result = Vector3.max(v1, v2);
      expect(result.x).toBe(4);
      expect(result.y).toBe(5);
      expect(result.z).toBe(6);
    });

    it("should handle negative values", () => {
      const v1 = new Vector3(-1, 5, -3);
      const v2 = new Vector3(4, -2, 6);
      const result = Vector3.max(v1, v2);
      expect(result.x).toBe(4);
      expect(result.y).toBe(5);
      expect(result.z).toBe(6);
    });

    it("should handle equal values", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(1, 2, 3);
      const result = Vector3.max(v1, v2);
      expect(result.x).toBe(1);
      expect(result.y).toBe(2);
      expect(result.z).toBe(3);
    });

    it("should return a new vector", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(4, 5, 6);
      const result = Vector3.max(v1, v2);
      expect(result).not.toBe(v1);
      expect(result).not.toBe(v2);
    });

    it("should be commutative", () => {
      const v1 = new Vector3(1, 5, 3);
      const v2 = new Vector3(4, 2, 6);
      const result1 = Vector3.max(v1, v2);
      const result2 = Vector3.max(v2, v1);
      expect(result1.x).toBe(result2.x);
      expect(result1.y).toBe(result2.y);
      expect(result1.z).toBe(result2.z);
    });
  });
});
