import { describe, it, expect } from "bun:test";
import { Color } from "@web-real/math";
import { LineMaterial } from "./LineMaterial";

describe("LineMaterial", () => {
  describe("constructor", () => {
    it("should initialize with default white color", () => {
      const material = new LineMaterial();
      expect(material.color.r).toBe(1.0);
      expect(material.color.g).toBe(1.0);
      expect(material.color.b).toBe(1.0);
      expect(material.color.a).toBe(1.0);
    });

    it("should initialize with color from array", () => {
      const material = new LineMaterial({ color: [1.0, 0.5, 0.0] });
      expect(material.color.r).toBe(1.0);
      expect(material.color.g).toBe(0.5);
      expect(material.color.b).toBe(0.0);
    });

    it("should initialize with Color instance", () => {
      const color = new Color(0.8, 0.2, 0.6);
      const material = new LineMaterial({ color });
      expect(material.color.r).toBe(0.8);
      expect(material.color.g).toBe(0.2);
      expect(material.color.b).toBe(0.6);
    });

    it("should have correct type", () => {
      const material = new LineMaterial();
      expect(material.type).toBe("line");
    });
  });

  describe("getVertexBufferLayout", () => {
    it("should return layout with 12-byte stride for position only", () => {
      const material = new LineMaterial();
      const layout = material.getVertexBufferLayout();
      expect(layout.arrayStride).toBe(12);
    });

    it("should have one attribute for position", () => {
      const material = new LineMaterial();
      const layout = material.getVertexBufferLayout();
      expect(layout.attributes).toHaveLength(1);
    });

    it("should have position at location 0 with offset 0", () => {
      const material = new LineMaterial();
      const layout = material.getVertexBufferLayout();
      expect(layout.attributes[0].shaderLocation).toBe(0);
      expect(layout.attributes[0].offset).toBe(0);
      expect(layout.attributes[0].format).toBe("float32x3");
    });
  });

  describe("getUniformBufferSize", () => {
    it("should return 80 bytes for MVP matrix and color", () => {
      const material = new LineMaterial();
      expect(material.getUniformBufferSize()).toBe(80);
    });
  });

  describe("getPrimitiveTopology", () => {
    it("should return line-list", () => {
      const material = new LineMaterial();
      expect(material.getPrimitiveTopology()).toBe("line-list");
    });
  });

  describe("writeUniformData", () => {
    it("should write color data at default offset 64", () => {
      const material = new LineMaterial({ color: [0.4, 0.5, 0.6] });
      const buffer = new ArrayBuffer(80);
      const dataView = new DataView(buffer);

      material.writeUniformData(dataView);

      expect(dataView.getFloat32(64, true)).toBeCloseTo(0.4);
      expect(dataView.getFloat32(68, true)).toBeCloseTo(0.5);
      expect(dataView.getFloat32(72, true)).toBeCloseTo(0.6);
      expect(dataView.getFloat32(76, true)).toBeCloseTo(1.0);
    });

    it("should write color data at custom offset", () => {
      const material = new LineMaterial({ color: [0.9, 0.1, 0.3] });
      const buffer = new ArrayBuffer(128);
      const dataView = new DataView(buffer);

      material.writeUniformData(dataView, 100);

      expect(dataView.getFloat32(100, true)).toBeCloseTo(0.9);
      expect(dataView.getFloat32(104, true)).toBeCloseTo(0.1);
      expect(dataView.getFloat32(108, true)).toBeCloseTo(0.3);
      expect(dataView.getFloat32(112, true)).toBeCloseTo(1.0);
    });
  });

  describe("shader methods", () => {
    it("should return vertex shader string", () => {
      const material = new LineMaterial();
      const shader = material.getVertexShader();
      expect(typeof shader).toBe("string");
      expect(shader.length).toBeGreaterThan(0);
    });

    it("should return fragment shader string", () => {
      const material = new LineMaterial();
      const shader = material.getFragmentShader();
      expect(typeof shader).toBe("string");
      expect(shader.length).toBeGreaterThan(0);
    });
  });
});
