import { canvas } from '../../Canvas'
import Events from '../../Events'

export default class Button {
  constructor ({ text = 'Button', x = 50, y = 50, color = '#ba55ad', textColor = "#fff" }) {
    this.fontSize = 16
    this.width = (text.length * this.fontSize) + (this.fontSize * 2)
    this.height = this.fontSize * 3

    this.text = text
    this.x = x - this.width / 2 // so that origin is in the middle
    this.y = y
    this.color = color
    this.textColor = textColor

    this.events = new Events()
    this.initListeners()
  }

  initListeners () {
    canvas.el.addEventListener('click', e => {
      if (e.x > this.x && e.x < this.x + this.width && e.y > this.y && e.y < this.y + this.height) {
        this.events.emit('click')
      }
    })
  }

  render () {
    // draw the button
    canvas.ctx.fillStyle = this.color
    canvas.ctx.fillRect(this.x, this.y, this.width, this.height)

    // draw the text
    canvas.ctx.font = `${this.fontSize}px sans-serif`
    canvas.ctx.fillStyle = this.textColor
    canvas.ctx.textAlign = "center"
    canvas.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.fontSize * 1.9)
  }
}
