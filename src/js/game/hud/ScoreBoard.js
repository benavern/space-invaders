import { canvas } from '../Canvas'
import { Text } from './elements'

export default class {
  constructor () {
    this.fontSize = 16
    this.score = 0
    this.level = 0
    this.scoreText = new Text({ x: this.fontSize, y: this.fontSize * 1.5, align: 'left' })
    this.levelText = new Text({ x: canvas.width - this.fontSize, y: this.fontSize * 1.5, align: 'right' })

    this.update()
  }

  reset () {
    this.score = 0
    this.level = 0
    this.update()
  }

  incrementScore () {
    this.score++
    this.update()
  }

  levelup () {
    this.level++
    this.update()
  }

  update () {
    this.scoreText.updateText(`Score: ${this.score}`)
    this.levelText.updateText(`Level: ${this.level}`)
  }

  render () {
    // overlay
    canvas.ctx.fillStyle = '#000000dd'
    canvas.ctx.fillRect(0, 0, canvas.width, this.fontSize * 2)

    // score
    this.scoreText.render()

    // level
    this.levelText.render()
  }
}
