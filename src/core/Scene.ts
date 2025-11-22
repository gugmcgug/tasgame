import { InputManager } from './InputManager'

export abstract class Scene {
  protected width: number
  protected height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  abstract update(deltaTime: number, input: InputManager): void
  abstract render(ctx: CanvasRenderingContext2D, alpha: number): void

  onEnter(): void {
    // Override in subclasses if needed
  }

  onExit(): void {
    // Override in subclasses if needed
  }
}
