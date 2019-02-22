import Player from "./Player";
import Enemy from "./Enemy";

export default class Game {
  constructor(el, nbEnemies = 3) {
    this.canvas = document.querySelector(el)
    this.ctx = this.canvas.getContext('2d')
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.canvas.width = this.width
    this.canvas.height = this.height

    this.paused = false

    this.player = new Player(this.width / 2, this.height - 150)
    this.playerVect = 0

    this.enemies = this.generateEnemies(nbEnemies)

    this.initListeners()
  }

  initListeners() {
    window.addEventListener('keydown', e => {
      // move right
      if (e.keyCode === 39 && this.playerVect === 0) this.playerVect = 1
      // move left
      if (e.keyCode === 37 && this.playerVect === 0) this.playerVect = -1
    })

    window.addEventListener('keyup', e => {
      // stop moving
      if (e.keyCode === 39 && this.playerVect === 1 || e.keyCode === 37 && this.playerVect === -1) this.playerVect = 0
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
      enemies.push(new Enemy((this.width * (i / nb)) + (this.width / (2 * nb)), 100))
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
    this.player.moveX(this.playerVect, this.width)
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height)
  }


  renderEnemy(enemy) {
    this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
  }

  renderEnemies() {
    this.enemies.forEach(enemy => {
      enemy.moveY(1)
      if (enemy.y + enemy.height > this.player.y) {
        this.loose()
        return
      }
      this.renderEnemy(enemy)
    })
  }

  update() {
    if (this.paused) return
    this.render()

    requestAnimationFrame(this.update.bind(this))
  }

  start() {
    this.paused = false
    this.update()
  }

  restart () {
    this.reset()
    this.start()
  }

  pause() {
    this.paused = true
  }

  reset() {
    this.pause()
    this.playerVect = 0
    this.player.reset()
    this.enemies.forEach(enemy => enemy.reset())
  }

  loose() {
    this.pause()
    if (confirm('You Lose! \nDo you want to try again ?')) {
      this.restart()
    }
  }
}
