import { describe, it, expect, mock } from "bun:test";
import { TextureMaterial } from "./TextureMaterial";
import type { Texture } from "../texture";

// Mock texture for testing
const createMockTexture = (): Texture => {
  return {
    texture: {} as GPUTexture,
    sampler: {} as GPUSampler,
    view: {} as GPUTextureView,
    width: 256,
    height: 256,
    format: "rgba8unorm" as GPUTextureFormat,
    destroy: mock(() => {}),
  } as unknown as Texture;
};

describe("TextureMaterial", () => {
  describe("constructor", () => {
    it("should create material with provided texture", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });

      expect(material.type).toBe("texture");
      expect(material.texture).toBe(texture);
    });

    it("should store texture reference correctly", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });

      expect(material.texture.width).toBe(256);
      expect(material.texture.height).toBe(256);
      expect(material.texture.format).toBe("rgba8unorm");
    });
  });

  describe("getVertexShader", () => {
    it("should return vertex shader code", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });
      const shader = material.getVertexShader();

      expect(typeof shader).toBe("string");
      expect(shader.length).toBeGreaterThan(0);
    });
  });

  describe("getFragmentShader", () => {
    it("should return fragment shader code", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });
      const shader = material.getFragmentShader();

      expect(typeof shader).toBe("string");
      expect(shader.length).toBeGreaterThan(0);
    });
  });

  describe("getVertexBufferLayout", () => {
    it("should return correct buffer layout for texture material", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });
      const layout = material.getVertexBufferLayout();

      // position(vec3f) + normal(vec3f) + uv(vec2f) = 32 bytes
      expect(layout.arrayStride).toBe(32);
      expect(layout.attributes.length).toBe(3);

      // Position attribute
      expect(layout.attributes[0].shaderLocation).toBe(0);
      expect(layout.attributes[0].offset).toBe(0);
      expect(layout.attributes[0].format).toBe("float32x3");

      // Normal attribute
      expect(layout.attributes[1].shaderLocation).toBe(1);
      expect(layout.attributes[1].offset).toBe(12);
      expect(layout.attributes[1].format).toBe("float32x3");

      // UV attribute
      expect(layout.attributes[2].shaderLocation).toBe(2);
      expect(layout.attributes[2].offset).toBe(24);
      expect(layout.attributes[2].format).toBe("float32x2");
    });
  });

  describe("getUniformBufferSize", () => {
    it("should return 64 bytes for MVP matrix", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });

      expect(material.getUniformBufferSize()).toBe(64);
    });
  });

  describe("getPrimitiveTopology", () => {
    it("should return triangle-list topology", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });

      expect(material.getPrimitiveTopology()).toBe("triangle-list");
    });
  });

  describe("getTexture", () => {
    it("should return the material's texture", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });

      expect(material.getTexture()).toBe(texture);
    });

    it("should return same texture instance", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });

      const retrievedTexture = material.getTexture();
      expect(retrievedTexture).toBe(texture);
      expect(retrievedTexture).toBe(material.texture);
    });
  });

  describe("getTextures", () => {
    it("should return array with single texture", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });
      const textures = material.getTextures();

      expect(Array.isArray(textures)).toBe(true);
      expect(textures.length).toBe(1);
      expect(textures[0]).toBe(texture);
    });

    it("should return array containing the same texture as getTexture", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });

      const singleTexture = material.getTexture();
      const textureArray = material.getTextures();

      expect(textureArray[0]).toBe(singleTexture);
    });
  });

  describe("type property", () => {
    it("should have readonly type property set to 'texture'", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });

      expect(material.type).toBe("texture");
    });
  });

  describe("vertex buffer layout validation", () => {
    it("should have correct byte offsets for all attributes", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });
      const layout = material.getVertexBufferLayout();

      // position: 3 floats × 4 bytes = 12 bytes (offset 0)
      expect(layout.attributes[0].offset).toBe(0);

      // normal: 3 floats × 4 bytes = 12 bytes (offset 12)
      expect(layout.attributes[1].offset).toBe(12);

      // uv: 2 floats × 4 bytes = 8 bytes (offset 24)
      expect(layout.attributes[2].offset).toBe(24);

      // Total stride: 12 + 12 + 8 = 32 bytes
      expect(layout.arrayStride).toBe(32);
    });

    it("should have sequential shader locations", () => {
      const texture = createMockTexture();
      const material = new TextureMaterial({ texture });
      const layout = material.getVertexBufferLayout();

      expect(layout.attributes[0].shaderLocation).toBe(0);
      expect(layout.attributes[1].shaderLocation).toBe(1);
      expect(layout.attributes[2].shaderLocation).toBe(2);
    });
  });
});
