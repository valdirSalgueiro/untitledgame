import * as THREE from 'three'

const ShipControls = function(object, mutation) {
  this.object = object
  const scope = this
  this.keys = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 }

  this.domElement = document

  this.mutation = mutation
  this.locked = false

  this.update = function() {
    if (!scope.locked) {
      this.object.translateZ(-1.0)
      euler.setFromQuaternion(scope.object.quaternion)

      euler.y += map(scope.mutation.mouseRelative.x, -0.5, 0.5, 0.03, -0.03)
      euler.x += map(scope.mutation.mouseRelative.y, -0.5, 0.5, 0.03, -0.03)

      euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x))

      scope.object.quaternion.setFromEuler(euler)
    }
  }

  function handleKeyDown(event) {
    switch (event.keyCode) {
      case scope.keys.SPACE:
        scope.locked = !scope.locked
        console.log(scope.locked)
        break
      default:
        break
    }
  }

  const euler = new THREE.Euler(0, 0, 0, 'YXZ')

  const PI_2 = Math.PI / 2

  function map(x, inMin, inMax, outMin, outMax) {
    return ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  }
  window.addEventListener('keydown', handleKeyDown, false)
}

ShipControls.prototype = Object.create(THREE.EventDispatcher.prototype)
ShipControls.prototype.constructor = ShipControls

Object.defineProperties(ShipControls.prototype, {})
export { ShipControls }
