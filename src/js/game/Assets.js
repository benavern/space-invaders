import gameMusic from '../../assets/spaceinvaders1.mpeg'
import looseSound from '../../assets/explosion.wav'
import enemyTexture from '../../assets/enemy.png'
import killSound from '../../assets/invaderkilled.wav'
import playerTexture from '../../assets/player.png'
import fireSound from '../../assets/shoot.wav'

export default class Assets {
  constructor () {
    this.music = new Audio(gameMusic)
    this.looseSound = new Audio(looseSound)
    this.enemyTexture = new Image()
    this.killSound = new Audio(killSound)
    this.playerTexture = new Image()
    this.fireSound = new Audio(fireSound)
  }

  load () {
    return Promise.all([
      this.loadAudio(this.music),
      this.loadAudio(this.looseSound),
      this.loadTexture(this.enemyTexture, enemyTexture),
      this.loadAudio(this.killSound),
      this.loadTexture(this.playerTexture, playerTexture),
      this.loadAudio(this.fireSound)
    ])
  }

  loadAudio (audio) {
    return new Promise((resolve, reject) => {
      // on load success
      audio.oncanplaythrough = () => {
        resolve(audio)
      }
      // on load error
      audio.onerror = err => {
        reject(err)
      }
      // audio.load()
    })
  }

  loadTexture (texture, src) {
    return new Promise((resolve, reject) => {
      // on load success
      texture.onload = () => {
        resolve(texture)
      }
      // on load error
      texture.onerror = err => {
        reject(err)
      }
      texture.src = src
    })
  }
}
