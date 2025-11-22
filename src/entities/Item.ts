import { Tilemap } from '../world/Tilemap'

export type ItemType = 'health_potion' | 'gold'

export class Item {
  private tileX: number
  private tileY: number
  private worldX: number
  private worldY: number
  private type: ItemType
  private color: string
  private collected: boolean = false

  constructor(tileX: number, tileY: number, type: ItemType) {
    this.tileX = tileX
    this.tileY = tileY
    this.type = type
    this.worldX = 0
    this.worldY = 0

    switch (type) {
      case 'health_potion':
        this.color = '#ff0066'
        break
      case 'gold':
        this.color = '#ffdd00'
        break
    }
  }

  setWorldPosition(tilemap: Tilemap): void {
    const worldPos = tilemap.tileToWorld(this.tileX, this.tileY)
    this.worldX = worldPos.x
    this.worldY = worldPos.y
  }

  getTilePosition(): { x: number; y: number } {
    return { x: this.tileX, y: this.tileY }
  }

  getType(): ItemType {
    return this.type
  }

  isCollected(): boolean {
    return this.collected
  }

  collect(): void {
    this.collected = true
  }

  render(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0): void {
    if (this.collected) return

    const size = 16

    // Draw item
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(
      this.worldX + offsetX,
      this.worldY + offsetY,
      size / 2,
      0,
      Math.PI * 2
    )
    ctx.fill()

    // Add glow
    ctx.strokeStyle = this.color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(
      this.worldX + offsetX,
      this.worldY + offsetY,
      size / 2 + 2,
      0,
      Math.PI * 2
    )
    ctx.stroke()
  }
}
