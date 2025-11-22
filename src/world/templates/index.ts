import { templateManager } from './TemplateManager'
import { BOSS_TEMPLATES } from './BossTemplates'
import { TREASURE_TEMPLATES } from './TreasureTemplates'

// Initialize all templates
export function initializeTemplates(): void {
  templateManager.registerTemplates(BOSS_TEMPLATES)
  templateManager.registerTemplates(TREASURE_TEMPLATES)

  console.log(`✅ Registered ${templateManager.getAllTemplates().length} room templates`)
}

export { templateManager } from './TemplateManager'
export { getFloorRules } from './FloorRules'
export type { RoomTemplate, TemplateRoom, EntitySpawn } from './RoomTemplate'
