import { Object3D } from "./Object3D";
import type { Light } from "../light/Light";
import { DirectionalLight } from "../light/DirectionalLight";
import { PointLight } from "../light/PointLight";
import type { Texture } from "../texture";
import type { CubeTexture } from "../texture/CubeTexture";
import type { PMREMResult } from "../texture/PMREMGenerator";
import { SkyboxMaterial } from "../material/SkyboxMaterial";

export interface SceneEnvironmentOptions {
  /** Equirectangular HDR/LDR panorama texture */
  equirectangularMap?: Texture;
  /** Pre-filtered specular IBL cubemap (from PMREMGenerator) */
  prefilteredMap?: CubeTexture;
  /** Diffuse irradiance IBL cubemap (from PMREMGenerator) */
  irradianceMap?: CubeTexture;
  /** Environment intensity for IBL reflections (default: 1.0) */
  environmentIntensity?: number;
  /** Skybox exposure for tone mapping (default: 1.0) */
  skyboxExposure?: number;
  /** Skybox roughness for blur effect (default: 0.0) */
  skyboxRoughness?: number;
}

/**
 * Represents a 3D scene graph that contains objects, lights, and environment settings.
 *
 * @example
 * ```ts
 * const scene = new Scene();
 * const mesh = new Mesh(geometry, material);
 * scene.add(mesh);
 *
 * // Setup environment with IBL
 * const pmrem = await PMREMGenerator.fromEquirectangular(device, hdrTexture);
 * scene.setEnvironmentFromPMREM(pmrem, { environmentIntensity: 1.2 });
 * ```
 */
export class Scene extends Object3D {
  private _equirectangularMap?: Texture;
  private _prefilteredMap?: CubeTexture;
  private _irradianceMap?: CubeTexture;
  private _environmentIntensity: number = 1.0;
  private _skyboxExposure: number = 1.0;
  private _skyboxRoughness: number = 0.0;
  private _skyboxMaterial?: SkyboxMaterial;

  /**
   * Gets the equirectangular environment map texture used for the skybox background.
   */
  get equirectangularMap(): Texture | undefined {
    return this._equirectangularMap;
  }

  /**
   * Gets the pre-filtered specular IBL cubemap for reflections on PBR materials.
   */
  get prefilteredMap(): CubeTexture | undefined {
    return this._prefilteredMap;
  }

  /**
   * Gets the diffuse irradiance IBL cubemap for ambient lighting on PBR materials.
   */
  get irradianceMap(): CubeTexture | undefined {
    return this._irradianceMap;
  }

  /**
   * Gets or sets the environment intensity for IBL reflections on PBR materials.
   * Only affects rendering when IBL is configured (hasIBL === true).
   */
  get environmentIntensity(): number {
    return this._environmentIntensity;
  }

  set environmentIntensity(value: number) {
    this._environmentIntensity = value;
  }

  /**
   * Gets or sets the skybox exposure value for HDR tone mapping.
   */
  get skyboxExposure(): number {
    return this._skyboxExposure;
  }

  set skyboxExposure(value: number) {
    this._skyboxExposure = value;
    if (this._skyboxMaterial) {
      this._skyboxMaterial.setExposure(value);
    }
  }

  /**
   * Gets or sets the skybox roughness for blur effect (0 = sharp, 1 = maximum blur).
   */
  get skyboxRoughness(): number {
    return this._skyboxRoughness;
  }

  set skyboxRoughness(value: number) {
    this._skyboxRoughness = value;
    if (this._skyboxMaterial) {
      this._skyboxMaterial.setRoughness(value);
    }
  }

  /**
   * Gets the internal skybox material used for rendering the environment background.
   * Automatically created when environment is set.
   */
  get skyboxMaterial(): SkyboxMaterial | undefined {
    return this._skyboxMaterial;
  }

  /**
   * Checks if the scene has IBL (Image-Based Lighting) fully configured.
   * Returns true when both prefilteredMap and irradianceMap are set.
   */
  get hasIBL(): boolean {
    return !!(this._prefilteredMap && this._irradianceMap);
  }

  /**
   * Sets the environment using PMREM-generated IBL maps for full PBR lighting support.
   * This is the recommended method for realistic environment reflections and lighting.
   *
   * @param pmrem - Pre-filtered environment maps from PMREMGenerator.fromEquirectangular()
   * @param options - Optional environment configuration (intensity, exposure, roughness)
   * @throws Error if pmrem is missing prefilteredMap or irradianceMap
   *
   * @example
   * ```ts
   * const hdrTexture = await HDRLoader.load(device, 'environment.hdr');
   * const pmrem = await PMREMGenerator.fromEquirectangular(device, hdrTexture);
   * scene.setEnvironmentFromPMREM(pmrem, {
   *   environmentIntensity: 1.0,
   *   skyboxExposure: 1.5
   * });
   * ```
   */
  setEnvironmentFromPMREM(
    pmrem: PMREMResult,
    options?: Partial<SceneEnvironmentOptions>
  ): void {
    if (!pmrem?.prefilteredMap || !pmrem?.irradianceMap) {
      throw new Error(
        "Scene.setEnvironmentFromPMREM() requires pmrem.prefilteredMap and pmrem.irradianceMap"
      );
    }

    this._prefilteredMap = pmrem.prefilteredMap;
    this._irradianceMap = pmrem.irradianceMap;

    if (options?.environmentIntensity !== undefined) {
      this._environmentIntensity = options.environmentIntensity;
    }
    if (options?.skyboxExposure !== undefined) {
      this._skyboxExposure = options.skyboxExposure;
    }
    if (options?.skyboxRoughness !== undefined) {
      this._skyboxRoughness = options.skyboxRoughness;
    }

    // Create skybox material using the prefiltered cubemap
    this._skyboxMaterial = new SkyboxMaterial({
      cubeMap: pmrem.prefilteredMap,
      exposure: this._skyboxExposure,
      roughness: this._skyboxRoughness,
    });
  }

  /**
   * Sets the environment using an equirectangular panorama texture for skybox only.
   * Clears IBL maps, so this method does not provide reflections on materials.
   * Use setEnvironmentFromPMREM() for full IBL support.
   *
   * @param texture - Equirectangular panorama texture (2:1 aspect ratio, HDR or LDR)
   * @param options - Optional skybox configuration (exposure, roughness)
   *
   * @example
   * ```ts
   * const hdrTexture = await HDRLoader.load(device, 'panorama.hdr');
   * scene.setEnvironmentFromEquirectangular(hdrTexture, {
   *   skyboxExposure: 1.2
   * });
   * ```
   */
  setEnvironmentFromEquirectangular(
    texture: Texture,
    options?: Partial<SceneEnvironmentOptions>
  ): void {
    this._equirectangularMap = texture;
    this._prefilteredMap = undefined;
    this._irradianceMap = undefined;

    if (options?.skyboxExposure !== undefined) {
      this._skyboxExposure = options.skyboxExposure;
    }
    if (options?.skyboxRoughness !== undefined) {
      this._skyboxRoughness = options.skyboxRoughness;
    }

    // Create skybox material using equirectangular map
    this._skyboxMaterial = new SkyboxMaterial({
      equirectangularMap: texture,
      exposure: this._skyboxExposure,
      roughness: this._skyboxRoughness,
    });
  }

  /**
   * Sets the full environment configuration with manual control over all maps.
   * For most use cases, prefer setEnvironmentFromPMREM() or setEnvironmentFromEquirectangular().
   *
   * @param options - Complete environment configuration including maps and parameters
   */
  setEnvironment(options: SceneEnvironmentOptions): void {
    this._equirectangularMap = options.equirectangularMap;
    this._prefilteredMap = options.prefilteredMap;
    this._irradianceMap = options.irradianceMap;

    if (options.environmentIntensity !== undefined) {
      this._environmentIntensity = options.environmentIntensity;
    }
    if (options.skyboxExposure !== undefined) {
      this._skyboxExposure = options.skyboxExposure;
    }
    if (options.skyboxRoughness !== undefined) {
      this._skyboxRoughness = options.skyboxRoughness;
    }

    // Create skybox material based on available textures
    if (options.prefilteredMap) {
      this._skyboxMaterial = new SkyboxMaterial({
        cubeMap: options.prefilteredMap,
        exposure: this._skyboxExposure,
        roughness: this._skyboxRoughness,
      });
    } else if (options.equirectangularMap) {
      this._skyboxMaterial = new SkyboxMaterial({
        equirectangularMap: options.equirectangularMap,
        exposure: this._skyboxExposure,
        roughness: this._skyboxRoughness,
      });
    }
  }

  /**
   * Clears all environment settings including skybox and IBL maps.
   */
  clearEnvironment(): void {
    this._equirectangularMap = undefined;
    this._prefilteredMap = undefined;
    this._irradianceMap = undefined;
    this._skyboxMaterial = undefined;
  }

  /**
   * Updates the world transformation matrices for this scene and all children.
   * Called automatically by the renderer before rendering.
   */
  updateMatrixWorld(): void {
    this.updateWorldMatrix(false, true);
  }

  /**
   * Finds the first light of the specified type in the scene graph.
   * Traverses all children to locate a matching light.
   *
   * @param type - Optional light constructor to filter by specific type
   * @returns The first matching light, or undefined if none exists
   */
  findFirstLight<T extends Light = Light>(
    type?: new (...args: any[]) => T
  ): T | undefined {
    let light: T | undefined;
    this.traverse((obj) => {
      if (
        !light &&
        (obj instanceof DirectionalLight || obj instanceof PointLight)
      ) {
        if (!type || obj instanceof type) {
          light = obj as unknown as T;
        }
      }
    });
    return light;
  }
}
