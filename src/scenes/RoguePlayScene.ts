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

    // Spawn items in random rooms
    this.items = []
    for (let i = 1; i < rooms.length; i++) {
      if (Math.random() < 0.6) {
        const room = rooms[i]
        const itemX = room.x + Math.floor(Math.random() * room.width)
        const itemY = room.y + Math.floor(Math.random() * room.height)

        const itemType: ItemType = Math.random() < 0.7 ? 'health_potion' : 'gold'
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
    const playerMove = this.player.update(deltaTime, input, this.tilemap, this.currentTime)

    // Check item collection and stair interaction
    if (playerMove) {
      const playerPos = this.player.getTilePosition()

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
    const type = item.getType()

    switch (type) {
      case 'health_potion':
        this.player.getStats().heal(30)
        console.log('Collected health potion! +30 HP')
        break
      case 'gold':
        this.score += 50
        console.log('Collected gold! +50 score')
        break
    }
  }

  private playerAttack(): void {
    const playerPos = this.player.getTilePosition()

    // Find adjacent enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i]
      const enemyPos = enemy.getTilePosition()

      const dx = Math.abs(enemyPos.x - playerPos.x)
      const dy = Math.abs(enemyPos.y - playerPos.y)

      if (dx <= 1 && dy <= 1 && (dx + dy) > 0) {
        const damage = this.player.attack(enemy)
        console.log(`Player attacks enemy for ${damage} damage!`)

        if (enemy.getStats().isDead()) {
          this.enemies.splice(i, 1)
          this.killCount++
          console.log('Enemy defeated!')
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

    // Score and stats
    ctx.fillStyle = '#ffffff'
    ctx.font = '16px monospace'
    ctx.fillText(`Score: ${this.score}`, 10, 80)
    ctx.fillText(`Kills: ${this.killCount}`, 10, 100)
    ctx.fillText(`Enemies: ${this.enemies.length}`, 10, 120)

    // Floor info
    ctx.fillStyle = '#ffaa00'
    ctx.font = 'bold 20px monospace'
    ctx.fillText(`Floor: ${this.currentFloor}`, 10, 150)
    if (this.deepestFloor > 1) {
      ctx.fillStyle = '#ffffff'
      ctx.font = '14px monospace'
      ctx.fillText(`(Deepest: ${this.deepestFloor})`, 10, 170)
    }

    // Instructions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '14px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('WASD: Move | SPACE: Attack | ESC: Pause', this.width / 2, this.height - 20)
  }
}
