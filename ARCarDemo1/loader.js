
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var noteContent = '';
recognition.continuous = true;

recognition.onresult = function(event) {
  var current = event.resultIndex;

  var transcript = event.results[current][0].transcript;
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
    noteContent = transcript;
    noteTextarea.val(noteContent);
    recognition.stop();
    init(noteContent);
  }
};
/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {
  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();
});

$('#pause-record-btn').on('click', function(e) {
  recognition.stop();
  instructions.text('Voice recognition paused.');
});

noteTextarea.on('input', function() {
  noteContent = $(this).val();
})


/*-----------------------------
      Helper Functions 
------------------------------*/

function renderNotes(notes) {
  var html = '';
  if(notes.length) {
    notes.forEach(function(note) {
      html+= `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
          <a href="#" class="delete-note" title="Delete">Delete</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;    
    });
  }
  else {
    html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
  }
  notesList.html(html);
}


var loader = new THREE.ObjectLoader();
var scene;
var renderer, controls;
var camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
// const colors = ["white", "red", "black", "grey", "blue"];
// let colorIndex = 0;
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
    recognition.start();

  }
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.set(0, 2.5, 3);
  document.body.appendChild(renderer.domElement);
}

// $("body").click(
//     function() {
//       colorIndex = (colorIndex + 1) % colors.length;
//       $('canvas').remove();
//       init(colors[colorIndex]);
// });

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