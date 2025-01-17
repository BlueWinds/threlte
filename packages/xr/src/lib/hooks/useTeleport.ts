import * as THREE from 'three'
import { useThrelte } from '@threlte/core'

const quaternion = new THREE.Quaternion()
const offset = { x: 0, y: 0, z: 0 }

/**
 * Returns a callback to teleport the player from the world origin to a position and optional orientation.
 *
 * @example
 * const teleport = useTeleport()
 * const vec3 = new THREE.Vector3()
 *
 * vec3.set(5, 0, 5)
 *
 * teleport(vec3)
 * 
 * const quat = new THREE.Quaternion()
 * 
 * teleport(vec3, quat)
 */
export const useTeleport = () => {
  const { xr } = useThrelte().renderer
  let space = xr.getReferenceSpace()

  /**
   * Teleports a player from the world origin to a position and optional orientation.
   */
  return (position: THREE.Vector3 | THREE.Vector3Tuple, orientation = quaternion) => {
    space ??= xr.getReferenceSpace()

    if (space === null) return

    if (Array.isArray(position)) {
      offset.x = -position[0]
      offset.y = -position[1]
      offset.z = -position[2]
    } else {
      offset.x = -position.x
      offset.y = -position.y
      offset.z = -position.z
    }

    const pose = xr.getFrame()?.getViewerPose(space)
    if (pose !== undefined) {
      offset.x += pose.transform.position.x
      offset.z += pose.transform.position.z
    }

    const teleportOffset = new XRRigidTransform(offset, orientation)
    xr.setReferenceSpace(space.getOffsetReferenceSpace(teleportOffset))
  }
}
