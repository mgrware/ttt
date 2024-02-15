import { Controller } from "@hotwired/stimulus"
import consumer from "./../channels/consumer"

export default class extends Controller {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  statusDisplay = document.querySelector("#status");
  count = document.querySelector("#numberTurns");
  
  winnMessage = () => `${this.currentPlayer} has won!`;
  drawMessage = () => `it's a draw!`;

  winnLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  connect() {
    this.roomId = this.data.get("idValue")
    this.gameId = this.data.get("gameIdValue")
    this.channel = consumer.subscriptions.create({channel: 'RoomChannel', room: this.roomId},
      {
        connected: this._connected.bind(this),
        disconnected: this._disconnected.bind(this),
        received: this._received.bind(this),
      }
    );
  }

  _connected() {}

  _disconnected() {}
  
  _received(data) {
    console.log(data)
  }

   handleClick(event) {
    let clickedIndex = event.params.id;
    console.log(this.gameId)
    if (this.gameState[clickedIndex] !== "" || !this.gameActive || !this.gameId) return;
    this.channel.perform('move', { room: this.roomId, game: this.gameId, cell: clickedIndex } )
    this.gameState[clickedIndex] = this.currentPlayer;
    event.target.innerHTML = this.currentPlayer;
    this.count.innerHTML = +this.count.innerHTML + 1;
    this.handleResult();
  }

  handleResult() {
    let roundWon = false,
        winLine,
        a,
        b,
        c,
        i;

    for (i = 0; i < 8; ++i) {
        winLine = this.winnLines[i];
        a = this.gameState[winLine[0]];
        b = this.gameState[winLine[1]];
        c = this.gameState[winLine[2]];
        if (a === b && b === c && c !== "") {
            roundWon = true;
            break;
        }
    }

    if (roundWon || !this.gameState.includes("")) {
        if (roundWon) {
            this.statusDisplay.innerHTML = this.winnMessage();
            this.statusDisplay.style.color = "#139de2";
            this.winColors(winLine);
        } else this.statusDisplay.innerHTML = this.drawMessage();
        this.gameActive = false;
        return;
    }

    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    this.handlePlayerTurn();
  }



  handlePlayerTurn() {
    let p1 = document.querySelector("#player1"),
    p2 = document.querySelector("#player2");

    if (this.currentPlayer === "X") {
        p1.style.background = "#8458B3";
        p2.style.background = "#d0bdf4";
    } else {
        p1.style.background = "#d0bdf4";
        p2.style.background = "#8458B3";
    }
  }

  winColors(line) {
    console.log(`${line}`);
    for (let i = 0; i < 3; ++i) {
        let cell = document.getElementById(`${line[i]}`);
        cell.style.color = "#139de2";
        cell.style.fontSize = "80px";
    }
  }

  playGame(event) {
    fetch(`http://localhost:3000/rooms/${this.roomId}/play`, {
      method: 'put'
    })
    .then(response => response.json())
    .then(result => {
      this.gameId = result.id
    }).catch(error => console.error(error))
  }
}
