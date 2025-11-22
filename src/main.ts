import './style.css'
import { Game } from './core/Game'

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')

if (!ctx) {
  throw new Error('Could not get 2D context from canvas')
}

// Set canvas size
canvas.width = 800
canvas.height = 600

// Initialize and start the game
const game = new Game(canvas, ctx)
game.start()

// Handle window resize
window.addEventListener('resize', () => {
  // Optional: make canvas responsive
  // canvas.width = window.innerWidth
  // canvas.height = window.innerHeight
})
