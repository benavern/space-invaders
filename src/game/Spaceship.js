export default class Spaceship {
  /**
   * A spaceship is a position and a size
   * @param {Integer} x - horizontal position
   * @param {Integer} y - vertical position
   * @param {Integer} width - width
   * @param {Integer} height - height
   */
  constructor (x = 0, y = 0, width = 100, height = 100) {
    this.initialPos = { x, y }

    this.x = x - width / 2
    this.y = y - height / 2
    this.width = width
    this.height = height

    this.velocity = 10
  }

  /**
   * make the spaceship change its horizontal position
   * @param {Integer} direction - positive or negative
   * @param {Integer} limit - the new position can only be betwin 0 & the limit
   */
  moveX (direction, limit) {
    const newPosition = this.x + direction * this.velocity
    if (limit && (newPosition < 0 || newPosition > limit - this.width)) return
    this.x = newPosition
  }

  reset () {
    this.x = this.initialPos.x
    this.y = this.initialPos.y
  }
}
