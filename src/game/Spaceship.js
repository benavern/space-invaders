export default class Spaceship {
  /**
   * A spaceship is a position and a size
   * @param {Object} params - spaceship initialisation parameters
   * @param {Integer} params.x - spaceship horizontal position
   * @param {Integer} params.y - spaceship vertical position
   * @param {Integer} params.width - spaceship width
   * @param {Integer} params.height - spaceship height
   */
  constructor ({x = 0, y = 0, width = 50, height = 50}) {
    this.initialPosition = { x, y }

    this.x = x - width / 2
    this.y = y - height / 2
    this.width = width
    this.height = height

    this.velocity = 1
  }

  /**
   * make the spaceship change its position
   * @param {Object {x: Integer, y: Integer}} direction - positive or negative
   */
  move ({x = 0, y = 0}) {
    this.x += x * this.velocity
    this.y += y * this.velocity
  }

  reset () {
    this.x = this.initialPosition.x
    this.y = this.initialPosition.y
  }
}
