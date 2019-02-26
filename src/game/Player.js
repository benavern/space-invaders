import GameObject from './GameObject'
import Missile from './Missile'

export default class Player extends GameObject {
  constructor (...args) {
    super(...args)

    this.velocity = 10

    this.missiles = []

    this.texture = args[0].texture
    this.fireSound = args[0].fireSound
  }

  fire () {
    this.missiles.push(new Missile({ x: this.x + this.width / 2, y: this.y, width: 10, height: 10 }))
    this.fireSound.pause()
    this.fireSound.currentTime = 0
    this.fireSound.play()
  }

  render () {
    // draw the player
    this.canvas.ctx.drawImage(this.texture, this.x, this.y, this.width, this.height)


    // if a missile reaches the canvas border, it destroys itself
    this.missiles = this.missiles.filter(missile => missile.y > 0)

    // draw missiles
    this.missiles.forEach(missile => {
      missile.move()
      missile.render()
    })
  }

  reset () {
    this.x = this.initialPosition.x
    this.y = this.initialPosition.y
    this.missiles = []
  }
}
