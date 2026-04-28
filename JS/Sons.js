// Sons
var sons = {};

function chargerSons() {
  sons.niveau = new Audio("Assets/Sons/recommencer un niveau.wav");
  sons.tresor = new Audio("Assets/Sons/Trouver trésor.wav");
  sons.temps = new Audio("Assets/Sons/temps zero.wav");
  sons.mur = new Audio("Assets/Sons/ouverture-mur.wav");
  sons.teleport = new Audio("Assets/Sons/tele-transportation.wav");
  sons.gameover = new Audio("Assets/Sons/Debut chaque niveau.wav");
  sons.victoire = new Audio("Assets/Sons/franchi les 10 niveaux.wav");
  sons.bg = new Audio("Assets/Sons/Voicy_Minecraft Lava SFX.mp3");
  sons.bg.loop = true;

  for (var nom in sons) {
    sons[nom].preload = "auto";
    sons[nom].volume = 0.7;
  }
}

function jouerSon(nom) {
  if (!sons[nom]) return;

  sons[nom].pause();
  sons[nom].currentTime = 0;
  sons[nom].play();
}
