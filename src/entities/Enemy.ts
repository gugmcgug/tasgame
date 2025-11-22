import { Entity } from './Entity'
import { Tilemap } from '../world/Tilemap'
import { RoguePlayer } from './RoguePlayer'

export class Enemy extends Entity {
  private moveDelay: number = 300 // milliseconds between moves
  private lastMoveTime: number = 0
  private aggroRange: number = 8 // tiles

  constructor(tileX: number, tileY: number, type: 'goblin' | 'orc' | 'skeleton' = 'goblin') {
    let health, attack, defense, color

    switch (type) {
      case 'goblin':
        health = 20
        attack = 5
        defense = 0
        color = '#00ff00'
        break
      case 'orc':
        health = 40
        attack = 8
        defense = 2
        color = '#ff6600'
        break
      case 'skeleton':
        health = 15
        attack = 6
        defense = 1
        color = '#cccccc'
        break
    }

    super(tileX, tileY, health, attack, defense)
    this.color = color
    this.size = 24
  }

  update(
    player: RoguePlayer,
    tilemap: Tilemap,
    currentTime: number,
    enemies: (Enemy | import('./Boss').Boss)[]
  ): { action: 'move' | 'attack' | 'idle'; target?: RoguePlayer } | null {
    // Check if enough time has passed since last move
    if (currentTime - this.lastMoveTime < this.moveDelay) {
      return null
    }

    const playerPos = player.getTilePosition()
    const distance = this.getDistanceTo(playerPos.x, playerPos.y)

    // Only chase if player is within aggro range
    if (distance > this.aggroRange) {
      return { action: 'idle' }
    }

    // Calculate direction to player
    const dx = Math.sign(playerPos.x - this.tileX)
    const dy = Math.sign(playerPos.y - this.tileY)

    // Check if adjacent to player (attack range)
    if (Math.abs(playerPos.x - this.tileX) <= 1 && Math.abs(playerPos.y - this.tileY) <= 1) {
      if (playerPos.x === this.tileX && playerPos.y === this.tileY) {
        // Same tile, try to move
        return this.tryMove(dx, dy, tilemap, enemies, currentTime)
      } else {
        // Adjacent, attack!
        this.lastMoveTime = currentTime
        return { action: 'attack', target: player }
      }
    }

    // Move towards player
    return this.tryMove(dx, dy, tilemap, enemies, currentTime)
  }

  private tryMove(
    dx: number,
    dy: number,
    tilemap: Tilemap,
    enemies: (Enemy | import('./Boss').Boss)[],
    currentTime: number
  ): { action: 'move' | 'idle' } {
    // Try to move in preferred direction
    if (this.canMove(dx, dy, tilemap, enemies)) {
      this.moveTo(dx, dy, tilemap)
      this.lastMoveTime = currentTime
      return { action: 'move' }
    }

    // Try alternative directions
    if (dx !== 0 && this.canMove(dx, 0, tilemap, enemies)) {
      this.moveTo(dx, 0, tilemap)
      this.lastMoveTime = currentTime
      return { action: 'move' }
    }

    if (dy !== 0 && this.canMove(0, dy, tilemap, enemies)) {
      this.moveTo(0, dy, tilemap)
      this.lastMoveTime = currentTime
      return { action: 'move' }
    }

    return { action: 'idle' }
  }

  private canMove(dx: number, dy: number, tilemap: Tilemap, enemies: (Enemy | import('./Boss').Boss)[]): boolean {
    const newX = this.tileX + dx
    const newY = this.tileY + dy

    // Check if walkable
    if (!tilemap.isWalkable(newX, newY)) {
      return false
    }

    // Check if another enemy is there
    for (const enemy of enemies) {
      if (enemy !== this) {
        const enemyPos = enemy.getTilePosition()
        if (enemyPos.x === newX && enemyPos.y === newY) {
          return false
        }
      }
    }

    return true
  }

  private getDistanceTo(x: number, y: number): number {
    return Math.abs(this.tileX - x) + Math.abs(this.tileY - y)
  }
}
