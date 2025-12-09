import { Color } from "@web-real/math";
import { Object3D } from "../scene/Object3D";

/**
 * Abstract base class for all light sources in the scene.
 * Provides common properties like color and intensity that all lights share.
 *
 * @example
 * ```ts
 * // Create a directional light
 * const light = new DirectionalLight(new Vector3(0, -1, 0));
 * light.color = new Color(1, 0.8, 0.6); // Warm light
 * light.intensity = 1.5;
 * ```
 */
export abstract class Light extends Object3D {
  public color: Color;
  public intensity: number;

  /**
   * Creates a new Light instance.
   * @param color - The color of the light (default: white)
   * @param intensity - The intensity multiplier for the light (default: 1)
   */
  constructor(color: Color = new Color(1, 1, 1), intensity: number = 1) {
    super();
    this.color = color;
    this.intensity = intensity;
  }
}
