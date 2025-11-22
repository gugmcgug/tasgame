import { RoomTemplate } from './RoomTemplate'
import { TileType } from '../Tile'

const E = TileType.Empty
const F = TileType.Floor
const W = TileType.Wall

export const BOSS_ARENA_CIRCULAR: RoomTemplate = {
  name: 'Boss Arena - Circular',
  width: 13,
  height: 13,
  minFloor: 5,
  rarity: 'boss',

  tiles: [
    [E, E, E, E, W, W, W, W, W, E, E, E, E],
    [E, E, W, W, F, F, F, F, F, W, W, E, E],
    [E, W, F, F, F, F, F, F, F, F, F, W, E],
    [E, W, F, F, F, F, F, F, F, F, F, W, E],
    [W, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, W], // Center
    [W, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, W],
    [E, W, F, F, F, F, F, F, F, F, F, W, E],
    [E, W, F, F, F, F, F, F, F, F, F, W, E],
    [E, E, W, W, F, F, F, F, F, W, W, E, E],
    [E, E, E, E, W, W, W, W, W, E, E, E, E],
  ],

  spawns: [
    { type: 'boss', enemyType: 'boss', position: { x: 6, y: 6 } },
    { type: 'item', itemType: 'health_potion', position: { x: 3, y: 3 } },
    { type: 'item', itemType: 'health_potion', position: { x: 9, y: 9 } },
  ],

  entryPoint: { x: 6, y: 11 },
}

export const BOSS_ARENA_THRONE: RoomTemplate = {
  name: 'Boss Arena - Throne Room',
  width: 15,
  height: 11,
  minFloor: 10,
  rarity: 'boss',

  tiles: [
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, W, F, F, F, F, F, F, F, W, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, W, F, F, F, F, F, F, F, W, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, W, W, W, W, W, F, F, F, W, W, W, W, W, W],
  ],

  spawns: [
    { type: 'boss', enemyType: 'boss', position: { x: 7, y: 2 } }, // Boss at throne
    { type: 'enemy', enemyType: 'orc', position: { x: 3, y: 5 } }, // Guard
    { type: 'enemy', enemyType: 'orc', position: { x: 11, y: 5 } }, // Guard
    { type: 'item', itemType: 'health_potion', position: { x: 2, y: 2 } },
    { type: 'item', itemType: 'health_potion', position: { x: 12, y: 2 } },
  ],

  entryPoint: { x: 7, y: 10 },
}

export const BOSS_TEMPLATES = [BOSS_ARENA_CIRCULAR, BOSS_ARENA_THRONE]
