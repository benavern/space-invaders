import Spaceship from "./Spaceship";

export default class Player extends Spaceship {
  constructor ({x, y, width, height}) {
    super({x, y, width, height})
    this.velocity = 10
  }
}
