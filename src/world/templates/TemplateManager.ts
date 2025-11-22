import { RoomTemplate, TemplateRarity } from './RoomTemplate'

export class TemplateManager {
  private templates: Map<string, RoomTemplate> = new Map()

  registerTemplate(template: RoomTemplate): void {
    this.templates.set(template.name, template)
  }

  registerTemplates(templates: RoomTemplate[]): void {
    templates.forEach(t => this.registerTemplate(t))
  }

  getTemplate(name: string): RoomTemplate | null {
    return this.templates.get(name) || null
  }

  getTemplatesForFloor(floor: number, rarity?: TemplateRarity): RoomTemplate[] {
    const templates: RoomTemplate[] = []

    for (const template of this.templates.values()) {
      // Check floor range
      if (floor < template.minFloor) continue
      if (template.maxFloor && floor > template.maxFloor) continue

      // Check rarity filter
      if (rarity && template.rarity !== rarity) continue

      templates.push(template)
    }

    return templates
  }

  selectRandomTemplate(templates: RoomTemplate[]): RoomTemplate | null {
    if (templates.length === 0) return null
    const index = Math.floor(Math.random() * templates.length)
    return templates[index]
  }

  getAllTemplates(): RoomTemplate[] {
    return Array.from(this.templates.values())
  }

  clear(): void {
    this.templates.clear()
  }
}

// Global template manager instance
export const templateManager = new TemplateManager()
