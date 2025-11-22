import { RoomTemplate } from './RoomTemplate'
import { TileType } from '../Tile'

const F = TileType.Floor
const W = TileType.Wall
const D = TileType.Door

export const TREASURE_VAULT: RoomTemplate = {
  name: 'Treasure Vault',
  width: 9,
  height: 9,
  minFloor: 3,
  rarity: 'rare',

  tiles: [
    [W, W, W, W, W, W, W, W, W],
    [W, F, F, F, F, F, F, F, W],
    [W, F, W, W, W, W, W, F, W],
    [W, F, W, F, F, F, W, F, W],
    [W, F, W, F, F, F, W, F, W],
    [W, F, W, F, F, F, W, F, W],
    [W, F, W, W, W, W, W, F, W],
    [W, F, F, F, F, F, F, F, W],
    [W, W, W, W, D, D, W, W, W],
  ],

  spawns: [
    { type: 'item', itemType: 'gold', position: { x: 4, y: 4 } },
    { type: 'item', itemType: 'gold', position: { x: 3, y: 4 } },
    { type: 'item', itemType: 'gold', position: { x: 5, y: 4 } },
    { type: 'item', itemType: 'health_potion', position: { x: 4, y: 3 } },
    { type: 'enemy', enemyType: 'orc', position: { x: 2, y: 2 } },
    { type: 'enemy', enemyType: 'skeleton', position: { x: 6, y: 6 } },
  ],

  entryPoint: { x: 4, y: 8 },
}

export const TREASURE_CHAMBER: RoomTemplate = {
  name: 'Treasure Chamber',
  width: 11,
  height: 8,
  minFloor: 5,
  rarity: 'rare',

  tiles: [
    [W, W, W, W, W, W, W, W, W, W, W],
    [W, F, F, F, W, F, F, F, W, F, W],
    [W, F, F, F, W, F, F, F, W, F, W],
    [W, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, W],
    [W, F, W, F, F, F, F, F, W, F, W],
    [W, F, W, F, F, F, F, F, W, F, W],
    [W, W, W, W, W, D, D, W, W, W, W],
  ],

  spawns: [
    { type: 'item', itemType: 'gold', position: { x: 5, y: 3 } },
    { type: 'item', itemType: 'gold', position: { x: 5, y: 4 } },
    { type: 'item', itemType: 'health_potion', position: { x: 2, y: 2 } },
    { type: 'item', itemType: 'health_potion', position: { x: 8, y: 2 } },
    { type: 'enemy', enemyType: 'skeleton', position: { x: 3, y: 5 } },
    { type: 'enemy', enemyType: 'skeleton', position: { x: 7, y: 5 } },
  ],

  entryPoint: { x: 5, y: 7 },
}

export const TREASURE_TEMPLATES = [TREASURE_VAULT, TREASURE_CHAMBER]
