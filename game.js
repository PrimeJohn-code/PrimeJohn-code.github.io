(() => {
  "use strict";
  const canvas = document.querySelector("#game-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const status = document.querySelector("#game-status");
  const scoreEl = document.querySelector("#score");
  const highScoreEl = document.querySelector("#high-score");
  const gameOverPanel = document.querySelector("#game-over-panel");
  const gameOverScore = document.querySelector("#game-over-score");
  const speedSelect = document.querySelector("#speed-select");
  const difficultySelect = document.querySelector("#difficulty-select");
  const soundToggle = document.querySelector("#sound-toggle");
  const startButton = document.querySelector("#start-game");
  const pauseButton = document.querySelector("#pause-game");
  const restartButton = document.querySelector("#restart-game");
  const overRestartButton = document.querySelector("#game-over-restart");
  const speeds = { slow: 240, normal: 160, fast: 100 };
  const enemiesByDifficulty = { easy: 1, normal: 2, hard: 3 };
  const directions = { up:{x:0,y:-1}, down:{x:0,y:1}, left:{x:-1,y:0}, right:{x:1,y:0} };
  let snake = [], food = null, enemies = [], direction = directions.right, nextDirection = direction;
  let cols = 20, rows = 16, cell = 24, score = 0, gameTimer = null, enemyTimer = null, running = false, paused = false, soundOn = true, audioContext = null;
  let highScore = Number.parseInt(localStorage.getItem("primejohn-high-score") || "0", 10);
  highScoreEl.textContent = String(highScore);

  function resizeBoard() { const rect = canvas.getBoundingClientRect(); canvas.width = Math.max(320, Math.floor(rect.width)); canvas.height = Math.max(240, Math.floor(rect.height)); cell = Math.max(16, Math.floor(Math.min(canvas.width / 24, canvas.height / 16))); cols = Math.max(12, Math.floor(canvas.width / cell)); rows = Math.max(10, Math.floor(canvas.height / cell)); draw(); }
  function same(a,b) { return a && b && a.x === b.x && a.y === b.y; }
  function occupied(point) { return snake.some((part) => same(part, point)) || enemies.some((enemy) => same(enemy, point)); }
  function randomPoint(isAllowed = () => true) { let point; do { point = { x:Math.floor(Math.random()*cols), y:Math.floor(Math.random()*rows) }; } while (occupied(point) || !isAllowed(point)); return point; }
  function safeEnemySpawn(point) { const head = snake[0]; return !head || Math.abs(point.x - head.x) + Math.abs(point.y - head.y) > 5; }
  function setStatus(message) { status.textContent = message; }
  function updateScore() { scoreEl.textContent = String(score); if (score > highScore) { highScore = score; highScoreEl.textContent = String(highScore); localStorage.setItem("primejohn-high-score", String(highScore)); } }
  function clearTimers() { clearInterval(gameTimer); clearInterval(enemyTimer); gameTimer = null; enemyTimer = null; }
  function scheduleTimers() { clearTimers(); gameTimer = setInterval(step, speeds[speedSelect.value]); enemyTimer = setInterval(moveEnemies, Math.max(300, speeds[speedSelect.value] * 3)); }
  function resetState() { clearTimers(); const center = {x:Math.floor(cols/2),y:Math.floor(rows/2)}; snake = [center,{x:center.x-1,y:center.y},{x:center.x-2,y:center.y}]; direction = directions.right; nextDirection = direction; score = 0; updateScore(); enemies = []; for (let i=0;i<enemiesByDifficulty[difficultySelect.value];i+=1) enemies.push(randomPoint(safeEnemySpawn)); food = randomPoint(); running = false; paused = false; pauseButton.disabled = true; pauseButton.textContent = "Pause"; gameOverPanel.hidden = true; setStatus("Press Start to play. Enemies begin at a safe distance."); draw(); }
  function startGame() { if (running && !paused) return; if (!snake.length || !food) resetState(); running = true; paused = false; pauseButton.disabled = false; setStatus("Use arrows, WASD, or touch controls."); scheduleTimers(); playTone(520,.06,"sine"); }
  function togglePause() { if (!running) return; if (paused) { paused = false; pauseButton.textContent = "Pause"; setStatus("Use arrows, WASD, or touch controls."); scheduleTimers(); playTone(620,.05,"sine"); } else { paused = true; clearTimers(); pauseButton.textContent = "Resume"; setStatus("Paused. Press Pause to continue."); playTone(280,.06,"sine"); } }
  function gameOver(reason = "Game over") { running = false; paused = false; clearTimers(); pauseButton.disabled = true; setStatus(`${reason} Press Restart to try again.`); gameOverScore.textContent = `Score: ${score}`; gameOverPanel.hidden = false; playTone(140,.18,"sawtooth"); draw(); }
  function changeDirection(name) { const candidate = directions[name]; if (!candidate || (candidate.x + direction.x === 0 && candidate.y + direction.y === 0)) return; nextDirection = candidate; }
  function step() { direction = nextDirection; const head = {x:snake[0].x+direction.x,y:snake[0].y+direction.y}; if (head.x<0 || head.x>=cols || head.y<0 || head.y>=rows || snake.some((part) => same(part,head)) || enemies.some((enemy) => same(enemy,head))) { gameOver("Collision."); return; } snake.unshift(head); if (same(head,food)) { score += 10; updateScore(); food = randomPoint(); playTone(760,.08,"triangle"); } else snake.pop(); draw(); }
  function moveEnemies() { enemies = enemies.map((enemy) => { const options = Object.values(directions).map((move) => ({x:enemy.x+move.x,y:enemy.y+move.y})).filter((point) => point.x>=0 && point.x<cols && point.y>=0 && point.y<rows && !snake.some((part) => same(part,point)) && !enemies.some((other) => other!==enemy && same(other,point))); return options.length ? options[Math.floor(Math.random()*options.length)] : enemy; }); if (enemies.some((enemy) => same(enemy,snake[0]))) gameOver("An enemy caught you."); draw(); }
  function draw() { ctx.fillStyle="#1b1412"; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.strokeStyle="rgba(255,192,120,.08)"; ctx.lineWidth=1; for(let x=0;x<=cols;x+=1){ctx.beginPath();ctx.moveTo(x*cell,0);ctx.lineTo(x*cell,rows*cell);ctx.stroke();} for(let y=0;y<=rows;y+=1){ctx.beginPath();ctx.moveTo(0,y*cell);ctx.lineTo(cols*cell,y*cell);ctx.stroke();} if(food){ctx.fillStyle="#ffd166";ctx.fillRect(food.x*cell+5,food.y*cell+5,cell-10,cell-10);} enemies.forEach((enemy)=>{ctx.fillStyle="#ff6b6b";ctx.fillRect(enemy.x*cell+4,enemy.y*cell+4,cell-8,cell-8);}); snake.forEach((part,index)=>{ctx.fillStyle=index===0?"#fff4e8":"#ffc078";ctx.fillRect(part.x*cell+3,part.y*cell+3,cell-6,cell-6);}); }
  function playTone(frequency,duration,type) { if (!soundOn) return; const AudioCtor = window.AudioContext || window.webkitAudioContext; if (!AudioCtor) return; audioContext = audioContext || new AudioCtor(); if (audioContext.state === "suspended") audioContext.resume(); const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain(); oscillator.type = type; oscillator.frequency.value = frequency; gain.gain.setValueAtTime(.035,audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration); oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime+duration); }
  function toggleSound() { soundOn = !soundOn; soundToggle.textContent = `Sound: ${soundOn ? "on" : "off"}`; soundToggle.setAttribute("aria-pressed",String(soundOn)); if(soundOn) playTone(620,.06,"sine"); }
  const keyMap = {ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down",ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right"};
  window.addEventListener("keydown",(event)=>{ if(keyMap[event.key]){event.preventDefault();changeDirection(keyMap[event.key]);} if(event.key===" "){event.preventDefault();togglePause();} });
  window.addEventListener("resize",resizeBoard);
  document.querySelectorAll("[data-direction]").forEach((button)=>button.addEventListener("pointerdown",(event)=>{event.preventDefault();changeDirection(button.dataset.direction);canvas.focus();}));
  startButton.addEventListener("click",startGame); pauseButton.addEventListener("click",togglePause); soundToggle.addEventListener("click",toggleSound); restartButton.addEventListener("click",()=>{resetState();startGame();}); overRestartButton.addEventListener("click",()=>{resetState();startGame();});
  speedSelect.addEventListener("change",()=>{if(running&&!paused)scheduleTimers();}); difficultySelect.addEventListener("change",()=>{resetState();setStatus("Difficulty updated. Press Start to play.");});
  resizeBoard(); resetState();
})();
