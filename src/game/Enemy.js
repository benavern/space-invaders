import GameObject from './GameObject'

export default class Ennemy extends GameObject {

  constructor (...args) {
    super(...args)

    this.direction = { x: 1, y: 1 }

    this.texture = args[0].texture
    this.killSound = args[0].killSound
  }

  die () {
    this.killSound.currentTime = 0
    this.killSound.play()
  }

  move (changeDirection) {
    // change direction
    if (changeDirection) this.direction.x *= -1
    this.x += this.direction.x * this.velocity
    this.y += this.direction.y * this.velocity
  }

  render () {
    // draw the enemy
    this.canvas.ctx.drawImage(this.texture, this.x, this.y, this.width, this.height)
  }
}
