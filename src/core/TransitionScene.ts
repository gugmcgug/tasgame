import { Scene } from './Scene'
import { InputManager } from './InputManager'

export class TransitionScene extends Scene {
  private fadeProgress: number = 0
  private fadeDuration: number = 500 // milliseconds
  private isFadingOut: boolean = true
  private nextScene: Scene | null = null
  private onComplete: (() => void) | null = null

  constructor(
    width: number,
    height: number,
    nextScene: Scene,
    onComplete: () => void
  ) {
    super(width, height)
    this.nextScene = nextScene
    this.onComplete = onComplete
  }

  onEnter(): void {
    this.fadeProgress = 0
    this.isFadingOut = true
  }

  update(deltaTime: number, _input: InputManager): void {
    this.fadeProgress += deltaTime

    if (this.isFadingOut && this.fadeProgress >= this.fadeDuration) {
      // Fade out complete, trigger callback
      if (this.onComplete) {
        this.onComplete()
      }
      // Start fade in
      this.isFadingOut = false
      this.fadeProgress = 0
    }
  }

  render(ctx: CanvasRenderingContext2D, alpha: number): void {
    // Render the next scene if fading in
    if (!this.isFadingOut && this.nextScene) {
      this.nextScene.render(ctx, alpha)
    }

    // Calculate opacity
    const progress = Math.min(this.fadeProgress / this.fadeDuration, 1)
    const opacity = this.isFadingOut ? progress : 1 - progress

    // Draw fade overlay
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
    ctx.fillRect(0, 0, this.width, this.height)
  }

  isDone(): boolean {
    return !this.isFadingOut && this.fadeProgress >= this.fadeDuration
  }
}
