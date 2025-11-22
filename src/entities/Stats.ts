export class Stats {
  public health: number
  public maxHealth: number
  public attack: number
  public defense: number

  constructor(maxHealth: number, attack: number = 5, defense: number = 0) {
    this.maxHealth = maxHealth
    this.health = maxHealth
    this.attack = attack
    this.defense = defense
  }

  takeDamage(amount: number): number {
    const actualDamage = Math.max(1, amount - this.defense)
    this.health = Math.max(0, this.health - actualDamage)
    return actualDamage
  }

  heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount)
  }

  isDead(): boolean {
    return this.health <= 0
  }

  getHealthPercentage(): number {
    return this.health / this.maxHealth
  }
}
