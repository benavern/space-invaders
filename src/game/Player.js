import GameObject from './GameObject'
import Missile from './Missile'
import playerImg from '../assets/player.png'

export default class Player extends GameObject {
  constructor (...args) {
    super(...args)

    this.velocity = 10
    this.missiles = []

    this.img = null
    this.loadImg()
  }

  loadImg () {
    let img = new Image(this.width, this.height)
    img.onload = () => this.img = img
    img.src = playerImg
  }

  fire () {
    this.missiles.push(new Missile({ x: this.x + this.width / 2, y: this.y, width: 10, height: 10 }))
  }

  reset () {
    this.x = this.initialPosition.x
    this.y = this.initialPosition.y
    this.missiles = []
  }
}
