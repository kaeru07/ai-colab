const HANDS = [
  { cards: ["A♠", "K♠", "Q♠", "J♠", "10♠"], answer: "ロイヤルフラッシュ" },
  { cards: ["9♥", "8♥", "7♥", "6♥", "5♥"], answer: "ストレートフラッシュ" },
  { cards: ["K♣", "K♦", "K♥", "K♠", "2♦"], answer: "フォーカード" },
  { cards: ["Q♣", "Q♦", "Q♠", "8♥", "8♣"], answer: "フルハウス" },
  { cards: ["A♦", "J♦", "8♦", "5♦", "2♦"], answer: "フラッシュ" },
  { cards: ["10♣", "9♦", "8♠", "7♥", "6♦"], answer: "ストレート" },
  { cards: ["7♣", "7♦", "7♠", "K♥", "4♣"], answer: "スリーカード" },
  { cards: ["A♣", "A♥", "4♠", "4♦", "9♣"], answer: "ツーペア" },
  { cards: ["J♣", "J♥", "8♠", "6♦", "2♣"], answer: "ワンペア" },
  { cards: ["A♣", "J♥", "9♠", "6♦", "3♣"], answer: "ハイカード" },
];

const RANKS = [
  "ロイヤルフラッシュ",
  "ストレートフラッシュ",
  "フォーカード",
  "フルハウス",
  "フラッシュ",
  "ストレート",
  "スリーカード",
  "ツーペア",
  "ワンペア",
  "ハイカード",
];

const quizHand = document.getElementById("quizHand");
const rankButtons = document.getElementById("rankButtons");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");

const potSizeInput = document.getElementById("potSizeInput");
const callAmountInput = document.getElementById("callAmountInput");
const equityInput = document.getElementById("equityInput");
const calcOddsBtn = document.getElementById("calcOddsBtn");
const oddsResult = document.getElementById("oddsResult");

let currentHand = null;

function pickRandomHand() {
  currentHand = HANDS[Math.floor(Math.random() * HANDS.length)];
  quizHand.textContent = currentHand.cards.join("  ");
  quizFeedback.textContent = "";
}

function handleRankAnswer(selectedRank) {
  if (!currentHand) {
    return;
  }

  if (selectedRank === currentHand.answer) {
    quizFeedback.textContent = `✅ 正解！ ${currentHand.answer}`;
    quizFeedback.classList.add("ok");
    quizFeedback.classList.remove("ng");
  } else {
    quizFeedback.textContent = `❌ 不正解。正解は ${currentHand.answer}`;
    quizFeedback.classList.add("ng");
    quizFeedback.classList.remove("ok");
  }
}

function createRankButtons() {
  RANKS.forEach((rank) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "small";
    button.textContent = rank;
    button.addEventListener("click", () => handleRankAnswer(rank));
    rankButtons.appendChild(button);
  });
}

function calculatePotOdds() {
  const potSize = Number(potSizeInput.value);
  const callAmount = Number(callAmountInput.value);
  const equity = Number(equityInput.value);

  if (!Number.isFinite(potSize) || !Number.isFinite(callAmount) || !Number.isFinite(equity) || callAmount <= 0) {
    oddsResult.textContent = "入力値を確認してください。";
    return;
  }

  const requiredEquity = (callAmount / (potSize + callAmount)) * 100;
  const ev = ((equity / 100) * (potSize + callAmount)) - callAmount;
  const decision = equity >= requiredEquity ? "コール候補" : "フォールド候補";

  oddsResult.textContent = `必要勝率: ${requiredEquity.toFixed(1)}% / 想定EV: ${ev.toFixed(1)} / 判断: ${decision}`;
}

nextQuestionBtn.addEventListener("click", pickRandomHand);
calcOddsBtn.addEventListener("click", calculatePotOdds);

createRankButtons();
pickRandomHand();
calculatePotOdds();
