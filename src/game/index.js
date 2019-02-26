import { initCanvas } from './Canvas';
import Assets from './Assets'
import Player from './Player'
import Enemy from './Enemy'

const KEYBOARD = {
  LEFT: 37,
  RIGHT: 39,
  FIRE: 32, // space
  PAUSE: 27, // escape
  FULLSCREEN: 70 // "F"
}

export default class Game {
  /**
   * Space invaders game constructor
   * @param {Object} params - initialisation parameters
   * @param {String} params.el - css selector for the canvas element
   * @param {Integer} params.nbEnemies - number of enemies to generate
   */
  constructor({ el, nbEnemies = 3 }) {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas = initCanvas({ el, width: this.width, height: this.height })
    this.nbEnemies = nbEnemies

    // assets
    this.assets = new Assets()

    // game state
    this.paused = true
    this.loading = true

    // player
    this.player = this.generatePlayer()

    // enemies
    this.enemies = this.generateEnemies(this.nbEnemies)
    this.enemiesChangeDirection = false

    // game music
    this.music = this.assets.music
    this.music.loop = true

    this.looseSound = this.assets.looseSound

    this.init()
  }

  init () {
    this.assets.load()
      .then(() => {
        this.loading = false
        this.render()
        this.initListeners()
      })
      .catch(err => {
        this.loading = true
        console.error(err)
      })
  }

  initListeners() {
    window.addEventListener('keydown', (e) => {
      // Do nothing if game is paused
      if (this.paused || this.loading) return

      // prevent page to move on key press
      if(Object.values(KEYBOARD).includes(e.keyCode)) e.preventDefault()

      if(e.keyCode === KEYBOARD.RIGHT || e.keyCode === KEYBOARD.LEFT) {
        this.player.direction.x = 0
        // move right
        if (e.keyCode === KEYBOARD.RIGHT && this.player.x + this.player.width < this.width) this.player.direction.x = 1
        // move left
        if (e.keyCode === KEYBOARD.LEFT && this.player.x > 0) this.player.direction.x = -1
      }
    })

    window.addEventListener('keyup', (e) => {
      if (this.loading) return

      // pause
      if (e.keyCode === KEYBOARD.PAUSE) !this.paused ? this.pause() : this.start()

      // Do nothing if game is paused
      if (this.paused) return

      // prevent page to move on key press
      if(Object.values(KEYBOARD).includes(e.keyCode)) e.preventDefault()

      // stop moving
      if ((e.keyCode === KEYBOARD.RIGHT  || e.keyCode === KEYBOARD.LEFT) && this.player.direction.x) this.player.direction.x = 0
      // fire
      if (e.keyCode === KEYBOARD.FIRE) this.player.fire()
      // fullscreen
      if (e.keyCode === KEYBOARD.FULLSCREEN) this.canvas.fullscreen()
    })
  }

  generatePlayer () {
    return new Player({
      x: this.width / 2,
      y: this.height - 100,
      width: 50,
      height: 50,
      texture: this.assets.playerTexture,
      fireSound: this.assets.fireSound
    })
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
        height: 75,
        texture: this.assets.enemyTexture,
        killSound: this.assets.killSound
      }))
    }
    return enemies
  }

  render() {
    // clear the canvas before render
    this.canvas.clear()

    this.renderPlayer()
    this.renderEnemies()
  }

  renderPlayer() {
    this.player.move()
    this.player.render()
  }

  renderEnemies() {
    let changeDirection = false
    this.enemies.forEach(enemy => {
      enemy.move(this.enemiesChangeDirection)
      enemy.render()
      // if any enemy reaches the edges of the game container, change enemies direction
      if (enemy.x < 0 || enemy.x + enemy.width > this.width) changeDirection = true
    })

    // next update loop, are they gonna change direction ?
    this.enemiesChangeDirection = changeDirection
  }

  update() {
    this.render()
    this.checkCollisions()

    if (this.paused) return
    requestAnimationFrame(this.update.bind(this))
  }

  checkCollisions () {
    let enemiesHit = []
    let missilesHit = []

    this.enemies.forEach(enemy => {
      this.player.missiles.forEach(missile => {
        // if a player missile reaches an enemy, they both disappear
        if (missile.x > enemy.x && missile.x < enemy.x + enemy.width && missile.y > enemy.y && missile.y < enemy.y + enemy.height) {
          enemy.die()
          enemiesHit.push(enemy)
          missilesHit.push(missile)
        }
      })

      // if any enemy reaches the player y position, the game is lost
      if (enemy.y + enemy.height > this.player.y) this.loose()
    })

    this.enemies = this.enemies.filter(enemy => !enemiesHit.includes(enemy))
    this.player.missiles = this.player.missiles.filter(missile => !missilesHit.includes(missile))

    // if no enemies left, the game is won
    if (!this.enemies.length) this.win()
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
    this.player = this.generatePlayer()
    this.enemies = this.generateEnemies(this.nbEnemies)
    this.music.currentTime = 0
    this.render()
  }

  loose () {
    this.pause()
    this.looseSound.play()
    this.reset()
  }

  win () {
    this.pause()
    this.nbEnemies += 1
    this.reset()
  }
}
