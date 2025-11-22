export class AssetLoader {
  private images: Map<string, HTMLImageElement> = new Map()
  private audio: Map<string, HTMLAudioElement> = new Map()
  private loadedCount: number = 0
  private totalCount: number = 0

  async loadImage(key: string, path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      this.totalCount++
      const img = new Image()
      img.onload = () => {
        this.images.set(key, img)
        this.loadedCount++
        resolve(img)
      }
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${path}`))
      }
      img.src = path
    })
  }

  async loadAudio(key: string, path: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      this.totalCount++
      const audio = new Audio()
      audio.oncanplaythrough = () => {
        this.audio.set(key, audio)
        this.loadedCount++
        resolve(audio)
      }
      audio.onerror = () => {
        reject(new Error(`Failed to load audio: ${path}`))
      }
      audio.src = path
    })
  }

  async loadAssets(
    images: { key: string; path: string }[],
    audio: { key: string; path: string }[] = []
  ): Promise<void> {
    const imagePromises = images.map((img) => this.loadImage(img.key, img.path))
    const audioPromises = audio.map((snd) => this.loadAudio(snd.key, snd.path))

    await Promise.all([...imagePromises, ...audioPromises])
  }

  getImage(key: string): HTMLImageElement | undefined {
    return this.images.get(key)
  }

  getAudio(key: string): HTMLAudioElement | undefined {
    return this.audio.get(key)
  }

  getProgress(): number {
    return this.totalCount === 0 ? 1 : this.loadedCount / this.totalCount
  }

  isLoaded(): boolean {
    return this.loadedCount === this.totalCount && this.totalCount > 0
  }
}
