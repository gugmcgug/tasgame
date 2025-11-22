export enum TileType {
  Empty = 0,
  Floor = 1,
  Wall = 2,
  Door = 3,
  StairsDown = 4,
  StairsUp = 5,
}

export class Tile {
  constructor(
    public type: TileType,
    public walkable: boolean = true,
    public transparent: boolean = true
  ) {}

  static createFloor(): Tile {
    return new Tile(TileType.Floor, true, true)
  }

  static createWall(): Tile {
    return new Tile(TileType.Wall, false, false)
  }

  static createEmpty(): Tile {
    return new Tile(TileType.Empty, false, true)
  }

  static createDoor(): Tile {
    return new Tile(TileType.Door, true, true)
  }

  static createStairsDown(): Tile {
    return new Tile(TileType.StairsDown, true, true)
  }

  static createStairsUp(): Tile {
    return new Tile(TileType.StairsUp, true, true)
  }
}
