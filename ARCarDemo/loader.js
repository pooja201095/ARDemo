// var loader = new THREE.ObjectLoader();
// var scene = new THREE.Scene();
// var renderer, controls;
// var camera = new THREE.PerspectiveCamera(
//   70,
//   window.innerWidth / window.innerHeight,
//   1,
//   10000
// );
// controls = new THREE.OrbitControls(camera);

// function init() {
//   var loadobj = loader.load(
//     // resource URL
//     "car.json",

//     // onLoad callback
//     // Here the loaded data is assumed to be an object
//     function(obj) {
//       // Add the loaded object to the scene
//       scene.add(obj);
//     }
//   );
//   renderer = new THREE.WebGLRenderer({ alpha: true });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   camera.position.set(0, 2.5, 3);
//   document.body.appendChild(renderer.domElement);
// }
// init();
// controls.update();

// animate();
// function animate() {
//   requestAnimationFrame(animate);
//   // required if controls.enableDamping or controls.autoRotate are set to true
//   controls.update();
//   renderer.render(scene, camera);
// }
// function render() {
//   // camera.lookAt(scene.position);
//   requestAnimationFrame(render);
//   renderer.render(scene, camera);
// }


// ################ //

// Copyright (c) 2018 8th Wall, Inc.

const onxrloaded = () => {
          var controls;
          var renderer = new THREE.WebGLRenderer({ alpha: true });

  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({ scene, camera }) => {
          //Objects in the scene at height/ y=0 will appear to
          // stick to physical surfaces.
          var loader = new THREE.ObjectLoader();
          var loadobj = loader.load(
            // resource URL
            "car.json",

            // onLoad callback
            // Here the loaded data is assumed to be an object
            function(obj) {
              // Add the loaded object to the scene
              scene.add(obj);
            }
          );
          
          renderer.setSize(window.innerWidth, window.innerHeight);

          // Set the initial camera position relative to the scene we just laid out. This must be at a
          // height greater than y=0.
          camera.position.set(0, 2.5, 7);
    document.body.appendChild(renderer.domElement);
        };;

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
    name: "mycubeapp",

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR.Threejs scene to be ready before we can access it to add content. It was created in
    // XR.Threejs.pipelineModule()'s onStart method.
    onStart: ({ canvasWidth, canvasHeight }) => {
      // Get the 3js sceen from xr3js.
      const { scene, camera } = XR.Threejs.xrScene();
              controls = new THREE.OrbitControls(camera);
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
    onUpdate: () => {
      console.log("Inside update func");
      controls.update();
    },

    animate: () => {
        requestAnimationFrame(animate);
        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();
        renderer.render(scene, camera);
    },
    render: () => {
        // camera.lookAt(scene.position);
        requestAnimationFrame(render);
        renderer.render(scene, camera);
}
  });

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


// ################ //
