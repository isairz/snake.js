import net from 'net'
import Player from './Player'

const decode = JSON.parse

let uid = 0

net.createServer((socket) => {
  const username = 'test' + (++uid) // FIXME: input username
  const player = new Player(socket, username)

  console.log('a user connected - ' + username)

  socket.on('data', (raw) => {
    const [type, msgid, method, params] = decode(raw)

    // Unused parameter
    ;type
    ;msgid

    console.log('Method Call : ' + method + '(' + params.toString() + ')')

    if (player[method]) {
      player[method].apply(player, params)
    } else if (player.room && player.room.host === player && player.room[method]) {
      player.room[method].apply(player.room, params)
    } else {
      console.error(method + ' isn\'t exit')
    }
  })

  socket.on('end', () => {
    player.disconnect()
  })

  socket.on('error', (error) => {
    // Error
    player.disconnect()
    console.error(error)
  })
}).listen('5000', () => {
  console.log('TCP listening on *:5000')
})
