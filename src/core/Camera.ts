export class Camera {
  private x: number = 0
  private y: number = 0
  private targetX: number = 0
  private targetY: number = 0
  private viewportWidth: number
  private viewportHeight: number
  private smoothing: number = 0.1

  constructor(viewportWidth: number, viewportHeight: number) {
    this.viewportWidth = viewportWidth
    this.viewportHeight = viewportHeight
  }

  follow(targetX: number, targetY: number): void {
    this.targetX = targetX - this.viewportWidth / 2
    this.targetY = targetY - this.viewportHeight / 2
  }

  update(): void {
    // Smooth camera movement
    this.x += (this.targetX - this.x) * this.smoothing
    this.y += (this.targetY - this.y) * this.smoothing
  }

  getOffset(): { x: number; y: number } {
    return {
      x: -this.x,
      y: -this.y,
    }
  }

  setPosition(x: number, y: number): void {
    this.x = x - this.viewportWidth / 2
    this.y = y - this.viewportHeight / 2
    this.targetX = this.x
    this.targetY = this.y
  }
}
