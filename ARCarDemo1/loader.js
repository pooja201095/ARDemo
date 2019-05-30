var loader = new THREE.ObjectLoader();
var scene;
var renderer, controls;
var camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
const colors = ["white", "red", "black", "grey", "blue"];
let colorIndex = 0;
controls = new THREE.OrbitControls(camera);

function init(color) {
  if (!color) {
    scene = new THREE.Scene();
    loader.load(
      // resource URL
      "white.json",

      // onLoad callback
      // Here the loaded data is assumed to be an object
      function(obj) {
        // Add the loaded object to the scene
        scene.add(obj);
      }
    );
  } else {
    scene = new THREE.Scene();
    loader.load(
      // resource URL
      color + ".json",

      // onLoad callback
      // Here the loaded data is assumed to be an object
      function(obj) {
        // Add the loaded object to the scene
        scene.add(obj);
      }
    );
  }
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.set(0, 2.5, 3);
  document.body.appendChild(renderer.domElement);
}

$("body").click(
    function() {
      colorIndex = (colorIndex + 1) % colors.length;
      $('canvas').remove();
      init(colors[colorIndex]);
});

init();
controls.update();

animate();
function animate() {
  requestAnimationFrame(animate);
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();
  renderer.render(scene, camera);
}
function render() {
  // camera.lookAt(scene.position);
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

