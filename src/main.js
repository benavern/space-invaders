import Game from './game'

const game = new Game({
  el: '#game',
  nbEnemies: 5
})

game.start()
