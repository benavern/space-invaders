import GameObject from './GameObject'

export default class Missile extends GameObject {
  constructor (...args) {
    super(...args)

    this.direction = { x: 0, y: -1 }
    this.velocity = 5
  }
}
