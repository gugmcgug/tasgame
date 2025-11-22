export class InputManager {
  private keys: Map<string, boolean> = new Map()
  private keysPressed: Map<string, boolean> = new Map()
  private keysReleased: Map<string, boolean> = new Map()

  private mousePosition: { x: number; y: number } = { x: 0, y: 0 }
  private mouseButtons: Map<number, boolean> = new Map()
  private mouseButtonsPressed: Map<number, boolean> = new Map()
  private mouseButtonsReleased: Map<number, boolean> = new Map()

  constructor() {
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    // Keyboard events
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!this.keys.get(e.code)) {
        this.keysPressed.set(e.code, true)
      }
      this.keys.set(e.code, true)
    })

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      this.keys.set(e.code, false)
      this.keysReleased.set(e.code, true)
    })

    // Mouse events
    window.addEventListener('mousemove', (e: MouseEvent) => {
      this.mousePosition.x = e.clientX
      this.mousePosition.y = e.clientY
    })

    window.addEventListener('mousedown', (e: MouseEvent) => {
      if (!this.mouseButtons.get(e.button)) {
        this.mouseButtonsPressed.set(e.button, true)
      }
      this.mouseButtons.set(e.button, true)
    })

    window.addEventListener('mouseup', (e: MouseEvent) => {
      this.mouseButtons.set(e.button, false)
      this.mouseButtonsReleased.set(e.button, true)
    })

    // Prevent context menu on right-click
    window.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault()
    })
  }

  update(): void {
    // Clear single-frame input states
    this.keysPressed.clear()
    this.keysReleased.clear()
    this.mouseButtonsPressed.clear()
    this.mouseButtonsReleased.clear()
  }

  // Keyboard methods
  isKeyDown(keyCode: string): boolean {
    return this.keys.get(keyCode) || false
  }

  isKeyPressed(keyCode: string): boolean {
    return this.keysPressed.get(keyCode) || false
  }

  isKeyReleased(keyCode: string): boolean {
    return this.keysReleased.get(keyCode) || false
  }

  // Mouse methods
  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition }
  }

  isMouseButtonDown(button: number): boolean {
    return this.mouseButtons.get(button) || false
  }

  isMouseButtonPressed(button: number): boolean {
    return this.mouseButtonsPressed.get(button) || false
  }

  isMouseButtonReleased(button: number): boolean {
    return this.mouseButtonsReleased.get(button) || false
  }
}
