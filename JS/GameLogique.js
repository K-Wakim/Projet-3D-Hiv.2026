// Contient la logique du jeu, collision, ouverture de mur, détection du trésor, passage au prochain niveau, téléportation, placement des flèches, timer, score, reset niveau, game over/win, etc...
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
  if (objCoffre == null) {
    return;
  }

  var xCam = posCam[0];
  var zCam = posCam[2];

  var xCoffre = getPositionX(objCoffre.transformations);
  var zCoffre = getPositionZ(objCoffre.transformations);

  var distanceX = Math.abs(xCam - xCoffre);
  var distanceZ = Math.abs(zCam - zCoffre);

  // seuil de collision simple
  if (distanceX < 0.4 && distanceZ < 0.4) {
    console.log("Coffre trouvé !");

    // temporaire : on enlève le coffre
    objCoffre = null; // à remplacer par niveauActuel++ éventuellement
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
        console.log("Ouverture du mur :", x, z);
        return;
      }
    }
  }
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

function placerObjetsAleatoires() {
  var casesLibres = getCasesLibres();

  // Coffre
  var pos = tirerCase(casesLibres);
  objCoffre = creerCoffre(gl, pos.x + 0.5, 0.45, pos.z + 0.5);
  console.log("Coffre →", pos.x, pos.z);

  var coffreCaseX = pos.x;
  var coffreCaseZ = pos.z;

  // 3 téléporteurs
  for (var i = 0; i < 3; i++) {
    pos = tirerCase(casesLibres);
    console.log("TeleTransporteur", i, "→", pos.x, pos.z);

    tabTeleporteurs.push(
      creerTeleTransporteur(gl, pos.x + 0.5, 1.0, pos.z + 0.5)
    );
  }

  // 3 receveurs
  for (var i = 0; i < 3; i++) {
    pos = tirerCase(casesLibres);
    console.log("TeleReceveur", i, "→", pos.x, pos.z);

    tabReceveurs.push(
      creerTeleReceveur(gl, pos.x + 0.5, 1.0, pos.z + 0.5)
    );
  }

  // 10 flèches
  for (var i = 0; i < 10; i++) {
    pos = tirerCase(casesLibres);

    var angleFleche = getAngleVersCoffre(pos.x, pos.z, coffreCaseX, coffreCaseZ);

    tabFleches.push(
      creerFleche(gl, pos.x + 0.5, 1.3, pos.z + 0.5, angleFleche)
    );

    console.log("Fleche", i, "→", pos.x, pos.z, "| angle:", angleFleche.toFixed(2));
  }
}

function getAngleVersCoffre(caseX, caseZ, coffreX, coffreZ) {
  var dx = coffreX - caseX;
  var dz = coffreZ - caseZ;
  return Math.atan2(dx, dz) * 180 / Math.PI;
}