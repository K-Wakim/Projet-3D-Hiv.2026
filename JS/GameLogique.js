// Contient la logique du jeu, collision, ouverture de mur, détection du trésor, passage au prochain niveau, téléportation, placement des flèches, timer, score, reset niveau, game over/win, etc...
var TEMPS_NIVEAU = 60;
var tempsRestant = TEMPS_NIVEAU;
var dernierTemps = 0;
var timerActif = false;
var tempsVueAerienneAccumule = 0;
var dernierTempsVueAerienne = 0;

var nbOuvreursParNiveau = [4, 4, 3, 3, 2, 2, 1, 1, 0, 0];
var nbFlechesParNiveau = [18, 16, 14, 12, 10, 8, 6, 4, 2, 0];
var nbTeleporteursParNiveau = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5];
var nbReceveursParNiveau = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function collisionMur(x, z) {
  var col = Math.floor(x);
  var lig = Math.floor(z);

  if (lig < 0 || lig >= tabCarte.length || col < 0 || col >= tabCarte[0].length) {
    return true;
  }

  var caseCarte = tabCarte[lig][col];

  return caseCarte === "M" || caseCarte === "O" || caseCarte === "X";
}

function verifierCollisionCoffre() {
  if (objCoffre == null || jeuTermine) {
    return;
  }

  var xCam = posCam[0];
  var zCam = posCam[2];

  var xCoffre = getPositionX(objCoffre.transformations);
  var zCoffre = getPositionZ(objCoffre.transformations);

  var distanceX = Math.abs(xCam - xCoffre);
  var distanceZ = Math.abs(zCam - zCoffre);

  if (distanceX < 0.4 && distanceZ < 0.4) {
    console.log("Coffre trouvé !");

    var bonus = Math.floor(tempsRestant) * 10;
    ajouterScore(bonus);

    passerAuNiveauSuivant();
  }
}

function verifierTeleportation() {
  if (tabTeleporteurs.length === 0 || tabReceveurs.length === 0) {
    return;
  }

  for (var i = 0; i < tabTeleporteurs.length; i++) {
    var xTP = getPositionX(tabTeleporteurs[i].transformations);
    var zTP = getPositionZ(tabTeleporteurs[i].transformations);

    var distanceX = Math.abs(posCam[0] - xTP);
    var distanceZ = Math.abs(posCam[2] - zTP);

    // contact avec un téléporteur
    if (distanceX < 0.4 && distanceZ < 0.4) {
      var indexReceveur = Math.floor(Math.random() * tabReceveurs.length);
      var receveur = tabReceveurs[indexReceveur];

      var xR = getPositionX(receveur.transformations);
      var zR = getPositionZ(receveur.transformations);

      // téléporter la caméra au centre du télé-réceveur
      posCam[0] = xR;
      posCam[2] = zR;

      // garder la même direction
      mettreAJourCibleCamera();
      synchroniserCamera();

      console.log("Téléportation vers :", Math.floor(xR), Math.floor(zR));
      return;
    }
  }
}

function initialiserControlesJeu() {
  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && !e.repeat) {
      tenterOuvrirMurDevantCamera();
    }
  });
}

function getCasesDevantCamera() {
  var caseX = Math.floor(posCam[0]);
  var caseZ = Math.floor(posCam[2]);

  var dx = Math.cos(angleCamera);
  var dz = Math.sin(angleCamera);

  var sx = 0;
  var sz = 0;

  if (dx > 0.2) sx = 1;
  else if (dx < -0.2) sx = -1;

  if (dz > 0.2) sz = 1;
  else if (dz < -0.2) sz = -1;

  var cases = [];

  // devant principal
  if (sx !== 0 || sz !== 0) {
    cases.push({ x: caseX + sx, z: caseZ + sz });
  }

  // si diagonale, essayer aussi les deux voisines
  if (sx !== 0 && sz !== 0) {
    cases.push({ x: caseX + sx, z: caseZ });
    cases.push({ x: caseX, z: caseZ + sz });
  }

  return cases;
}

function tenterOuvrirMurDevantCamera() {
  if (!peutUtiliserOuvreur()) {
    console.log("Impossible d'utiliser un ouvreur");
    return;
  }

  var casesDevant = getCasesDevantCamera();

  for (var c = 0; c < casesDevant.length; c++) {
    var x = casesDevant[c].x;
    var z = casesDevant[c].z;

    if (z < 0 || z >= tabCarte.length || x < 0 || x >= tabCarte[0].length) {
      continue;
    }

    if (tabCarte[z][x] !== "O") {
      continue;
    }

    for (var i = 0; i < tabMursOuvrables.length; i++) {
      var mur = tabMursOuvrables[i];

      if (mur.caseX === x && mur.caseZ === z && !mur.binEnOuverture && !mur.binOuvert) {
        mur.binEnOuverture = true;
        nbOuvreurs--;
        ajouterScore(-50);
        console.log("Ouverture du mur :", x, z, "| Ouvreurs restants :", nbOuvreurs);
        return;
      }
    }
  }

  console.log("Aucun mur ouvrable devant la caméra");
}

function animerMursOuvrables() {
  for (var i = 0; i < tabMursOuvrables.length; i++) {
    var mur = tabMursOuvrables[i];

    if (mur.binEnOuverture) {
      var y = getPositionY(mur.transformations);
      y -= 0.03;

      if (y <= -0.99) {
        y = -0.99;
        mur.binEnOuverture = false;
        mur.binOuvert = true;

        // le mur devient traversable
        tabCarte[mur.caseZ][mur.caseX] = "_";
      }

      setPositionY(y, mur.transformations);
    }
  }
}

function verifierSortieSpawn() {
  var caseX = Math.floor(posCam[0]);
  var caseZ = Math.floor(posCam[2]);

  if (caseX === 15 && caseZ === 12) {
    for (var i = 0; i < tabPortesSpawn.length; i++) {
      var porte = tabPortesSpawn[i];

      if (!porte.binEnFermeture && !porte.binFermee) {
        porte.binEnFermeture = true;
        console.log("Fermeture de la porte du spawn");
      }
    }
  }
}

function joueurEstEncoreDansSpawn() {
  var caseX = Math.floor(posCam[0]);
  var caseZ = Math.floor(posCam[2]);

  if (caseZ < 0 || caseZ >= tabCarte.length || caseX < 0 || caseX >= tabCarte[0].length) {
    return false;
  }

  return tabCarte[caseZ][caseX] === "S";
}

function animerPortesSpawn() {
  for (var i = 0; i < tabPortesSpawn.length; i++) {
    var porte = tabPortesSpawn[i];

    if (porte.binEnFermeture) {
      var y = getPositionY(porte.transformations);
      y += 0.03;

      if (y >= 0.5) {
        y = 0.5;
        porte.binEnFermeture = false;
        porte.binFermee = true;
        console.log("Porte fermée");
      }

      setPositionY(y, porte.transformations);

      if (!joueurEstEncoreDansSpawn()) {
        tabCarte[porte.caseZ][porte.caseX] = "X";
      }
    }
  }
}

function getCasesLibres() {
  var casesLibres = [];

  for (var z = 0; z < tabCarte.length; z++) {
    for (var x = 0; x < tabCarte[z].length; x++) {
      if (tabCarte[z][x] === "_") {
        casesLibres.push({ x: x, z: z });
      }
    }
  }

  return casesLibres;
}

function tirerCase(casesLibres) {
  var index = Math.floor(Math.random() * casesLibres.length);
  return casesLibres.splice(index, 1)[0];
}

function placerObjetsAleatoiresPourNiveau(noNiveau) {
  var indexNiveau = noNiveau - 1;

  objCoffre = null;
  tabTeleporteurs = [];
  tabReceveurs = [];
  tabFleches = [];

  nbOuvreurs = nbOuvreursParNiveau[indexNiveau];

  var casesLibres = getCasesLibres();

  // Coffre
  var pos = tirerCase(casesLibres);
  objCoffre = creerCoffre(gl, pos.x + 0.5, 0.45, pos.z + 0.5);
  console.log("Niveau", noNiveau, "- Coffre →", pos.x, pos.z);

  var coffreCaseX = pos.x;
  var coffreCaseZ = pos.z;

  // Télé-transporteurs
  for (var i = 0; i < nbTeleporteursParNiveau[indexNiveau]; i++) {
    pos = tirerCase(casesLibres);
    console.log("Niveau", noNiveau, "- TeleTransporteur", i, "→", pos.x, pos.z);

    tabTeleporteurs.push(creerTeleTransporteur(gl, pos.x + 0.5, 1.0, pos.z + 0.5));
  }

  // Télé-récepteurs
  for (var i = 0; i < nbReceveursParNiveau[indexNiveau]; i++) {
    pos = tirerCase(casesLibres);
    console.log("Niveau", noNiveau, "- TeleReceveur", i, "→", pos.x, pos.z);

    tabReceveurs.push(creerTeleReceveur(gl, pos.x + 0.5, 1.0, pos.z + 0.5));
  }

  // Flèches
  for (var i = 0; i < nbFlechesParNiveau[indexNiveau]; i++) {
    pos = tirerCase(casesLibres);

    var angleFleche = getAngleVersCoffre(pos.x, pos.z, coffreCaseX, coffreCaseZ);

    tabFleches.push(creerFleche(gl, pos.x + 0.5, 1.3, pos.z + 0.5, angleFleche));

    console.log("Niveau", noNiveau, "- Fleche", i, "→", pos.x, pos.z, "| angle:", angleFleche.toFixed(2));
  }
}

function replacerCameraAuSpawn() {
  posCam = [15.5, 0.6, 15.5];
  angleCamera = -Math.PI / 2;

  mettreAJourCibleCamera();
  synchroniserCamera();
}

function reinitialiserEtatCarteEtObjetsFixes() {
  // refermer tous les murs ouvrables
  for (var i = 0; i < tabMursOuvrables.length; i++) {
    var mur = tabMursOuvrables[i];

    setPositionY(0.5, mur.transformations);
    mur.binEnOuverture = false;
    mur.binOuvert = false;

    tabCarte[mur.caseZ][mur.caseX] = "O";
  }

  // rouvrir la porte du spawn
  for (var i = 0; i < tabPortesSpawn.length; i++) {
    var porte = tabPortesSpawn[i];

    setPositionY(-0.99, porte.transformations);
    porte.binEnFermeture = false;
    porte.binFermee = false;

    tabCarte[porte.caseZ][porte.caseX] = "_";
  }
}

function resetTimer() {
  tempsRestant = TEMPS_NIVEAU;
  dernierTemps = Date.now();
  timerActif = false;
}

function mettreAJourTimer() {
  if (jeuTermine) {
    return;
  }

  if (!timerActif) {
    dernierTemps = Date.now();
    return;
  }

  var maintenant = Date.now();
  var delta = (maintenant - dernierTemps) / 1000;

  dernierTemps = maintenant;
  tempsRestant -= delta;

  if (tempsRestant <= 0) {
    console.log("Temps écoulé !");
    tempsRestant = 0;
    recommencerNiveau();
  }

  if (Math.floor(tempsRestant) !== Math.floor(tempsRestant + delta)) {
    console.log("Temps:", Math.floor(tempsRestant));
  }
}

function recommencerNiveau() {
  ajouterScore(-200);

  if (score < 0) {
    score = 0;
  }

  if (score < 200) {
    jeuTermine = true;
    return;
  }

  console.log("Recommencer niveau", niveauActuel);

  replacerCameraAuSpawn();
  reinitialiserEtatCarteEtObjetsFixes();

  nbOuvreurs = nbOuvreursParNiveau[niveauActuel - 1];

  resetTimer();
}

function initialiserScore() {
  score = 300;
  jeuTermine = false;
  tempsVueAerienneAccumule = 0;
  dernierTempsVueAerienne = Date.now();
  console.log("Score initial :", score);
}

function ajouterScore(points) {
  score += points;
  console.log("Score :", score, "(" + (points >= 0 ? "+" : "") + points + ")");
}

function peutUtiliserOuvreur() {
  return score >= 50 && nbOuvreurs > 0;
}

function peutUtiliserVueAerienne() {
  return score >= 10;
}

function verifierGameOverRecommencer() {
  if (score < 200) {
    jeuTermine = true;
    console.log("GAME OVER");
    return true;
  }
  return false;
}

function mettreAJourScoreVueAerienne() {
  var maintenant = Date.now();

  if (!modeVueAerienne || jeuTermine) {
    dernierTempsVueAerienne = maintenant;
    return;
  }

  var delta = (maintenant - dernierTempsVueAerienne) / 1000;
  dernierTempsVueAerienne = maintenant;

  tempsVueAerienneAccumule += delta;

  while (tempsVueAerienneAccumule >= 1.0) {
    tempsVueAerienneAccumule -= 1.0;

    if (score >= 10) {
      ajouterScore(-10);
    }

    if (score < 10) {
      console.log("Score trop bas pour la vue aérienne");
      desactiverVueAerienne();
      break;
    }
  }
}

function demarrerNiveau(noNiveau) {
  niveauActuel = noNiveau;

  console.log("===== NIVEAU " + niveauActuel + " =====");

  replacerCameraAuSpawn();
  reinitialiserEtatCarteEtObjetsFixes();
  placerObjetsAleatoiresPourNiveau(niveauActuel);
  resetTimer();
}

function passerAuNiveauSuivant() {
  if (niveauActuel < 10) {
    demarrerNiveau(niveauActuel + 1);
  } else {
    console.log("Jeu terminé !");
    jeuTermine = true;
    objCoffre = null;
  }
}

function getAngleVersCoffre(caseX, caseZ, coffreX, coffreZ) {
  var dx = coffreX - caseX;
  var dz = coffreZ - caseZ;
  return (Math.atan2(dx, dz) * 180) / Math.PI;
}

function mettreAJourTriangleCamera() {
  if (objDisqueCamera == null) {
    return;
  }

  objDisqueCamera.transformations[0] = posCamSauvegarde[0];
  objDisqueCamera.transformations[1] = 1.51;
  objDisqueCamera.transformations[2] = posCamSauvegarde[2];

  setAngleY((-angleCameraSauvegarde * 180) / Math.PI + 90, objDisqueCamera.transformations);
}
