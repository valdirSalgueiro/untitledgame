console.log('> Script started')
const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const game = createGame()
let maxConcurrentConnections = 15

app.use(express.static(path.join(__dirname, 'build')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

setInterval(() => {
  io.emit('concurrent-connections', io.engine.clientsCount)
}, 5000)

io.on('connection', function (socket) {
  const admin = socket.handshake.query.admin

  if (io.engine.clientsCount > maxConcurrentConnections && !admin) {
    socket.emit('show-max-concurrent-connections-message')
    socket.conn.close()
    return
  } else {
    socket.emit('hide-max-concurrent-connections-message')
  }
  const playerState = game.addPlayer(socket.id)
  socket.emit('bootstrap', game)

  socket.broadcast.emit('player-update', {
    socketId: socket.id,
    newState: playerState
  })

  socket.on('player-move', (direction) => {
    game.movePlayer(socket.id, direction)

    const fruitColisionIds = game.checkForFruitColision()

    socket.broadcast.emit('player-update', {
      socketId: socket.id,
      newState: game.players[socket.id]
    })

    if (fruitColisionIds) {
      io.emit('fruit-remove', {
        fruitId: fruitColisionIds.fruitId,
        score: game.players[socket.id].score
      })
      socket.emit('update-player-score', game.players[socket.id].score)
    }
  })

  socket.on('disconnect', () => {
    game.removePlayer(socket.id)
    socket.broadcast.emit('player-remove', socket.id)
  })

  let fruitGameInterval
  socket.on('admin-start-fruit-game', (interval) => {
    console.log('> Fruit Game start')
    clearInterval(fruitGameInterval)

    fruitGameInterval = setInterval(() => {
      const fruitData = game.addFruit()

      if (fruitData) {
        io.emit('fruit-add', fruitData)
      }
    }, interval)
  })

  socket.on('admin-stop-fruit-game', () => {
    console.log('> Fruit Game stop')
    clearInterval(fruitGameInterval)
  })

  socket.on('admin-start-crazy-mode', () => {
    io.emit('start-crazy-mode')
  })

  socket.on('admin-stop-crazy-mode', () => {
    io.emit('stop-crazy-mode')
  })

  socket.on('admin-clear-scores', () => {
    game.clearScores()
    io.emit('bootstrap', game)
  })

  socket.on('admin-concurrent-connections', (newConcurrentConnections) => {
    maxConcurrentConnections = newConcurrentConnections
  })
})

server.listen(3000, function () {
  console.log('> Server listening on port:', 3000)
})

function createGame () {
  console.log('> Starting new game')
  let fruitGameInterval

  const game = {
    canvasWidth: 35,
    canvasHeight: 30,
    players: {},
    fruits: {},
    addPlayer,
    removePlayer,
    movePlayer,
    addFruit,
    removeFruit,
    checkForFruitColision,
    clearScores
  }

  function addPlayer (socketId) {
    return game.players[socketId] = {
      x: Math.floor(Math.random() * game.canvasWidth),
      y: Math.floor(Math.random() * game.canvasHeight),
      score: 0
    }
  }

  function removePlayer (socketId) {
    delete game.players[socketId]
  }

  function movePlayer (socketId, direction) {
    const player = game.players[socketId]

    if (direction === 'left' && player.x - 1 >= 0) {
      player.x = player.x - 1
    }

    if (direction === 'up' && player.y - 1 >= 0) {
      player.y = player.y - 1
    }

    if (direction === 'right' && player.x + 1 < game.canvasWidth) {
      player.x = player.x + 1
    }

    if (direction === 'down' && player.y + 1 < game.canvasHeight) {
      player.y = player.y + 1
    }

    return player
  }

  function addFruit () {
    const fruitRandomId = Math.floor(Math.random() * 10000000)
    const fruitRandomX = Math.floor(Math.random() * game.canvasWidth)
    const fruitRandomY = Math.floor(Math.random() * game.canvasHeight)

    for (fruitId in game.fruits) {
      const fruit = game.fruits[fruitId]

      if (fruit.x === fruitRandomX && fruit.y === fruitRandomY) {
        return false
      }
    }

    game.fruits[fruitRandomId] = {
      x: fruitRandomX,
      y: fruitRandomY
    }

    return {
      fruitId: fruitRandomId,
      x: fruitRandomX,
      y: fruitRandomY
    }
  }

  function removeFruit (fruitId) {
    delete game.fruits[fruitId]
  }

  function checkForFruitColision () {
    for (fruitId in game.fruits) {
      const fruit = game.fruits[fruitId]

      for (socketId in game.players) {
        const player = game.players[socketId]

        if (fruit.x === player.x && fruit.y === player.y) {
          player.score = player.score + 1
          game.removeFruit(fruitId)

          return {
            socketId: socketId,
            fruitId: fruitId
          }
        }
      }
    }
  }

  function clearScores () {
    for (socketId in game.players) {
      game.players[socketId].score = 0
    }
  }

  return game
}
