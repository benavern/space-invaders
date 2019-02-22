import Spaceship from "./Spaceship";

export default class Ennemy extends Spaceship {

  constructor (x = 0, y = 0, width = 125, height = 75) {
    super(x, y, width, height)
    this.velocity = 1
  }

  moveY (direction, limit) {
    const newPosition = this.y + direction * this.velocity
    if (limit && (newPosition < 0 || newPosition > limit - this.height)) return
    this.y = newPosition
  }
}
