const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

const modeLabel = document.getElementById("modeLabel");
const timeDisplay = document.getElementById("timeDisplay");
const startPauseBtn = document.getElementById("startPauseBtn");
const resetBtn = document.getElementById("resetBtn");
const switchModeBtn = document.getElementById("switchModeBtn");

let isWorkMode = true;
let isRunning = false;
let remainingSeconds = WORK_SECONDS;
let timerId = null;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function syncUI() {
  modeLabel.textContent = isWorkMode ? "作業" : "休憩";
  timeDisplay.textContent = formatTime(remainingSeconds);
  startPauseBtn.textContent = isRunning ? "一時停止" : "開始";
  switchModeBtn.textContent = isWorkMode ? "休憩に切替" : "作業に切替";
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  isRunning = false;
}

function notifyFinished() {
  const message = isWorkMode ? "作業時間が終了しました！" : "休憩時間が終了しました！";
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(message);
    return;
  }
  alert(message);
}

function startTimer() {
  if (isRunning) {
    return;
  }

  isRunning = true;
  timerId = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds -= 1;
      syncUI();
      return;
    }

    stopTimer();
    syncUI();
    notifyFinished();
  }, 1000);
}

startPauseBtn.addEventListener("click", async () => {
  if (isRunning) {
    stopTimer();
    syncUI();
    return;
  }

  if ("Notification" in window && Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch {
      // ignore
    }
  }

  startTimer();
  syncUI();
});

resetBtn.addEventListener("click", () => {
  stopTimer();
  remainingSeconds = isWorkMode ? WORK_SECONDS : BREAK_SECONDS;
  syncUI();
});

switchModeBtn.addEventListener("click", () => {
  stopTimer();
  isWorkMode = !isWorkMode;
  remainingSeconds = isWorkMode ? WORK_SECONDS : BREAK_SECONDS;
  syncUI();
});

syncUI();
