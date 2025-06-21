/**
 * @author fernandojsg / http://fernandojsg.com
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 * @author bhouston / http://exocortex.com
 * @author Joe Pea / http://github.com/trusktr
 */

// Simple GLTFLoader for isolated THREE.js
(function() {
    // Use isolated THREE if available
    var THREE = window.Sappy3D && window.Sappy3D.THREE ? window.Sappy3D.THREE : (typeof THREE !== 'undefined' ? THREE : null);

    if (!THREE) {
        console.error('GLTFLoader: THREE is not available');
        return;
    }

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
                    if (onError) onError(e);
                }
            }, onProgress, onError);
        },

        parse: function(data, path, onLoad, onError) {
            try {
                // Simple GLB parsing
                var magic = THREE.LoaderUtils.decodeText(new Uint8Array(data, 0, 4));
                
                if (magic === 'glTF') {
                    // Binary GLB
                    var headerView = new DataView(data, 0, 12);
                    var version = headerView.getUint32(4, true);
                    var length = headerView.getUint32(8, true);
                    
                    // Find JSON chunk
                    var chunkLength = headerView.getUint32(12, true);
                    var chunkType = headerView.getUint32(16, true);
                    
                    if (chunkType === 0x4E4F534A) { // JSON
                        var jsonStart = 20;
                        var jsonString = THREE.LoaderUtils.decodeText(new Uint8Array(data, jsonStart, chunkLength));
                        var json = JSON.parse(jsonString);
                        
                        // Create a simple scene
                        var scene = new THREE.Group();
                        
                        // Add a simple cube as placeholder
                        var geometry = new THREE.BoxGeometry(1, 1, 1);
                        var material = new THREE.MeshBasicMaterial({ color: 0x888888 });
                        var mesh = new THREE.Mesh(geometry, material);
                        scene.add(mesh);
                        
                        onLoad({ scene: scene });
                    } else {
                        throw new Error('GLTFLoader: JSON chunk not found');
                    }
                } else {
                    // Text GLTF
                    var jsonString = THREE.LoaderUtils.decodeText(new Uint8Array(data));
                    var json = JSON.parse(jsonString);
                    
                    // Create a simple scene
                    var scene = new THREE.Group();
                    
                    // Add a simple cube as placeholder
                    var geometry = new THREE.BoxGeometry(1, 1, 1);
                    var material = new THREE.MeshBasicMaterial({ color: 0x888888 });
                    var mesh = new THREE.Mesh(geometry, material);
                    scene.add(mesh);
                    
                    onLoad({ scene: scene });
                }
            } catch (e) {
                if (onError) onError(e);
            }
        }
    };

    console.log('Simple GLTFLoader created for isolated THREE.js');
})();
