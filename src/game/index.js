import Player from './Player'
import Enemy from './Enemy'
import gameMusic from '../assets/spaceinvaders1.mpeg'
import looseSound from '../assets/explosion.wav'
import killSound from '../assets/invaderkilled.wav'

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
    this.canvas = document.querySelector(el)
    this.ctx = this.canvas.getContext('2d')

    this.nbEnemies = nbEnemies

    this.paused = true
    this.state = 0 // -1 = loose | 0 = continue | 1 = win

    this.initCanvas()
    this.initPlayer()
    this.initEnemies()
    this.initListeners()
    this.initSounds()

    this.render()
  }

  initCanvas() {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.canvas.width = this.width
    this.canvas.height = this.height
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
    window.addEventListener('keydown', (e) => {
      // Do nothing if game is paused
      if (this.paused) return

      // prevent page to move on key press
      if(Object.values(KEYBOARD).includes(e.keyCode)) e.preventDefault()

      // move right
      if (e.keyCode === KEYBOARD.RIGHT) this.playerVect.x = 1
      // move left
      if (e.keyCode === KEYBOARD.LEFT) this.playerVect.x = -1
      // don't move if player has reached the sides of the game screen
      if ((this.playerVect.x < 0 && this.player.x < 0) || (this.playerVect.x > 0 && (this.player.x + this.player.width > this.width))) this.playerVect.x = 0
    })

    window.addEventListener('keyup', (e) => {
      // pause
      if (e.keyCode === KEYBOARD.PAUSE) !this.paused ? this.pause() : this.start()

      // Do nothing if game is paused
      if (this.paused) return

      // prevent page to move on key press
      if(Object.values(KEYBOARD).includes(e.keyCode)) e.preventDefault()

      // stop moving
      if ((e.keyCode === KEYBOARD.RIGHT  || e.keyCode === KEYBOARD.LEFT) && this.playerVect.x) this.playerVect.x = 0
      // fire
      if (e.keyCode === KEYBOARD.FIRE) this.player.fire()
      // fullscreen
      if (e.keyCode === KEYBOARD.FULLSCREEN) this.fullscreen()
    })
  }

  fullscreen() {
    if(!document.fullscreenElement) {
      if (this.canvas.requestFullscreen) {
        this.canvas.requestFullscreen();
      } else if (this.canvas.mozRequestFullScreen) { /* Firefox */
        this.canvas.mozRequestFullScreen();
      } else if (this.canvas.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        this.canvas.webkitRequestFullscreen();
      } else if (this.canvas.msRequestFullscreen) { /* IE/Edge */
        this.canvas.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    this.initCanvas()
  }

  initSounds() {
    this.music = new Audio(gameMusic)
    this.music.load()
    this.music.loop = true
    // this.music.autoplay = true

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
    this.initCanvas()
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
