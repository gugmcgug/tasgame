import { Stats } from './Stats'
import { Tilemap } from '../world/Tilemap'

export abstract class Entity {
  protected tileX: number
  protected tileY: number
  protected worldX: number
  protected worldY: number
  protected stats: Stats
  protected color: string = '#ffffff'
  protected size: number = 24

  constructor(tileX: number, tileY: number, maxHealth: number, attack: number, defense: number) {
    this.tileX = tileX
    this.tileY = tileY
    this.worldX = 0
    this.worldY = 0
    this.stats = new Stats(maxHealth, attack, defense)
  }

  getTilePosition(): { x: number; y: number } {
    return { x: this.tileX, y: this.tileY }
  }

  setTilePosition(x: number, y: number, tilemap: Tilemap): void {
    this.tileX = x
    this.tileY = y
    const worldPos = tilemap.tileToWorld(x, y)
    this.worldX = worldPos.x
    this.worldY = worldPos.y
  }

  moveTo(dx: number, dy: number, tilemap: Tilemap): boolean {
    const newX = this.tileX + dx
    const newY = this.tileY + dy

    if (tilemap.isWalkable(newX, newY)) {
      this.setTilePosition(newX, newY, tilemap)
      return true
    }
    return false
  }

  getStats(): Stats {
    return this.stats
  }

  attack(target: Entity): number {
    const damage = this.stats.attack
    const actualDamage = target.stats.takeDamage(damage)
    return actualDamage
  }

  render(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0): void {
    // Draw entity
    ctx.fillStyle = this.color
    ctx.fillRect(
      this.worldX - this.size / 2 + offsetX,
      this.worldY - this.size / 2 + offsetY,
      this.size,
      this.size
    )

    // Draw health bar
    const healthBarWidth = this.size
    const healthBarHeight = 4
    const healthPercentage = this.stats.getHealthPercentage()

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(
      this.worldX - healthBarWidth / 2 + offsetX,
      this.worldY - this.size / 2 - 8 + offsetY,
      healthBarWidth,
      healthBarHeight
    )

    // Health
    ctx.fillStyle = healthPercentage > 0.5 ? '#00ff00' : healthPercentage > 0.25 ? '#ffaa00' : '#ff0000'
    ctx.fillRect(
      this.worldX - healthBarWidth / 2 + offsetX,
      this.worldY - this.size / 2 - 8 + offsetY,
      healthBarWidth * healthPercentage,
      healthBarHeight
    )
  }
}
