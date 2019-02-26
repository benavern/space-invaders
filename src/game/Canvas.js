class Canvas {
  constructor ({ el, width, height }) {
    this.canvas = document.querySelector(el)
    this.ctx = this.canvas.getContext('2d')

    this.width = width
    this.height = height

    this.canvas.width = width
    this.canvas.height = height
  }

  resize ({ width = 0, height = 0 }) {
    this.width = width
    this.height = height

    this.canvas.width = width
    this.canvas.height = height
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
