import { Scene } from '../core/Scene'
import { InputManager } from '../core/InputManager'
import { Player } from '../entities/Player'

export class PlayScene extends Scene {
  private player: Player

  constructor(width: number, height: number) {
    super(width, height)
    this.player = new Player(width / 2, height / 2)
  }

  onEnter(): void {
    console.log('▶️  PlayScene entered')
  }

  onExit(): void {
    console.log('⏹️  PlayScene exited')
  }

  update(deltaTime: number, input: InputManager): void {
    this.player.update(deltaTime, input)

    // Keep player in bounds
    this.player.clampToBounds(0, 0, this.width, this.height)
  }

  render(ctx: CanvasRenderingContext2D, alpha: number): void {
    // Render background
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, this.width, this.height)

    // Draw grid
    this.drawGrid(ctx)

    // Render player
    this.player.render(ctx, alpha)

    // Render instructions
    this.renderInstructions(ctx)
  }

  private drawGrid(ctx: CanvasRenderingContext2D): void {
    const gridSize = 50
    ctx.strokeStyle = 'rgba(100, 108, 255, 0.1)'
    ctx.lineWidth = 1

    // Vertical lines
    for (let x = 0; x <= this.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.height)
      ctx.stroke()
    }

    // Horizontal lines
    for (let y = 0; y <= this.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(this.width, y)
      ctx.stroke()
    }
  }

  private renderInstructions(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#ffffff'
    ctx.font = '16px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('Use WASD or Arrow Keys to move', this.width / 2, this.height - 30)
  }
}
