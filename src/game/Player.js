import GameObject from "./GameObject";
import Missile from './Missile'

export default class Player extends GameObject {
  constructor ({ x, y, width, height }) {
    super({ x, y, width, height })
    this.velocity = 10
    this.missiles = []
  }

  fire () {
    this.missiles.push(new Missile({ x: this.x + this.width / 2, y: this.y, width: 20, height: 20 }))
  }

  reset () {
    this.x = this.initialPosition.x
    this.y = this.initialPosition.y
    this.missiles = []
  }
}
