// Contenu du fichier: matrice 31x31, lancer Webgl, charger images/ sons, creer la scène 3D, appeler les fonctions de dessin, démarrer le jeu, générer la loop principale
var gl = null;
var prog = null;
var matProjection = null;

// Objets
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

function demarrer() {
  var canvas = document.getElementById("monCanvas");
  gl = initWebGL(canvas);
  prog = initShaders(gl);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, canvas.width, canvas.height);

  matProjection = mat4.create();
  mat4.perspective(45, canvas.width / canvas.height, 0.1, 100.0, matProjection);
  gl.uniformMatrix4fv(prog.matProjection, false, matProjection);

  initialiserCamera();
  gererClavierCamera();
  initialiserControlesJeu();

  objPlancher = creerPlancher(gl);
  objCiel = creerCiel(gl);

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
        var mur = creerMurOuvrable(gl, 0, 0.0, x + 0.5, 0.5, z + 0.5);
        mur.caseX = x;
        mur.caseZ = z;
        mur.binEnOuverture = false;
        mur.binOuvert = false;
        tabMursOuvrables.push(mur);
      }

      if (tabCarte[z][x] === "M") {
        tabMursNonOuvrables.push(creerMurNonOuvrable(gl, 0, 0.0, x + 0.5, 0.5, z + 0.5));
      }

      if (tabCarte[z][x] === "S") {
        tabSolsSpawn.push(creerSolSpawn(gl, x, z));
      }

      if (tabCarte[z][x] === "X") {
        var porte = creerPorteSpawn(gl, 0, 0.0, x + 0.5, -0.99, z + 0.5);

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

  // Cases libres pour coffre / TP / receveurs / flèches
  var casesLibres = [];

  for (var z = 0; z < tabCarte.length; z++) {
    for (var x = 0; x < tabCarte[z].length; x++) {
      if (tabCarte[z][x] === "_") {
        casesLibres.push({ x: x, z: z });
      }
    }
  }

  function tirerCase() {
    var index = Math.floor(Math.random() * casesLibres.length);
    return casesLibres.splice(index, 1)[0];
  }

  // Coffre
  var pos = tirerCase();
  objCoffre = creerCoffre(gl, pos.x + 0.5, 0.45, pos.z + 0.5);
  console.log("Coffre →", pos.x, pos.z);

  var coffreCaseX = pos.x;
  var coffreCaseZ = pos.z;

  // 3 téléporteurs
  for (var i = 0; i < 3; i++) {
    pos = tirerCase();
    console.log("TeleTransporteur", i, "→", pos.x, pos.z);
    tabTeleporteurs.push(
      creerTeleTransporteur(gl, pos.x + 0.5, 1.0, pos.z + 0.5)
    );
  }

  // 3 receveurs
  for (var i = 0; i < 3; i++) {
    pos = tirerCase();
    console.log("TeleReceveur", i, "→", pos.x, pos.z);
    tabReceveurs.push(
      creerTeleReceveur(gl, pos.x + 0.5, 1.0, pos.z + 0.5)
    );
  }

  // 10 flèches
  for (var i = 0; i < 10; i++) {
    pos = tirerCase();

    var angleFleche = getAngleVersCoffre(pos.x, pos.z, coffreCaseX, coffreCaseZ);

    tabFleches.push(
      creerFleche(gl, pos.x + 0.5, 1.3, pos.z + 0.5, angleFleche)
    );

    console.log("Fleche", i, "→", pos.x, pos.z, "| angle:", angleFleche.toFixed(2));
  }

  requestAnimationFrame(bouclePrincipale);
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
  mettreAJourCamera();

  verifierCollisionCoffre();
  verifierTeleportation();
  verifierSortieSpawn();
  animerMursOuvrables();
  animerPortesSpawn();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  dessinerObjet(gl, prog, objPlancher);
  dessinerObjet(gl, prog, objCiel);

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

  requestAnimationFrame(bouclePrincipale);
}
