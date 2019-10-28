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
  socket.emit('bootstrap', game.players)

  socket.broadcast.emit('player-add', socket.id)

  socket.on('player-update', data => {
    game.addPlayer(socket.id, data)

    socket.broadcast.emit('player-update', { ...data, guid: socket.id })
  })

  socket.on('disconnect', () => {
    console.log(`player disconnected ${socket.id}`)
    game.removePlayer(socket.id)
    socket.broadcast.emit('player-remove', socket.id)
  })
})

server.listen(3000, function() {
  console.log('> Server listening on port:', 3000)
})

function createGame() {
  const game = {
    players: {},
    addPlayer,
    removePlayer
  }

  function addPlayer(socketId, data) {
    return (game.players[socketId] = data)
  }

  function removePlayer(socketId) {
    delete game.players[socketId]
  }

  return game
}
