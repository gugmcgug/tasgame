import { Scene } from '../core/Scene'
import { InputManager } from '../core/InputManager'
import { Camera } from '../core/Camera'
import { DungeonGenerator } from '../world/DungeonGenerator'
import { Tilemap } from '../world/Tilemap'
import { RoguePlayer } from '../entities/RoguePlayer'
import { Enemy } from '../entities/Enemy'
import { Boss } from '../entities/Boss'
import { Item, ItemType } from '../entities/Item'
import { initializeTemplates } from '../world/templates'

// Initialize templates once
let templatesInitialized = false

export class RoguePlayScene extends Scene {
  private tilemap!: Tilemap
  private player!: RoguePlayer
  private enemies: (Enemy | Boss)[] = []
  private items: Item[] = []
  private camera!: Camera
  private gameTime: number = 0
  private currentTime: number = 0
  private score: number = 0
  private killCount: number = 0
  private currentFloor: number = 1
  private stairsDownPos: { x: number; y: number } | null = null
  private stairsUpPos: { x: number; y: number } | null = null
  private deepestFloor: number = 1

  constructor(
    width: number,
    height: number,
    private onPause?: () => void,
    private onGameOver?: (score: number) => void
  ) {
    super(width, height)
    this.camera = new Camera(width, height)
  }

  onEnter(): void {
    console.log('▶️  RoguePlayScene entered')

    // Initialize templates on first load
    if (!templatesInitialized) {
      initializeTemplates()
      templatesInitialized = true
    }

    this.generateDungeon()
  }

  onExit(): void {
    console.log('⏹️  RoguePlayScene exited')
  }

  private generateDungeon(preservePlayer: boolean = false): void {
    // Generate dungeon
    const mapWidth = 50
    const mapHeight = 40
    const tileSize = 32

    const { tilemap, rooms, startPos, stairsDownPos, stairsUpPos, templateSpawns } = DungeonGenerator.generate(
      mapWidth,
      mapHeight,
      tileSize,
      this.currentFloor
    )
    this.tilemap = tilemap
    this.stairsDownPos = stairsDownPos
    this.stairsUpPos = stairsUpPos

    // Create or reposition player
    if (!preservePlayer || !this.player) {
      this.player = new RoguePlayer(startPos.x, startPos.y)
      this.player.setTilePosition(startPos.x, startPos.y, tilemap)
    } else {
      // Keep player stats, just change position
      this.player.setTilePosition(startPos.x, startPos.y, tilemap)
    }

    // Position camera on player
    const playerWorldPos = tilemap.tileToWorld(startPos.x, startPos.y)
    this.camera.setPosition(playerWorldPos.x, playerWorldPos.y)

    // Spawn enemies in random rooms (skip first room)
    // Difficulty scaling: more enemies and tougher types on deeper floors
    this.enemies = []
    const baseEnemies = 1 + Math.floor(Math.random() * 2)
    const bonusEnemies = Math.floor(this.currentFloor / 3) // +1 enemy every 3 floors

    for (let i = 1; i < rooms.length; i++) {
      const room = rooms[i]
      const numEnemies = baseEnemies + bonusEnemies

      for (let j = 0; j < numEnemies; j++) {
        const enemyX = room.x + Math.floor(Math.random() * room.width)
        const enemyY = room.y + Math.floor(Math.random() * room.height)

        // Higher chance of tougher enemies on deeper floors
        const rand = Math.random()
        let type: 'goblin' | 'orc' | 'skeleton'
        if (this.currentFloor >= 5 && rand < 0.5) {
          type = 'orc' // More orcs on floor 5+
        } else if (this.currentFloor >= 3 && rand < 0.4) {
          type = 'skeleton' // More skeletons on floor 3+
        } else if (rand < 0.5) {
          type = 'goblin'
        } else if (rand < 0.75) {
          type = 'skeleton'
        } else {
          type = 'orc'
        }

        const enemy = new Enemy(enemyX, enemyY, type)
        enemy.setTilePosition(enemyX, enemyY, tilemap)
        this.enemies.push(enemy)
      }
    }

    // Spawn items in random rooms with varied types
    this.items = []
    for (let i = 1; i < rooms.length; i++) {
      if (Math.random() < 0.7) { // 70% chance for items
        const room = rooms[i]
        const itemX = room.x + Math.floor(Math.random() * room.width)
        const itemY = room.y + Math.floor(Math.random() * room.height)

        // Choose item type based on rarity
        const rand = Math.random()
        let itemType: ItemType

        if (rand < 0.35) {
          // Common items (35%)
          itemType = 'health_potion'
        } else if (rand < 0.55) {
          // Gold (20%)
          itemType = 'gold'
        } else if (rand < 0.70) {
          // Common equipment (15%)
          const commonEquip: ItemType[] = ['leather_armor', 'dagger', 'mana_potion']
          itemType = commonEquip[Math.floor(Math.random() * commonEquip.length)]
        } else if (rand < 0.85) {
          // Uncommon equipment (15%)
          const uncommonEquip: ItemType[] = ['sword', 'chain_mail', 'key']
          itemType = uncommonEquip[Math.floor(Math.random() * uncommonEquip.length)]
        } else if (rand < 0.95) {
          // Rare equipment (10%)
          const rareEquip: ItemType[] = ['axe', 'plate_armor', 'scroll_fireball']
          itemType = rareEquip[Math.floor(Math.random() * rareEquip.length)]
        } else {
          // Epic items (5%)
          const epicItems: ItemType[] = ['ring_regeneration', 'amulet_protection', 'scroll_teleport']
          itemType = epicItems[Math.floor(Math.random() * epicItems.length)]
        }

        const item = new Item(itemX, itemY, itemType)
        item.setWorldPosition(tilemap)
        this.items.push(item)
      }
    }

    // Spawn entities from templates
    for (const spawn of templateSpawns) {
      switch (spawn.type) {
        case 'boss':
          const boss = new Boss(spawn.position.x, spawn.position.y, this.currentFloor)
          boss.setTilePosition(spawn.position.x, spawn.position.y, tilemap)
          this.enemies.push(boss)
          break

        case 'enemy':
          if (spawn.enemyType && spawn.enemyType !== 'boss') {
            const enemy = new Enemy(spawn.position.x, spawn.position.y, spawn.enemyType)
            enemy.setTilePosition(spawn.position.x, spawn.position.y, tilemap)
            this.enemies.push(enemy)
          }
          break

        case 'item':
          if (spawn.itemType) {
            const item = new Item(spawn.position.x, spawn.position.y, spawn.itemType)
            item.setWorldPosition(tilemap)
            this.items.push(item)
          }
          break
      }
    }

    // Only reset stats when starting a new game (not preserving player)
    if (!preservePlayer) {
      this.gameTime = 0
      this.score = 0
      this.killCount = 0
      this.currentFloor = 1
      this.deepestFloor = 1
    }
    // NEVER reset currentTime - it's used for entity timing and must be continuous
  }

  update(deltaTime: number, input: InputManager): void {
    this.currentTime += deltaTime
    this.gameTime += deltaTime

    // Check for pause
    if (input.isKeyPressed('Escape')) {
      if (this.onPause) {
        this.onPause()
      }
      return
    }

    // Update player
    const playerMove = this.player.update(deltaTime, input, this.tilemap, this.currentTime, this.enemies)

    // Check item collection, attacks, and stair interaction
    if (playerMove) {
      const playerPos = this.player.getTilePosition()

      // Handle attack if player moved into an enemy
      if (playerMove.attacked) {
        this.playerAttackDirection(playerMove.dx, playerMove.dy)
      }

      // Item collection
      for (const item of this.items) {
        if (!item.isCollected()) {
          const itemPos = item.getTilePosition()
          if (playerPos.x === itemPos.x && playerPos.y === itemPos.y) {
            this.collectItem(item)
          }
        }
      }

      // Check if standing on stairs
      if (this.stairsDownPos && playerPos.x === this.stairsDownPos.x && playerPos.y === this.stairsDownPos.y) {
        this.descend()
      } else if (this.stairsUpPos && playerPos.x === this.stairsUpPos.x && playerPos.y === this.stairsUpPos.y) {
        this.ascend()
      }
    }

    // Update enemies
    for (const enemy of this.enemies) {
      const action = enemy.update(this.player, this.tilemap, this.currentTime, this.enemies)

      if (action && action.action === 'attack' && action.target) {
        const damage = enemy.attack(action.target)
        console.log(`Enemy attacks player for ${damage} damage!`)

        // Check if player died
        if (this.player.getStats().isDead()) {
          this.gameOver()
        }
      }
    }

    // Player attack nearby enemies
    if (input.isKeyPressed('Space')) {
      this.playerAttack()
    }

    // Update camera to follow player
    const playerPos = this.player.getTilePosition()
    const playerWorldPos = this.tilemap.tileToWorld(playerPos.x, playerPos.y)
    this.camera.follow(playerWorldPos.x, playerWorldPos.y)
    this.camera.update()

    // Update score
    this.score = Math.floor(this.gameTime / 1000) + this.killCount * 10
  }

  private collectItem(item: Item): void {
    item.collect()
    const effect = item.getEffect()
    const name = item.getName()

    switch (effect.type) {
      case 'heal':
        this.player.getStats().heal(effect.value)
        console.log(`✨ Collected ${name}! +${effect.value} HP`)
        break

      case 'score':
        this.score += effect.value
        if (effect.value > 0) {
          console.log(`✨ Collected ${name}! +${effect.value} score`)
        } else {
          console.log(`✨ Collected ${name}!`)
        }
        break

      case 'equipment':
        if (effect.stat) {
          const stats = this.player.getStats()
          switch (effect.stat) {
            case 'attack':
              stats.attack += effect.value
              console.log(`⚔️  Equipped ${name}! ATK +${effect.value} (Total: ${stats.attack})`)
              break
            case 'defense':
              stats.defense += effect.value
              console.log(`🛡️  Equipped ${name}! DEF +${effect.value} (Total: ${stats.defense})`)
              break
            case 'maxHealth':
              stats.maxHealth += effect.value
              stats.health += effect.value // Also increase current health
              console.log(`❤️  Equipped ${name}! Max HP +${effect.value} (Total: ${stats.maxHealth})`)
              break
          }
        }
        break

      case 'damage':
        // Damage all nearby enemies (for scrolls like fireball)
        let damaged = 0
        const playerPos = this.player.getTilePosition()
        for (let i = this.enemies.length - 1; i >= 0; i--) {
          const enemy = this.enemies[i]
          const enemyPos = enemy.getTilePosition()
          const distance = Math.abs(enemyPos.x - playerPos.x) + Math.abs(enemyPos.y - playerPos.y)

          if (distance <= 3) { // 3 tile radius
            enemy.getStats().takeDamage(effect.value)
            damaged++
            if (enemy.getStats().isDead()) {
              this.enemies.splice(i, 1)
              this.killCount++
            }
          }
        }
        console.log(`🔥 Used ${name}! Damaged ${damaged} enemies for ${effect.value} each!`)
        break

      case 'mana':
        // For future mana system
        this.score += 10
        console.log(`✨ Collected ${name}! (No mana system yet, +10 score)`)
        break
    }
  }

  private playerAttackDirection(dx: number, dy: number): void {
    const playerPos = this.player.getTilePosition()
    const targetX = playerPos.x + dx
    const targetY = playerPos.y + dy

    // Find enemy at target position
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i]
      const enemyPos = enemy.getTilePosition()

      if (enemyPos.x === targetX && enemyPos.y === targetY) {
        const damage = this.player.attack(enemy)
        console.log(`Player attacks ${enemy instanceof Boss ? 'BOSS' : 'enemy'} for ${damage} damage! (${enemy.getStats().health}/${enemy.getStats().maxHealth} HP remaining)`)

        if (enemy.getStats().isDead()) {
          this.enemies.splice(i, 1)
          this.killCount++
          console.log(`${enemy instanceof Boss ? 'BOSS' : 'Enemy'} defeated! +${enemy instanceof Boss ? 100 : 10} score`)
          this.score += enemy instanceof Boss ? 100 : 10
        }
        break
      }
    }
  }

  private playerAttack(): void {
    const playerPos = this.player.getTilePosition()

    // Find all adjacent enemies and attack them
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i]
      const enemyPos = enemy.getTilePosition()

      const dx = Math.abs(enemyPos.x - playerPos.x)
      const dy = Math.abs(enemyPos.y - playerPos.y)

      if (dx <= 1 && dy <= 1 && (dx + dy) > 0) {
        const damage = this.player.attack(enemy)
        console.log(`Player attacks ${enemy instanceof Boss ? 'BOSS' : 'enemy'} for ${damage} damage! (${enemy.getStats().health}/${enemy.getStats().maxHealth} HP remaining)`)

        if (enemy.getStats().isDead()) {
          this.enemies.splice(i, 1)
          this.killCount++
          console.log(`${enemy instanceof Boss ? 'BOSS' : 'Enemy'} defeated! +${enemy instanceof Boss ? 100 : 10} score`)
          this.score += enemy instanceof Boss ? 100 : 10
        }
      }
    }
  }

  private gameOver(): void {
    if (this.onGameOver) {
      this.onGameOver(this.score)
    }
  }

  private descend(): void {
    this.currentFloor++
    if (this.currentFloor > this.deepestFloor) {
      this.deepestFloor = this.currentFloor
    }
    console.log(`Descending to floor ${this.currentFloor}...`)
    this.generateDungeon(true) // Preserve player health
  }

  private ascend(): void {
    if (this.currentFloor > 1) {
      this.currentFloor--
      console.log(`Ascending to floor ${this.currentFloor}...`)
      this.generateDungeon(true) // Preserve player health
    }
  }

  render(ctx: CanvasRenderingContext2D, _alpha: number): void {
    // Clear
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, this.width, this.height)

    const offset = this.camera.getOffset()

    // Render tilemap
    this.tilemap.render(ctx, offset.x, offset.y)

    // Render items
    for (const item of this.items) {
      item.render(ctx, offset.x, offset.y)
    }

    // Render enemies
    for (const enemy of this.enemies) {
      enemy.render(ctx, offset.x, offset.y)
    }

    // Render player
    this.player.render(ctx, offset.x, offset.y)

    // Render UI
    this.renderUI(ctx)
  }

  private renderUI(ctx: CanvasRenderingContext2D): void {
    // Health bar
    const healthBarWidth = 200
    const healthBarHeight = 20
    const healthPercent = this.player.getStats().getHealthPercentage()
    const health = this.player.getStats().health
    const maxHealth = this.player.getStats().maxHealth

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(10, 10, healthBarWidth + 10, healthBarHeight + 30)

    ctx.fillStyle = '#333'
    ctx.fillRect(15, 15, healthBarWidth, healthBarHeight)

    ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffaa00' : '#ff0000'
    ctx.fillRect(15, 15, healthBarWidth * healthPercent, healthBarHeight)

    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.strokeRect(15, 15, healthBarWidth, healthBarHeight)

    ctx.fillStyle = '#ffffff'
    ctx.font = '14px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`HP: ${health}/${maxHealth}`, 20, 50)

    // Player stats
    const stats = this.player.getStats()
    ctx.fillStyle = '#ffaa00'
    ctx.font = '14px monospace'
    ctx.fillText(`⚔️  ATK: ${stats.attack}  🛡️  DEF: ${stats.defense}`, 20, 70)

    // Score and stats
    ctx.fillStyle = '#ffffff'
    ctx.font = '16px monospace'
    ctx.fillText(`Score: ${this.score}`, 10, 100)
    ctx.fillText(`Kills: ${this.killCount}`, 10, 120)
    ctx.fillText(`Enemies: ${this.enemies.length}`, 10, 140)

    // Floor info
    ctx.fillStyle = '#ffaa00'
    ctx.font = 'bold 20px monospace'
    ctx.fillText(`Floor: ${this.currentFloor}`, 10, 170)
    if (this.deepestFloor > 1) {
      ctx.fillStyle = '#ffffff'
      ctx.font = '14px monospace'
      ctx.fillText(`(Deepest: ${this.deepestFloor})`, 10, 190)
    }

    // Instructions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '14px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('WASD: Move/Attack | SPACE: Multi-Attack | ESC: Pause', this.width / 2, this.height - 20)
  }
}
