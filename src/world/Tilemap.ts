import { Tile, TileType } from './Tile'

export class Tilemap {
  public tiles: Tile[][]
  public width: number
  public height: number
  public tileSize: number

  constructor(width: number, height: number, tileSize: number = 32) {
    this.width = width
    this.height = height
    this.tileSize = tileSize
    this.tiles = []

    // Initialize with empty tiles
    for (let y = 0; y < height; y++) {
      this.tiles[y] = []
      for (let x = 0; x < width; x++) {
        this.tiles[y][x] = Tile.createEmpty()
      }
    }
  }

  getTile(x: number, y: number): Tile | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null
    }
    return this.tiles[y][x]
  }

  setTile(x: number, y: number, tile: Tile): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.tiles[y][x] = tile
    }
  }

  isWalkable(x: number, y: number): boolean {
    const tile = this.getTile(x, y)
    return tile ? tile.walkable : false
  }

  worldToTile(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: Math.floor(worldX / this.tileSize),
      y: Math.floor(worldY / this.tileSize),
    }
  }

  tileToWorld(tileX: number, tileY: number): { x: number; y: number } {
    return {
      x: tileX * this.tileSize + this.tileSize / 2,
      y: tileY * this.tileSize + this.tileSize / 2,
    }
  }

  render(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.tiles[y][x]
        const worldPos = this.tileToWorld(x, y)
        const drawX = worldPos.x - this.tileSize / 2 + offsetX
        const drawY = worldPos.y - this.tileSize / 2 + offsetY

        // Draw tile based on type
        switch (tile.type) {
          case TileType.Floor:
            ctx.fillStyle = '#2a2a3e'
            ctx.fillRect(drawX, drawY, this.tileSize, this.tileSize)
            // Add floor detail
            ctx.strokeStyle = 'rgba(100, 108, 255, 0.1)'
            ctx.strokeRect(drawX, drawY, this.tileSize, this.tileSize)
            break
          case TileType.Wall:
            ctx.fillStyle = '#4a4a6e'
            ctx.fillRect(drawX, drawY, this.tileSize, this.tileSize)
            // Add wall shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
            ctx.fillRect(drawX, drawY + this.tileSize - 4, this.tileSize, 4)
            break
          case TileType.Door:
            ctx.fillStyle = '#8b6914'
            ctx.fillRect(drawX, drawY, this.tileSize, this.tileSize)
            break
          case TileType.Empty:
            ctx.fillStyle = '#0a0a0a'
            ctx.fillRect(drawX, drawY, this.tileSize, this.tileSize)
            break
        }
      }
    }
  }
}
