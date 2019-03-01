class Canvas {
  constructor ({ el, width, height }) {
    this.el = document.querySelector(el)
    this.ctx = this.el.getContext('2d')

    this.width = width
    this.height = height

    this.el.width = width
    this.el.height = height
  }

  resize ({ width = 0, height = 0 }) {
    this.width = width
    this.height = height

    this.el.width = width
    this.el.height = height
  }

  fullscreen() {
    if(!document.fullscreenElement) {
      if (this.el.requestFullscreen) {
        this.el.requestFullscreen()
      } else if (this.el.mozRequestFullScreen) { /* Firefox */
        this.el.mozRequestFullScreen()
      } else if (this.el.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        this.el.webkitRequestFullscreen()
      } else if (this.el.msRequestFullscreen) { /* IE/Edge */
        this.el.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }

  clear () {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}

// access canvas
export let canvas

// init canvas
export function initCanvas(...args) {
  canvas = new Canvas(...args)
  return canvas
}
