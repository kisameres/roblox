let startTime = null;
let timerInterval = null;

function startSession() {
  const game = document.getElementById("gameName").value.trim();
  if (!game) return alert("Digite o nome do jogo!");

  startTime = Date.now();

  timerInterval = setInterval(() => {
    const diff = Date.now() - startTime;
    document.getElementById("timer").innerText = formatTime(diff);
  }, 1000);

  localStorage.setItem("currentGame", game);
}

function stopSession() {
  if (!startTime) return;

  clearInterval(timerInterval);

  const duration = Date.now() - startTime;
  const game = localStorage.getItem("currentGame");

  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");

  sessions.push({
    game,
    duration,
    date: new Date().toLocaleDateString("pt-BR")
  });

  localStorage.setItem("sessions", JSON.stringify(sessions));

  startTime = null;
  document.getElementById("timer").innerText = "0h 0m 0s";
  alert("Sessão salva!");
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ${s % 60}s`;
}

/* STATS */
if (document.getElementById("stats")) {
  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");

  const totalMs = sessions.reduce((a, s) => a + s.duration, 0);
  document.getElementById("stats").innerHTML =
    `<p>Total jogado: <strong>${(totalMs / 3600000).toFixed(1)}h</strong></p>
     <p>Sessões: <strong>${sessions.length}</strong></p>`;

  const games = {};
  sessions.forEach(s => {
    games[s.game] = (games[s.game] || 0) + s.duration;
  });

  const ul = document.getElementById("games");
  Object.entries(games)
    .sort((a, b) => b[1] - a[1])
    .forEach(([game, time]) => {
      const li = document.createElement("li");
      li.innerText = `${game} — ${(time / 3600000).toFixed(1)}h`;
      ul.appendChild(li);
    });
}
