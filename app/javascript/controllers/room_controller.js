// controller.js
import { Controller } from "@hotwired/stimulus";
import consumer from "./../channels/consumer";
import * as GameFunctions from "./services/game_function";

export default class extends Controller {
  gameState = JSON.parse(document.querySelector("#game_state").innerHTML);
  gameActive = true;
  gamePlayed = false;
  currentPlayer = document.querySelector("#current_player").value;
  statusDisplay = document.querySelector("#status");
  count = document.querySelector("#numberTurns");
  p1 = document.querySelector("#player1");
  p2 = document.querySelector("#player2");
  playerIdX = document.querySelector("#player-X")
  playerIdO = document.querySelector("#player-O")

  winnMessage = (name) => `${name} has won!`;
  drawMessage = () => `It's a draw!`;

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
    this.roomId = this.data.get("idValue");
    this.gameId = this.data.get("gameIdValue");
    this.currentPlayerId = this.data.get("currentPlayerIdValue");
    this.channel = consumer.subscriptions.create(
      { channel: "RoomChannel", room: this.roomId },
      {
        connected: GameFunctions.handleConnected.bind(this),
        disconnected: GameFunctions.handleDisconnected.bind(this),
        received: this._handleReceived.bind(this)
      }
    );

  }

  _handleReceived(res) {
    const cell = document.getElementById(`cell-${res.data.cell_number}`);
    if (res.type === "play_game") {
      location.reload()
    } else if (res.type === "game_over"){
      this.statusDisplay.innerHTML = this.winnMessage(res.player_name);
      this.statusDisplay.style.color = "#139de2";
      this.gameActive = false
    } else {
      cell.innerHTML = res.sign;
      this.gameState = res.game_states

      if (res.sign === this.currentPlayer){
        this.gameActive = false
      } else {
        this.gameActive = true
      }
    }
    
    GameFunctions.handlePlayerTurn(res.sign, this.p1, this.p2)
    this.handleResult()
  }
  

  handleClick(event) {
    const clickedIndex = event.params.id;

    if(!this.gameId ) {
      return alert("click play button");
    }

    if (
      this.gameState[clickedIndex] !== "" ||
      !this.gameActive ||
      !this.gameId
    )
      return;
    
    this.gamePlayed = true
    this.channel.perform("move", {
      room: this.roomId,
      game_id: this.gameId,
      cell: clickedIndex,
      player_id: this.currentPlayerId,
      sign: this.currentPlayer
    });

    this.gameState[clickedIndex] = this.currentPlayer;
    event.target.innerHTML = this.currentPlayer;
    this.count.innerHTML = +this.count.innerHTML + 1;
    this.handleResult();
  }

  handleResult() {
    if(!this.gameActive)
    return;
    
    let playerIds
    let roundWon = false,
      winLine,
      a,
      b,
      c,
      i;

    for (i = 0; i < 8; ++i) {
      winLine = this.winnLines[i];
      [a, b, c] = winLine.map(index => this.gameState[index]);

      if (a === b && b === c && c !== "") {
        if (a === "X" && b === "X" && c === "X") {
          this.sendWinner(this.playerIdX.value)
        }else{
          this.sendWinner(this.playerIdO.value)
        }

        roundWon = true;
        break;
      }
    }

    if (roundWon || !this.gameState.includes("")) {
      if (roundWon) {
        GameFunctions.winColors(winLine);
      } else this.statusDisplay.innerHTML = this.drawMessage();

      this.gameActive = false;
      return;
    }
  }

  playGame(event) {

    fetch(`/rooms/${this.roomId}/play`, {
      method: "put"
    })
    .then((rsp) => {
    
    });
  }

  sendWinner(player_id){
    fetch(`/rooms/${this.roomId}/winning`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({game_id: this.gameId, player_id: player_id})
    })
  }
}
