import { Object3D } from "./Object3D";

export class Scene extends Object3D {
  updateMatrixWorld(): void {
    this.updateWorldMatrix(false, true);
  }

  /**
   * Traverses all objects in the scene and collects renderable meshes.
   * @param callback - Function to call for each Object3D
   */
  traverseVisible(callback: (object: Object3D) => void): void {
    this.traverse(callback);
  }
}
