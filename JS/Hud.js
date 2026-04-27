// Contient les élément pour l'interface (affichage), temps, score, niveau, nombre d'ouvreaurs de murs, meagges game over/win, noms, etc...

function clearHUD(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dessineBGHUD(ctx, canvas) {
  ctx.save();

  // Semi-transparent white background
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillRect(0, 600, canvas.width, canvas.height);

  ctx.restore();
}

function dessineHUD(ctx, canvas, score, temps, ouvreur, niveau) {
  ctx.save();

  ctx.fillStyle = "black";
  ctx.font = "30px Arial";

  // Align to bottom-left
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";

  // texte pour le HUD
  const scoreText = `Score: ${score < 100 ? (score < 10 ? "00" + score : "0" + score) : score}`;
  const tempsText = `Temps: ${new Date(Math.ceil(temps) * 1000).toISOString().substring(14, 19)}`; // convertit secondes en mm:ss
  const ouvreurText = `Ouvreurs: ${ouvreur}`;
  const niveauText = `Niveau: ${niveau}`;

  const scoreWidth = ctx.measureText(scoreText).width;
  const tempsWidth = ctx.measureText(tempsText).width;
  const ouvreurWidth = ctx.measureText(ouvreurText).width;
  const niveauWidth = ctx.measureText(niveauText).width;

  const textTotal = scoreText + "  " + tempsText + "  " + ouvreurText + "  " + niveauText;

  const posXTexte = 50;
  const posYTexte = canvas.height - 10; // 10px from bottom

  // Small margin (10px from edges)
  ctx.fillText(textTotal, posXTexte, posYTexte);

  ctx.restore();
}

function dessineGameOver(ctx, canvas) {
  // Save current state
  ctx.save();

  // Style
  ctx.fillStyle = "red";
  ctx.font = "bold 48px Arial";

  // Center alignment
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw text at center
  ctx.fillText("Game Over !", canvas.width / 2, canvas.height / 2);

  // Restore state
  ctx.restore();
}

function dessineVictoire(ctx, canvas) {
  // Save current state
  ctx.save();

  // Style
  ctx.fillStyle = "green";
  ctx.font = "bold 48px Arial";

  // Center alignment
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw text at center
  ctx.fillText("Victoire !", canvas.width / 2, canvas.height / 2);

  // Restore state
  ctx.restore();
}
