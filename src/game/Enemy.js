import Spaceship from "./Spaceship";

export default class Ennemy extends Spaceship {
  constructor ({x, y, width, height}) {
    super({x, y, width, height})
    this.velocity = 1
  }
}
