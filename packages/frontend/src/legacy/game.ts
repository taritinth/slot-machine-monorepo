import { calculateDigest } from "./utils";
const symbols = ["🍎", "🍊", "🍇", "🍒", "🍋"];
const slots = document.getElementById("slots") as HTMLElement;
const spinButton = document.getElementById("spinButton") as HTMLButtonElement;
const result = document.getElementById("result") as HTMLElement;
const debugLog = document.getElementById("debugLog") as HTMLPreElement;

let gameParams = new URLSearchParams(window.location.search);

function log(message: string) {
  if (debugLog) {
    debugLog.textContent += message + "\n";
    debugLog.scrollTop = debugLog.scrollHeight;
  }
}

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function spin() {
  spinButton.disabled = true;
  const newSymbols = `${getRandomSymbol()} ${getRandomSymbol()} ${getRandomSymbol()}`;
  slots.textContent = newSymbols;
  log(`Spin result: ${newSymbols}`);
  checkResult();
}

function checkResult() {
  if (slots && result && spinButton) {
    const slotSymbols = slots.textContent?.split(" ") || [];
    let score = 0;
    if (slotSymbols[0] === slotSymbols[1] && slotSymbols[1] === slotSymbols[2]) {
      result.textContent = "Jackpot! You win!";
      score = 100;
    } else if (
      slotSymbols[0] === slotSymbols[1] ||
      slotSymbols[1] === slotSymbols[2] ||
      slotSymbols[0] === slotSymbols[2]
    ) {
      result.textContent = "Two matches! Small win!";
      score = 50;
    } else {
      result.textContent = "No match. Try again!";
      score = 10;
    }
    spinButton.disabled = false;
    log(`Result: ${result.textContent}, Score: ${score}`);
    sendScore(score);
  }
}

async function sendScore(score: number) {
  const userId = gameParams.get("uid");
  const inlineMessageId = gameParams.get("iid");

  if (!userId || !inlineMessageId) {
    log("Error: Missing userId or inlineMessageId");
    return;
  }

  try {
    if (!import.meta.env.VITE_BACKEND_URL) {
      throw new Error("VITE_BACKEND_URL is not defined in the environment");
    }
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!import.meta.env.VITE_API_SECRET) {
      throw new Error("VITE_API_SECRET is not defined in the environment");
    }
    const apiSecret = import.meta.env.VITE_API_SECRET;

    log(`Sending score to: ${backendUrl}/setScore`);

    const body = {
      score: score,
      userId: userId,
      inlineMessageId: inlineMessageId,
    };

    const response = await fetch(`${backendUrl}/setScore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "payload-hash": await calculateDigest(apiSecret, body),
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Server responded with ${response.status}: ${response.statusText}. Details: ${JSON.stringify(errorData)}`,
      );
    }
    const data = await response.json();
    log(`Score sent successfully: ${score}. Server response: ${JSON.stringify(data)}`);
  } catch (error) {
    log(`Error sending score: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

function initGame() {
  spinButton.addEventListener("click", spin);
}

document.addEventListener("DOMContentLoaded", initGame);
