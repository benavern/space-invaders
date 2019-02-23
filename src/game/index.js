import Player from "./Player";
import Enemy from "./Enemy";

export default class Game {
  /**
   * Space invaders game constructor
   * @param {Object} params - initialisation parameters
   * @param {String} params.el - css selector for the canvas element
   * @param {Integer} params.nbEnemies - number of enemies to generate
   */
  constructor({el, nbEnemies = 3}) {
    this.canvas = document.querySelector(el)
    this.ctx = this.canvas.getContext('2d')
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.canvas.width = this.width
    this.canvas.height = this.height

    this.paused = true

    this.player = new Player({
      x: this.width / 2,
      y: this.height - 100,
      width: 50,
      height: 50
    })
    this.playerVect = {x: 0, y: 0}

    this.enemies = this.generateEnemies(nbEnemies)
    this.enemiesVect = {x: 1, y: 1}

    this.lost = false

    this.initListeners()
    this.render()
  }

  initListeners() {
    window.addEventListener('keydown', e => {
      // move right
      if (e.keyCode === 39) this.playerVect.x = 1
      // move left
      if (e.keyCode === 37) this.playerVect.x = -1
      // don't move if player has reached the sides of the game screen
      if ((this.playerVect.x < 0 && this.player.x < 0) || (this.playerVect.x > 0 && (this.player.x + this.player.width > this.width))) this.playerVect.x = 0
    })

    window.addEventListener('keyup', e => {
      // stop moving
      if ((e.keyCode === 39  || e.keyCode === 37) && this.playerVect.x) this.playerVect.x = 0
      // pause
      if (e.keyCode === 27) !this.paused ? this.pause() : this.start()
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
        y: 50 + 150 * Math.random(), // generates a random number beween 50 & 200
        width: 75,
        height: 50
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
    this.player.move(this.playerVect)
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height)
  }

  renderEnemy(enemy) {
    enemy.move(this.enemiesVect)
    this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
  }

  renderEnemies() {
    let dead = false
    let changeDirection = false
    this.enemies.forEach(enemy => {
      this.renderEnemy(enemy)
      // if any enemy reaches the edges of the game container, change enemies direction
      if (enemy.x < 0 || enemy.x + enemy.width > this.width) changeDirection = true
      // if any enemy reaches the player y position, the game is lost
      if (enemy.y + enemy.height > this.player.y) dead = true
    })

    if (changeDirection) this.enemiesVect.x *= -1
    if (dead) this.loose()
  }

  update() {
    if (this.paused) return
    if (this.lost) this.askForRestart()

    this.render()
    requestAnimationFrame(this.update.bind(this))
  }

  start() {
    this.resume()
    this.update()
  }

  pause() {
    this.paused = true
  }

  resume() {
    this.paused = false
  }

  reset() {
    this.playerVect = {x: 0, y: 0}
    this.enemiesVect = {x: 1, y: 1}
    this.player.reset()
    this.enemies.forEach(enemy => enemy.reset())
    this.lost = false
    this.render()
  }

  loose() {
    this.lost = true
  }

  askForRestart () {
    this.pause()
    this.reset()
    if (confirm('You Lose! \nDo you want to try again ?')) {
      this.resume()
    }
  }
}
