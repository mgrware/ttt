// gameFunctions.js

export function handleConnected() {}

export function handleDisconnected() {}

export function handlePlayerTurn(currentPlayer, p1, p2) {
  if (currentPlayer === "X") {
    setPlayerStyles(p1, "#8458B3");
    setPlayerStyles(p2, "#d0bdf4");
  } else {
    setPlayerStyles(p1, "#d0bdf4");
    setPlayerStyles(p2, "#8458B3");
  }
}

export function setPlayerStyles(player, background) {
  player.style.background = background;
}

export function winColors(line) {
  console.log(`${line}`);
  for (const index of line) {
    const cell = document.getElementById(`cell-${index}`);
    cell.style.color = "#139de2";
    cell.style.fontSize = "80px";
  }
}