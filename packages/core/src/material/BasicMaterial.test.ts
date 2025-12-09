import { describe, it, expect } from "bun:test";
import { Color } from "@web-real/math";
import { BasicMaterial } from "./BasicMaterial";

describe("BasicMaterial", () => {
  describe("constructor", () => {
    it("should initialize with default white color", () => {
      const material = new BasicMaterial();
      expect(material.color.r).toBe(1.0);
      expect(material.color.g).toBe(1.0);
      expect(material.color.b).toBe(1.0);
      expect(material.color.a).toBe(1.0);
    });

    it("should initialize with color from array", () => {
      const material = new BasicMaterial({ color: [0.5, 0.7, 0.9] });
      expect(material.color.r).toBe(0.5);
      expect(material.color.g).toBe(0.7);
      expect(material.color.b).toBe(0.9);
    });

    it("should initialize with Color instance", () => {
      const color = new Color(0.2, 0.3, 0.4);
      const material = new BasicMaterial({ color });
      expect(material.color.r).toBe(0.2);
      expect(material.color.g).toBe(0.3);
      expect(material.color.b).toBe(0.4);
    });

    it("should have correct type", () => {
      const material = new BasicMaterial();
      expect(material.type).toBe("basic");
    });
  });

  describe("getVertexBufferLayout", () => {
    it("should return layout with 24-byte stride for position and normal", () => {
      const material = new BasicMaterial();
      const layout = material.getVertexBufferLayout();
      expect(layout.arrayStride).toBe(24);
    });

    it("should have two attributes for position and normal", () => {
      const material = new BasicMaterial();
      const layout = material.getVertexBufferLayout();
      expect(layout.attributes).toHaveLength(2);
    });

    it("should have position at location 0 with offset 0", () => {
      const material = new BasicMaterial();
      const layout = material.getVertexBufferLayout();
      expect(layout.attributes[0].shaderLocation).toBe(0);
      expect(layout.attributes[0].offset).toBe(0);
      expect(layout.attributes[0].format).toBe("float32x3");
    });

    it("should have normal at location 1 with offset 12", () => {
      const material = new BasicMaterial();
      const layout = material.getVertexBufferLayout();
      expect(layout.attributes[1].shaderLocation).toBe(1);
      expect(layout.attributes[1].offset).toBe(12);
      expect(layout.attributes[1].format).toBe("float32x3");
    });
  });

  describe("getUniformBufferSize", () => {
    it("should return 80 bytes for MVP matrix and color", () => {
      const material = new BasicMaterial();
      expect(material.getUniformBufferSize()).toBe(80);
    });
  });

  describe("getPrimitiveTopology", () => {
    it("should return triangle-list", () => {
      const material = new BasicMaterial();
      expect(material.getPrimitiveTopology()).toBe("triangle-list");
    });
  });

  describe("writeUniformData", () => {
    it("should write color data at default offset 64", () => {
      const material = new BasicMaterial({ color: [0.1, 0.2, 0.3] });
      const buffer = new ArrayBuffer(80);
      const dataView = new DataView(buffer);

      material.writeUniformData(dataView);

      expect(dataView.getFloat32(64, true)).toBeCloseTo(0.1);
      expect(dataView.getFloat32(68, true)).toBeCloseTo(0.2);
      expect(dataView.getFloat32(72, true)).toBeCloseTo(0.3);
      expect(dataView.getFloat32(76, true)).toBeCloseTo(1.0);
    });

    it("should write color data at custom offset", () => {
      const material = new BasicMaterial({ color: [0.5, 0.6, 0.7] });
      const buffer = new ArrayBuffer(128);
      const dataView = new DataView(buffer);

      material.writeUniformData(dataView, 96);

      expect(dataView.getFloat32(96, true)).toBeCloseTo(0.5);
      expect(dataView.getFloat32(100, true)).toBeCloseTo(0.6);
      expect(dataView.getFloat32(104, true)).toBeCloseTo(0.7);
      expect(dataView.getFloat32(108, true)).toBeCloseTo(1.0);
    });
  });

  describe("shader methods", () => {
    it("should return vertex shader string", () => {
      const material = new BasicMaterial();
      const shader = material.getVertexShader();
      expect(typeof shader).toBe("string");
      expect(shader.length).toBeGreaterThan(0);
    });

    it("should return fragment shader string", () => {
      const material = new BasicMaterial();
      const shader = material.getFragmentShader();
      expect(typeof shader).toBe("string");
      expect(shader.length).toBeGreaterThan(0);
    });
  });
});
