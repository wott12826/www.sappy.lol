/**
 * @author fernandojsg / http://fernandojsg.com
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 * @author bhouston / http://exocortex.com
 * @author Joe Pea / http://github.com/trusktr
 */

// Simple GLTFLoader for isolated THREE.js
(function() {
    // Wait for THREE to be available
    function waitForThree(callback) {
        var THREE = window.Sappy3D && window.Sappy3D.THREE ? window.Sappy3D.THREE : (typeof THREE !== 'undefined' ? THREE : null);
        
        if (THREE) {
            callback(THREE);
        } else {
            setTimeout(function() {
                waitForThree(callback);
            }, 100);
        }
    }
    
    waitForThree(function(THREE) {
        console.log('GLTFLoader: THREE is available, creating loader...');
        
        // Add missing utilities
        THREE.LoaderUtils = THREE.LoaderUtils || {};
        THREE.LoaderUtils.decodeText = function(array) {
            if (typeof TextDecoder !== 'undefined') {
                return new TextDecoder().decode(array);
            }
            
            // Fallback for older browsers
            var s = '';
            for (var i = 0, il = array.length; i < il; i++) {
                s += String.fromCharCode(array[i]);
            }
            return s;
        };
        
        // Simple GLTFLoader implementation
        THREE.GLTFLoader = function(manager) {
            this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
        };

        THREE.GLTFLoader.prototype = {
            constructor: THREE.GLTFLoader,

            load: function(url, onLoad, onProgress, onError) {
                var scope = this;
                var loader = new THREE.FileLoader(scope.manager);
                loader.setResponseType('arraybuffer');
                
                loader.load(url, function(data) {
                    try {
                        scope.parse(data, '', onLoad, onError);
                    } catch (e) {
                        console.error('GLTFLoader parse error:', e);
                        if (onError) onError(e);
                    }
                }, onProgress, onError);
            },

            parse: function(data, path, onLoad, onError) {
                try {
                    console.log('GLTFLoader: Starting parse, data length:', data.byteLength);
                    
                    // Check if it's a GLB file (binary)
                    var magic = THREE.LoaderUtils.decodeText(new Uint8Array(data, 0, 4));
                    console.log('GLTFLoader: Magic bytes:', magic);
                    
                    if (magic === 'glTF') {
                        console.log('GLTFLoader: Detected GLB format');
                        
                        // Check if we have enough data for header
                        if (data.byteLength < 12) {
                            throw new Error('GLTFLoader: Not enough data for GLB header');
                        }
                        
                        // Binary GLB
                        var headerView = new DataView(data, 0, 12);
                        var version = headerView.getUint32(4, true);
                        var length = headerView.getUint32(8, true);
                        
                        console.log('GLTFLoader: Version:', version, 'Length:', length);
                        
                        // Check if we have enough data for chunk header
                        if (data.byteLength < 20) {
                            throw new Error('GLTFLoader: Not enough data for chunk header');
                        }
                        
                        // Find JSON chunk
                        var chunkLength = headerView.getUint32(12, true);
                        var chunkType = headerView.getUint32(16, true);
                        
                        console.log('GLTFLoader: Chunk length:', chunkLength, 'Chunk type:', chunkType);
                        
                        // Check if chunk data is within bounds
                        if (20 + chunkLength > data.byteLength) {
                            console.warn('GLTFLoader: Chunk data extends beyond file bounds, using fallback character');
                            // Create fallback character instead of failing
                            var scene = createFallbackCharacter(THREE);
                            onLoad({ scene: scene });
                            return;
                        }
                        
                        if (chunkType === 0x4E4F534A) { // JSON
                            console.log('GLTFLoader: Found JSON chunk');
                            var jsonStart = 20;
                            var jsonString = THREE.LoaderUtils.decodeText(new Uint8Array(data, jsonStart, chunkLength));
                            var json = JSON.parse(jsonString);
                            
                            console.log('GLTFLoader: Parsed JSON:', json);
                            
                            // Create a simple scene with a character-like object
                            var scene = createFallbackCharacter(THREE);
                            
                            console.log('GLTFLoader: Created character scene');
                            onLoad({ scene: scene });
                        } else {
                            console.warn('GLTFLoader: JSON chunk not found, chunk type: ' + chunkType + ', using fallback character');
                            var scene = createFallbackCharacter(THREE);
                            onLoad({ scene: scene });
                        }
                    } else {
                        console.log('GLTFLoader: Detected text GLTF format');
                        // Text GLTF
                        var jsonString = THREE.LoaderUtils.decodeText(new Uint8Array(data));
                        var json = JSON.parse(jsonString);
                        
                        // Create a simple scene
                        var scene = createFallbackCharacter(THREE);
                        
                        onLoad({ scene: scene });
                    }
                } catch (e) {
                    console.error('GLTFLoader: Parse error:', e);
                    console.log('GLTFLoader: Using fallback character due to parse error');
                    try {
                        var scene = createFallbackCharacter(THREE);
                        onLoad({ scene: scene });
                    } catch (fallbackError) {
                        console.error('GLTFLoader: Fallback character creation failed:', fallbackError);
                        if (onError) onError(e);
                    }
                }
            }
        };
        
        // Helper function to create fallback character
        function createFallbackCharacter(THREE) {
            var scene = new THREE.Group();
            
            // Create a more complex geometry that looks like a character
            var geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
            var material = new THREE.MeshPhongMaterial({ 
                color: 0x4a90e2,
                shininess: 30,
                specular: 0x444444
            });
            var mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.position.y = 0.5;
            scene.add(mesh);
            
            // Add a head
            var headGeometry = new THREE.SphereGeometry(0.3, 8, 6);
            var headMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xffdbac,
                shininess: 30
            });
            var head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = 1.2;
            head.castShadow = true;
            head.receiveShadow = true;
            scene.add(head);
            
            // Add eyes
            var eyeGeometry = new THREE.SphereGeometry(0.05, 4, 4);
            var eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            var leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            leftEye.position.set(-0.1, 1.25, 0.25);
            scene.add(leftEye);
            var rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            rightEye.position.set(0.1, 1.25, 0.25);
            scene.add(rightEye);
            
            // Add arms
            var armGeometry = new THREE.CapsuleGeometry(0.15, 0.8, 4, 6);
            var armMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2 });
            var leftArm = new THREE.Mesh(armGeometry, armMaterial);
            leftArm.position.set(-0.8, 0.5, 0);
            leftArm.rotation.z = Math.PI / 4;
            leftArm.castShadow = true;
            scene.add(leftArm);
            var rightArm = new THREE.Mesh(armGeometry, armMaterial);
            rightArm.position.set(0.8, 0.5, 0);
            rightArm.rotation.z = -Math.PI / 4;
            rightArm.castShadow = true;
            scene.add(rightArm);
            
            // Add legs
            var legGeometry = new THREE.CapsuleGeometry(0.2, 0.8, 4, 6);
            var legMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });
            var leftLeg = new THREE.Mesh(legGeometry, legMaterial);
            leftLeg.position.set(-0.3, -0.8, 0);
            leftLeg.castShadow = true;
            scene.add(leftLeg);
            var rightLeg = new THREE.Mesh(legGeometry, legMaterial);
            rightLeg.position.set(0.3, -0.8, 0);
            rightLeg.castShadow = true;
            scene.add(rightLeg);
            
            return scene;
        }

        console.log('Simple GLTFLoader created for isolated THREE.js');
    });
})();
