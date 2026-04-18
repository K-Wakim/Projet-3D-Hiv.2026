// Contient la logique du jeu, collision, ouverture de mur, détection du trésor, passage au prochain niveau, téléportation, placement des flèches, timer, score, reset niveau, game over/win, etc...
function collisionMur(x, z) {
  var col = Math.floor(x);
  var lig = Math.floor(z);

  if (lig < 0 || lig >= tabCarte.length || col < 0 || col >= tabCarte[0].length) {
    return true;
  }

  var caseCarte = tabCarte[lig][col];

  return caseCarte === "M" || caseCarte === "O";
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
