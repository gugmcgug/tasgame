import { Scene } from '../core/Scene'
import { InputManager } from '../core/InputManager'
import { Player } from '../entities/Player'

export class PlayScene extends Scene {
  private player: Player
  private score: number = 0
  private gameTime: number = 0

  constructor(
    width: number,
    height: number,
    private onPause?: () => void,
    private onGameOver?: (score: number) => void
  ) {
    super(width, height)
    this.player = new Player(width / 2, height / 2)
  }

  onEnter(): void {
    console.log('▶️  PlayScene entered')
    // Reset game state
    this.score = 0
    this.gameTime = 0
    this.player.setPosition(this.width / 2, this.height / 2)
  }

  onExit(): void {
    console.log('⏹️  PlayScene exited')
  }

  update(deltaTime: number, input: InputManager): void {
    // Check for pause
    if (input.isKeyPressed('Escape')) {
      if (this.onPause) {
        this.onPause()
      }
      return
    }

    // Update game time and score
    this.gameTime += deltaTime
    this.score = Math.floor(this.gameTime / 1000)

    // Update player
    this.player.update(deltaTime, input)

    // Keep player in bounds
    this.player.clampToBounds(0, 0, this.width, this.height)

    // Demo: Press 'G' to trigger game over (for testing)
    if (input.isKeyPressed('KeyG')) {
      if (this.onGameOver) {
        this.onGameOver(this.score)
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, alpha: number): void {
    // Render background
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, this.width, this.height)

    // Draw grid
    this.drawGrid(ctx)

    // Render player
    this.player.render(ctx, alpha)

    // Render score
    this.renderScore(ctx)

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
    ctx.fillText('Use WASD or Arrow Keys to move | ESC to pause | G for game over (demo)', this.width / 2, this.height - 30)
  }

  renderScore(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#ffffff'
    ctx.font = '20px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`Score: ${this.score}`, 10, 50)
  }

  getScore(): number {
    return this.score
  }
}
