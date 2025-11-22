export interface FloorRule {
  bossRoom?: boolean
  treasureChance?: number // 0-1
  maxTemplateRooms?: number
}

export function getFloorRules(floor: number): FloorRule {
  const rules: FloorRule = {
    bossRoom: floor % 5 === 0 && floor > 0, // Boss every 5 floors
    treasureChance: 0,
    maxTemplateRooms: 1,
  }

  // Treasure chance increases with depth
  if (floor >= 3) {
    rules.treasureChance = Math.min(0.3 + (floor - 3) * 0.05, 0.7)
  }

  // More template rooms on deeper floors
  rules.maxTemplateRooms = Math.min(Math.floor(floor / 3) + 1, 3)

  return rules
}
