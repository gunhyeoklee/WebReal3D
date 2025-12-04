import {
  Engine,
  Renderer,
  BoxGeometry,
  VertexColorMaterial,
  Mesh,
  Scene,
  PerspectiveCamera,
  CameraHelper,
} from "@web-real-3d/core";
import { Vector3 } from "@web-real-3d/math";
import GUI from "lil-gui";

type FaceColors = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

interface Params {
  // Cube params
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  autoRotate: boolean;
  rotationSpeed: number;
  scale: number;
  // Observer camera params
  observerX: number;
  observerY: number;
  observerZ: number;
  observerFov: number;
  // Debug camera params
  debugFov: number;
  debugNear: number;
  debugFar: number;
  debugDistance: number;
  showFrustum: boolean;
}

async function main() {
  const canvasObserver = document.getElementById(
    "canvas-observer"
  ) as HTMLCanvasElement;
  const canvasDebug = document.getElementById(
    "canvas-debug"
  ) as HTMLCanvasElement;

  try {
    const engineObserver = await Engine.create({ canvas: canvasObserver });
    const rendererObserver = new Renderer(engineObserver);
    rendererObserver.setClearColor(0.1, 0.1, 0.1);

    const engineDebug = await Engine.create({ canvas: canvasDebug });
    const rendererDebug = new Renderer(engineDebug);
    rendererDebug.setClearColor(0.15, 0.1, 0.1);

    const params: Params = {
      // Cube params
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      autoRotate: true,
      rotationSpeed: 1.0,
      scale: 1.0,
      // Observer camera params
      observerX: 8.0,
      observerY: 3.0,
      observerZ: 8.0,
      observerFov: 60,
      // Debug camera params
      debugFov: 60,
      debugNear: 0.5,
      debugFar: 5,
      debugDistance: 4,
      showFrustum: true,
    };

    const gui = new GUI({ title: "Camera Helper Demo" });

    const cubeFolder = gui.addFolder("Cube");
    cubeFolder.add(params, "autoRotate").name("Auto Rotate");
    cubeFolder.add(params, "rotationSpeed", 0, 3).name("Rotation Speed");
    cubeFolder.add(params, "scale", 0.1, 3).name("Scale");

    const observerFolder = gui.addFolder("Observer Camera (Left)");
    observerFolder.add(params, "observerX", -15, 15).name("Position X");
    observerFolder.add(params, "observerY", -15, 15).name("Position Y");
    observerFolder.add(params, "observerZ", -15, 15).name("Position Z");
    observerFolder.add(params, "observerFov", 30, 120).name("FOV");

    const debugFolder = gui.addFolder("Debug Camera (Right)");
    debugFolder.add(params, "showFrustum").name("Show Frustum");
    debugFolder.add(params, "debugDistance", 2, 8).name("Distance");
    debugFolder.add(params, "debugFov", 30, 120).name("FOV");
    debugFolder.add(params, "debugNear", 0.1, 2).name("Near Plane");
    debugFolder.add(params, "debugFar", 2, 10).name("Far Plane");

    const faceColors: FaceColors = [
      [1.0, 0.3, 0.3], // Front - Red
      [0.3, 1.0, 0.3], // Back - Green
      [0.3, 0.3, 1.0], // Top - Blue
      [1.0, 1.0, 0.3], // Bottom - Yellow
      [1.0, 0.3, 1.0], // Right - Magenta
      [0.3, 1.0, 1.0], // Left - Cyan
    ];

    const sceneObserver = new Scene();
    const geometry = new BoxGeometry(2, 2, 2);
    const material = new VertexColorMaterial({ faceColors });
    const meshObserver = new Mesh(geometry, material);
    sceneObserver.add(meshObserver);

    const sceneDebug = new Scene();
    const meshDebug = new Mesh(geometry, material);
    sceneDebug.add(meshDebug);

    const debugCamera = new PerspectiveCamera({
      fov: params.debugFov,
      aspect: canvasDebug.width / canvasDebug.height,
      near: params.debugNear,
      far: params.debugFar,
    });
    debugCamera.position.set(0, 0, params.debugDistance);
    debugCamera.lookAt(new Vector3(0, 0, 0));

    const cameraHelper = new CameraHelper(debugCamera, {
      nearColor: [0, 1, 0], // Green - Near plane
      farColor: [1, 0, 0], // Red - Far plane
      sideColor: [1, 1, 0], // Yellow - Connecting edges
      coneColor: [0.5, 0.5, 1], // Light blue - Camera to near plane
    });
    sceneObserver.add(cameraHelper);

    const observerCamera = new PerspectiveCamera({
      fov: params.observerFov,
      aspect: canvasObserver.width / canvasObserver.height,
      near: 0.1,
      far: 100,
    });
    observerCamera.position.set(
      params.observerX,
      params.observerY,
      params.observerZ
    );
    observerCamera.lookAt(new Vector3(0, 0, 0));

    // Use the first engine's run loop for timing
    engineObserver.run((deltaTime: number) => {
      // Update cube rotation
      if (params.autoRotate) {
        params.rotationX += deltaTime * params.rotationSpeed * 0.5;
        params.rotationY += deltaTime * params.rotationSpeed;
      }

      // Sync both meshes
      meshObserver.rotation.set(
        params.rotationX,
        params.rotationY,
        params.rotationZ
      );
      meshObserver.scale.set(params.scale, params.scale, params.scale);

      meshDebug.rotation.set(
        params.rotationX,
        params.rotationY,
        params.rotationZ
      );
      meshDebug.scale.set(params.scale, params.scale, params.scale);

      // Update observer camera
      observerCamera.fov = params.observerFov;
      observerCamera.position.set(
        params.observerX,
        params.observerY,
        params.observerZ
      );
      observerCamera.lookAt(new Vector3(0, 0, 0));

      // Update debug camera
      debugCamera.fov = params.debugFov;
      debugCamera.near = params.debugNear;
      debugCamera.far = params.debugFar;
      debugCamera.position.set(0, 0, params.debugDistance);
      debugCamera.lookAt(new Vector3(0, 0, 0));

      // Update frustum helper
      cameraHelper.update();
      cameraHelper.visible = params.showFrustum;

      // Render both views
      rendererObserver.render(sceneObserver, observerCamera);
      rendererDebug.render(sceneDebug, debugCamera);
    });

    window.addEventListener("beforeunload", () => {
      observerCamera.dispose();
      debugCamera.dispose();
      gui.destroy();
      rendererObserver.dispose();
      rendererDebug.dispose();
      engineObserver.dispose();
      engineDebug.dispose();
    });
  } catch (error) {
    console.error(error);
  }
}

main();
