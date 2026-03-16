const statusView = document.getElementById("status");
const resultView = document.getElementById("resultView");

const rankingUrlInput = document.getElementById("rankingUrlInput");
const customUrlInput = document.getElementById("customUrlInput");
const selectorInput = document.getElementById("selectorInput");
const limitInput = document.getElementById("limitInput");

const openLoginBtn = document.getElementById("openLoginBtn");
const fetchProfileBtn = document.getElementById("fetchProfileBtn");
const fetchRankingBtn = document.getElementById("fetchRankingBtn");
const fetchCustomBtn = document.getElementById("fetchCustomBtn");

const PROFILE_URL = "https://www.streetfighter.com/6/buckler/ja-jp/profile";
const LOGIN_URL = "https://www.streetfighter.com/6/buckler/ja-jp/login";

function setStatus(message, isError = false) {
  statusView.textContent = message;
  statusView.style.color = isError ? "#b91c1c" : "#065f46";
}

function showResult(data) {
  resultView.textContent = JSON.stringify(data, null, 2);
}

async function callScraper(payload) {
  setStatus("取得中...");
  try {
    const res = await fetch("/api/sf6-scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "取得に失敗しました。");
    }

    showResult(json);
    setStatus(`取得完了: ${json.summary?.title || "タイトル不明"}`);
  } catch (error) {
    setStatus(`エラー: ${error.message}`, true);
  }
}

openLoginBtn.addEventListener("click", () => {
  window.open(LOGIN_URL, "_blank", "noopener,noreferrer");
  setStatus("ログインページを新しいタブで開きました。ログイン後にプロフィール取得を実行してください。");
});

fetchProfileBtn.addEventListener("click", () => {
  callScraper({
    label: "profile",
    url: PROFILE_URL,
    selector: "h1, h2, .name, .player-name",
    limit: 8,
  });
});

fetchRankingBtn.addEventListener("click", () => {
  callScraper({
    label: "ranking",
    url: rankingUrlInput.value.trim(),
    selector: "table tr, .ranking-item, .rank-row",
    limit: 10,
  });
});

fetchCustomBtn.addEventListener("click", () => {
  callScraper({
    label: "custom",
    url: customUrlInput.value.trim(),
    selector: selectorInput.value.trim(),
    limit: Number(limitInput.value),
  });
});
