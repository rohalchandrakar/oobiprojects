var DrawModel = function(__containerName, __parentPath, __fileName, __containerWidth, __containerHeight) {
        
    this.containerName = __containerName;
    this.parentPath = __parentPath;
    this.fileName = __fileName;
    this.containerWidth = __containerWidth;
    this.containerHeight = __containerHeight;
    

        //var SCREEN_WIDTH = window.innerWidth;
        //var SCREEN_HEIGHT = window.innerHeight;
    
        var SCREEN_WIDTH = __containerWidth;
        var SCREEN_HEIGHT = __containerHeight;
    
    var scene = {}, panoSphere;
    var container = {};
    var camera, cameraFPS;
    var renderer = {};
    var light = {};
    var camFixPos, camFixRot;
    var controls, stableControllerPos;


    
    var mtlLoader = {};
    var objLoader = {};
    var time = Date.now(), rayLine, frameCounter = 1;
        


    var objects = [];

            var raycaster;

            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

            if ( havePointerLock ) {

                var element = document.getElementById('container');

                var pointerlockchange = function ( event ) {

                    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

                        controlsEnabled = true;
                        controls.enabled = true;

                    } else {
                        controls.enabled = false;
                        cellingVisibilityState(false);
                    }

                };

                var pointerlockerror = function ( event ) {

                    //instructions.style.display = '';

                };

                // Hook pointer lock state change events
                document.addEventListener( 'pointerlockchange', pointerlockchange, false );
                document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
                document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

                document.addEventListener( 'pointerlockerror', pointerlockerror, false );
                document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
                document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

                element.addEventListener( 'click', function ( event ) {

                    /*if(controls.enabled && controlsOrbit.enabled == false)
                    {

                    // Ask the browser to lock the pointer
                    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

                    if ( /Firefox/i.test( navigator.userAgent ) ) {

                        var fullscreenchange = function ( event ) {

                            if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                                document.removeEventListener( 'fullscreenchange', fullscreenchange );
                                document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                                element.requestPointerLock();
                            }

                        };

                        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

                        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                        element.requestFullscreen();

                    } else {

                        element.requestPointerLock();

                    }
                    }*/

                }, false );

            } else {

                instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

            }









        init();
        animate();



        var controlsEnabled = false;

            var moveForward = false;
            var moveBackward = false;
            var moveLeft = false;
            var moveRight = false;
            var canJump = false;

            var prevTime = performance.now();
            var velocity = new THREE.Vector3();
            var objects = [], colliderDist = 10;

            var raycaster, is2dPlanVisible = false;


        
        function init () {
            container = document.getElementById(__containerName);
            //mirrorCameraArray = new Array();
            
            document.getElementById('containerOverlay').style.display = 'none';
            
            // CAMERA

            camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 200000);
            camera.position.set(10, 10, 10);

            cameraFPS = new THREE.PerspectiveCamera(55, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 200000);
            cameraFPS.position.set(0, 0, 0);
            
            
            
            
            // ENV MAP TEXTURE LOAD
            var loader = new THREE.CubeTextureLoader();
            loader.setPath('skybox/');
            var reflectionCube = loader.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
            reflectionCube.mapping = THREE.CubeRefractionMapping;

            
            
            

            // SCENE

            scene = new THREE.Scene();

            //scene.background = reflectionCube;




            // draw pamnorama Sphere
            var geometry = new THREE.SphereGeometry( 50000, 60, 40 );
            geometry.scale( - 1, 1, 1 );

            var material = new THREE.MeshBasicMaterial( {
                map: new THREE.TextureLoader().load( 'model/skybox_default/texture.jpg' )
            } );

            panoSphere = new THREE.Mesh( geometry, material );

            scene.add( panoSphere );



            // Fps controls

            controls = new THREE.PointerLockControls( cameraFPS );
            controls.enabled = false;
            scene.add( controls.getObject() );

                var onKeyDown = function ( event ) {

                    switch ( event.keyCode ) {

                        case 38: // up
                        case 87: // w
                            moveForward = true;
                            break;

                        case 37: // left
                        case 65: // a
                            moveLeft = true; break;

                        case 40: // down
                        case 83: // s
                            moveBackward = true;
                            break;

                        case 39: // right
                        case 68: // d
                            moveRight = true;
                            break;

                        case 32: // space
                            if ( canJump === true ) velocity.y += 350;
                            canJump = false;
                            break;

                    }

                };

                var onKeyUp = function ( event ) {

                    switch( event.keyCode ) {

                        case 38: // up
                        case 87: // w
                            moveForward = false;
                            break;

                        case 37: // left
                        case 65: // a
                            moveLeft = false;
                            break;

                        case 40: // down
                        case 83: // s
                            moveBackward = false;
                            break;

                        case 39: // right
                        case 68: // d
                            moveRight = false;
                            break;

                    }

                };

                document.addEventListener( 'keydown', onKeyDown, false );
                document.addEventListener( 'keyup', onKeyUp, false );

                raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 50 );

                controls.getObject().position.y = 6;


            // CONTROLS

            controlsOrbit = new THREE.OrbitControls(camera);
            controlsOrbit.maxPolarAngle = 0.9 * Math.PI / 2;
            controlsOrbit.enableZoom = true;
            controlsOrbit.enablePan = false;
            controlsOrbit.enableDamping = true;
            controlsOrbit.dampingFactor = 0.15;
            controlsOrbit.maxDistance = 20000;






            // LIGHTS
            
            var ambient = new THREE.AmbientLight( 0xffffff );
			scene.add( ambient );





            // SUN LIGHTS

            light = new THREE.DirectionalLight(0xaabbff, 0.5);
            light.position.x = 30;
            light.position.y = 30;
            light.position.z = 100;
            light.castShadow = true;
            /*light.shadowCameraVisible = true;
            light.shadowDarkness = 5.5;
            light.shadowCameraRight     =  100;
            light.shadowCameraLeft     = -100;
            light.shadowCameraTop      =  100;
            light.shadowCameraBottom   = -100;*/
            scene.add(light);

            // SKYDOME

            /*var vertexShader = document.getElementById('vertexShader').textContent;
            var fragmentShader = document.getElementById('fragmentShader').textContent;
            var uniforms = {
                topColor: {
                    type: "c",
                    value: new THREE.Color(0x0077ff)
                },
                bottomColor: {
                    type: "c",
                    value: new THREE.Color(0xffffff)
                },
                offset: {
                    type: "f",
                    value: 400
                },
                exponent: {
                    type: "f",
                    value: 0.6
                }
            };
            uniforms.topColor.value.copy(light.color);

            var skyGeo = new THREE.SphereGeometry(40000, 32, 15);
            var skyMat = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                side: THREE.BackSide
            });

            var sky = new THREE.Mesh(skyGeo, skyMat);
            scene.add(sky);*/

            // RENDERER

            renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
            container.appendChild(renderer.domElement);

            /*renderer.gammaInput = true;
            renderer.gammaOutput = true;
            renderer.shadowMap.enabled = true;
            renderer.shadowMapSoft = true;
            renderer.shadowMapType = THREE.PCFSoftShadowMap; */



            //model draw
            window.addEventListener('resize', onWindowResize, false);

        }
    
    
    

        function onWindowResize() {
            camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
            camera.updateProjectionMatrix();
            cameraFPS.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
            cameraFPS.updateProjectionMatrix();

            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        }
        
        
        
        
        
        
        
        function _createMaterial(__type, __envMap, _oldMat) 
        {
            var material;
            
            
            if (__type.indexOf("glass") != -1) {
                console.log("__glass");
                var material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    metalness: 0.9,
                    roughness: 0.3,
                    envMap: __envMap,
                    shading: THREE.SmoothShading,
                    refractionRatio: 0.985
                });
            } else if (__type.indexOf("fabric") != -1) {
                console.log("fabric");
                material = new THREE.MeshStandardMaterial({
                    map: null,
                    bumpMap: null,
                    bumpScale: null,
                    color: 0x996633,
                    metalness: 0.1,
                    roughness: 0.8,
                    shading: THREE.SmoothShading,
                    envMap: null
                })
            } else if (__type.indexOf("wood") != -1) {
                console.log("wood");
                material = new THREE.MeshStandardMaterial({
                    map: null,
                    bumpMap: null,
                    bumpScale: null,
                    color: 0x996633,
                    metalness: 0.1,
                    roughness: 0.6,
                    shading: THREE.SmoothShading,
                    envMap: null
                })
            } else if (__type.indexOf("metal") != -1) {
                console.log("metal");
                
                var msc = new THREE.CubeCamera(1, 5000, 512);
                msc.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
                scene.add(msc);
                material = new THREE.MeshBasicMaterial({
                    envMap: msc.renderTarget.texture
                });
                mirrorCameraArray.push(msc);
            } // glossy
            else {
                
                console.log("glossy");
                
                var msc = new THREE.CubeCamera(1, 5000, 512);
                msc.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
                scene.add(msc);
                var material = new THREE.MeshPhongMaterial({
                            map: null,
                            bumpMap: null,
                            bumpScale: null,
                            color: 0x996633,
                            specular: 0x996633,
                            reflectivity: 100,
                            shininess: 100,
                            shading: THREE.SmoothShading,
                            envMap: null
                        });
                mirrorCameraArray.push(msc);
            }
            return material;
        }

        
        
        

        //

        function animate() {

            requestAnimationFrame(animate);

            if ( controls.enabled) {
                    detectCollision();
                }
                else
                {
                    controlsOrbit.update();
                    renderer.render(scene, camera);
                }
        }


        this.reSizeContainer = function()
        {

            var w = $('#container').width();
            var h = $('#slideOut').height();

            console.log("resize container with : " + w.toString() + h.toString());

            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            cameraFPS.aspect = w / h;
            cameraFPS.updateProjectionMatrix();

            renderer.setSize(w, h);
        }


    this.updateModel = function(__parentPath, __fileName)
    {
           // model
           document.getElementById('containerOverlay').style.display = 'block';
           deleteGroups();
            
				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
                        if(percentComplete === 100)
                            document.getElementById('containerOverlay').style.display = 'none';
                        else
                            document.getElementById('containerOverlay').innerHTML= "<span>Loading...   " + Math.round(percentComplete, 2) + " % downloaded</span>";
                    }
				};

				var onError = function ( xhr ) { };

				THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

				var mtlLoader = new THREE.MTLLoader();
				mtlLoader.setPath( __parentPath );
				mtlLoader.load( __fileName + '.mtl', function( materials ) {
					materials.preload();
					var objLoader = new THREE.OBJLoader();
					objLoader.setMaterials( materials );
					objLoader.setPath( __parentPath );
					objLoader.load( __fileName + '.obj', function ( object ) {
						scene.add( object );

                        swithOn2dPlan(false);
                        $('.btn-2d-plan').addClass('hide');
                        is2dPlanVisible = false
                        computeBoundingboxAndSetupCamera(object);
                        cellingVisibilityState(false);
					}, onProgress, onError );
				});
    }




    function computeBoundingboxAndSetupCamera(__object)
    {
        var minX = 100000;
        var minY = 100000;
        var minZ = 100000;
        var maxX = -100000;
        var maxY = -100000;
        var maxZ = -100000;
        __object.traverse (function (mesh)
        {
            
            if (mesh instanceof THREE.Mesh)
            {
                mesh.geometry.computeBoundingBox ();
                var bBox = mesh.geometry.boundingBox;
                // compute overall bbox
                minX = Math.min (minX, bBox.min.x);
                minY = Math.min (minY, bBox.min.y);
                minZ = Math.min (minZ, bBox.min.z);
                maxX = Math.max (maxX, bBox.max.x);
                maxY = Math.max (maxY, bBox.max.y);
                maxZ = Math.max (maxZ, bBox.max.z);

                console.log(mesh.name);
                mesh.geometry.computeVertexNormals();


                // enable only when you need the shadows

                /*if(mesh.name.toLowerCase().indexOf('glass') !== -1)
                {
                    mesh.receiveShadow = true;
                    //mesh.castShadow = true;
                }
                else
                {
                    mesh.receiveShadow = true;
                    mesh.castShadow = true;
                }*/

                if(mesh.name.toLowerCase().indexOf('collider') !== -1)
                {
                    console.log('added to colliders');
                    controls.getObject().position.y = ((maxY + minY) / 2) + minY;
                    mesh.material.transparent = true;
                    mesh.material.opacity = 0.01;
                    objects.push(mesh);
                }


                if(mesh.name.toLowerCase() === "plan")
                    $('.btn-2d-plan').removeClass('hide');
            }
        });



        console.log('x length : ' + (maxX - minX));
        console.log('z length : ' + (maxZ - minZ));
        console.log('y length : ' + (maxY - minY));


        camera.position.set(minX * 1.5, (maxY - minY) * 7 , minZ * -1.5);
        controlsOrbit.target = new THREE.Vector3((minX + maxX)/2, 0, (minZ + maxZ)/2);
        controlsOrbit.maxDistance = Math.max((maxX - minX) , (maxZ - minZ)) * 3;
        controlsOrbit.minDistance = (maxY - minY) / 3;
    }



    function deleteGroups()
    {
        for(var j = 0 ; j < scene.children.length ; j++)
        {
            if(scene.children[j].type === "Group")
            {
                for(var i = 0 ; i < scene.children[j].children.length ; i++)
                {
                    try{scene.children[j].children[i].geometry.dispose();}catch(e){}
                    try{scene.children[j].children[i].material.map.dispose();}catch(e){}
                    try{scene.children[j].children[i].material.dispose();}catch(e){}
                    try{scene.children[j].children[i].dispose();}catch(e){}
                }
                scene.remove(scene.children[j]);
            }
        }
    }


    function cellingVisibilityState (__mode)
    {
        for(var j = 0 ; j < scene.children.length ; j++)
        {
            if(scene.children[j].type === "Group")
            {
                for(var i = 0 ; i < scene.children[j].children.length ; i++)
                {
                    if(scene.children[j].children[i].type === "Mesh" && scene.children[j].children[i].name.toLowerCase().indexOf('celling') !== -1)
                    {
                        scene.children[j].children[i].visible = __mode;
                    }

                    
                }
            }
        }
    }




    function resetFPSControllerPos ()
    {
        for(var j = 0 ; j < scene.children.length ; j++)
        {
            if(scene.children[j].type === "Group")
            {
                for(var i = 0 ; i < scene.children[j].children.length ; i++)
                {
                    if(scene.children[j].children[i].type === "Mesh" && scene.children[j].children[i].name.toLowerCase().indexOf('spawn') !== -1)
                    {
                        console.log('spawn spotted....');
                        controls.getObject().position.x = scene.children[j].children[i].geometry.boundingBox.min.x;
                        controls.getObject().position.z = scene.children[j].children[i].geometry.boundingBox.min.z;
                        controls.getObject().position.y = scene.children[j].children[i].geometry.boundingBox.min.y;
                    }
                }
            }
        }
    }



    function swithOn2dPlan(__mode)
    {
        for(var j = 0 ; j < scene.children.length ; j++)
        {
            if(scene.children[j].type === "Group")
            {
                for(var i = 0 ; i < scene.children[j].children.length ; i++)
                {
                    if(scene.children[j].children[i].type === "Mesh")
                    {
                        if(scene.children[j].children[i].name.toLowerCase() === 'plan')
                        {
                            scene.children[j].children[i].visible = __mode;    
                        }
                        else
                        {
                            if(__mode)
                                scene.children[j].children[i].visible = false;
                            else
                                scene.children[j].children[i].visible = true;
                        }
                    }
                    
                }
            }
        }
    }




    this.clearViewport = function(){
        deleteGroups();
    }


    this.swithToOrbit = function()
    {
        controls.enabled = false;
        cellingVisibilityState(false);
        //scene.remove(panoSphere);
    }

    this.swithToFPS = function()
    {
        controls.enabled = true;
        cellingVisibilityState(true);
        //scene.add(panoSphere);
        element.requestPointerLock();
        resetFPSControllerPos ();
    }


    this.getCamEnabled = function()
    {
        return controls.enabled;
    }

    this.toggel2dPlanVisibility = function()
    {
        if(is2dPlanVisible)
            swithOn2dPlan(false);
        else
            swithOn2dPlan(true);
    }


    this.changePanorama = function(__path)
    {
        // code to update panorama image on project change only
        try{panoSphere.material.map.dispose();} catch(e){}
        panoSphere.material.map = new THREE.TextureLoader().load( __path );
    }







    function detectCollision() {
                    

                    //cameraFPS.matrixWorldNeedsUpdate = true;

                    //console.log(intersections);
                    //var cameraDirection = controls.getDirection(new THREE.Vector3(0, 0, 0)).clone();

                    if(moveForward || moveBackward || moveLeft || moveRight)
                    {
                        var fd = controls.getDirection(new THREE.Vector3(0, 0, 0)).clone();
                    var bd = controls.getDirection(new THREE.Vector3(0, 0, 0)).clone();
                    var ld = controls.getDirection(new THREE.Vector3(0, 0, 0)).clone();
                    var rd = controls.getDirection(new THREE.Vector3(0, 0, 0)).clone();

                    var res = new THREE.Vector3(0,0,0);

                    var time = performance.now();
                    var delta = ( time - prevTime ) / 1000;

                    velocity.x = 0;
                    velocity.z = 0;

                    if ( moveForward ) 
                        {
                            velocity.z = -0.5;
                            res.add(fd);
                        }
                    if ( moveBackward ) 
                        {
                            velocity.z = 0.5;
                            rotationMatrix = new THREE.Matrix4();
                            rotationMatrix.makeRotationY(180 * Math.PI / 180);
                            bd.applyMatrix4(rotationMatrix);
                            res.add(bd);
                        }
                    if ( moveLeft ) 
                        {
                            velocity.x = -0.5;
                            rotationMatrix = new THREE.Matrix4();
                            rotationMatrix.makeRotationY(90 * Math.PI / 180);
                            ld.applyMatrix4(rotationMatrix);
                            res.add(ld);
                        }
                    if ( moveRight ) 
                        {
                            velocity.x = 0.5;
                            rotationMatrix = new THREE.Matrix4();
                            rotationMatrix.makeRotationY(270 * Math.PI / 180);
                            rd.applyMatrix4(rotationMatrix);
                            res.add(rd);
                        }


                        //console.log(res);
                        res.multiplyScalar(10);

                    //  code for mover direction block
                    raycaster.ray.origin.set(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);
                    raycaster.ray.direction.set(res.x, controls.getObject().position.y, res.z);
                    var intersections = raycaster.intersectObjects( objects );

                    var isOnObject = intersections.length > 0 && intersections[0].distance < 5;
                    
                    if(isOnObject)
                    {
                        console.log(intersections.length);
                        velocity.x = 0;
                        velocity.z = 0;
                    }


                    controls.getObject().translateX( velocity.x/2 );
                    controls.getObject().translateZ( velocity.z/2 );
                        

                    

                    prevTime = time;
                    }
                    


                    //cameraFPS.position.y = 8;
                    renderer.render(scene, cameraFPS);


    }

    function lockDirection() {
        if (controls.moveForward()) {
            controls.lockMoveForward(true);
        }
        else if (controls.moveBackward()) {
            controls.lockMoveBackward(true);
        }
        else if (controls.moveLeft()) {
            controls.lockMoveLeft(true);
        }
        else if (controls.moveRight()) {
            controls.lockMoveRight(true);
        }
    }

    function unlockAllDirection(){
        controls.lockMoveForward(false);
        controls.lockMoveBackward(false);
        controls.lockMoveLeft(false);
        controls.lockMoveRight(false);
    }
    
    
    }
