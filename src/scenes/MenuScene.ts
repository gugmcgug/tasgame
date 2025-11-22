import { Scene } from '../core/Scene'
import { InputManager } from '../core/InputManager'
import { Button } from '../ui/Button'

export class MenuScene extends Scene {
  private startButton: Button
  private particles: { x: number; y: number; vx: number; vy: number; size: number }[] = []

  constructor(width: number, height: number, private onStartGame: () => void) {
    super(width, height)

    // Create start button
    this.startButton = new Button({
      x: width / 2 - 120,
      y: height / 2 + 40,
      width: 240,
      height: 60,
      text: 'Start Game',
      onClick: () => {
        this.onStartGame()
      },
    })

    // Create background particles
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
      })
    }
  }

  onEnter(): void {
    console.log('▶️  MenuScene entered')
  }

  onExit(): void {
    console.log('⏹️  MenuScene exited')
  }

  update(_deltaTime: number, input: InputManager): void {
    this.startButton.update(input)

    // Update particles
    for (const particle of this.particles) {
      particle.x += particle.vx
      particle.y += particle.vy

      // Wrap around screen
      if (particle.x < 0) particle.x = this.width
      if (particle.x > this.width) particle.x = 0
      if (particle.y < 0) particle.y = this.height
      if (particle.y > this.height) particle.y = 0
    }

    // Allow Enter key to start
    if (input.isKeyPressed('Enter') || input.isKeyPressed('Space')) {
      this.onStartGame()
    }
  }

  render(ctx: CanvasRenderingContext2D, _alpha: number): void {
    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height)
    gradient.addColorStop(0, '#0f0f1e')
    gradient.addColorStop(1, '#1a1a2e')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, this.width, this.height)

    // Draw particles
    ctx.fillStyle = 'rgba(100, 108, 255, 0.3)'
    for (const particle of this.particles) {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 72px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Add glow effect to title
    ctx.shadowColor = '#646cff'
    ctx.shadowBlur = 20
    ctx.fillText('TAS GAME', this.width / 2, this.height / 2 - 80)
    ctx.shadowBlur = 0

    // Draw subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '20px monospace'
    ctx.fillText('A Modern Game Framework', this.width / 2, this.height / 2 - 20)

    // Draw button
    this.startButton.render(ctx)

    // Draw instructions at bottom
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.font = '14px monospace'
    ctx.fillText(
      'Press ENTER or SPACE to start',
      this.width / 2,
      this.height - 40
    )
  }
}
