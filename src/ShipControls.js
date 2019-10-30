import * as THREE from 'three'

const ShipControls = function(player, mouseRelative, actions) {
  this.player = player
  const scope = this
  this.keys = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 }

  this.domElement = document

  this.mouseRelative = mouseRelative
  this.isAlive = false
  this.locked = false
  this.player.position.copy(new THREE.Vector3(0, 0, 600))
  this.playerName = ''

  this.update = function() {
    if (scope.isAlive) {
      this.player.translateZ(-1.0)
      euler.setFromQuaternion(scope.player.quaternion)

      euler.y += map(scope.mouseRelative.x, -0.5, 0.5, 0.03, -0.03)
      euler.x += map(scope.mouseRelative.y, -0.5, 0.5, 0.03, -0.03)

      euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x))

      scope.player.quaternion.setFromEuler(euler)
    }
  }

  function handleKeyDown(event) {
    if (scope.isAlive) {
      switch (event.keyCode) {
        case scope.keys.SPACE:
          scope.locked = !scope.locked
          console.log(scope.locked)
          break
        default:
          break
      }
    } else {
      const keycode = event.keyCode

      if (keycode === 13) {
        actions.spawn(true)
        scope.isAlive = true
        window.removeEventListener('keydown', handleKeyDown, false)
      } else {
        const valid =
          (keycode > 47 && keycode < 58) || // number keys
          (keycode > 64 && keycode < 91) || // letter keys
          (keycode > 95 && keycode < 112) || // numpad keys
          (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
          (keycode > 218 && keycode < 223) // [\]' (in order)
        if (keycode === 8) {
          scope.playerName = scope.playerName.substring(0, Math.max(0, scope.playerName.length - 1))
          actions.updateName(scope.playerName)
        } else if (valid) {
          scope.playerName = scope.playerName + String.fromCharCode(keycode)
          actions.updateName(scope.playerName)
        }
      }
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
