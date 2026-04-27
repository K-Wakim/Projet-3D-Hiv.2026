// Contient les élément pour l'interface (affichage), temps, score, niveau, nombre d'ouvreaurs de murs, meagges game over/win, noms, etc...

function clearHUD(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dessineBGHUD(ctx, canvas) {
  ctx.save();

  var hauteurHUD = 60;
  var y = canvas.height - hauteurHUD;

  ctx.fillStyle = "rgba(40, 8, 0, 0.9)";
  ctx.fillRect(0, y, canvas.width, hauteurHUD);

  ctx.strokeStyle = "#ff7a00";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(canvas.width, y);
  ctx.stroke();

  ctx.restore();
}

function dessineHUD(ctx, canvas, score, temps, ouvreur, niveau) {
  ctx.save();

  var hauteurHUD = 60;
  var y = canvas.height - hauteurHUD;

  ctx.fillStyle = "#ffd27a";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  var tempsText = new Date(Math.ceil(temps) * 1000).toISOString().substring(14, 19);

  ctx.fillText("Score : " + score, canvas.width * 0.18, y + 32);
  ctx.fillText("Temps : " + tempsText, canvas.width * 0.40, y + 32);
  ctx.fillText("Ouvreurs : " + ouvreur, canvas.width * 0.63, y + 32);
  ctx.fillText("Niveau : " + niveau, canvas.width * 0.84, y + 32);

  ctx.restore();
}

function dessineGameOver(ctx, canvas) {
  ctx.save();

  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ff3300";
  ctx.font = "bold 70px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GAME OVER !", canvas.width / 2, canvas.height / 2);

  ctx.restore();
}

function dessineVictoire(ctx, canvas) {
  ctx.save();

  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffd000";
  ctx.font = "bold 70px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("VICTOIRE !", canvas.width / 2, canvas.height / 2 - 30);

  ctx.font = "bold 32px Arial";
  ctx.fillStyle = "#ff7a00";
  ctx.fillText("Tous les niveaux sont terminés", canvas.width / 2, canvas.height / 2 + 35);

  ctx.restore();
}
