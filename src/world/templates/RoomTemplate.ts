import { TileType } from '../Tile'

export type EntitySpawnType = 'enemy' | 'item' | 'boss' | 'npc'
export type EnemyType = 'goblin' | 'orc' | 'skeleton' | 'boss'
export type ItemType = 'health_potion' | 'gold'
export type TemplateRarity = 'common' | 'rare' | 'boss' | 'unique'

export interface EntitySpawn {
  type: EntitySpawnType
  enemyType?: EnemyType
  itemType?: ItemType
  position: { x: number; y: number }
}

export interface RoomTemplate {
  name: string
  width: number
  height: number
  minFloor: number
  maxFloor?: number
  rarity: TemplateRarity

  // Tile layout as 2D array
  tiles: TileType[][]

  // Entity spawn points
  spawns: EntitySpawn[]

  // Player entry point (relative to room)
  entryPoint: { x: number; y: number }

  // Optional connections for corridors
  connectionPoints?: { x: number; y: number }[]
}

export interface TemplateRoom {
  template: RoomTemplate
  x: number // World position
  y: number // World position
  spawns: EntitySpawn[] // Spawns with world positions
}
