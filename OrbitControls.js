// OrbitControls for isolated THREE.js
(function() {
	// Use isolated THREE if available
	var THREE = window.Sappy3D && window.Sappy3D.THREE ? window.Sappy3D.THREE : (typeof THREE !== 'undefined' ? THREE : null);

	if (!THREE) {
		console.error('OrbitControls: THREE is not available');
		return;
	}

	// Simple OrbitControls implementation
	THREE.OrbitControls = function(object, domElement) {
		this.object = object;
		this.domElement = domElement;
		
		// Set to false to disable this control
		this.enabled = true;
		
		// "target" sets the location of focus, where the object orbits around
		this.target = new THREE.Vector3();
		
		// How far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;
		
		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;
		
		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians
		
		// How far you can orbit horizontally, upper and lower limits.
		// If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians
		
		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.05;
		
		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;
		
		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;
		
		// Set to false to disable panning
		this.enablePan = true;
		this.panSpeed = 1.0;
		this.screenSpacePanning = true; // if false, pan orthogonal to world-space direction camera.up
		
		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60
		
		// The four arrow keys
		this.enableKeys = true;
		this.keyPanSpeed = 7.0; // pixels moved per arrow key push
		
		// Mouse buttons
		this.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
		
		// Touch fingers
		this.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
		
		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;
		
		// the target DOM element for key events
		this._domElementKeyEvents = null;
		
		// Current position in spherical coordinate system.
		this.spherical = new THREE.Spherical();
		this.sphericalDelta = new THREE.Spherical();
		
		this.scale = 1;
		this.panOffset = new THREE.Vector3();
		this.zoomChanged = false;
		
		this.rotateStart = new THREE.Vector2();
		this.rotateEnd = new THREE.Vector2();
		this.rotateDelta = new THREE.Vector2();
		
		this.panStart = new THREE.Vector2();
		this.panEnd = new THREE.Vector2();
		this.panDelta = new THREE.Vector2();
		
		this.dollyStart = new THREE.Vector2();
		this.dollyEnd = new THREE.Vector2();
		this.dollyDelta = new THREE.Vector2();
		
		this.update = function() {
			var offset = new THREE.Vector3();
			
			// so camera.up is the orbit axis
			var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
			var quatInverse = quat.clone().invert();
			
			offset.copy(this.target).sub(object.position);
			
			// rotate offset to "y-axis-is-up" space
			offset.applyQuaternion(quat);
			
			// angle from z-axis around y-axis
			this.spherical.setFromVector3(offset);
			
			if (this.autoRotate && this.state === THREE.OrbitControls.STATE.NONE) {
				this.rotateLeft(this.getAutoRotationAngle());
			}
			
			this.spherical.theta += this.sphericalDelta.theta;
			this.spherical.phi += this.sphericalDelta.phi;
			
			// restrict theta to be between desired limits
			this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta));
			
			// restrict phi to be between desired limits
			this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));
			
			this.spherical.makeSafe();
			
			this.spherical.radius *= this.scale;
			
			// restrict radius to be between desired limits
			this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
			
			// move target to panned location
			this.target.add(this.panOffset);
			
			offset.setFromSpherical(this.spherical);
			
			// rotate offset back to "camera-up-vector-is-up" space
			offset.applyQuaternion(quatInverse);
			
			object.position.copy(this.target).add(offset);
			
			object.lookAt(this.target);
			
			if (this.enableDamping === true) {
				this.sphericalDelta.theta *= (1 - this.dampingFactor);
				this.sphericalDelta.phi *= (1 - this.dampingFactor);
				this.panOffset.multiplyScalar(1 - this.dampingFactor);
			} else {
				this.sphericalDelta.set(0, 0, 0);
				this.panOffset.set(0, 0, 0);
			}
			
			this.scale = 1;
			
			// update condition is:
			// min(camera displacement, camera rotation in radians)^2 > EPS
			// using small-angle approximation cos(x/2) = 1 - x^2 / 8
			
			if (this.zoomChanged ||
				this.lastPosition.distanceToSquared(object.position) > this.EPS ||
				8 * (1 - this.lastQuaternion.dot(object.quaternion)) > this.EPS) {
				
				this.dispatchEvent(this.changeEvent);
				
				this.lastPosition.copy(object.position);
				this.lastQuaternion.copy(object.quaternion);
				this.zoomChanged = false;
				
				return true;
			}
			
			return false;
		};
		
		this.getAutoRotationAngle = function() {
			return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
		};
		
		this.rotateLeft = function(angle) {
			this.sphericalDelta.theta -= angle;
		};
		
		this.rotateUp = function(angle) {
			this.sphericalDelta.phi -= angle;
		};
		
		this.panLeft = function(distance, objectMatrix) {
			var v = new THREE.Vector3();
			v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
			v.multiplyScalar(- distance);
			this.panOffset.add(v);
		};
		
		this.panUp = function(distance, objectMatrix) {
			var v = new THREE.Vector3();
			if (this.screenSpacePanning === true) {
				v.setFromMatrixColumn(objectMatrix, 1);
			} else {
				v.setFromMatrixColumn(objectMatrix, 0);
				v.crossVectors(object.up, v);
			}
			v.multiplyScalar(distance);
			this.panOffset.add(v);
		};
		
		this.pan = function(deltaX, deltaY) {
			var element = this.domElement === document ? this.domElement.body : this.domElement;
			
			if (this.object.isPerspectiveCamera) {
				// perspective
				var position = this.object.position;
				var offset = new THREE.Vector3();
				var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
				var quatInverse = quat.clone().invert();
				
				offset.copy(position).sub(this.target);
				offset.applyQuaternion(quat);
				
				var distance = offset.length();
				
				// half of the fov is center to top of screen
				distance *= Math.tan((this.object.fov / 2) * Math.PI / 180.0);
				
				// we use only clientHeight here so aspect ratio does not distort speed
				this.panLeft(2 * deltaX * distance / element.clientHeight, this.object.matrix);
				this.panUp(2 * deltaY * distance / element.clientHeight, this.object.matrix);
			} else if (this.object.isOrthographicCamera) {
				// orthographic
				this.panLeft(deltaX * (this.object.right - this.object.left) / this.object.zoom / element.clientWidth, this.object.matrix);
				this.panUp(deltaY * (this.object.top - this.object.bottom) / this.object.zoom / element.clientHeight, this.object.matrix);
			} else {
				// camera neither orthographic nor perspective
				console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
				this.enablePan = false;
			}
		};
		
		this.dollyIn = function(dollyScale) {
			if (this.object.isPerspectiveCamera) {
				this.scale /= dollyScale;
			} else if (this.object.isOrthographicCamera) {
				this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom * dollyScale));
				this.object.updateProjectionMatrix();
				this.zoomChanged = true;
			} else {
				console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly disabled.');
				this.enableZoom = false;
			}
		};
		
		this.dollyOut = function(dollyScale) {
			if (this.object.isPerspectiveCamera) {
				this.scale *= dollyScale;
			} else if (this.object.isOrthographicCamera) {
				this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / dollyScale));
				this.object.updateProjectionMatrix();
				this.zoomChanged = true;
			} else {
				console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly disabled.');
				this.enableZoom = false;
			}
		};
		
		this.update = function() {
			var offset = new THREE.Vector3();
			
			// so camera.up is the orbit axis
			var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
			var quatInverse = quat.clone().invert();
			
			offset.copy(this.target).sub(object.position);
			
			// rotate offset to "y-axis-is-up" space
			offset.applyQuaternion(quat);
			
			// angle from z-axis around y-axis
			this.spherical.setFromVector3(offset);
			
			if (this.autoRotate && this.state === THREE.OrbitControls.STATE.NONE) {
				this.rotateLeft(this.getAutoRotationAngle());
			}
			
			this.spherical.theta += this.sphericalDelta.theta;
			this.spherical.phi += this.sphericalDelta.phi;
			
			// restrict theta to be between desired limits
			this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta));
			
			// restrict phi to be between desired limits
			this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));
			
			this.spherical.makeSafe();
			
			this.spherical.radius *= this.scale;
			
			// restrict radius to be between desired limits
			this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
			
			// move target to panned location
			this.target.add(this.panOffset);
			
			offset.setFromSpherical(this.spherical);
			
			// rotate offset back to "camera-up-vector-is-up" space
			offset.applyQuaternion(quatInverse);
			
			object.position.copy(this.target).add(offset);
			
			object.lookAt(this.target);
			
			if (this.enableDamping === true) {
				this.sphericalDelta.theta *= (1 - this.dampingFactor);
				this.sphericalDelta.phi *= (1 - this.dampingFactor);
				this.panOffset.multiplyScalar(1 - this.dampingFactor);
			} else {
				this.sphericalDelta.set(0, 0, 0);
				this.panOffset.set(0, 0, 0);
			}
			
			this.scale = 1;
			
			return true;
		};
		
		this.reset = function() {
			this.target.copy(this.target0);
			this.object.position.copy(this.position0);
			this.object.zoom = this.zoom0;
			
			this.object.updateProjectionMatrix();
			
			this.dispatchEvent(this.changeEvent);
			
			this.update();
			
			this.state = THREE.OrbitControls.STATE.NONE;
		};
		
		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function() {
			var offset = new THREE.Vector3();
			
			// so camera.up is the orbit axis
			var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
			var quatInverse = quat.clone().invert();
			
			offset.copy(this.target).sub(object.position);
			
			// rotate offset to "y-axis-is-up" space
			offset.applyQuaternion(quat);
			
			// angle from z-axis around y-axis
			this.spherical.setFromVector3(offset);
			
			if (this.autoRotate && this.state === THREE.OrbitControls.STATE.NONE) {
				this.rotateLeft(this.getAutoRotationAngle());
			}
			
			this.spherical.theta += this.sphericalDelta.theta;
			this.spherical.phi += this.sphericalDelta.phi;
			
			// restrict theta to be between desired limits
			this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta));
			
			// restrict phi to be between desired limits
			this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));
			
			this.spherical.makeSafe();
			
			this.spherical.radius *= this.scale;
			
			// restrict radius to be between desired limits
			this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
			
			// move target to panned location
			this.target.add(this.panOffset);
			
			offset.setFromSpherical(this.spherical);
			
			// rotate offset back to "camera-up-vector-is-up" space
			offset.applyQuaternion(quatInverse);
			
			object.position.copy(this.target).add(offset);
			
			object.lookAt(this.target);
			
			if (this.enableDamping === true) {
				this.sphericalDelta.theta *= (1 - this.dampingFactor);
				this.sphericalDelta.phi *= (1 - this.dampingFactor);
				this.panOffset.multiplyScalar(1 - this.dampingFactor);
			} else {
				this.sphericalDelta.set(0, 0, 0);
				this.panOffset.set(0, 0, 0);
			}
			
			this.scale = 1;
			
			return true;
		};
		
		this.dispose = function() {
			this.domElement.removeEventListener('contextmenu', this.onContextMenu, false);
			this.domElement.removeEventListener('pointerdown', this.onPointerDown, false);
			this.domElement.removeEventListener('wheel', this.onMouseWheel, false);
			this.domElement.removeEventListener('touchstart', this.onTouchStart, false);
			
			this.domElement.ownerDocument.removeEventListener('pointermove', this.onPointerMove, false);
			this.domElement.ownerDocument.removeEventListener('pointerup', this.onPointerUp, false);
			
			window.removeEventListener('keydown', this.onKeyDown, false);
			
			//this.dispatchEvent( { type: 'dispose' } ); // should this be added here?
		};
		
		// Set up initial state
		this.target.copy(this.target0);
		this.object.position.copy(this.position0);
		this.object.zoom = this.zoom0;
		
		this.object.updateProjectionMatrix();
		
		this.update();
		
		this.state = THREE.OrbitControls.STATE.NONE;
		
		// Constants
		this.EPS = 0.000001;
		
		// Events
		this.changeEvent = { type: 'change' };
		this.startEvent = { type: 'start' };
		this.endEvent = { type: 'end' };
		
		// States
		this.STATE = {
			NONE: - 1,
			ROTATE: 0,
			DOLLY: 1,
			PAN: 2,
			TOUCH_ROTATE: 3,
			TOUCH_PAN: 4,
			TOUCH_DOLLY_PAN: 5,
			TOUCH_DOLLY_ROTATE: 6
		};
		
		this.state = this.STATE.NONE;
		
		console.log('Simple OrbitControls created for isolated THREE.js');
	};

})();
