import { describe, it, expect } from "bun:test";
import { VertexColorMaterial } from "./VertexColorMaterial";
import { Color } from "@web-real/math";

describe("VertexColorMaterial", () => {
  describe("constructor", () => {
    it("should create material with default face colors", () => {
      const material = new VertexColorMaterial();

      expect(material.type).toBe("vertexColor");
      expect(material.colors).toBeInstanceOf(Float32Array);
      // 6 faces × 4 vertices × 3 RGB components = 72 floats
      expect(material.colors.length).toBe(72);
    });

    it("should create material with custom face colors", () => {
      const faceColors = [Color.RED, Color.GREEN, Color.BLUE];
      const material = new VertexColorMaterial({
        faceColors,
        verticesPerFace: 4,
      });

      // 3 faces × 4 vertices × 3 RGB = 36 floats
      expect(material.colors.length).toBe(36);

      // First face should be red (repeated 4 times)
      expect(material.colors[0]).toBe(1); // R
      expect(material.colors[1]).toBe(0); // G
      expect(material.colors[2]).toBe(0); // B
      expect(material.colors[3]).toBe(1); // R (vertex 2)
      expect(material.colors[4]).toBe(0); // G
      expect(material.colors[5]).toBe(0); // B
    });

    it("should create material with direct color array", () => {
      const colors = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
      const material = new VertexColorMaterial({ colors });

      expect(material.colors).toBe(colors);
      expect(material.colors.length).toBe(9);
    });

    it("should handle different vertices per face", () => {
      const faceColors = [Color.RED, Color.GREEN];
      const material = new VertexColorMaterial({
        faceColors,
        verticesPerFace: 3, // triangles
      });

      // 2 faces × 3 vertices × 3 RGB = 18 floats
      expect(material.colors.length).toBe(18);
    });
  });

  describe("setFaceColors", () => {
    it("should update face colors correctly", () => {
      const material = new VertexColorMaterial();
      const newColors = [Color.BLUE, Color.YELLOW];

      material.setFaceColors(newColors, 3);

      // 2 faces × 3 vertices × 3 RGB = 18 floats
      expect(material.colors.length).toBe(18);

      // First vertex should be blue
      expect(material.colors[0]).toBe(0); // R
      expect(material.colors[1]).toBe(0); // G
      expect(material.colors[2]).toBe(1); // B
    });

    it("should use default vertices per face when not specified", () => {
      const material = new VertexColorMaterial();
      const newColors = [Color.RED];

      material.setFaceColors(newColors);

      // 1 face × 4 vertices (default) × 3 RGB = 12 floats
      expect(material.colors.length).toBe(12);
    });

    it("should replace existing colors completely", () => {
      const material = new VertexColorMaterial();
      const originalLength = material.colors.length;

      material.setFaceColors([Color.RED], 2);

      // Should be different from original
      expect(material.colors.length).toBe(6); // 1 × 2 × 3
      expect(material.colors.length).not.toBe(originalLength);
    });
  });

  describe("setColors", () => {
    it("should update colors directly", () => {
      const material = new VertexColorMaterial();
      const newColors = new Float32Array([1, 1, 0, 0, 1, 1]);

      material.setColors(newColors);

      expect(material.colors).toBe(newColors);
      expect(material.colors.length).toBe(6);
    });

    it("should accept empty color array", () => {
      const material = new VertexColorMaterial();
      const emptyColors = new Float32Array(0);

      material.setColors(emptyColors);

      expect(material.colors.length).toBe(0);
    });
  });

  describe("getVertexShader", () => {
    it("should return vertex shader code", () => {
      const material = new VertexColorMaterial();
      const shader = material.getVertexShader();

      expect(typeof shader).toBe("string");
      expect(shader.length).toBeGreaterThan(0);
    });
  });

  describe("getFragmentShader", () => {
    it("should return fragment shader code", () => {
      const material = new VertexColorMaterial();
      const shader = material.getFragmentShader();

      expect(typeof shader).toBe("string");
      expect(shader.length).toBeGreaterThan(0);
    });
  });

  describe("getVertexBufferLayout", () => {
    it("should return correct buffer layout", () => {
      const material = new VertexColorMaterial();
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
  });

  describe("getUniformBufferSize", () => {
    it("should return 64 bytes for MVP matrix", () => {
      const material = new VertexColorMaterial();

      expect(material.getUniformBufferSize()).toBe(64);
    });
  });

  describe("getPrimitiveTopology", () => {
    it("should return triangle-list topology", () => {
      const material = new VertexColorMaterial();

      expect(material.getPrimitiveTopology()).toBe("triangle-list");
    });
  });

  describe("color expansion", () => {
    it("should expand single face color correctly", () => {
      const faceColors = [Color.fromHex("#ffffff")];
      const material = new VertexColorMaterial({
        faceColors,
        verticesPerFace: 2,
      });

      // All vertices should have same color
      expect(material.colors[0]).toBe(1); // R
      expect(material.colors[1]).toBe(1); // G
      expect(material.colors[2]).toBe(1); // B
      expect(material.colors[3]).toBe(1); // R (vertex 2)
      expect(material.colors[4]).toBe(1); // G
      expect(material.colors[5]).toBe(1); // B
    });

    it("should maintain color order for multiple faces", () => {
      const red = Color.RED;
      const green = Color.GREEN;
      const blue = Color.BLUE;
      const material = new VertexColorMaterial({
        faceColors: [red, green, blue],
        verticesPerFace: 1,
      });

      // Face 1: Red
      expect(material.colors[0]).toBe(1);
      expect(material.colors[1]).toBe(0);
      expect(material.colors[2]).toBe(0);

      // Face 2: Green
      expect(material.colors[3]).toBe(0);
      expect(material.colors[4]).toBe(1);
      expect(material.colors[5]).toBe(0);

      // Face 3: Blue
      expect(material.colors[6]).toBe(0);
      expect(material.colors[7]).toBe(0);
      expect(material.colors[8]).toBe(1);
    });
  });
});
