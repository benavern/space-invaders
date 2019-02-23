import GameObject from './GameObject'

export default class Missile extends GameObject {
  constructor (...args) {
    super(...args)

    this.velocity = 5
  }
}
