import { canvas } from '../../Canvas'

export default class Text {
  constructor ({ text = 'Text', x = 50, y = 50, color = '#fff', align = 'center' }) {
    this.text = text
    this.x = x
    this.y = y
    this.color = color
    this.align = align
    this.size = 16
  }

  updateText(newText) {
    this.text = newText
  }

  render () {
    // draw the text
    canvas.ctx.font = `${this.size}px VT323`
    canvas.ctx.fillStyle = this.color
    canvas.ctx.textAlign = this.align
    canvas.ctx.fillText(this.text, this.x , this.y)
  }
}
