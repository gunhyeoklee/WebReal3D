/**
 * 불변(immutable) RGBA 색상 클래스
 * RGB 기본, alpha는 옵션 (기본값 1.0)
 */
export class Color {
  private readonly _r: number;
  private readonly _g: number;
  private readonly _b: number;
  private readonly _a: number;

  constructor(r = 0, g = 0, b = 0, a = 1) {
    this._r = r;
    this._g = g;
    this._b = b;
    this._a = a;
  }

  get r(): number {
    return this._r;
  }

  get g(): number {
    return this._g;
  }

  get b(): number {
    return this._b;
  }

  get a(): number {
    return this._a;
  }

  /**
   * RGB 튜플로 변환
   */
  toArray(): [number, number, number] {
    return [this._r, this._g, this._b];
  }

  /**
   * RGBA 튜플로 변환
   */
  toArray4(): [number, number, number, number] {
    return [this._r, this._g, this._b, this._a];
  }

  /**
   * RGB 또는 RGBA 배열에서 Color 생성
   */
  static fromArray(
    arr: [number, number, number] | [number, number, number, number]
  ): Color {
    return new Color(arr[0], arr[1], arr[2], arr[3] ?? 1);
  }

  toString(): string {
    return `Color(${this._r}, ${this._g}, ${this._b}, ${this._a})`;
  }
}
