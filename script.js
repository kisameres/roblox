let sessions = JSON.parse(localStorage.getItem("sessions")) || [];
let current = null;
let timer = null;

function start() {
  const game = document.getElementById("game").value.trim();
  if (!game) return alert("Digite o nome do jogo");

  current = { game, start: Date.now(), duration: 0 };
  timer = setInterval(() => {
    current.duration = Date.now() - current.start;
  }, 1000);
}

function stop() {
  if (!current) return;
  clearInterval(timer);
  sessions.push(current);
  localStorage.setItem("sessions", JSON.stringify(sessions));
  current = null;
  update();
}

function update() {
  const total = sessions.reduce((a, s) => a + s.duration, 0);
  const totalEl = document.getElementById("total");
  if (totalEl)
    totalEl.innerText = (total / 3600000).toFixed(1) + "h";

  const map = {};
  sessions.forEach(s => map[s.game] = (map[s.game] || 0) + s.duration);

  const ranking = document.getElementById("ranking");
  if (ranking) {
    ranking.innerHTML = "";
    Object.entries(map).forEach(([g, d]) => {
      ranking.innerHTML += `<li>${g} — ${(d/3600000).toFixed(1)}h</li>`;
    });
  }

  const history = document.getElementById("history");
  if (history) {
    history.innerHTML = "";
    sessions.forEach(s => {
      history.innerHTML += `<li>${s.game} — ${(s.duration/60000).toFixed(1)} min</li>`;
    });
  }
}

update();
