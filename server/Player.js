import Room from './Room'

// FIXME: Room Manager ?
let rooms = {}
rooms[1] = new Room()

export default class Player {
  constructor (socket, nickname) {
    this.socket = socket
    this.nickname = nickname
    this.room = null
    this.move = 1
  }

  disconnect () {
    this.LeaveRoom()
  }

  CreateRoom () {
    let i
    for (i = 1; i < 100; i++) {
      if (!rooms[i]) {
        break
      }
    }

    this.room = rooms[i] = new Room()
    this.JoinRoom(i)
  }

  JoinRoom (roomId) {
    this.room = rooms[roomId]
    this.room.joined(this)
  }

  LeaveRoom () {
    if (this.room) {
      this.room.leaved(this)
      this.room = null
    }
  }

  Move (direction) {
    this.move = direction
  }
}

Player.prototype.onClick = () => {
  this.element
}
