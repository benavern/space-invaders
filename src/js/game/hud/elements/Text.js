import { canvas } from '../../Canvas'

export default class Text {
  constructor ({ text = 'Text', x = 50, y = 50, color = '#fff' }) {
    this.text = text
    this.x = x
    this.y = y
    this.color = color
    this.size = 16
  }

  render () {
    // draw the text
    canvas.ctx.font = `${this.size}px sans-serif`
    canvas.ctx.fillStyle = this.color
    canvas.ctx.textAlign = "center"
    canvas.ctx.fillText(this.text, this.x , this.y)
  }
}
