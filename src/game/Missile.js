import GameObject from "./GameObject";

export default class Missile extends GameObject {
  constructor ({x, y, width, height}) {
    super({x, y, width, height})
    this.velocity = 5
  }
}
