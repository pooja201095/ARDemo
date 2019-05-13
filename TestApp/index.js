// Copyright (c) 2018 8th Wall, Inc.

const onxrloaded = () => {
  const purple = 0xad50ff;
  const cherry = 0xdd0065;
  const mint = 0x00edaf;
  const canary = 0xfcee21;

  // To illustrate how to integrate render updates with the camera run loop, we drive a cone in
  // a circle every three seconds.
  let animateCone;
  const startTime = Date.now();
  const coneLoopMillis = 3000;

  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({ scene, camera }) => {
    // Add a grid of purple spheres to the scene. Objects in the scene at height/ y=0 will appear to
    // stick to physical surfaces.
   var geometry = new THREE.BoxGeometry(700, 700, 700, 15, 5, 10);
   var material = new THREE.MeshBasicMaterial({
     color: 0xfffff,
     wireframe: true
   });
   var cube = new THREE.Mesh(geometry, material);
   scene.add(cube);

    // Add one cone in each cardinal direction, and three ahead. Objects in the scene at height
    // y=0 will appear to stick to physical surfaces.

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 3, 0);
  };

  XR.addCameraPipelineModules([
    // Add camera pipeline modules.
    // Existing pipeline modules.
    XR.GlTextureRenderer.pipelineModule(), // Draws the camera feed.
    XR.Threejs.pipelineModule(), // Creates a ThreeJS AR Scene.
    XR.XrController.pipelineModule(), // Enables SLAM tracking.
    XRExtras.AlmostThere.pipelineModule(), // Detects unsupported browsers and gives hints.
    XRExtras.RuntimeError.pipelineModule() // Shows an error image on runtime error.
  ]);

  // Add custom logic to the camera loop. This is done with camera pipeline modules that provide
  // logic for key lifecycle moments for processing each camera frame. In this case, we'll be
  // adding onStart logic for scene initialization, and onUpdate logic for scene updates.
  XR.addCameraPipelineModule({
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: "myawesomeapp",

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR.Threejs scene to be ready before we can access it to add content. It was created in
    // XR.Threejs.pipelineModule()'s onStart method.
    onStart: ({ canvasWidth, canvasHeight }) => {
      // Get the 3js sceen from xr3js.
      const { scene, camera } = XR.Threejs.xrScene();

      // Add some objects to the scene and set the starting camera position.
      initXrScene({ scene, camera });

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion
      });
    },

    // onUpdate is called once per camera loop prior to render. Any 3js geometry scene
    // would typically happen here.
    // onUpdate: () => {
    //   // Update the position of the animating cone at a constant angular velocity.
    //   const coneTheta =
    //     (((Date.now() - startTime) % coneLoopMillis) * 2 * Math.PI) /
    //     coneLoopMillis;
    //   animateCone.position.set(
    //     Math.sin(coneTheta) * 1.5,
    //     0.5,
    //     -Math.cos(coneTheta) * 1.5 - 3.5
    //   );
    // }
  });

  // Call xrController.pause() / xrController.resume() when the button is pressed.
  const pauseButton = document.getElementById("pause");
  pauseButton &&
    pauseButton.addEventListener(
      "click",
      () => {
        if (!XR.isPaused()) {
          XR.pause();
          pauseButton.innerHTML = "RESUME";
          pauseButton.className = "paused";
        } else {
          XR.resume();
          (pauseButton.innerHTML = "PAUSE"), (pauseButton.className = "");
        }
      },
      true
    );

  const canvas = document.getElementById("camerafeed");
  // Call XrController.recenter() when the canvas is tapped with two fingers. This resets the
  // ar camera to the position specified by XrController.updateCameraProjectionMatrix() above.
  canvas.addEventListener(
    "touchstart",
    e => {
      e.touches.length == 2 && XR.XrController.recenter();
    },
    true
  );

  // Open the camera and start running the camera run loop.
  XR.run({ canvas });
};

window.onload = () => {
  window.XR ? onxrloaded() : window.addEventListener("xrloaded", onxrloaded);
};
