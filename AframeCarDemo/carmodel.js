 AFRAME.registerComponent('mythreejsthing',{
            schema: {
                color: {
                    default: '#000'
                },
                colors : {
                    default: ["white", "red", "black", "grey", "blue"]
                },
                colorIndex : {
                    default: 0
                }
            },
                init: function (color) {
                    var el = document.querySelector('myapp');
                    var loader = new THREE.ObjectLoader();
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
                    let func = this.carClick.bind(this);
                     // $("body").click(func);
                    $("body").unbind().click(func);
                 
                },
                carClick : function () {
                      this.data.colorIndex =
                        (this.data.colorIndex + 1) %
                        this.data.colors.length;
//                       $("#myapp").remove();
                      this.init(
                        this.data.colors[
                          this.data.colorIndex
                        ]
                      );
                }
            });
