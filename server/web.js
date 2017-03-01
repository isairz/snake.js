import Express from 'express'
import net from 'net'
import path from 'path'

const app = new Express()

app.use(Express.static(path.join(__dirname, '..', 'static')))
const http = require('http').Server(app)
const io = require('socket.io')(http)

io.on('connection', (socket) => {
  const client = new net.Socket()
  client.connect(5000, 'localhost', () => {
    socket.on('data', (data) => {
      client.write(data)
    })

    socket.on('disconnect', () => {
      client.end()
    })
  })

  client.on('data', (data) => {
    console.log(data.toString())
    socket.emit('data', data.toString())
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
