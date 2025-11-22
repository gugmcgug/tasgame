import { Scene } from '../core/Scene'
import { InputManager } from '../core/InputManager'
import { Button } from '../ui/Button'

export class PauseScene extends Scene {
  private resumeButton: Button
  private menuButton: Button

  constructor(
    width: number,
    height: number,
    private onResume: () => void,
    private onMenu: () => void
  ) {
    super(width, height)

    // Create resume button
    this.resumeButton = new Button({
      x: width / 2 - 120,
      y: height / 2 - 40,
      width: 240,
      height: 60,
      text: 'Resume',
      onClick: () => {
        this.onResume()
      },
    })

    // Create menu button
    this.menuButton = new Button({
      x: width / 2 - 120,
      y: height / 2 + 40,
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
    console.log('⏸️  PauseScene entered')
  }

  onExit(): void {
    console.log('▶️  PauseScene exited')
  }

  update(_deltaTime: number, input: InputManager): void {
    this.resumeButton.update(input)
    this.menuButton.update(input)

    // Resume on ESC or Enter
    if (input.isKeyPressed('Escape') || input.isKeyPressed('Enter')) {
      this.onResume()
    }
  }

  render(ctx: CanvasRenderingContext2D, _alpha: number): void {
    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, this.width, this.height)

    // Draw pause title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('PAUSED', this.width / 2, this.height / 2 - 120)

    // Draw buttons
    this.resumeButton.render(ctx)
    this.menuButton.render(ctx)

    // Draw instructions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = '14px monospace'
    ctx.fillText('Press ESC or ENTER to resume', this.width / 2, this.height - 40)
  }
}
