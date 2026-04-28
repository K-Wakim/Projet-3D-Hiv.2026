// Contenu du fichier: matrice 31x31, lancer Webgl, charger images/ sons, creer la scène 3D, appeler les fonctions de dessin, démarrer le jeu, générer la loop principale
var gl = null;
var prog = null;
var matProjection = null;
var matProjectionPerspective = null;
var matProjectionOrtho = null;
var canvas = null;
var hudCanvas = null;
var ctx = null;

// Objets
var niveauActuel = 1;
var nbOuvreurs = 4;
var score = 300;
var jeuTermine = false;
var jeuGagne = false;
var jeuEnPause = false;
var objPlancher = null;
var objCiel = null;
var objCoffre = null;
var tabSolsSpawn = [];
var tabMursOuvrables = [];
var tabMursNonOuvrables = [];
var tabPortesSpawn = [];
var tabTeleporteurs = [];
var tabReceveurs = [];
var tabFleches = [];
var tabObjTextures = [];
var objDisqueCamera = null;
var modeVueAerienne = false;
var modeVueAerienneTriche = false;

// Images
var tabImages = [
  "Assets/Images/Plancher.png",
  "Assets/Images/MurNonOuvrable.png",
  "Assets/Images/MurOuvrable.png",
  "Assets/Images/PlancherSpawn.png",
  "Assets/Images/Ciel.png",
  "Assets/Images/TeleTransporteur.png",
  "Assets/Images/TeleReceveur.png",
  "Assets/Images/Coffre.png",
];

async function demarrer() {
  chargerSons();

  canvas = document.getElementById("monCanvas");
  gl = initWebGL(canvas);
  prog = initShaders(gl);
  tabObjTextures = await creerTextures(gl, tabImages);
  hudCanvas = document.getElementById("hudCanvas");
  ctx = hudCanvas.getContext("2d");

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, canvas.width, canvas.height);

  matProjectionPerspective = mat4.create();
  mat4.perspective(
    45,
    canvas.width / canvas.height,
    0.02,
    100.0,
    matProjectionPerspective
  );
  matProjectionOrtho = mat4.create();
  mat4.ortho(-17, 17, -17, 17, 0.1, 100.0, matProjectionOrtho);

  gl.uniformMatrix4fv(prog.matProjection, false, matProjectionPerspective);

  initialiserCamera();
  gererClavierCamera(gl);
  initialiserControlesJeu();
  initialiserScore(score);

  objPlancher = creerPlancher(gl);
  objCiel = creerCiel(gl);
  objDisqueCamera = creerTriangleCamera(gl);

  // RESET tableaux
  tabMursOuvrables = [];
  tabMursNonOuvrables = [];
  tabSolsSpawn = [];
  tabPortesSpawn = [];
  tabTeleporteurs = [];
  tabReceveurs = [];
  tabFleches = [];

  // Création des objets fixes
  for (var z = 0; z < tabCarte.length; z++) {
    for (var x = 0; x < tabCarte[z].length; x++) {
      if (tabCarte[z][x] === "O") {
        var mur = creerMurOuvrable(gl, 2, 1.0, x + 0.5, 0.5, z + 0.5);
        mur.caseX = x;
        mur.caseZ = z;
        mur.binEnOuverture = false;
        mur.binOuvert = false;
        tabMursOuvrables.push(mur);
      }

      if (tabCarte[z][x] === "M") {
        tabMursNonOuvrables.push(
          creerMurNonOuvrable(gl, 1, 1.0, x + 0.5, 0.5, z + 0.5)
        );
      }

      if (tabCarte[z][x] === "S") {
        tabSolsSpawn.push(creerSolSpawn(gl, 3, 1.0, x, z));
      }

      if (tabCarte[z][x] === "X") {
        var porte = creerPorteSpawn(gl, 1, 1.0, x + 0.5, -0.99, z + 0.5);

        porte.caseX = x;
        porte.caseZ = z;
        porte.binEnFermeture = false;
        porte.binFermee = false;

        tabPortesSpawn.push(porte);

        // au départ, la porte n'est pas bloquante
        tabCarte[z][x] = "_";
      }
    }
  }

  demarrerNiveau(1);

  requestAnimationFrame(bouclePrincipale);
}

function creerTextures(objgl, tabImages) {
  return new Promise(function (resolve) {
    var tabTextures = [];
    var nbChargees = 0;

    for (let i = 0; i < tabImages.length; i++) {
      let image = new Image();

      image.onload = function () {
        var texture = objgl.createTexture();
        objgl.bindTexture(objgl.TEXTURE_2D, texture);

        objgl.texImage2D(
          objgl.TEXTURE_2D,
          0,
          objgl.RGBA,
          objgl.RGBA,
          objgl.UNSIGNED_BYTE,
          image
        );

        objgl.texParameteri(
          objgl.TEXTURE_2D,
          objgl.TEXTURE_MAG_FILTER,
          objgl.LINEAR
        );
        objgl.texParameteri(
          objgl.TEXTURE_2D,
          objgl.TEXTURE_MIN_FILTER,
          objgl.LINEAR
        );
        objgl.texParameteri(
          objgl.TEXTURE_2D,
          objgl.TEXTURE_WRAP_S,
          objgl.REPEAT
        );
        objgl.texParameteri(
          objgl.TEXTURE_2D,
          objgl.TEXTURE_WRAP_T,
          objgl.REPEAT
        );

        tabTextures[i] = texture;
        nbChargees++;

        if (nbChargees === tabImages.length) {
          resolve(tabTextures);
        }
      };

      image.src = tabImages[i];
    }
  });
}

// array 31x31 qui represente la carte de murs, vides, murs ouvrables et salle de spawn
// LEGENDE
// _ = vide
// M = mur
// O = mur ouvrable
// S = salle de spawn
// 1-99 = mur en cours d'ouverture (sera utilise par des fonctions, pas ecrit dans le tableau de base)
// 1 = un mur qui a ete ouvert (sera utilise par des fonctions, pas ecrit dans le tableau de base)
// T = trésor
// X = mur non ouvrable qui se referme quand le joueur sort de la salle de spawn

// prettier-ignore
var tabCarte = [
  ["M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M"],
  ["M", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "O", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "M"],
  ["M", "_", "O", "O", "O", "O", "O", "O", "_", "O", "O", "O", "O", "O", "_", "O", "_", "O", "O", "O", "O", "O", "_", "O", "O", "O", "O", "O", "O", "_", "M"],
  ["M", "_", "_", "_", "_", "_", "_", "_", "_", "O", "_", "_", "_", "O", "_", "O", "_", "O", "_", "_", "_", "O", "_", "_", "_", "_", "_", "_", "_", "_", "M"],
  ["M", "O", "O", "O", "O", "O", "O", "O", "_", "O", "O", "_", "O", "O", "_", "O", "_", "O", "O", "_", "O", "O", "_", "O", "O", "O", "O", "O", "O", "O", "M"],
  ["M", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "M"],
  ["M", "O", "O", "O", "_", "O", "O", "O", "_", "O", "_", "O", "O", "O", "_", "O", "_", "O", "O", "O", "_", "O", "_", "O", "O", "O", "_", "O", "O", "O", "M"],
  ["M", "_", "_", "_", "_", "_", "_", "_", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "_", "_", "_", "_", "_", "_", "_", "M"],
  ["M", "O", "O", "O", "_", "O", "O", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "O", "O", "_", "O", "O", "O", "M"],
  ["M", "_", "_", "_", "_", "_", "_", "_", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "_", "_", "_", "_", "_", "_", "_", "M"],
  ["M", "_", "O", "O", "O", "O", "O", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "_", "O", "O", "O", "O", "O", "O", "_", "M"],
  ["M", "_", "_", "_", "_", "_", "_", "O", "_", "O", "O", "O", "_", "O", "_", "O", "_", "O", "_", "O", "O", "O", "_", "O", "_", "_", "_", "_", "_", "_", "M"],
  ["M", "O", "O", "O", "O", "O", "_", "O", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "O", "_", "O", "O", "O", "O", "O", "M"],
  ["M", "_", "_", "_", "_", "_", "_", "O", "_", "O", "O", "O", "_", "M", "M", "X", "M", "M", "_", "O", "O", "O", "_", "O", "_", "_", "_", "_", "_", "_", "M"],
  ["M", "_", "O", "O", "O", "O", "O", "O", "_", "O", "_", "O", "_", "M", "S", "S", "S", "M", "_", "O", "_", "O", "_", "O", "O", "O", "O", "O", "O", "_", "M"],
  ["M", "_", "_", "_", "_", "_", "_", "_", "_", "O", "_", "O", "_", "M", "S", "S", "S", "M", "_", "O", "_", "O", "_", "_", "_", "_", "_", "_", "_", "_", "M"],
  ["M", "O", "O", "O", "O", "O", "O", "O", "_", "O", "_", "O", "_", "M", "S", "S", "S", "M", "_", "O", "_", "O", "_", "O", "O", "O", "O", "O", "O", "O", "M"],
  ["M", "_", "_", "_", "_", "_", "_", "_", "_", "O", "_", "O", "_", "M", "M", "M", "M", "M", "_", "O", "_", "O", "_", "_", "_", "_", "_", "_", "_", "_", "M"],
  ["M", "_", "O", "O", "O", "O", "O", "O", "_", "O", "_", "O", "_", "_", "_", "_", "_", "_", "_", "O", "_", "O", "_", "O", "O", "O", "O", "O", "O", "_", "M"],
  ["M", "_", "O", "_", "_", "_", "_", "_", "_", "O", "_", "O", "O", "O", "O", "_", "O", "O", "O", "O", "_", "O", "_", "_", "_", "_", "_", "_", "O", "_", "M"],
  ["M", "_", "O", "_", "O", "O", "O", "O", "_", "O", "_", "_", "_", "_", "O", "_", "O", "_", "_", "_", "_", "O", "_", "O", "O", "O", "O", "_", "O", "_", "M"],
  ["M", "_", "O", "_", "O", "_", "_", "_", "_", "O", "_", "O", "_", "_", "O", "_", "O", "_", "_", "O", "_", "O", "_", "_", "_", "_", "O", "_", "O", "_", "M"],
  ["M", "_", "O", "_", "O", "O", "O", "O", "_", "O", "_", "O", "_", "O", "O", "_", "O", "O", "_", "O", "_", "O", "_", "O", "O", "O", "O", "_", "O", "_", "M"],
  ["M", "_", "_", "_", "_", "_", "_", "O", "_", "O", "_", "_", "_", "O", "_", "_", "_", "O", "_", "_", "_", "O", "_", "O", "_", "_", "_", "_", "_", "_", "M"],
  ["M", "_", "O", "O", "O", "O", "_", "O", "_", "O", "_", "O", "O", "O", "_", "O", "_", "O", "O", "O", "_", "O", "_", "O", "_", "O", "O", "O", "O", "_", "M"],
  ["M", "_", "_", "_", "_", "_", "_", "O", "_", "_", "_", "O", "_", "_", "_", "_", "_", "_", "_", "O", "_", "_", "_", "O", "_", "_", "_", "_", "_", "_", "M"],
  ["M", "_", "O", "_", "O", "O", "_", "O", "_", "O", "O", "O", "_", "O", "O", "_", "O", "O", "_", "O", "O", "O", "_", "O", "_", "O", "O", "_", "O", "_", "M"],
  ["M", "_", "O", "_", "O", "_", "_", "O", "_", "O", "_", "_", "_", "O", "_", "_", "_", "O", "_", "_", "_", "O", "_", "O", "_", "_", "O", "_", "O", "_", "M"],
  ["M", "O", "O", "_", "O", "O", "O", "O", "_", "O", "_", "O", "O", "O", "O", "O", "O", "O", "O", "O", "_", "O", "_", "O", "O", "O", "O", "_", "O", "O", "M"],
  ["M", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "M"],
  ["M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M"],
];

function bouclePrincipale() {
  if (jeuTermine) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    clearHUD(ctx, hudCanvas);
    dessineBGHUD(ctx, hudCanvas);
    dessineHUD(ctx, hudCanvas, score, tempsRestant, nbOuvreurs, niveauActuel);

    if (jeuGagne) {
      dessineVictoire(ctx, hudCanvas);
    } else {
      dessineGameOver(ctx, hudCanvas);
    }

    return;
  }

  mettreAJourCamera();
  mettreAJourTimer();
  mettreAJourScoreVueAerienne();

  if (!modeVueAerienne) {
    verifierCollisionCoffre();
    verifierTeleportation();
    verifierSortieSpawn();
    animerMursOuvrables();
    animerPortesSpawn();
  } else if (modeVueAerienne) {
    mettreAJourTriangleCamera();
  }

  if (modeVueAerienne) {
    gl.uniformMatrix4fv(prog.matProjection, false, matProjectionOrtho);
  } else {
    gl.uniformMatrix4fv(prog.matProjection, false, matProjectionPerspective);
  }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  dessinerObjet(gl, prog, objPlancher);
  dessinerObjet(gl, prog, objDisqueCamera);

  if (!modeVueAerienne) {
    dessinerObjet(gl, prog, objCiel);
  }

  for (var i = 0; i < tabMursOuvrables.length; i++) {
    dessinerObjet(gl, prog, tabMursOuvrables[i]);
  }

  for (var i = 0; i < tabMursNonOuvrables.length; i++) {
    dessinerObjet(gl, prog, tabMursNonOuvrables[i]);
  }

  for (var i = 0; i < tabSolsSpawn.length; i++) {
    dessinerObjet(gl, prog, tabSolsSpawn[i]);
  }

  for (var i = 0; i < tabPortesSpawn.length; i++) {
    dessinerObjet(gl, prog, tabPortesSpawn[i]);
  }

  // vue normale au sol
  if (!modeVueAerienne) {
    if (objCoffre != null) {
      dessinerObjet(gl, prog, objCoffre);
    }

    for (var i = 0; i < tabTeleporteurs.length; i++) {
      dessinerObjet(gl, prog, tabTeleporteurs[i]);
    }

    for (var i = 0; i < tabReceveurs.length; i++) {
      dessinerObjet(gl, prog, tabReceveurs[i]);
    }

    for (var i = 0; i < tabFleches.length; i++) {
      dessinerObjet(gl, prog, tabFleches[i]);
    }
  }

  // vue aérienne triche
  if (modeVueAerienne && modeVueAerienneTriche) {
    if (objCoffre != null) {
      dessinerObjet(gl, prog, objCoffre);
    }

    for (var i = 0; i < tabTeleporteurs.length; i++) {
      dessinerObjet(gl, prog, tabTeleporteurs[i]);
    }

    for (var i = 0; i < tabReceveurs.length; i++) {
      dessinerObjet(gl, prog, tabReceveurs[i]);
    }

    for (var i = 0; i < tabFleches.length; i++) {
      dessinerObjet(gl, prog, tabFleches[i]);
    }
  }

  clearHUD(ctx, hudCanvas);
  dessineBGHUD(ctx, hudCanvas);
  dessineHUD(ctx, hudCanvas, score, tempsRestant, nbOuvreurs, niveauActuel);

  requestAnimationFrame(bouclePrincipale);
}
