import { InputManager } from '../core/InputManager'

export class Player {
  private x: number
  private y: number
  private width: number = 32
  private height: number = 32
  private speed: number = 200 // pixels per second
  private color: string = '#646cff'

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  update(deltaTime: number, input: InputManager): void {
    const dt = deltaTime / 1000 // Convert to seconds

    // Movement
    let dx = 0
    let dy = 0

    if (input.isKeyDown('KeyW') || input.isKeyDown('ArrowUp')) {
      dy -= 1
    }
    if (input.isKeyDown('KeyS') || input.isKeyDown('ArrowDown')) {
      dy += 1
    }
    if (input.isKeyDown('KeyA') || input.isKeyDown('ArrowLeft')) {
      dx -= 1
    }
    if (input.isKeyDown('KeyD') || input.isKeyDown('ArrowRight')) {
      dx += 1
    }

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy)
      dx /= length
      dy /= length
    }

    // Apply movement
    this.x += dx * this.speed * dt
    this.y += dy * this.speed * dt
  }

  render(ctx: CanvasRenderingContext2D, _alpha: number): void {
    // Draw player square
    ctx.fillStyle = this.color
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    )

    // Draw center dot
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  clampToBounds(minX: number, minY: number, maxX: number, maxY: number): void {
    const halfWidth = this.width / 2
    const halfHeight = this.height / 2

    this.x = Math.max(minX + halfWidth, Math.min(maxX - halfWidth, this.x))
    this.y = Math.max(minY + halfHeight, Math.min(maxY - halfHeight, this.y))
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y }
  }

  setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }
}
