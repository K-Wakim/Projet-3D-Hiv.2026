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

function dessineScore(ctx, canvas, score) {
  ctx.save();

  ctx.fillStyle = "black";
  ctx.font = "45px Arial";

  // Align to bottom-left
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";

  // Small margin (10px from edges)
  ctx.fillText("Score: " + score, 10, canvas.height);

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
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);

  // Restore state
  ctx.restore();
}
