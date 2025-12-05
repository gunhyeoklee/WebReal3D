import { describe, it, expect } from "vitest";
import { Color } from "./Color";

describe("Color", () => {
  describe("constructor", () => {
    it("기본값 (0, 0, 0, 1)로 초기화", () => {
      const c = new Color();
      expect(c.r).toBe(0);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
      expect(c.a).toBe(1);
    });

    it("RGB 값으로 초기화, alpha는 기본값 1", () => {
      const c = new Color(1, 0.5, 0.3);
      expect(c.r).toBe(1);
      expect(c.g).toBe(0.5);
      expect(c.b).toBe(0.3);
      expect(c.a).toBe(1);
    });

    it("RGBA 값으로 초기화", () => {
      const c = new Color(1, 0.5, 0.3, 0.8);
      expect(c.r).toBe(1);
      expect(c.g).toBe(0.5);
      expect(c.b).toBe(0.3);
      expect(c.a).toBe(0.8);
    });
  });

  describe("toArray", () => {
    it("RGB 튜플 반환", () => {
      const c = new Color(1, 0.5, 0.3, 0.8);
      const arr = c.toArray();
      expect(arr).toEqual([1, 0.5, 0.3]);
      expect(arr.length).toBe(3);
    });
  });

  describe("toArray4", () => {
    it("RGBA 튜플 반환", () => {
      const c = new Color(1, 0.5, 0.3, 0.8);
      const arr = c.toArray4();
      expect(arr).toEqual([1, 0.5, 0.3, 0.8]);
      expect(arr.length).toBe(4);
    });
  });

  describe("fromArray", () => {
    it("RGB 배열에서 Color 생성, alpha는 기본값 1", () => {
      const c = Color.fromArray([1, 0.5, 0.3]);
      expect(c.r).toBe(1);
      expect(c.g).toBe(0.5);
      expect(c.b).toBe(0.3);
      expect(c.a).toBe(1);
    });

    it("RGBA 배열에서 Color 생성", () => {
      const c = Color.fromArray([1, 0.5, 0.3, 0.8]);
      expect(c.r).toBe(1);
      expect(c.g).toBe(0.5);
      expect(c.b).toBe(0.3);
      expect(c.a).toBe(0.8);
    });
  });

  describe("불변성", () => {
    it("속성을 직접 변경할 수 없음", () => {
      const c = new Color(1, 0, 0);
      // @ts-expect-error - readonly 속성 테스트
      expect(() => (c.r = 0.5)).toThrow();
    });
  });

  describe("toString", () => {
    it("문자열 표현 반환", () => {
      const c = new Color(1, 0.5, 0.3, 0.8);
      expect(c.toString()).toBe("Color(1, 0.5, 0.3, 0.8)");
    });
  });
});
