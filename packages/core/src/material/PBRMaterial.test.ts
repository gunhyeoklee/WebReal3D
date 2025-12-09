import { describe, it, expect } from "bun:test";
import { Color } from "@web-real/math";

import { PBRMaterial } from "./PBRMaterial";
import { AmbientLight } from "../light/AmbientLight";

describe("PBRMaterial", () => {
  describe("constructor", () => {
    it("should create a material with default parameters", () => {
      const material = new PBRMaterial();

      expect(material.type).toBe("pbr");
      expect(material.color.r).toBe(1.0);
      expect(material.color.g).toBe(1.0);
      expect(material.color.b).toBe(1.0);
      expect(material.metalness).toBe(0.0);
      expect(material.roughness).toBe(0.5);
      expect(material.normalScale).toBe(1.0);
      expect(material.aoMapIntensity).toBe(1.0);
      expect(material.emissive.r).toBe(0.0);
      expect(material.emissive.g).toBe(0.0);
      expect(material.emissive.b).toBe(0.0);
      expect(material.emissiveIntensity).toBe(1.0);
      expect(material.envMapIntensity).toBe(1.0);
      expect(material.wireframe).toBe(false);
      expect(material.map).toBeUndefined();
      expect(material.normalMap).toBeUndefined();
      expect(material.roughnessMap).toBeUndefined();
      expect(material.metalnessMap).toBeUndefined();
      expect(material.aoMap).toBeUndefined();
      expect(material.emissiveMap).toBeUndefined();
      expect(material.envMap).toBeUndefined();
    });

    it("should create a material with Color instance", () => {
      const color = new Color(0.5, 0.3, 0.8);
      const material = new PBRMaterial({ color });

      expect(material.color.r).toBe(0.5);
      expect(material.color.g).toBe(0.3);
      expect(material.color.b).toBe(0.8);
    });

    it("should create a material with RGB array", () => {
      const material = new PBRMaterial({ color: [0.2, 0.4, 0.6] });

      expect(material.color.r).toBe(0.2);
      expect(material.color.g).toBe(0.4);
      expect(material.color.b).toBe(0.6);
    });

    it("should create a material with custom metalness and roughness", () => {
      const material = new PBRMaterial({ metalness: 1.0, roughness: 0.2 });

      expect(material.metalness).toBe(1.0);
      expect(material.roughness).toBe(0.2);
    });

    it("should create a material with wireframe enabled", () => {
      const material = new PBRMaterial({ wireframe: true });

      expect(material.wireframe).toBe(true);
    });

    it("should create a material with emissive properties", () => {
      const material = new PBRMaterial({
        emissive: [1.0, 0.5, 0.0],
        emissiveIntensity: 2.0,
      });

      expect(material.emissive.r).toBe(1.0);
      expect(material.emissive.g).toBe(0.5);
      expect(material.emissive.b).toBe(0.0);
      expect(material.emissiveIntensity).toBe(2.0);
    });

    it("should create a material with all options specified", () => {
      const material = new PBRMaterial({
        color: [0.8, 0.2, 0.2],
        metalness: 0.9,
        roughness: 0.1,
        normalScale: 1.5,
        aoMapIntensity: 0.8,
        emissive: [0.1, 0.1, 0.1],
        emissiveIntensity: 0.5,
        envMapIntensity: 0.7,
        wireframe: true,
      });

      expect(material.color.r).toBe(0.8);
      expect(material.metalness).toBe(0.9);
      expect(material.roughness).toBe(0.1);
      expect(material.normalScale).toBe(1.5);
      expect(material.aoMapIntensity).toBe(0.8);
      expect(material.emissive.r).toBe(0.1);
      expect(material.emissiveIntensity).toBe(0.5);
      expect(material.envMapIntensity).toBe(0.7);
      expect(material.wireframe).toBe(true);
    });

    it("should create a material with empty options object", () => {
      const material = new PBRMaterial({});

      expect(material.type).toBe("pbr");
      expect(material.color.r).toBe(1.0);
      expect(material.metalness).toBe(0.0);
      expect(material.roughness).toBe(0.5);
    });

    it("should create a material with black color", () => {
      const material = new PBRMaterial({ color: [0, 0, 0] });

      expect(material.color.r).toBe(0);
      expect(material.color.g).toBe(0);
      expect(material.color.b).toBe(0);
    });

    it("should create a material with boundary metalness values", () => {
      const material1 = new PBRMaterial({ metalness: 0.0 });
      const material2 = new PBRMaterial({ metalness: 1.0 });

      expect(material1.metalness).toBe(0.0);
      expect(material2.metalness).toBe(1.0);
    });

    it("should create a material with boundary roughness values", () => {
      const material1 = new PBRMaterial({ roughness: 0.0 });
      const material2 = new PBRMaterial({ roughness: 1.0 });

      expect(material1.roughness).toBe(0.0);
      expect(material2.roughness).toBe(1.0);
    });
  });

  describe("getters", () => {
    it("should return correct color value", () => {
      const material = new PBRMaterial({ color: [0.3, 0.6, 0.9] });

      expect(material.color.r).toBe(0.3);
      expect(material.color.g).toBe(0.6);
      expect(material.color.b).toBe(0.9);
    });

    it("should return correct metalness value", () => {
      const material = new PBRMaterial({ metalness: 0.75 });

      expect(material.metalness).toBe(0.75);
    });

    it("should return correct roughness value", () => {
      const material = new PBRMaterial({ roughness: 0.25 });

      expect(material.roughness).toBe(0.25);
    });

    it("should return correct normalScale value", () => {
      const material = new PBRMaterial({ normalScale: 2.5 });

      expect(material.normalScale).toBe(2.5);
    });

    it("should return correct aoMapIntensity value", () => {
      const material = new PBRMaterial({ aoMapIntensity: 0.6 });

      expect(material.aoMapIntensity).toBe(0.6);
    });

    it("should return correct emissive value", () => {
      const material = new PBRMaterial({ emissive: [0.2, 0.4, 0.6] });

      expect(material.emissive.r).toBe(0.2);
      expect(material.emissive.g).toBe(0.4);
      expect(material.emissive.b).toBe(0.6);
    });

    it("should return correct emissiveIntensity value", () => {
      const material = new PBRMaterial({ emissiveIntensity: 3.5 });

      expect(material.emissiveIntensity).toBe(3.5);
    });

    it("should return correct envMapIntensity value", () => {
      const material = new PBRMaterial({ envMapIntensity: 1.8 });

      expect(material.envMapIntensity).toBe(1.8);
    });
  });

  describe("setters", () => {
    it("should set color with Color instance", () => {
      const material = new PBRMaterial();
      material.setColor(new Color(0.1, 0.2, 0.3));

      expect(material.color.r).toBe(0.1);
      expect(material.color.g).toBe(0.2);
      expect(material.color.b).toBe(0.3);
    });

    it("should set color with RGB array", () => {
      const material = new PBRMaterial();
      material.setColor([0.4, 0.5, 0.6]);

      expect(material.color.r).toBe(0.4);
      expect(material.color.g).toBe(0.5);
      expect(material.color.b).toBe(0.6);
    });

    it("should update color without affecting other properties", () => {
      const material = new PBRMaterial({ metalness: 0.8, roughness: 0.3 });
      material.setColor([0.1, 0.2, 0.3]);

      expect(material.color.r).toBe(0.1);
      expect(material.metalness).toBe(0.8);
      expect(material.roughness).toBe(0.3);
    });

    it("should set metalness within valid range", () => {
      const material = new PBRMaterial();
      material.setMetalness(0.5);

      expect(material.metalness).toBe(0.5);
    });

    it("should set metalness at boundary values", () => {
      const material = new PBRMaterial();

      material.setMetalness(0.0);
      expect(material.metalness).toBe(0.0);

      material.setMetalness(1.0);
      expect(material.metalness).toBe(1.0);
    });

    it("should throw error for metalness below 0", () => {
      const material = new PBRMaterial();

      expect(() => material.setMetalness(-0.1)).toThrow(
        "Metalness must be between 0 and 1"
      );
      expect(() => material.setMetalness(-1.0)).toThrow(
        "Metalness must be between 0 and 1"
      );
    });

    it("should throw error for metalness above 1", () => {
      const material = new PBRMaterial();

      expect(() => material.setMetalness(1.1)).toThrow(
        "Metalness must be between 0 and 1"
      );
      expect(() => material.setMetalness(2.0)).toThrow(
        "Metalness must be between 0 and 1"
      );
    });

    it("should throw error for metalness out of range", () => {
      const material = new PBRMaterial();

      expect(() => material.setMetalness(-0.1)).toThrow(
        "Metalness must be between 0 and 1"
      );
      expect(() => material.setMetalness(1.1)).toThrow(
        "Metalness must be between 0 and 1"
      );
    });

    it("should set roughness within valid range", () => {
      const material = new PBRMaterial();
      material.setRoughness(0.8);

      expect(material.roughness).toBe(0.8);
    });

    it("should set roughness at boundary values", () => {
      const material = new PBRMaterial();

      material.setRoughness(0.0);
      expect(material.roughness).toBe(0.0);

      material.setRoughness(1.0);
      expect(material.roughness).toBe(1.0);
    });

    it("should throw error for roughness below 0", () => {
      const material = new PBRMaterial();

      expect(() => material.setRoughness(-0.1)).toThrow(
        "Roughness must be between 0 and 1"
      );
      expect(() => material.setRoughness(-1.0)).toThrow(
        "Roughness must be between 0 and 1"
      );
    });

    it("should throw error for roughness above 1", () => {
      const material = new PBRMaterial();

      expect(() => material.setRoughness(1.1)).toThrow(
        "Roughness must be between 0 and 1"
      );
      expect(() => material.setRoughness(2.0)).toThrow(
        "Roughness must be between 0 and 1"
      );
    });

    it("should throw error for roughness out of range", () => {
      const material = new PBRMaterial();

      expect(() => material.setRoughness(-0.1)).toThrow(
        "Roughness must be between 0 and 1"
      );
      expect(() => material.setRoughness(1.1)).toThrow(
        "Roughness must be between 0 and 1"
      );
    });

    it("should set normalScale within valid range", () => {
      const material = new PBRMaterial();
      material.setNormalScale(2.0);

      expect(material.normalScale).toBe(2.0);
    });

    it("should set normalScale at boundary values", () => {
      const material = new PBRMaterial();

      material.setNormalScale(0.0);
      expect(material.normalScale).toBe(0.0);

      material.setNormalScale(3.0);
      expect(material.normalScale).toBe(3.0);
    });

    it("should throw error for normalScale below 0", () => {
      const material = new PBRMaterial();

      expect(() => material.setNormalScale(-0.1)).toThrow(
        "Normal scale must be between 0 and 3"
      );
      expect(() => material.setNormalScale(-1.0)).toThrow(
        "Normal scale must be between 0 and 3"
      );
    });

    it("should throw error for normalScale above 3", () => {
      const material = new PBRMaterial();

      expect(() => material.setNormalScale(3.1)).toThrow(
        "Normal scale must be between 0 and 3"
      );
      expect(() => material.setNormalScale(5.0)).toThrow(
        "Normal scale must be between 0 and 3"
      );
    });

    it("should throw error for normalScale out of range", () => {
      const material = new PBRMaterial();

      expect(() => material.setNormalScale(-0.1)).toThrow(
        "Normal scale must be between 0 and 3"
      );
      expect(() => material.setNormalScale(3.1)).toThrow(
        "Normal scale must be between 0 and 3"
      );
    });

    it("should set aoMapIntensity within valid range", () => {
      const material = new PBRMaterial();
      material.setAoMapIntensity(0.5);

      expect(material.aoMapIntensity).toBe(0.5);
    });

    it("should set aoMapIntensity at boundary values", () => {
      const material = new PBRMaterial();

      material.setAoMapIntensity(0.0);
      expect(material.aoMapIntensity).toBe(0.0);

      material.setAoMapIntensity(1.0);
      expect(material.aoMapIntensity).toBe(1.0);
    });

    it("should throw error for aoMapIntensity below 0", () => {
      const material = new PBRMaterial();

      expect(() => material.setAoMapIntensity(-0.1)).toThrow(
        "AO map intensity must be between 0 and 1"
      );
      expect(() => material.setAoMapIntensity(-1.0)).toThrow(
        "AO map intensity must be between 0 and 1"
      );
    });

    it("should throw error for aoMapIntensity above 1", () => {
      const material = new PBRMaterial();

      expect(() => material.setAoMapIntensity(1.1)).toThrow(
        "AO map intensity must be between 0 and 1"
      );
      expect(() => material.setAoMapIntensity(2.0)).toThrow(
        "AO map intensity must be between 0 and 1"
      );
    });

    it("should throw error for aoMapIntensity out of range", () => {
      const material = new PBRMaterial();

      expect(() => material.setAoMapIntensity(-0.1)).toThrow(
        "AO map intensity must be between 0 and 1"
      );
      expect(() => material.setAoMapIntensity(1.1)).toThrow(
        "AO map intensity must be between 0 and 1"
      );
    });

    it("should set emissive with Color instance", () => {
      const material = new PBRMaterial();
      material.setEmissive(new Color(1.0, 0.5, 0.0));

      expect(material.emissive.r).toBe(1.0);
      expect(material.emissive.g).toBe(0.5);
      expect(material.emissive.b).toBe(0.0);
    });

    it("should set emissive with RGB array", () => {
      const material = new PBRMaterial();
      material.setEmissive([0.2, 0.8, 0.4]);

      expect(material.emissive.r).toBe(0.2);
      expect(material.emissive.g).toBe(0.8);
      expect(material.emissive.b).toBe(0.4);
    });

    it("should set emissiveIntensity", () => {
      const material = new PBRMaterial();
      material.setEmissiveIntensity(3.0);

      expect(material.emissiveIntensity).toBe(3.0);
    });

    it("should set emissiveIntensity to zero", () => {
      const material = new PBRMaterial();
      material.setEmissiveIntensity(0.0);

      expect(material.emissiveIntensity).toBe(0.0);
    });

    it("should set very large emissiveIntensity", () => {
      const material = new PBRMaterial();
      material.setEmissiveIntensity(100.0);

      expect(material.emissiveIntensity).toBe(100.0);
    });

    it("should throw error for negative emissiveIntensity", () => {
      const material = new PBRMaterial();

      expect(() => material.setEmissiveIntensity(-0.1)).toThrow(
        "Emissive intensity must be non-negative"
      );
    });

    it("should throw error for negative emissiveIntensity values", () => {
      const material = new PBRMaterial();

      expect(() => material.setEmissiveIntensity(-0.1)).toThrow(
        "Emissive intensity must be non-negative"
      );
      expect(() => material.setEmissiveIntensity(-10.0)).toThrow(
        "Emissive intensity must be non-negative"
      );
    });

    it("should set envMapIntensity", () => {
      const material = new PBRMaterial();
      material.setEnvMapIntensity(2.0);

      expect(material.envMapIntensity).toBe(2.0);
    });

    it("should set envMapIntensity to zero", () => {
      const material = new PBRMaterial();
      material.setEnvMapIntensity(0.0);

      expect(material.envMapIntensity).toBe(0.0);
    });

    it("should set very large envMapIntensity", () => {
      const material = new PBRMaterial();
      material.setEnvMapIntensity(50.0);

      expect(material.envMapIntensity).toBe(50.0);
    });

    it("should throw error for negative envMapIntensity", () => {
      const material = new PBRMaterial();

      expect(() => material.setEnvMapIntensity(-0.1)).toThrow(
        "Environment map intensity must be non-negative"
      );
    });

    it("should throw error for negative envMapIntensity values", () => {
      const material = new PBRMaterial();

      expect(() => material.setEnvMapIntensity(-0.1)).toThrow(
        "Environment map intensity must be non-negative"
      );
      expect(() => material.setEnvMapIntensity(-5.0)).toThrow(
        "Environment map intensity must be non-negative"
      );
    });
  });

  describe("getVertexBufferLayout", () => {
    it("should return correct vertex buffer layout", () => {
      const material = new PBRMaterial();
      const layout = material.getVertexBufferLayout();

      expect(layout.arrayStride).toBe(56);
      expect(layout.attributes).toHaveLength(5);
      expect(layout.attributes[0]).toEqual({
        shaderLocation: 0,
        offset: 0,
        format: "float32x3",
      });
      expect(layout.attributes[1]).toEqual({
        shaderLocation: 1,
        offset: 12,
        format: "float32x3",
      });
      expect(layout.attributes[2]).toEqual({
        shaderLocation: 2,
        offset: 24,
        format: "float32x2",
      });
      expect(layout.attributes[3]).toEqual({
        shaderLocation: 3,
        offset: 32,
        format: "float32x3",
      });
      expect(layout.attributes[4]).toEqual({
        shaderLocation: 4,
        offset: 44,
        format: "float32x3",
      });
    });

    it("should return same layout for different material instances", () => {
      const material1 = new PBRMaterial();
      const material2 = new PBRMaterial({ metalness: 1.0 });

      const layout1 = material1.getVertexBufferLayout();
      const layout2 = material2.getVertexBufferLayout();

      expect(layout1.arrayStride).toBe(layout2.arrayStride);
      expect(layout1.attributes).toEqual(layout2.attributes);
    });

    it("should calculate correct stride from attributes", () => {
      const material = new PBRMaterial();
      const layout = material.getVertexBufferLayout();

      // position(3) + normal(3) + uv(2) + tangent(3) + bitangent(3) = 14 floats * 4 bytes
      const expectedStride = 14 * 4;
      expect(layout.arrayStride).toBe(expectedStride);
    });

    it("should have attributes in correct order", () => {
      const material = new PBRMaterial();
      const layout = material.getVertexBufferLayout();

      // Verify shader locations are sequential
      expect(layout.attributes[0].shaderLocation).toBe(0);
      expect(layout.attributes[1].shaderLocation).toBe(1);
      expect(layout.attributes[2].shaderLocation).toBe(2);
      expect(layout.attributes[3].shaderLocation).toBe(3);
      expect(layout.attributes[4].shaderLocation).toBe(4);
    });

    it("should have correct offsets for each attribute", () => {
      const material = new PBRMaterial();
      const layout = material.getVertexBufferLayout();

      expect(layout.attributes[0].offset).toBe(0); // position
      expect(layout.attributes[1].offset).toBe(12); // normal (after 3 floats)
      expect(layout.attributes[2].offset).toBe(24); // uv (after 6 floats)
      expect(layout.attributes[3].offset).toBe(32); // tangent (after 8 floats)
      expect(layout.attributes[4].offset).toBe(44); // bitangent (after 11 floats)
    });
  });

  describe("getUniformBufferSize", () => {
    it("should return 512 bytes", () => {
      const material = new PBRMaterial();
      expect(material.getUniformBufferSize()).toBe(512);
    });

    it("should return same size for different material configurations", () => {
      const material1 = new PBRMaterial();
      const material2 = new PBRMaterial({ metalness: 1.0, roughness: 0.1 });

      expect(material1.getUniformBufferSize()).toBe(512);
      expect(material2.getUniformBufferSize()).toBe(512);
    });
  });

  describe("getPrimitiveTopology", () => {
    it("should return triangle-list by default", () => {
      const material = new PBRMaterial();
      expect(material.getPrimitiveTopology()).toBe("triangle-list");
    });

    it("should return line-list when wireframe is enabled", () => {
      const material = new PBRMaterial({ wireframe: true });
      expect(material.getPrimitiveTopology()).toBe("line-list");
    });

    it("should return triangle-list when wireframe is false", () => {
      const material = new PBRMaterial({ wireframe: false });
      expect(material.getPrimitiveTopology()).toBe("triangle-list");
    });

    it("should update topology when wireframe changes", () => {
      const material = new PBRMaterial({ wireframe: false });
      expect(material.getPrimitiveTopology()).toBe("triangle-list");

      material.wireframe = true;
      expect(material.getPrimitiveTopology()).toBe("line-list");

      material.wireframe = false;
      expect(material.getPrimitiveTopology()).toBe("triangle-list");
    });
  });

  describe("getTextures", () => {
    it("should throw error when device is not provided", () => {
      const material = new PBRMaterial();
      expect(() => material.getTextures()).toThrow(
        "PBRMaterial.getTextures() requires a GPUDevice parameter"
      );
    });

    it("should throw error when device is undefined", () => {
      const material = new PBRMaterial();
      expect(() => material.getTextures(undefined)).toThrow(
        "PBRMaterial.getTextures() requires a GPUDevice parameter"
      );
    });
  });

  describe("getVertexShader and getFragmentShader", () => {
    it("should return shader source code strings", () => {
      const material = new PBRMaterial();
      const vertexShader = material.getVertexShader();
      const fragmentShader = material.getFragmentShader();

      expect(typeof vertexShader).toBe("string");
      expect(typeof fragmentShader).toBe("string");
      expect(vertexShader.length).toBeGreaterThan(0);
      expect(fragmentShader.length).toBeGreaterThan(0);
    });

    it("should return consistent shaders for same material type", () => {
      const material1 = new PBRMaterial();
      const material2 = new PBRMaterial({ metalness: 1.0 });

      expect(material1.getVertexShader()).toBe(material2.getVertexShader());
      expect(material1.getFragmentShader()).toBe(material2.getFragmentShader());
    });

    it("should return non-empty vertex shader", () => {
      const material = new PBRMaterial();
      const vertexShader = material.getVertexShader();

      expect(vertexShader).toBeTruthy();
      expect(vertexShader.trim().length).toBeGreaterThan(0);
    });

    it("should return non-empty fragment shader", () => {
      const material = new PBRMaterial();
      const fragmentShader = material.getFragmentShader();

      expect(fragmentShader).toBeTruthy();
      expect(fragmentShader.trim().length).toBeGreaterThan(0);
    });
  });

  describe("type property", () => {
    it("should have type 'pbr'", () => {
      const material = new PBRMaterial();
      expect(material.type).toBe("pbr");
    });

    it("should be readonly", () => {
      const material = new PBRMaterial();
      const type = material.type;

      // TypeScript should prevent assignment, but verify the value remains constant
      expect(material.type).toBe(type);
      expect(material.type).toBe("pbr");
    });
  });

  describe("immutability", () => {
    it("should not mutate color when getter is accessed", () => {
      const material = new PBRMaterial({ color: [0.5, 0.5, 0.5] });
      const color1 = material.color;
      const color2 = material.color;

      expect(color1.r).toBe(color2.r);
      expect(color1.g).toBe(color2.g);
      expect(color1.b).toBe(color2.b);
    });

    it("should not mutate emissive when getter is accessed", () => {
      const material = new PBRMaterial({ emissive: [0.5, 0.5, 0.5] });
      const emissive1 = material.emissive;
      const emissive2 = material.emissive;

      expect(emissive1.r).toBe(emissive2.r);
      expect(emissive1.g).toBe(emissive2.g);
      expect(emissive1.b).toBe(emissive2.b);
    });
  });

  describe("edge cases", () => {
    it("should handle zero values for all properties", () => {
      const material = new PBRMaterial({
        color: [0, 0, 0],
        metalness: 0,
        roughness: 0,
        normalScale: 0,
        aoMapIntensity: 0,
        emissive: [0, 0, 0],
        emissiveIntensity: 0,
        envMapIntensity: 0,
      });

      expect(material.color.r).toBe(0);
      expect(material.metalness).toBe(0);
      expect(material.roughness).toBe(0);
      expect(material.normalScale).toBe(0);
      expect(material.aoMapIntensity).toBe(0);
      expect(material.emissive.r).toBe(0);
      expect(material.emissiveIntensity).toBe(0);
      expect(material.envMapIntensity).toBe(0);
    });

    it("should handle maximum values for bounded properties", () => {
      const material = new PBRMaterial({
        metalness: 1.0,
        roughness: 1.0,
        normalScale: 3.0,
        aoMapIntensity: 1.0,
      });

      expect(material.metalness).toBe(1.0);
      expect(material.roughness).toBe(1.0);
      expect(material.normalScale).toBe(3.0);
      expect(material.aoMapIntensity).toBe(1.0);
    });

    it("should handle very large unbounded intensity values", () => {
      const material = new PBRMaterial({
        emissiveIntensity: 1000.0,
        envMapIntensity: 500.0,
      });

      expect(material.emissiveIntensity).toBe(1000.0);
      expect(material.envMapIntensity).toBe(500.0);
    });

    it("should handle fractional values for all numeric properties", () => {
      const material = new PBRMaterial({
        color: [0.123, 0.456, 0.789],
        metalness: 0.333,
        roughness: 0.666,
        normalScale: 1.234,
        aoMapIntensity: 0.567,
        emissive: [0.111, 0.222, 0.333],
        emissiveIntensity: 1.567,
        envMapIntensity: 2.345,
      });

      expect(material.color.r).toBeCloseTo(0.123, 5);
      expect(material.metalness).toBeCloseTo(0.333, 5);
      expect(material.roughness).toBeCloseTo(0.666, 5);
      expect(material.normalScale).toBeCloseTo(1.234, 5);
      expect(material.aoMapIntensity).toBeCloseTo(0.567, 5);
      expect(material.emissive.r).toBeCloseTo(0.111, 5);
      expect(material.emissiveIntensity).toBeCloseTo(1.567, 5);
      expect(material.envMapIntensity).toBeCloseTo(2.345, 5);
    });
  });
});

describe("AmbientLight", () => {
  describe("constructor", () => {
    it("should create with default values", () => {
      const light = new AmbientLight();

      expect(light.color.r).toBe(1);
      expect(light.color.g).toBe(1);
      expect(light.color.b).toBe(1);
      expect(light.intensity).toBe(0.1);
    });

    it("should create with custom color", () => {
      const color = new Color(0.5, 0.5, 0.5);
      const light = new AmbientLight(color);

      expect(light.color.r).toBe(0.5);
      expect(light.color.g).toBe(0.5);
      expect(light.color.b).toBe(0.5);
      expect(light.intensity).toBe(0.1);
    });

    it("should create with custom values", () => {
      const light = new AmbientLight(new Color(0.5, 0.5, 0.5), 0.3);

      expect(light.color.r).toBe(0.5);
      expect(light.color.g).toBe(0.5);
      expect(light.color.b).toBe(0.5);
      expect(light.intensity).toBe(0.3);
    });

    it("should create with zero intensity", () => {
      const light = new AmbientLight(new Color(1, 1, 1), 0.0);

      expect(light.intensity).toBe(0.0);
    });

    it("should create with high intensity", () => {
      const light = new AmbientLight(new Color(1, 1, 1), 5.0);

      expect(light.intensity).toBe(5.0);
    });

    it("should create with black color", () => {
      const light = new AmbientLight(new Color(0, 0, 0), 1.0);

      expect(light.color.r).toBe(0);
      expect(light.color.g).toBe(0);
      expect(light.color.b).toBe(0);
    });

    it("should create with colored light", () => {
      const light = new AmbientLight(new Color(1.0, 0.5, 0.2), 0.8);

      expect(light.color.r).toBe(1.0);
      expect(light.color.g).toBe(0.5);
      expect(light.color.b).toBe(0.2);
      expect(light.intensity).toBe(0.8);
    });
  });

  describe("properties", () => {
    it("should allow modifying color after creation", () => {
      const light = new AmbientLight();
      light.color = new Color(0.2, 0.4, 0.6);

      expect(light.color.r).toBe(0.2);
      expect(light.color.g).toBe(0.4);
      expect(light.color.b).toBe(0.6);
    });

    it("should allow modifying intensity after creation", () => {
      const light = new AmbientLight();
      light.intensity = 0.5;

      expect(light.intensity).toBe(0.5);
    });

    it("should allow setting intensity to zero", () => {
      const light = new AmbientLight();
      light.intensity = 0;

      expect(light.intensity).toBe(0);
    });

    it("should allow negative intensity", () => {
      const light = new AmbientLight();
      light.intensity = -0.5;

      expect(light.intensity).toBe(-0.5);
    });
  });

  describe("edge cases", () => {
    it("should handle fractional color values", () => {
      const light = new AmbientLight(new Color(0.123, 0.456, 0.789), 0.234);

      expect(light.color.r).toBeCloseTo(0.123, 5);
      expect(light.color.g).toBeCloseTo(0.456, 5);
      expect(light.color.b).toBeCloseTo(0.789, 5);
      expect(light.intensity).toBeCloseTo(0.234, 5);
    });

    it("should handle very small intensity values", () => {
      const light = new AmbientLight(new Color(1, 1, 1), 0.001);

      expect(light.intensity).toBe(0.001);
    });

    it("should handle very large intensity values", () => {
      const light = new AmbientLight(new Color(1, 1, 1), 100.0);

      expect(light.intensity).toBe(100.0);
    });
  });
});
