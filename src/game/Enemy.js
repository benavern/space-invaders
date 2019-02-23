import GameObject from './GameObject'
import enemyImg from '../assets/enemy.png'

export default class Ennemy extends GameObject {

  constructor (...args) {
    super(...args)

    this.img = null
    this.loadImg()
  }

  loadImg () {
    let img = new Image(this.width, this.height)
    img.onload = () => this.img = img
    img.src = enemyImg
  }
}
