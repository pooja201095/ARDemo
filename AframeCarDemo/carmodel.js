 AFRAME.registerComponent('mythreejsthing',{
            schema: {
                color: {
                    default: '#CC0000'
                },
            },
                init: function () {
                    var el = document.querySelector('myapp');
                    // var camera = document.querySelector(
                    //   "a-camera[camera]"
                    // ).components.camera.camera;
                    // camera.position.z = 5;
                    // camera.position.y = -3;
                    var loader = new THREE.ObjectLoader();
                    var that = this;
                    loader.load(
                        // resource URL
                        "car.json",

                        // onLoad callback
                        // Here the loaded data is assumed to be an object
                        function (obj) {
                            // Add the loaded object to the scene
                            that.el.setObject3D('obj', obj);
                        }
                    );
                }
            });
