// Contient les controles de la caméra, déplacement, rotation, passage vue normale / vue aérienne, vue cheat, save / restore de la caméra, etc...
var camera = null;

var posCam = [15.5, 0.6, 15.5]; // centre approximatif de la zone spawn
var tgtCam = [15.5, 0.6, 14.5]; // regarde vers le nord
var upCam = [0, 1, 0];

var angleCamera = -Math.PI / 2; // nord si on utilise cos/sin comme ci-dessous
var vitesseCamera = 0.03;
var vitesseRotation = 0.03;

var touches = {};

function initialiserCamera() {
  camera = creerCamera();

  posCam = [15.5, 0.6, 15.5];
  angleCamera = -Math.PI / 2;

  mettreAJourCibleCamera();
  synchroniserCamera();
}

function mettreAJourCibleCamera() {
  tgtCam[0] = posCam[0] + Math.cos(angleCamera);
  tgtCam[1] = posCam[1];
  tgtCam[2] = posCam[2] + Math.sin(angleCamera);
}

function synchroniserCamera() {
  setPositionCameraX(posCam[0], camera);
  setPositionCameraY(posCam[1], camera);
  setPositionCameraZ(posCam[2], camera);

  setCibleCameraX(tgtCam[0], camera);
  setCibleCameraY(tgtCam[1], camera);
  setCibleCameraZ(tgtCam[2], camera);

  setOrientationX(upCam[0], camera);
  setOrientationY(upCam[1], camera);
  setOrientationZ(upCam[2], camera);
}

function gererClavierCamera() {
  document.addEventListener("keydown", function (e) {
    touches[e.key] = true;
  });

  document.addEventListener("keyup", function (e) {
    touches[e.key] = false;
  });
}

function mettreAJourCamera() {
  if (touches["ArrowLeft"]) {
    angleCamera -= vitesseRotation;
  }

  if (touches["ArrowRight"]) {
    angleCamera += vitesseRotation;
  }

  var nouveauX = posCam[0];
  var nouveauZ = posCam[2];

  if (touches["ArrowUp"]) {
    nouveauX += Math.cos(angleCamera) * vitesseCamera;
    nouveauZ += Math.sin(angleCamera) * vitesseCamera;
  }

  if (touches["ArrowDown"]) {
    nouveauX -= Math.cos(angleCamera) * vitesseCamera;
    nouveauZ -= Math.sin(angleCamera) * vitesseCamera;
  }

  if (!collisionMur(nouveauX, nouveauZ)) {
    posCam[0] = nouveauX;
    posCam[2] = nouveauZ;
  }

  var col = Math.floor(posCam[0]);
  var lig = Math.floor(posCam[2]);

  console.log(`Camera → X: ${col} | Z: ${lig}`);

  mettreAJourCibleCamera();
  synchroniserCamera();
}

function collisionMur(x, z) {
  var col = Math.floor(x);
  var lig = Math.floor(z);

  if (lig < 0 || lig >= tabCarte.length || col < 0 || col >= tabCarte[0].length) {
    return true;
  }

  var caseCarte = tabCarte[lig][col];

  // return caseCarte === "M" || caseCarte === "O" || caseCarte === "X";
  return caseCarte === "M" || caseCarte === "O";
  return false;
}

function obtenirMatriceVue() {
  var matVue = mat4.create();
  mat4.lookAt(posCam, tgtCam, upCam, matVue);
  return matVue;
}
