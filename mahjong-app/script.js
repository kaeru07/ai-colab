const tileTypes = [
  ...Array.from({ length: 9 }, (_, i) => `${i + 1}m`),
  ...Array.from({ length: 9 }, (_, i) => `${i + 1}p`),
  ...Array.from({ length: 9 }, (_, i) => `${i + 1}s`),
  "E",
  "S",
  "W",
  "N",
  "P",
  "F",
  "C"
];

const tileLabels = {
  E: "東", S: "南", W: "西", N: "北", P: "白", F: "發", C: "中"
};

const state = {
  wall: [],
  hand: [],
  drawnTile: null,
  discards: [],
  turn: 0,
  active: false,
  won: false,
  selectedTile: null
};

const el = {
  newGameBtn: document.getElementById("new-game-btn"),
  drawBtn: document.getElementById("draw-btn"),
  discardSelectedBtn: document.getElementById("discard-selected-btn"),
  discardDrawnBtn: document.getElementById("discard-drawn-btn"),
  selectedTileLabel: document.getElementById("selected-tile-label"),
  wallCount: document.getElementById("wall-count"),
  turnCount: document.getElementById("turn-count"),
  gameState: document.getElementById("game-state"),
  hand: document.getElementById("hand"),
  drawnTile: document.getElementById("drawn-tile"),
  discards: document.getElementById("discards"),
  log: document.getElementById("log")
};

function tileName(code) {
  return tileLabels[code] ?? code;
}

function makeWall() {
  const wall = [];
  tileTypes.forEach((type) => {
    for (let i = 0; i < 4; i += 1) wall.push(type);
  });
  for (let i = wall.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [wall[i], wall[j]] = [wall[j], wall[i]];
  }
  return wall;
}

function log(msg) {
  const li = document.createElement("li");
  li.textContent = msg;
  el.log.prepend(li);
}

function sortHand(hand) {
  const order = new Map(tileTypes.map((tile, idx) => [tile, idx]));
  hand.sort((a, b) => order.get(a) - order.get(b));
}

function selectTile(tile) {
  if (!state.drawnTile || !state.active) return;
  state.selectedTile = tile;
  render();
}

function newGame() {
  state.wall = makeWall();
  state.hand = state.wall.splice(0, 13);
  sortHand(state.hand);
  state.drawnTile = null;
  state.discards = [];
  state.turn = 0;
  state.active = true;
  state.won = false;
  state.selectedTile = null;
  el.log.innerHTML = "";
  log("新しい局を開始しました。ツモってください。");
  render();
}

function drawTile() {
  if (!state.active || state.drawnTile) return;
  if (state.wall.length === 0) {
    state.active = false;
    log("流局：山が尽きました。");
    render();
    return;
  }
  state.drawnTile = state.wall.shift();
  state.turn += 1;
  state.selectedTile = null;
  log(`${state.turn}巡目 ツモ: ${tileName(state.drawnTile)}`);

  const candidate = [...state.hand, state.drawnTile];
  if (isWinningHand(candidate)) {
    state.won = true;
    state.active = false;
    log("🎉 ツモ和了！おめでとうございます。");
  }

  render();
}

function discardSelectedTile() {
  if (!state.selectedTile) return;
  discardTile(state.selectedTile);
}

function discardTile(tile, fromDrawn = false) {
  if (!state.active || !state.drawnTile) return;

  if (fromDrawn) {
    state.discards.push(state.drawnTile);
    log(`打牌: ${tileName(state.drawnTile)}（ツモ切り）`);
  } else {
    const index = state.hand.indexOf(tile);
    if (index < 0) return;
    state.hand.splice(index, 1);
    state.hand.push(state.drawnTile);
    sortHand(state.hand);
    state.discards.push(tile);
    log(`打牌: ${tileName(tile)}`);
  }

  state.drawnTile = null;
  state.selectedTile = null;
  render();
}

function isWinningHand(tiles) {
  if (tiles.length !== 14) return false;
  const counts = countTiles(tiles);

  for (const tile of tileTypes) {
    if ((counts[tile] ?? 0) >= 2) {
      counts[tile] -= 2;
      if (canMakeMelds(counts)) {
        counts[tile] += 2;
        return true;
      }
      counts[tile] += 2;
    }
  }

  return false;
}

function countTiles(tiles) {
  return tiles.reduce((acc, t) => {
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});
}

function canMakeMelds(counts) {
  const remaining = Object.values(counts).reduce((a, b) => a + b, 0);
  if (remaining === 0) return true;

  const first = tileTypes.find((t) => (counts[t] ?? 0) > 0);
  if (!first) return true;

  if (counts[first] >= 3) {
    counts[first] -= 3;
    if (canMakeMelds(counts)) {
      counts[first] += 3;
      return true;
    }
    counts[first] += 3;
  }

  const suit = first.at(-1);
  if (["m", "p", "s"].includes(suit)) {
    const n = Number(first[0]);
    const t2 = `${n + 1}${suit}`;
    const t3 = `${n + 2}${suit}`;
    if (n <= 7 && (counts[t2] ?? 0) > 0 && (counts[t3] ?? 0) > 0) {
      counts[first] -= 1;
      counts[t2] -= 1;
      counts[t3] -= 1;
      if (canMakeMelds(counts)) {
        counts[first] += 1;
        counts[t2] += 1;
        counts[t3] += 1;
        return true;
      }
      counts[first] += 1;
      counts[t2] += 1;
      counts[t3] += 1;
    }
  }

  return false;
}

function render() {
  el.wallCount.textContent = state.wall.length;
  el.turnCount.textContent = state.turn;

  if (state.won) {
    el.gameState.textContent = "和了";
  } else if (state.active) {
    el.gameState.textContent = state.drawnTile ? "打牌待ち" : "ツモ待ち";
  } else {
    el.gameState.textContent = "局終了";
  }

  el.drawBtn.disabled = !state.active || !!state.drawnTile;
  el.discardDrawnBtn.disabled = !state.active || !state.drawnTile;
  el.discardSelectedBtn.disabled = !state.active || !state.drawnTile || !state.selectedTile;
  el.selectedTileLabel.textContent = `選択中の牌: ${state.selectedTile ? tileName(state.selectedTile) : "なし"}`;

  el.hand.innerHTML = "";
  state.hand.forEach((tile) => {
    const tileEl = document.createElement("button");
    tileEl.className = `tile${state.selectedTile === tile ? " selected" : ""}`;
    tileEl.type = "button";
    tileEl.innerHTML = `<span class="tile-code">${tileName(tile)}</span>`;
    tileEl.addEventListener("click", () => selectTile(tile));

    if (state.drawnTile) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "捨てる";
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        discardTile(tile);
      });
      tileEl.appendChild(btn);
    }

    el.hand.appendChild(tileEl);
  });

  el.drawnTile.textContent = state.drawnTile ? tileName(state.drawnTile) : "-";

  el.discards.innerHTML = "";
  state.discards.forEach((tile) => {
    const d = document.createElement("div");
    d.className = "tile";
    d.textContent = tileName(tile);
    el.discards.appendChild(d);
  });
}

el.newGameBtn.addEventListener("click", newGame);
el.drawBtn.addEventListener("click", drawTile);
el.discardSelectedBtn.addEventListener("click", discardSelectedTile);
el.discardDrawnBtn.addEventListener("click", () => discardTile(state.drawnTile, true));

render();
