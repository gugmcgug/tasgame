import { Scene } from './Scene'

export class GameState {
  private scenes: Scene[] = []

  pushScene(scene: Scene): void {
    this.scenes.push(scene)
    scene.onEnter()
  }

  popScene(): Scene | undefined {
    const scene = this.scenes.pop()
    if (scene) {
      scene.onExit()
    }
    return scene
  }

  getCurrentScene(): Scene | null {
    return this.scenes.length > 0 ? this.scenes[this.scenes.length - 1] : null
  }

  clearScenes(): void {
    this.scenes.forEach(scene => scene.onExit())
    this.scenes = []
  }
}
