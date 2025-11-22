import { Entity } from './Entity'
import { Tilemap } from '../world/Tilemap'
import { RoguePlayer } from './RoguePlayer'
import { Enemy } from './Enemy'

export class Boss extends Entity {
  private moveDelay: number = 250 // Slower but deliberate
  private lastMoveTime: number = 0
  private aggroRange: number = 15 // Larger detection range
  private name: string

  constructor(tileX: number, tileY: number, floor: number = 5) {
    // Scale boss stats with floor
    const baseHealth = 100
    const healthPerFloor = 20
    const health = baseHealth + (floor - 5) * healthPerFloor

    const baseAttack = 15
    const attackPerFloor = 3
    const attack = baseAttack + Math.floor((floor - 5) / 2) * attackPerFloor

    const defense = 5 + Math.floor(floor / 5)

    super(tileX, tileY, health, attack, defense)

    this.color = '#ff0000' // Red for boss
    this.size = 32 // Larger than normal enemies
    this.name = this.generateBossName(floor)

    console.log(`👹 Boss spawned: ${this.name} (HP: ${health}, ATK: ${attack}, DEF: ${defense})`)
  }

  private generateBossName(_floor: number): string {
    const titles = ['Corrupted', 'Ancient', 'Vengeful', 'Cursed', 'Eternal']
    const names = ['Guardian', 'Warlord', 'Sorcerer', 'Beast', 'Tyrant']

    const title = titles[Math.floor(Math.random() * titles.length)]
    const name = names[Math.floor(Math.random() * names.length)]

    return `${title} ${name}`
  }

  getName(): string {
    return this.name
  }

  update(
    player: RoguePlayer,
    tilemap: Tilemap,
    currentTime: number,
    enemies: (Enemy | Boss)[]
  ): { action: 'move' | 'attack' | 'idle'; target?: RoguePlayer } | null {
    // Check if enough time has passed since last move
    if (currentTime - this.lastMoveTime < this.moveDelay) {
      return null
    }

    const playerPos = player.getTilePosition()
    const distance = this.getDistanceTo(playerPos.x, playerPos.y)

    // Always aggro (bosses don't ignore you)
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
    enemies: (Enemy | Boss)[],
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

  private canMove(dx: number, dy: number, tilemap: Tilemap, enemies: (Enemy | Boss)[]): boolean {
    const newX = this.tileX + dx
    const newY = this.tileY + dy

    // Check if walkable
    if (!tilemap.isWalkable(newX, newY)) {
      return false
    }

    // Check if another enemy is there
    for (const enemy of enemies) {
      const enemyPos = enemy.getTilePosition()
      if (enemyPos.x === newX && enemyPos.y === newY) {
        return false
      }
    }

    return true
  }

  private getDistanceTo(x: number, y: number): number {
    return Math.abs(this.tileX - x) + Math.abs(this.tileY - y)
  }

  // Override render to show boss differently
  render(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0): void {
    // Draw boss with extra visual flair
    ctx.fillStyle = this.color
    ctx.fillRect(
      this.worldX - this.size / 2 + offsetX,
      this.worldY - this.size / 2 + offsetY,
      this.size,
      this.size
    )

    // Add glow effect
    ctx.strokeStyle = '#ff6600'
    ctx.lineWidth = 3
    ctx.strokeRect(
      this.worldX - this.size / 2 + offsetX,
      this.worldY - this.size / 2 + offsetY,
      this.size,
      this.size
    )

    // Draw health bar
    const healthBarWidth = this.size
    const healthBarHeight = 6
    const healthPercentage = this.stats.getHealthPercentage()

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(
      this.worldX - healthBarWidth / 2 + offsetX,
      this.worldY - this.size / 2 - 12 + offsetY,
      healthBarWidth,
      healthBarHeight
    )

    // Health
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(
      this.worldX - healthBarWidth / 2 + offsetX,
      this.worldY - this.size / 2 - 12 + offsetY,
      healthBarWidth * healthPercentage,
      healthBarHeight
    )

    // Boss name
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 10px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(
      this.name,
      this.worldX + offsetX,
      this.worldY - this.size / 2 - 18 + offsetY
    )
  }
}
