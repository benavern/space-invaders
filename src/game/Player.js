import GameObject from './GameObject'
import Missile from './Missile'
import playerImg from '../assets/player.png'
import fireSound from '../assets/shoot.wav'

export default class Player extends GameObject {
  constructor (...args) {
    super(...args)

    this.velocity = 10
    this.missiles = []

    this.img = null
    this.loadImg()

    this.fireSound = new Audio(fireSound)
    this.fireSound.load()
  }

  loadImg () {
    let img = new Image(this.width, this.height)
    img.onload = () => this.img = img
    img.src = playerImg
  }

  fire () {
    this.missiles.push(new Missile({ x: this.x + this.width / 2, y: this.y, width: 10, height: 10 }))
    this.fireSound.pause()
    this.fireSound.currentTime = 0
    this.fireSound.play()
  }

  reset () {
    this.x = this.initialPosition.x
    this.y = this.initialPosition.y
    this.missiles = []
  }
}
