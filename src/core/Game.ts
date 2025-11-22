import { InputManager } from './InputManager'
import { GameState } from './GameState'
import { MenuScene } from '../scenes/MenuScene'
import { RoguePlayScene } from '../scenes/RoguePlayScene'
import { PauseScene } from '../scenes/PauseScene'
import { GameOverScene } from '../scenes/GameOverScene'

export class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private inputManager: InputManager
  private state: GameState
  private lastTime: number = 0
  private accumulator: number = 0
  private readonly fixedDeltaTime: number = 1000 / 60 // 60 FPS
  private animationFrameId: number | null = null
  private isRunning: boolean = false

  // Debug info
  private fps: number = 0
  private frameCount: number = 0
  private lastFpsUpdate: number = 0

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas
    this.ctx = ctx
    this.inputManager = new InputManager()
    this.state = new GameState()

    // Initialize with MenuScene
    this.showMenu()
  }

  start(): void {
    if (this.isRunning) return

    this.isRunning = true
    this.lastTime = performance.now()
    this.lastFpsUpdate = this.lastTime
    this.gameLoop(this.lastTime)

    console.log('🎮 Game started!')
  }

  stop(): void {
    this.isRunning = false
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    console.log('🛑 Game stopped!')
  }

  private gameLoop = (currentTime: number): void => {
    if (!this.isRunning) return

    this.animationFrameId = requestAnimationFrame(this.gameLoop)

    const deltaTime = currentTime - this.lastTime
    this.lastTime = currentTime
    this.accumulator += deltaTime

    // Fixed timestep update
    while (this.accumulator >= this.fixedDeltaTime) {
      this.update(this.fixedDeltaTime)
      this.accumulator -= this.fixedDeltaTime
    }

    // Render with interpolation factor
    const alpha = this.accumulator / this.fixedDeltaTime
    this.render(alpha)

    // Update FPS counter
    this.updateFps(currentTime)
  }

  private update(deltaTime: number): void {
    // Update current scene
    const currentScene = this.state.getCurrentScene()
    if (currentScene) {
      currentScene.update(deltaTime, this.inputManager)
    }

    // Update input manager (clear single-frame inputs)
    this.inputManager.update()
  }

  private render(alpha: number): void {
    // Clear canvas
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Render current scene
    const currentScene = this.state.getCurrentScene()
    if (currentScene) {
      currentScene.render(this.ctx, alpha)
    }

    // Render debug info
    this.renderDebugInfo()
  }

  private renderDebugInfo(): void {
    this.ctx.fillStyle = '#00ff00'
    this.ctx.font = '14px monospace'
    this.ctx.fillText(`FPS: ${this.fps}`, 10, 20)
  }

  private updateFps(currentTime: number): void {
    this.frameCount++

    if (currentTime - this.lastFpsUpdate >= 1000) {
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastFpsUpdate = currentTime
    }
  }

  getInputManager(): InputManager {
    return this.inputManager
  }

  getState(): GameState {
    return this.state
  }

  // Scene management methods
  private showMenu(): void {
    this.state.clearScenes()
    const menuScene = new MenuScene(
      this.canvas.width,
      this.canvas.height,
      () => this.startGame()
    )
    this.state.pushScene(menuScene)
  }

  private startGame(): void {
    this.state.clearScenes()
    const playScene = new RoguePlayScene(
      this.canvas.width,
      this.canvas.height,
      () => this.pauseGame(),
      (score: number) => this.gameOver(score)
    )
    this.state.pushScene(playScene)
  }

  private pauseGame(): void {
    const pauseScene = new PauseScene(
      this.canvas.width,
      this.canvas.height,
      () => this.resumeGame(),
      () => this.returnToMenu()
    )
    this.state.pushScene(pauseScene)
  }

  private resumeGame(): void {
    this.state.popScene()
  }

  private gameOver(score: number): void {
    this.state.clearScenes()
    const gameOverScene = new GameOverScene(
      this.canvas.width,
      this.canvas.height,
      score,
      () => this.startGame(),
      () => this.returnToMenu()
    )
    this.state.pushScene(gameOverScene)
  }

  private returnToMenu(): void {
    this.showMenu()
  }
}
