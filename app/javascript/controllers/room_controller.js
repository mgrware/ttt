// controller.js
import { Controller } from "@hotwired/stimulus";
import consumer from "./../channels/consumer";
import * as GameFunctions from "./services/game_function";

export default class extends Controller {
  gameState = JSON.parse(document.querySelector("#game_state").innerHTML);
  gameActive = true;
  currentPlayer = document.querySelector("#current_player").value;
  statusDisplay = document.querySelector("#status");
  count = document.querySelector("#numberTurns");

  winnMessage = () => `${this.currentPlayer} has won!`;
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
    console.log(this.gameState)
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
    }
    cell.innerHTML = res.sign;
    this.gameState = res.game_states
  }
  

  handleClick(event) {
    const clickedIndex = event.params.id;
    console.log(this.gameState)
    if (
      this.gameState[clickedIndex] !== "" ||
      !this.gameActive ||
      !this.gameId
    )
      return;

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
        roundWon = true;
        break;
      }
    }

    if (roundWon || !this.gameState.includes("")) {
      if (roundWon) {
        this.statusDisplay.innerHTML = this.winnMessage();
        this.statusDisplay.style.color = "#139de2";
        GameFunctions.winColors(winLine);
      } else this.statusDisplay.innerHTML = this.drawMessage();

      this.gameActive = false;
      return;
    }

    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    GameFunctions.handlePlayerTurn(
      this.currentPlayer,
      document.querySelector("#player1"),
      document.querySelector("#player2")
    );
  }

  playGame(event) {
    fetch(`/rooms/${this.roomId}/play`, {
      method: "put"
    })
    .then((rsp) => rsp.json());
  }
}
