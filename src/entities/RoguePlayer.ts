import { Entity } from './Entity'
import { InputManager } from '../core/InputManager'
import { Tilemap } from '../world/Tilemap'
import type { Enemy } from './Enemy'
import type { Boss } from './Boss'

export class RoguePlayer extends Entity {
  private moveDelay: number = 150 // milliseconds between moves
  private lastMoveTime: number = 0

  constructor(tileX: number, tileY: number) {
    super(tileX, tileY, 100, 10, 2) // 100 HP, 10 attack, 2 defense
    this.color = '#646cff'
    this.size = 24
  }

  update(
    _deltaTime: number,
    input: InputManager,
    tilemap: Tilemap,
    currentTime: number,
    enemies: (Enemy | Boss)[]
  ): { dx: number; dy: number; attacked?: boolean } | null {
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
      // Check if there's an enemy at the target position
      const targetX = this.tileX + dx
      const targetY = this.tileY + dy

      for (const enemy of enemies) {
        const enemyPos = enemy.getTilePosition()
        if (enemyPos.x === targetX && enemyPos.y === targetY) {
          // Attack the enemy instead of moving
          this.lastMoveTime = currentTime
          return { dx, dy, attacked: true }
        }
      }

      // No enemy, try to move
      const moved = this.moveTo(dx, dy, tilemap)
      if (moved) {
        this.lastMoveTime = currentTime
        return { dx, dy, attacked: false }
      }
    }

    return null
  }
}
