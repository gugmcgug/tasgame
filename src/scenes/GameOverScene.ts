import { Scene } from '../core/Scene'
import { InputManager } from '../core/InputManager'
import { Button } from '../ui/Button'

export class GameOverScene extends Scene {
  private restartButton: Button
  private menuButton: Button
  private score: number

  constructor(
    width: number,
    height: number,
    score: number,
    private onRestart: () => void,
    private onMenu: () => void
  ) {
    super(width, height)
    this.score = score

    // Create restart button
    this.restartButton = new Button({
      x: width / 2 - 120,
      y: height / 2 + 20,
      width: 240,
      height: 60,
      text: 'Play Again',
      onClick: () => {
        this.onRestart()
      },
    })

    // Create menu button
    this.menuButton = new Button({
      x: width / 2 - 120,
      y: height / 2 + 100,
      width: 240,
      height: 60,
      text: 'Main Menu',
      onClick: () => {
        this.onMenu()
      },
      backgroundColor: '#555555',
      hoverColor: '#666666',
    })
  }

  onEnter(): void {
    console.log('💀 GameOverScene entered')
  }

  onExit(): void {
    console.log('⏹️  GameOverScene exited')
  }

  update(_deltaTime: number, input: InputManager): void {
    this.restartButton.update(input)
    this.menuButton.update(input)

    // Quick restart with Enter/Space
    if (input.isKeyPressed('Enter') || input.isKeyPressed('Space')) {
      this.onRestart()
    }
  }

  render(ctx: CanvasRenderingContext2D, _alpha: number): void {
    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height)
    gradient.addColorStop(0, '#1a0a0a')
    gradient.addColorStop(1, '#2a1a1a')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, this.width, this.height)

    // Draw "Game Over" title with red glow
    ctx.fillStyle = '#ff4444'
    ctx.font = 'bold 64px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = '#ff0000'
    ctx.shadowBlur = 30
    ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 100)
    ctx.shadowBlur = 0

    // Draw score
    ctx.fillStyle = '#ffffff'
    ctx.font = '24px monospace'
    ctx.fillText(`Score: ${this.score}`, this.width / 2, this.height / 2 - 40)

    // Draw buttons
    this.restartButton.render(ctx)
    this.menuButton.render(ctx)

    // Draw instructions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.font = '14px monospace'
    ctx.fillText(
      'Press ENTER or SPACE to play again',
      this.width / 2,
      this.height - 40
    )
  }
}
