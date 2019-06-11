AFRAME.registerComponent("mythreejsthing", {
    schema: {
        color: {
            default: "#000"
        },
        colors: {
            default: ["white", "red", "black", "grey", "blue"]
        },
        colorIndex: {
            default: 0
        }
    },
    speechFunc: function (that) {
        var SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition,
            recognition = new SpeechRecognition(),
            noteTextarea = $("#note-textarea"),
            instructions = $("#recording-instructions"),
            noteContent = "",
            color;
        recognition.continuous = true;

        recognition.onresult = function (event) {
            var current = event.resultIndex;

            var transcript = event.results[current][0].transcript;
            var mobileRepeatBug =
                current == 1 && transcript == event.results[0][0].transcript;

            if (!mobileRepeatBug) {
                noteContent = transcript;
                noteTextarea.val(noteContent);
                recognition.stop();
                $('.'+colorPicked).removeClass('border');
                var wordsArray = noteContent.split(" ");
                var colorArray = ["blue", "white", "grey", "red", "black"];
                var colorPicked;

                wordsArray.forEach(function (word) {
                    if (colorArray.indexOf(word) > -1) {
                        colorPicked = colorArray[colorArray.indexOf(word)];
                        console.log(colorPicked);
                    }
                });
                $('.'+colorPicked).addClass('border');
                that.init(colorPicked);
            }
        };
        /*-----------------------------
            App buttons and input 
        ------------------------------*/

        if (noteContent.length) {
            noteContent += " ";
        }
        recognition.start();

        noteTextarea.on("input", function () {
            noteContent = $(this).val();
        });
        /*-----------------------------
            Helper Functions 
        ------------------------------*/
        function renderNotes(notes) {
            var html = "";
            if (notes.length) {
                notes.forEach(function (note) {
                    html += `<li class="note">
          <p class="header">
            <span class="date">${note.date}</span>
            <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
            <a href="#" class="delete-note" title="Delete">Delete</a>
          </p>
          <p class="content">${note.content}</p>
        </li>`;
                });
            } else {
                html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
            }
            notesList.html(html);
        }
    },
    init: function (color) {
        var el = document.querySelector("myapp");
        var loader = new THREE.ObjectLoader();
        var that = this;
        var count = 1;

        if (!color) {
            loader.load(
                // resource URL
                "blue.json",
                // onLoad callback
                // Here the loaded data is assumed to be an object
                function (obj) {
                    // Add the loaded object to the scene
                    that.el.setObject3D("obj", obj);
                }
            );
        } else {
            loader.load(
                // resource URL
                color + ".json",

                // onLoad callback
                // Here the loaded data is assumed to be an object
                function (obj) {
                    // Add the loaded object to the scene
                    that.el.setObject3D("obj", obj);
                }
            );
        }

        $("body").append(
            '<div class="container"><div class="color-boxes"><span class="blue"></span><span class="grey"></span><span class="red"></span><span class="white"></span></div><p><a class="tz-link" href="https://tutorialzine.com/2017/08/converting-from-speech-to-text-with-javascript"></a></p><div class="app"> <div class="input-single"><textarea id="note-textarea" placeholder="Create a new note by typing or using voice recognition." rows="6"></textarea></div><button id="start-record-btn" title="Start Recording">Start</button></div></div>'
        );

        $(document).on("click", "#start-record-btn", function () {
            that.speechFunc(that);
            $('.color-boxes').addClass('show');
        });

    }
});
