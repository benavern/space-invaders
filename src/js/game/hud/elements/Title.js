import Text from './Text'

export default class Title extends Text {
  constructor (...args) {
    super(...args)
    this.size = 32
  }
}
