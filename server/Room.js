const encode = JSON.stringify

export default class Room {
  constructor () {
    this.players = []
    this.host = null
  }

  boardcast (method, params) {
    console.log('BoardCast: ' + encode([1, 2, method, Array.prototype.slice.call(arguments, 1)]))
    this.players.forEach((player) => {
      player.socket.write(encode([1, 2, method, Array.prototype.slice.call(arguments, 1)]))
    })
  }

  boardcastPlayerList () {
    var playerList = []
    this.players.forEach((player, idx) => {
      playerList.push({
        id: player.socket.id,
        nickname: player.nickname,
        uid: idx + 1,
        isHost: player === this.host
      })
    })

    this.boardcast('PlayerList', playerList)
  }

  joined (player) {
    this.players.push(player)
    if (!this.host) {
      this.host = player
    }

    this.boardcastPlayerList()
  }

  leaved (player) {
    this.players = this.players.filter((p) => { return player !== p })
    this.host = this.players[0]
    this.StopGame()

    if (this.host) {
      this.boardcastPlayerList()
    }
  }

  randomMove (prev) {
    let next
    while (1) {
      next = Math.floor(Math.random() * 4)
      if ((next + 2) % 4 !== prev) {
        break
      }
    }
    return next
  }

  StartGame () {
    this.players.forEach(this.spawnPlayers)
    this.boardcast('StartGame')

    this.timer = setInterval(() => {
      let moves = []
      this.players.forEach((player) => {
        // let next = this.randomMove(player.move)
        // moves.push(next)
        moves.push(player.move)
        player.move = -1
      })

      this.boardcast('TurnOver', moves)
    }, 500)
  }

  StopGame () {
    clearInterval(this.timer)
    this.boardcast('StopGame')
  }

  AddApple (position) {
    this.boardcast('AddApple', { x: position.x, y: position.y })
  }

  spawnPlayers () {

  }
}
