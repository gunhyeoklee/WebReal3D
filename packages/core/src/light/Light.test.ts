import { describe, it, expect } from "bun:test";
import { Color } from "@web-real/math";
import { Light } from "./Light";

// Concrete implementation for testing abstract Light class
class TestLight extends Light {
  constructor(color?: Color, intensity?: number) {
    super(color, intensity);
  }
}

describe("Light", () => {
  describe("constructor", () => {
    it("should initialize with default values (white color, intensity 1)", () => {
      const light = new TestLight();
      expect(light.color.r).toBe(1);
      expect(light.color.g).toBe(1);
      expect(light.color.b).toBe(1);
      expect(light.intensity).toBe(1);
    });

    it("should initialize with given color and default intensity", () => {
      const color = new Color(0.5, 0.3, 0.8);
      const light = new TestLight(color);
      expect(light.color.r).toBe(0.5);
      expect(light.color.g).toBe(0.3);
      expect(light.color.b).toBe(0.8);
      expect(light.intensity).toBe(1);
    });

    it("should initialize with given color and intensity", () => {
      const color = new Color(0.5, 0.3, 0.8);
      const light = new TestLight(color, 2.5);
      expect(light.color.r).toBe(0.5);
      expect(light.color.g).toBe(0.3);
      expect(light.color.b).toBe(0.8);
      expect(light.intensity).toBe(2.5);
    });

    it("should initialize with zero intensity", () => {
      const color = new Color(1, 1, 1);
      const light = new TestLight(color, 0);
      expect(light.intensity).toBe(0);
    });

    it("should initialize with negative intensity", () => {
      const color = new Color(1, 1, 1);
      const light = new TestLight(color, -0.5);
      expect(light.intensity).toBe(-0.5);
    });
  });

  describe("color property", () => {
    it("should allow color to be modified", () => {
      const light = new TestLight();
      light.color = new Color(0.2, 0.4, 0.6);
      expect(light.color.r).toBe(0.2);
      expect(light.color.g).toBe(0.4);
      expect(light.color.b).toBe(0.6);
    });

    it("should preserve color immutability", () => {
      const color = new Color(0.5, 0.5, 0.5);
      const light = new TestLight(color);
      // Color is immutable, so we replace it with a new instance
      light.color = new Color(0.7, 0.8, 0.9);
      expect(light.color.r).toBe(0.7);
      expect(light.color.g).toBe(0.8);
      expect(light.color.b).toBe(0.9);
      // Original color should be unchanged
      expect(color.r).toBe(0.5);
      expect(color.g).toBe(0.5);
      expect(color.b).toBe(0.5);
    });
  });

  describe("intensity property", () => {
    it("should allow intensity to be modified", () => {
      const light = new TestLight();
      light.intensity = 3.5;
      expect(light.intensity).toBe(3.5);
    });

    it("should allow intensity to be set to zero", () => {
      const light = new TestLight(new Color(1, 1, 1), 2.0);
      light.intensity = 0;
      expect(light.intensity).toBe(0);
    });
  });

  describe("inheritance from Object3D", () => {
    it("should inherit position, rotation, scale properties", () => {
      const light = new TestLight();
      expect(light.position).toBeDefined();
      expect(light.rotation).toBeDefined();
      expect(light.scale).toBeDefined();
    });

    it("should allow position to be modified", () => {
      const light = new TestLight();
      light.position.x = 5;
      light.position.y = 10;
      light.position.z = 15;
      expect(light.position.x).toBe(5);
      expect(light.position.y).toBe(10);
      expect(light.position.z).toBe(15);
    });

    it("should have visible property defaulting to true", () => {
      const light = new TestLight();
      expect(light.visible).toBe(true);
    });

    it("should allow visibility to be toggled", () => {
      const light = new TestLight();
      light.visible = false;
      expect(light.visible).toBe(false);
    });
  });
});
