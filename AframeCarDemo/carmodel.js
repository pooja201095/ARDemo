 AFRAME.registerComponent('mythreejsthing',{
            schema: {
                color: {
                    default: '#000'
                },
                colors : ["white", "red", "black", "grey", "blue"],
                colorIndex : 0
            },
                init: function (color) {
                    var el = document.querySelector('myapp');
                    var loadser = new THREE.ObjectLoader();
                    var that = this;

                    if(!color) {
                        loader.load(
                        // resource URL
                        "black.json",
                        // onLoad callback
                        // Here the loaded data is assumed to be an object
                        function (obj) {
                            // Add the loaded object to the scene
                            that.el.setObject3D('obj', obj);
                        }
                    );
                    } else {
                        loader.load(
                        // resource URL
                        color + ".json",

                        // onLoad callback
                        // Here the loaded data is assumed to be an object
                        function(obj) {
                            // Add the loaded object to the scene
                            that.el.setObject3D('obj', obj);
                        }
                        );
                    }
                    
                     $("body").click(carClick);
                },
                carClick : function () {
                      schema.colorIndex =
                        (schema.colorIndex + 1) % schema.colors.length;
//                       $("#myapp").remove();
                      init(schema.colors[schema.colorIndex]);
                }
            });
