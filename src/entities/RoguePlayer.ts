import { Entity } from './Entity'
import { InputManager } from '../core/InputManager'
import { Tilemap } from '../world/Tilemap'

export class RoguePlayer extends Entity {
  private moveDelay: number = 150 // milliseconds between moves
  private lastMoveTime: number = 0

  constructor(tileX: number, tileY: number) {
    super(tileX, tileY, 100, 10, 2) // 100 HP, 10 attack, 2 defense
    this.color = '#646cff'
    this.size = 24
  }

  update(_deltaTime: number, input: InputManager, tilemap: Tilemap, currentTime: number): { dx: number; dy: number } | null {
    // Check if enough time has passed since last move
    if (currentTime - this.lastMoveTime < this.moveDelay) {
      return null
    }

    let dx = 0
    let dy = 0

    // Grid-based movement
    if (input.isKeyDown('KeyW') || input.isKeyDown('ArrowUp')) {
      dy = -1
    } else if (input.isKeyDown('KeyS') || input.isKeyDown('ArrowDown')) {
      dy = 1
    } else if (input.isKeyDown('KeyA') || input.isKeyDown('ArrowLeft')) {
      dx = -1
    } else if (input.isKeyDown('KeyD') || input.isKeyDown('ArrowRight')) {
      dx = 1
    }

    if (dx !== 0 || dy !== 0) {
      const moved = this.moveTo(dx, dy, tilemap)
      if (moved) {
        this.lastMoveTime = currentTime
        return { dx, dy }
      }
    }

    return null
  }
}
