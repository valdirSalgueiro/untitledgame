console.log('> Script started')
const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'build')))
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const game = createGame()

io.on('connection', function(socket) {
  console.log(`player connected ${socket.id}`)
  socket.emit('bootstrap', { players: game.players, socketId: socket.id })

  socket.broadcast.emit('player-add', socket.id)

  socket.on('player-update', data => {
    game.updatePlayer(socket.id, data)

    socket.broadcast.emit('player-update', { ...data, socketId: socket.id })
  })

  socket.on('player-shoot', () => {
    socket.broadcast.emit('player-shoot', socket.id)
  })

  socket.on('player-hit', data => {
    //console.log('player-hit')
    //console.log(data)
    socket.broadcast.emit('player-hit', data)
  })

  socket.on('player-spawn', () => {
    //console.log('player-spawn')
    //console.log(socket.id)
    socket.broadcast.emit('player-spawn', socket.id)
  })

  socket.on('disconnect', () => {
    console.log(`player disconnected ${socket.id}`)
    game.removePlayer(socket.id)
    socket.broadcast.emit('player-remove', socket.id)
  })
})

server.listen(5000, function() {
  console.log('> Server listening on port:', 5000)
})

function createGame() {
  const game = {
    players: {},
    updatePlayer,
    removePlayer
  }

  function updatePlayer(socketId, data) {
    return (game.players[socketId] = data)
  }

  function removePlayer(socketId) {
    delete game.players[socketId]
  }

  return game
}
