// Contient les controles de la caméra, déplacement, rotation, passage vue normale / vue aérienne, vue cheat, save / restore de la caméra, etc...
var camera = null;

var posCam = [15.5, 0.6, 15.5];
var tgtCam = [15.5, 0.6, 14.5];
var upCam = [0, 1, 0];

var angleCamera = -Math.PI / 2;
var vitesseCamera = 0.03;
var vitesseRotation = 0.03;

var touches = {};

// sauvegarde caméra normale
var posCamSauvegarde = null;
var tgtCamSauvegarde = null;
var upCamSauvegarde = null;
var angleCameraSauvegarde = null;

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

function activerVueAerienne(triche) {
  if (modeVueAerienne) {
    modeVueAerienneTriche = triche;
    return;
  }

  posCamSauvegarde = [posCam[0], posCam[1], posCam[2]];
  tgtCamSauvegarde = [tgtCam[0], tgtCam[1], tgtCam[2]];
  upCamSauvegarde = [upCam[0], upCam[1], upCam[2]];
  angleCameraSauvegarde = angleCamera;

  modeVueAerienne = true;
  modeVueAerienneTriche = triche;

  // caméra au-dessus du centre de la map
  posCam = [15.5, 40.0, 15.5];
  tgtCam = [15.5, 0.0, 15.5];
  upCam = [0, 0, -1];

  synchroniserCamera();
}

function desactiverVueAerienne() {
  if (!modeVueAerienne) {
    return;
  }

  modeVueAerienne = false;
  modeVueAerienneTriche = false;

  posCam = [posCamSauvegarde[0], posCamSauvegarde[1], posCamSauvegarde[2]];
  tgtCam = [tgtCamSauvegarde[0], tgtCamSauvegarde[1], tgtCamSauvegarde[2]];
  upCam = [upCamSauvegarde[0], upCamSauvegarde[1], upCamSauvegarde[2]];
  angleCamera = angleCameraSauvegarde;

  synchroniserCamera();
}

function gererClavierCamera() {
  document.addEventListener("keydown", function (e) {
    touches[e.key] = true;

    if (e.code === "PageUp") {
      e.preventDefault();
      activerVueAerienne(false);
    }

    if (e.code === "PageDown") {
      e.preventDefault();
      desactiverVueAerienne();
    }

    if (e.code === "Space" && e.ctrlKey && e.shiftKey) {
      e.preventDefault();

      if (modeVueAerienne && modeVueAerienneTriche) {
        modeVueAerienneTriche = false;
      } else {
        activerVueAerienne(true);
      }
    }
  });

  document.addEventListener("keyup", function (e) {
    touches[e.key] = false;
  });
}

function mettreAJourCamera() {
  // aucune mise à jour joueur en vue aérienne
  if (modeVueAerienne) {
    synchroniserCamera();
    return;
  }

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

  if ((touches["ArrowUp"] || touches["ArrowDown"]) && !timerActif) {
    timerActif = true;
    dernierTemps = Date.now();
    console.log("Timer démarré");
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

function obtenirMatriceVue() {
  var matVue = mat4.create();
  mat4.lookAt(posCam, tgtCam, upCam, matVue);
  return matVue;
}