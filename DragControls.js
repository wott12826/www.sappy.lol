// DragControls for Three.js
// Based on Three.js DragControls implementation

(function() {
  'use strict';

  function DragControls(objects, camera, domElement) {
    this.objects = objects;
    this.camera = camera;
    this.domElement = domElement;

    this.enabled = true;
    this.transformGroup = false;

    this.mouse = new THREE.Vector2();
    this.offset = new THREE.Vector3();
    this.intersected = null;
    this.selected = null;
    this.plane = new THREE.Plane();
    this.raycaster = new THREE.Raycaster();

    this.activate();
  }

  DragControls.prototype = {
    constructor: DragControls,

    activate: function() {
      this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
      this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
      this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    },

    deactivate: function() {
      this.domElement.removeEventListener('mousedown', this.onMouseDown.bind(this), false);
      this.domElement.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
      this.domElement.removeEventListener('mouseup', this.onMouseUp.bind(this), false);
    },

    dispose: function() {
      this.deactivate();
    },

    onMouseDown: function(event) {
      event.preventDefault();

      if (this.enabled === false) return;

      var rect = this.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      var intersects = this.raycaster.intersectObjects(this.objects, this.transformGroup);

      if (intersects.length > 0) {
        this.selected = intersects[0].object;

        this.plane.setFromNormalAndCoplanarPoint(
          this.camera.getWorldDirection(this.plane.normal),
          this.selected.position
        );

        this.offset.subVectors(this.selected.position, this.raycaster.ray.origin).projectOn(this.plane.normal).multiplyScalar(-1);

        this.domElement.style.cursor = 'grabbing';
      }
    },

    onMouseMove: function(event) {
      event.preventDefault();

      if (this.enabled === false) return;

      var rect = this.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      if (this.selected && this.enabled) {
        var intersection = this.raycaster.ray.intersectPlane(this.plane, new THREE.Vector3());
        this.selected.position.copy(intersection.sub(this.offset));
      }
    },

    onMouseUp: function(event) {
      event.preventDefault();

      if (this.selected) {
        this.selected = null;
        this.domElement.style.cursor = 'grab';
      }
    }
  };

  // Add to THREE namespace
  if (typeof THREE !== 'undefined') {
    THREE.DragControls = DragControls;
  } else {
    // Wait for THREE to be available
    window.addEventListener('load', function() {
      if (typeof THREE !== 'undefined') {
        THREE.DragControls = DragControls;
      }
    });
  }
})(); 