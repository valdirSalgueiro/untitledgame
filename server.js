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

const players = []

io.on('connection', function(socket) {
  console.log(`new player connected ${socket.id}`)
  socket.broadcast.emit('player-add', socket.id)

  socket.on('player-update', data => {
    players[socket.id] = data

    socket.broadcast.emit('player-update', {
      socketId: socket.id,
      data: players[socket.id]
    })
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('player-remove', socket.id)
  })
})

server.listen(3000, function() {
  console.log('> Server listening on port:', 3000)
})
