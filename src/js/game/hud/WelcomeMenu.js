import { canvas } from '../Canvas'
import Events from '../Events'
import { Button, Text, Title } from './elements'

export default class {
  constructor () {
    this.title = new Title({ text: 'Space Invaders', x: canvas.width / 2, y: canvas.height / 2 - 75 })
    this.text1 = new Text({ text: 'Welcome on this game!', x: canvas.width / 2, y: canvas.height / 2 - 25 })
    this.text2 = new Text({ text: 'Do you want to start ?', x: canvas.width / 2, y: canvas.height / 2 + 25 })
    this.btn = new Button({ text: 'Start', x: canvas.width / 2, y: canvas.height / 2 + 50 })
    this.events = new Events()

    this.initListeners()
  }

  initListeners () {
    this.btn.events.on('click', () => {
      this.events.emit('start')
    })
  }

  render () {
    // overlay
    canvas.ctx.fillStyle = '#000000dd'
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height)

    // title
    this.title.render()

    // Text
    this.text1.render()
    this.text2.render()

    // resume button
    this.btn.render()
  }
}
