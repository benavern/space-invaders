import Player from './Player'
import Enemy from './Enemy'
import gameMusic from '../assets/spaceinvaders1.mpeg'
import looseSound from '../assets/explosion.wav'
import killSound from '../assets/invaderkilled.wav'

const LEFT = 37,
      RIGHT = 39,
      SPACE = 32,
      ESCAPE = 27

export default class Game {
  /**
   * Space invaders game constructor
   * @param {Object} params - initialisation parameters
   * @param {String} params.el - css selector for the canvas element
   * @param {Integer} params.nbEnemies - number of enemies to generate
   */
  constructor({ el, nbEnemies = 3 }) {
    this.canvas = document.querySelector(el)
    this.ctx = this.canvas.getContext('2d')
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.canvas.width = this.width
    this.canvas.height = this.height

    this.nbEnemies = nbEnemies

    this.paused = false
    this.state = 0 // -1 = loose | 0 = continue | 1 = win

    this.initPlayer()
    this.initEnemies()
    this.initListeners()
    this.initSounds()

    this.render()
  }

  initPlayer () {
    this.player = new Player({ x: this.width / 2, y: this.height - 100, width: 50, height: 50 })
    this.playerVect = { x: 0, y: 0 }
    this.playerMissilesVext = { x: 0, y: -1 }
  }

  initEnemies () {
    this.enemies = this.generateEnemies(this.nbEnemies)
    this.enemiesVect = { x: 1, y: 1 }
  }

  initListeners() {
    window.addEventListener('keydown', ({ keyCode }) => {
      // move right
      if (keyCode === RIGHT) this.playerVect.x = 1
      // move left
      if (keyCode === LEFT) this.playerVect.x = -1
      // don't move if player has reached the sides of the game screen
      if ((this.playerVect.x < 0 && this.player.x < 0) || (this.playerVect.x > 0 && (this.player.x + this.player.width > this.width))) this.playerVect.x = 0
    })

    window.addEventListener('keyup', ({ keyCode }) => {
      // stop moving
      if ((keyCode === RIGHT  || keyCode === LEFT) && this.playerVect.x) this.playerVect.x = 0
      // pause
      if (keyCode === ESCAPE) !this.paused ? this.pause() : this.start()
      // fire
      if (keyCode === SPACE) this.player.fire()
    })
  }

  initSounds() {
    this.music = new Audio(gameMusic)
    this.music.load()
    this.music.loop = true
    this.music.autoplay = true

    this.looseSound = new Audio(looseSound)
    this.looseSound.load()

    this.killSound = new Audio(killSound)
    this.killSound.load()
  }

  /**
   * generates a given number of enemies
   * @param {Integer} nb - the number of enemies to be created
   */
  generateEnemies(nb) {
    let enemies = []
    for (let i = 0; i < nb; i++) {
      enemies.push(new Enemy({
        x: (this.width * (i / nb)) + (this.width / (2 * nb)),
        y: 50 + 200 * Math.random(), // generates a random number beween 50 & 250
        width: 75,
        height: 75
      }))
    }
    return enemies
  }

  render() {
    // clear the canvas before render
    this.ctx.clearRect(0, 0, this.width, this.height)

    this.renderPlayer()
    this.renderEnemies()
  }

  renderPlayer() {
    // player object
    this.renderGameObject(this.player, this.playerVect)

    // player missiles
    this.renderMissiles(this.player.missiles, this.playerMissilesVext)
  }

  renderEnemies() {
    let changeDirection = false
    this.enemies.forEach(enemy => {
      this.renderGameObject(enemy, this.enemiesVect)
      // if any enemy reaches the edges of the game container, change enemies direction
      if (enemy.x < 0 || enemy.x + enemy.width > this.width) changeDirection = true
    })

    if (changeDirection) this.enemiesVect.x *= -1
  }

  renderGameObject(gameObject, moveVect) {
    gameObject.move(moveVect)
    if (gameObject.img) {
      this.ctx.drawImage(gameObject.img, gameObject.x, gameObject.y, gameObject.width, gameObject.height)
    } else {
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height)
    }
  }

  renderMissiles(missiles, moveVect) {
    missiles.forEach(missile => {
      this.renderGameObject(missile, moveVect)
    })
  }

  update() {
    if (this.paused || this.state) return
    this.render()
    this.checkCollisions()

    if (this.state) {
      this.checkState()
    } else {
      requestAnimationFrame(this.update.bind(this))
    }
  }

  checkCollisions () {
    let enemiesHit = []
    let missilesHit = []

    this.enemies.forEach(enemy => {
      this.player.missiles.forEach(missile => {
        // if a player missile reaches an enemy, they both disappear
        if (missile.x > enemy.x && missile.x < enemy.x + enemy.width && missile.y > enemy.y && missile.y < enemy.y + enemy.height) {
          enemiesHit.push(enemy)
          missilesHit.push(missile)
        }

        // if a missile reaches an edge of the screen it disappears
        if (missile.y < 0 || missile.y + missile.height > this.height) missilesHit.push(missile)
      })

      // if any enemy reaches the player y position, the game is lost
      if (enemy.y + enemy.height > this.player.y) this.state = -1
    })

    if (enemiesHit.length) {
      this.killSound.currentTime = 0
      this.killSound.play()
    }

    this.enemies = this.enemies.filter(enemy => !enemiesHit.includes(enemy))
    this.player.missiles = this.player.missiles.filter(missile => !missilesHit.includes(missile))

    // if no enemies left, the game is won
    if (!this.enemies.length) this.state = 1
  }

  checkState() {
    if (this.state > 0) this.win()
    if (this.state < 0) this.loose()
  }

  start() {
    this.resume()
    this.update()
  }

  pause() {
    this.paused = true
    this.music.pause()
  }

  resume () {
    this.paused = false
    this.music.play()
  }

  reset() {
    this.initPlayer()
    this.initEnemies()
    this.state = 0
    this.music.currentTime = 0
    this.render()
  }

  loose () {
    this.pause()
    this.looseSound.play()
    if(confirm('You loose!\nTry again?')) {
      this.reset()
      this.start()
    }
  }

  win () {
    this.pause()
    if(confirm('You win!\nTry again?')) {
      this.reset()
      this.start()
    }
  }
}
