import { InputManager } from '../core/InputManager'

export interface ButtonConfig {
  x: number
  y: number
  width: number
  height: number
  text: string
  onClick: () => void
  backgroundColor?: string
  hoverColor?: string
  textColor?: string
  fontSize?: number
}

export class Button {
  private x: number
  private y: number
  private width: number
  private height: number
  private text: string
  private onClick: () => void
  private backgroundColor: string
  private hoverColor: string
  private textColor: string
  private fontSize: number
  private isHovered: boolean = false

  constructor(config: ButtonConfig) {
    this.x = config.x
    this.y = config.y
    this.width = config.width
    this.height = config.height
    this.text = config.text
    this.onClick = config.onClick
    this.backgroundColor = config.backgroundColor || '#646cff'
    this.hoverColor = config.hoverColor || '#535bf2'
    this.textColor = config.textColor || '#ffffff'
    this.fontSize = config.fontSize || 20
  }

  update(input: InputManager): void {
    const mouse = input.getMousePosition()

    // Check if mouse is over button
    this.isHovered = this.isPointInside(mouse.x, mouse.y)

    // Handle click
    if (this.isHovered && input.isMouseButtonPressed(0)) {
      this.onClick()
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Draw button background
    ctx.fillStyle = this.isHovered ? this.hoverColor : this.backgroundColor

    // Add shadow effect
    if (this.isHovered) {
      ctx.shadowColor = 'rgba(100, 108, 255, 0.5)'
      ctx.shadowBlur = 15
    }

    this.roundRect(ctx, this.x, this.y, this.width, this.height, 8)
    ctx.fill()

    // Reset shadow
    ctx.shadowBlur = 0

    // Draw button border
    ctx.strokeStyle = this.isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 2
    this.roundRect(ctx, this.x, this.y, this.width, this.height, 8)
    ctx.stroke()

    // Draw text
    ctx.fillStyle = this.textColor
    ctx.font = `${this.fontSize}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2)
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  private isPointInside(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    )
  }

  setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }
}
