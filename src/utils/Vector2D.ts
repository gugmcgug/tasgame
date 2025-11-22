export class Vector2D {
  constructor(public x: number = 0, public y: number = 0) {}

  static zero(): Vector2D {
    return new Vector2D(0, 0)
  }

  static one(): Vector2D {
    return new Vector2D(1, 1)
  }

  add(other: Vector2D): Vector2D {
    return new Vector2D(this.x + other.x, this.y + other.y)
  }

  subtract(other: Vector2D): Vector2D {
    return new Vector2D(this.x - other.x, this.y - other.y)
  }

  multiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar)
  }

  divide(scalar: number): Vector2D {
    if (scalar === 0) throw new Error('Division by zero')
    return new Vector2D(this.x / scalar, this.y / scalar)
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize(): Vector2D {
    const mag = this.magnitude()
    if (mag === 0) return Vector2D.zero()
    return this.divide(mag)
  }

  dot(other: Vector2D): number {
    return this.x * other.x + this.y * other.y
  }

  distance(other: Vector2D): number {
    return this.subtract(other).magnitude()
  }

  clone(): Vector2D {
    return new Vector2D(this.x, this.y)
  }
}
