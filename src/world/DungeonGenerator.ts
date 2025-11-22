import { Tilemap } from './Tilemap'
import { Tile } from './Tile'

interface Room {
  x: number
  y: number
  width: number
  height: number
}

export class DungeonGenerator {
  static generate(width: number, height: number, tileSize: number = 32, floor: number = 1): {
    tilemap: Tilemap
    rooms: Room[]
    startPos: { x: number; y: number }
    stairsDownPos: { x: number; y: number } | null
    stairsUpPos: { x: number; y: number } | null
  } {
    const tilemap = new Tilemap(width, height, tileSize)
    const rooms: Room[] = []
    const numRooms = 8 + Math.floor(Math.random() * 5)

    // Generate rooms
    for (let i = 0; i < numRooms; i++) {
      const roomWidth = 4 + Math.floor(Math.random() * 6)
      const roomHeight = 4 + Math.floor(Math.random() * 6)
      const roomX = Math.floor(Math.random() * (width - roomWidth - 2)) + 1
      const roomY = Math.floor(Math.random() * (height - roomHeight - 2)) + 1

      const newRoom: Room = {
        x: roomX,
        y: roomY,
        width: roomWidth,
        height: roomHeight,
      }

      // Check if room overlaps with existing rooms
      let overlaps = false
      for (const room of rooms) {
        if (this.roomsOverlap(newRoom, room)) {
          overlaps = true
          break
        }
      }

      if (!overlaps) {
        this.carveRoom(tilemap, newRoom)

        // Connect to previous room with corridor
        if (rooms.length > 0) {
          const prevRoom = rooms[rooms.length - 1]
          this.createCorridor(tilemap, newRoom, prevRoom)
        }

        rooms.push(newRoom)
      }
    }

    // Create walls around floors
    this.createWalls(tilemap)

    // Get starting position (center of first room)
    const startRoom = rooms[0]
    const startPos = {
      x: Math.floor(startRoom.x + startRoom.width / 2),
      y: Math.floor(startRoom.y + startRoom.height / 2),
    }

    // Place stairs up in first room (if not floor 1)
    let stairsUpPos: { x: number; y: number } | null = null
    if (floor > 1) {
      const upX = startRoom.x + Math.floor(startRoom.width / 2) + 1
      const upY = startRoom.y + Math.floor(startRoom.height / 2)
      tilemap.setTile(upX, upY, Tile.createStairsUp())
      stairsUpPos = { x: upX, y: upY }
    }

    // Place stairs down in last room
    const lastRoom = rooms[rooms.length - 1]
    const downX = Math.floor(lastRoom.x + lastRoom.width / 2)
    const downY = Math.floor(lastRoom.y + lastRoom.height / 2)
    tilemap.setTile(downX, downY, Tile.createStairsDown())
    const stairsDownPos = { x: downX, y: downY }

    return { tilemap, rooms, startPos, stairsDownPos, stairsUpPos }
  }

  private static roomsOverlap(room1: Room, room2: Room): boolean {
    return (
      room1.x < room2.x + room2.width + 1 &&
      room1.x + room1.width + 1 > room2.x &&
      room1.y < room2.y + room2.height + 1 &&
      room1.y + room1.height + 1 > room2.y
    )
  }

  private static carveRoom(tilemap: Tilemap, room: Room): void {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        tilemap.setTile(x, y, Tile.createFloor())
      }
    }
  }

  private static createCorridor(tilemap: Tilemap, room1: Room, room2: Room): void {
    const x1 = Math.floor(room1.x + room1.width / 2)
    const y1 = Math.floor(room1.y + room1.height / 2)
    const x2 = Math.floor(room2.x + room2.width / 2)
    const y2 = Math.floor(room2.y + room2.height / 2)

    // Random L-shaped corridor
    if (Math.random() < 0.5) {
      // Horizontal then vertical
      this.createHorizontalCorridor(tilemap, x1, x2, y1)
      this.createVerticalCorridor(tilemap, y1, y2, x2)
    } else {
      // Vertical then horizontal
      this.createVerticalCorridor(tilemap, y1, y2, x1)
      this.createHorizontalCorridor(tilemap, x1, x2, y2)
    }
  }

  private static createHorizontalCorridor(
    tilemap: Tilemap,
    x1: number,
    x2: number,
    y: number
  ): void {
    const minX = Math.min(x1, x2)
    const maxX = Math.max(x1, x2)
    for (let x = minX; x <= maxX; x++) {
      tilemap.setTile(x, y, Tile.createFloor())
    }
  }

  private static createVerticalCorridor(
    tilemap: Tilemap,
    y1: number,
    y2: number,
    x: number
  ): void {
    const minY = Math.min(y1, y2)
    const maxY = Math.max(y1, y2)
    for (let y = minY; y <= maxY; y++) {
      tilemap.setTile(x, y, Tile.createFloor())
    }
  }

  private static createWalls(tilemap: Tilemap): void {
    for (let y = 0; y < tilemap.height; y++) {
      for (let x = 0; x < tilemap.width; x++) {
        const tile = tilemap.getTile(x, y)
        if (tile && tile.walkable) {
          // Check adjacent tiles
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue
              const adjTile = tilemap.getTile(x + dx, y + dy)
              if (!adjTile || !adjTile.walkable) {
                tilemap.setTile(x + dx, y + dy, Tile.createWall())
              }
            }
          }
        }
      }
    }
  }
}
