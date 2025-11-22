import { Tilemap } from '../world/Tilemap'

export type ItemType =
  | 'health_potion'
  | 'mana_potion'
  | 'gold'
  | 'sword'
  | 'axe'
  | 'dagger'
  | 'leather_armor'
  | 'chain_mail'
  | 'plate_armor'
  | 'key'
  | 'scroll_teleport'
  | 'scroll_fireball'
  | 'ring_regeneration'
  | 'amulet_protection'

export interface ItemEffect {
  type: 'heal' | 'mana' | 'damage' | 'defense' | 'score' | 'equipment'
  value: number
  stat?: 'attack' | 'defense' | 'maxHealth'
}

export class Item {
  private tileX: number
  private tileY: number
  private worldX: number = 0
  private worldY: number = 0
  private type: ItemType
  private collected: boolean = false
  private glowPhase: number = 0

  constructor(tileX: number, tileY: number, type: ItemType) {
    this.tileX = tileX
    this.tileY = tileY
    this.type = type
  }

  getTilePosition(): { x: number; y: number } {
    return { x: this.tileX, y: this.tileY }
  }

  setWorldPosition(tilemap: Tilemap): void {
    const worldPos = tilemap.tileToWorld(this.tileX, this.tileY)
    this.worldX = worldPos.x
    this.worldY = worldPos.y
  }

  getType(): ItemType {
    return this.type
  }

  getName(): string {
    const names: Record<ItemType, string> = {
      health_potion: 'Health Potion',
      mana_potion: 'Mana Potion',
      gold: 'Gold Coins',
      sword: 'Iron Sword',
      axe: 'Battle Axe',
      dagger: 'Steel Dagger',
      leather_armor: 'Leather Armor',
      chain_mail: 'Chain Mail',
      plate_armor: 'Plate Armor',
      key: 'Golden Key',
      scroll_teleport: 'Scroll of Teleport',
      scroll_fireball: 'Scroll of Fireball',
      ring_regeneration: 'Ring of Regeneration',
      amulet_protection: 'Amulet of Protection'
    }
    return names[this.type] || 'Unknown Item'
  }

  getEffect(): ItemEffect {
    const effects: Record<ItemType, ItemEffect> = {
      health_potion: { type: 'heal', value: 30 },
      mana_potion: { type: 'mana', value: 20 },
      gold: { type: 'score', value: 50 },
      sword: { type: 'equipment', value: 5, stat: 'attack' },
      axe: { type: 'equipment', value: 7, stat: 'attack' },
      dagger: { type: 'equipment', value: 3, stat: 'attack' },
      leather_armor: { type: 'equipment', value: 2, stat: 'defense' },
      chain_mail: { type: 'equipment', value: 4, stat: 'defense' },
      plate_armor: { type: 'equipment', value: 6, stat: 'defense' },
      key: { type: 'score', value: 0 }, // Keys are collected for later use
      scroll_teleport: { type: 'score', value: 20 },
      scroll_fireball: { type: 'damage', value: 50 },
      ring_regeneration: { type: 'equipment', value: 20, stat: 'maxHealth' },
      amulet_protection: { type: 'equipment', value: 3, stat: 'defense' }
    }
    return effects[this.type] || { type: 'score', value: 0 }
  }

  collect(): void {
    this.collected = true
  }

  isCollected(): boolean {
    return this.collected
  }

  render(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0): void {
    if (this.collected) return

    // Glow animation
    this.glowPhase += 0.05
    const glowIntensity = Math.sin(this.glowPhase) * 0.3 + 0.7

    // Draw glow
    const size = this.getSize()
    ctx.shadowBlur = 10
    ctx.shadowColor = this.getColor()

    // Draw item
    ctx.fillStyle = this.getColor()
    ctx.globalAlpha = glowIntensity

    // Different shapes for different item types
    const x = this.worldX + offsetX
    const y = this.worldY + offsetY

    if (this.type.includes('potion')) {
      // Draw potion bottle shape
      ctx.fillRect(x - size / 2, y - size / 2, size, size)
    } else if (this.type.includes('sword') || this.type.includes('axe') || this.type.includes('dagger')) {
      // Draw weapon shape (rotated rectangle)
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(Math.PI / 4)
      ctx.fillRect(-size / 3, -size / 1.5, size / 1.5, size * 1.3)
      ctx.restore()
    } else if (this.type.includes('armor') || this.type.includes('mail')) {
      // Draw armor shape (shield-like)
      ctx.fillRect(x - size / 2, y - size / 2, size, size)
      ctx.strokeStyle = this.getColor()
      ctx.lineWidth = 2
      ctx.strokeRect(x - size / 2 + 2, y - size / 2 + 2, size - 4, size - 4)
    } else if (this.type.includes('ring') || this.type.includes('amulet')) {
      // Draw circle for jewelry
      ctx.beginPath()
      ctx.arc(x, y, size / 2, 0, Math.PI * 2)
      ctx.fill()
    } else if (this.type.includes('scroll')) {
      // Draw scroll (rectangle with curled edges)
      ctx.fillRect(x - size / 2, y - size / 3, size, size / 1.5)
    } else {
      // Default square
      ctx.fillRect(x - size / 2, y - size / 2, size, size)
    }

    // Reset shadow and alpha
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  }

  private getSize(): number {
    if (this.type === 'gold') return 16
    if (this.type.includes('ring') || this.type.includes('key')) return 14
    if (this.type.includes('scroll')) return 18
    return 20
  }

  private getColor(): string {
    const colors: Record<ItemType, string> = {
      health_potion: '#ff0088',
      mana_potion: '#0088ff',
      gold: '#ffdd00',
      sword: '#c0c0c0',
      axe: '#8b4513',
      dagger: '#e0e0e0',
      leather_armor: '#8b4513',
      chain_mail: '#a0a0a0',
      plate_armor: '#d0d0d0',
      key: '#ffd700',
      scroll_teleport: '#9370db',
      scroll_fireball: '#ff4500',
      ring_regeneration: '#00ff00',
      amulet_protection: '#4169e1'
    }
    return colors[this.type] || '#ffffff'
  }
}
