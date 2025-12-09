import { describe, it, expect } from "bun:test";
import { LineColorMaterial } from "./LineColorMaterial";

describe("LineColorMaterial", () => {
  describe("constructor", () => {
    it("should create material with default empty colors", () => {
      const material = new LineColorMaterial();

      expect(material.type).toBe("lineColor");
      expect(material.colors).toBeInstanceOf(Float32Array);
      expect(material.colors.length).toBe(0);
    });

    it("should create material with provided colors", () => {
      const colors = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
      const material = new LineColorMaterial({ colors });

      expect(material.colors).toBe(colors);
      expect(material.colors.length).toBe(9);
    });

    it("should accept empty color array", () => {
      const colors = new Float32Array(0);
      const material = new LineColorMaterial({ colors });

      expect(material.colors.length).toBe(0);
    });

    it("should handle single line (2 vertices)", () => {
      const colors = new Float32Array([1, 0, 0, 0, 1, 0]);
      const material = new LineColorMaterial({ colors });

      // 2 vertices × 3 RGB = 6 floats
      expect(material.colors.length).toBe(6);
    });
  });

  describe("setColors", () => {
    it("should update colors correctly", () => {
      const material = new LineColorMaterial();
      const newColors = new Float32Array([1, 1, 0, 0, 1, 1]);

      material.setColors(newColors);

      expect(material.colors).toBe(newColors);
      expect(material.colors.length).toBe(6);
    });

    it("should replace existing colors", () => {
      const initialColors = new Float32Array([1, 0, 0]);
      const material = new LineColorMaterial({ colors: initialColors });

      const newColors = new Float32Array([0, 1, 0, 0, 0, 1]);
      material.setColors(newColors);

      expect(material.colors).toBe(newColors);
      expect(material.colors).not.toBe(initialColors);
    });

    it("should accept empty array", () => {
      const material = new LineColorMaterial({
        colors: new Float32Array([1, 0, 0]),
      });

      material.setColors(new Float32Array(0));

      expect(material.colors.length).toBe(0);
    });

    it("should handle large color arrays", () => {
      const material = new LineColorMaterial();
      // 100 vertices × 3 RGB = 300 floats
      const largeColors = new Float32Array(300);
      for (let i = 0; i < 300; i++) {
        largeColors[i] = Math.random();
      }

      material.setColors(largeColors);

      expect(material.colors.length).toBe(300);
    });
  });

  describe("getVertexShader", () => {
    it("should return vertex shader code", () => {
      const material = new LineColorMaterial();
      const shader = material.getVertexShader();

      expect(typeof shader).toBe("string");
      expect(shader.length).toBeGreaterThan(0);
    });
  });

  describe("getFragmentShader", () => {
    it("should return fragment shader code", () => {
      const material = new LineColorMaterial();
      const shader = material.getFragmentShader();

      expect(typeof shader).toBe("string");
      expect(shader.length).toBeGreaterThan(0);
    });
  });

  describe("getVertexBufferLayout", () => {
    it("should return correct buffer layout", () => {
      const material = new LineColorMaterial();
      const layout = material.getVertexBufferLayout();

      // position(vec3f) + color(vec3f) = 24 bytes
      expect(layout.arrayStride).toBe(24);
      expect(layout.attributes.length).toBe(2);

      // Position attribute
      expect(layout.attributes[0].shaderLocation).toBe(0);
      expect(layout.attributes[0].offset).toBe(0);
      expect(layout.attributes[0].format).toBe("float32x3");

      // Color attribute
      expect(layout.attributes[1].shaderLocation).toBe(1);
      expect(layout.attributes[1].offset).toBe(12);
      expect(layout.attributes[1].format).toBe("float32x3");
    });

    it("should have correct byte offsets", () => {
      const material = new LineColorMaterial();
      const layout = material.getVertexBufferLayout();

      // position: 3 floats × 4 bytes = 12 bytes (offset 0)
      expect(layout.attributes[0].offset).toBe(0);

      // color: 3 floats × 4 bytes = 12 bytes (offset 12)
      expect(layout.attributes[1].offset).toBe(12);

      // Total stride: 12 + 12 = 24 bytes
      expect(layout.arrayStride).toBe(24);
    });
  });

  describe("getUniformBufferSize", () => {
    it("should return 64 bytes for MVP matrix", () => {
      const material = new LineColorMaterial();

      expect(material.getUniformBufferSize()).toBe(64);
    });
  });

  describe("getPrimitiveTopology", () => {
    it("should return line-list topology", () => {
      const material = new LineColorMaterial();

      expect(material.getPrimitiveTopology()).toBe("line-list");
    });

    it("should not return triangle-list", () => {
      const material = new LineColorMaterial();

      expect(material.getPrimitiveTopology()).not.toBe("triangle-list");
    });
  });

  describe("type property", () => {
    it("should have readonly type property set to 'lineColor'", () => {
      const material = new LineColorMaterial();

      expect(material.type).toBe("lineColor");
    });
  });

  describe("color data validation", () => {
    it("should store color values correctly", () => {
      const colors = new Float32Array([
        1.0,
        0.0,
        0.0, // red
        0.0,
        1.0,
        0.0, // green
      ]);
      const material = new LineColorMaterial({ colors });

      expect(material.colors[0]).toBe(1.0);
      expect(material.colors[1]).toBe(0.0);
      expect(material.colors[2]).toBe(0.0);
      expect(material.colors[3]).toBe(0.0);
      expect(material.colors[4]).toBe(1.0);
      expect(material.colors[5]).toBe(0.0);
    });

    it("should handle normalized color values", () => {
      const colors = new Float32Array([
        0.5,
        0.5,
        0.5, // gray
        0.0,
        0.0,
        0.0, // black
        1.0,
        1.0,
        1.0, // white
      ]);
      const material = new LineColorMaterial({ colors });

      expect(material.colors[0]).toBe(0.5);
      expect(material.colors[6]).toBe(1.0);
    });
  });

  describe("buffer layout compatibility", () => {
    it("should match VertexColorMaterial layout for position and color", () => {
      const material = new LineColorMaterial();
      const layout = material.getVertexBufferLayout();

      // Should have same stride as VertexColorMaterial
      expect(layout.arrayStride).toBe(24);

      // Should have same attribute formats
      expect(layout.attributes[0].format).toBe("float32x3");
      expect(layout.attributes[1].format).toBe("float32x3");

      // Should have same shader locations
      expect(layout.attributes[0].shaderLocation).toBe(0);
      expect(layout.attributes[1].shaderLocation).toBe(1);
    });
  });
});
