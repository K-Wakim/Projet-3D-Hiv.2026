// Librairie sur la caméra

// Pour créer une caméra
// Au point de départ, le transformations sont neutres.
function creerCamera() {
  var tabCamera = [0, 0, 1, 0, 0, 0, 0, 1, 0];
  return tabCamera;
}

// Pour aller chercher les positions XYZ 
function getPositionsCameraXYZ(tabCamera) {
  return tabCamera.slice(0, 3);
}

// Pour aller chercher la position en X 
function getPositionCameraX(tabCamera) {
  return tabCamera[0];
}

// Pour aller chercher la position en Y
function getPositionCameraY(tabCamera) {
  return tabCamera[1];
}

// Pour aller chercher la position en Z
function getPositionCameraZ(tabCamera) {
  return tabCamera[2];
}

// Pour aller chercher les position cibl�es 
function getCiblesCameraXYZ(tabCamera) {
  return tabCamera.slice(3, 6);
}

// Pour aller chercher la position cibl�e en X 
function getCibleCameraX(tabCamera) {
  return tabCamera[3];
}

// Pour aller chercher la position cibl�e en X
function getCibleCameraY(tabCamera) {
  return tabCamera[4];
}

// Pour aller chercher la position cibl�e en X
function getCibleCameraZ(tabCamera) {
  return tabCamera[5];
}

// Pour aller chercher les orientations XYZ
function getOrientationsXYZ(tabCamera) {
  return tabCamera.slice(6, 9);
}

// Pour aller chercher l'orientation en X
function getOrientationX(tabCamera) {
  return tabCamera[6];
}

// Pour aller chercher l'orientation en Y
function getOrientationY(tabCamera) {
  return tabCamera[7];
}

// Pour aller chercher l'orientation en Z
function getOrientationZ(tabCamera) {
  return tabCamera[8];
}

// Pour modifier les positions XYZ 
function setPositionsCameraXYZ(tabXYZ, tabCamera) {
  tabCamera.splice(0, 3, tabXYZ[0], tabXYZ[1], tabXYZ[2]);
}

// Pour modifier la position en X 
function setPositionCameraX(fltX, tabCamera) {
  tabCamera[0] = fltX;
}

// Pour modifier la position en Y 
function setPositionCameraY(fltY, tabCamera) {
  tabCamera[1] = fltY;
}

// Pour modifier la position en Z 
function setPositionCameraZ(fltZ, tabCamera) {
  tabCamera[2] = fltZ;
}

// Pour modifier les positions cibl�es 
function setCiblesCameraXYZ(tabXYZ, tabCamera) {
  tabCamera.splice(3, 3, tabXYZ[0], tabXYZ[1], tabXYZ[2]);
}

// Pour modifier la position cibl�e en X 
function setCibleCameraX(fltX, tabCamera) {
  tabCamera[3] = fltX;
}

// Pour modifier la position cibl�e en Y 
function setCibleCameraY(fltY, tabCamera) {
  tabCamera[4] = fltY;
}

// Pour modifier la position cibl�e en Z
function setCibleCameraZ(fltZ, tabCamera) {
  tabCamera[5] = fltZ;
}

// Pour modifier les orientations XYZ
function setOrientationsXYZ(tabOrientationsXYZ, tabCamera) {
  tabCamera.splice(6, 3, tabOrientationsXYZ[0], tabOrientationsXYZ[1], tabOrientationsXYZ[2]);
}

// Pour modifier l'orientation en X
function setOrientationX(fltOrientationX, tabCamera) {
  tabCamera[6] = fltOrientationX;
}

// Pour modifier l'orientation en Y
function setOrientationY(fltOrientationY, tabCamera) {
  tabCamera[7] = fltOrientationY;
}

// Pour modifier l'orientation en Z
function setOrientationZ(fltOrientationZ, tabCamera) {
  tabCamera[8] = fltOrientationZ;
}


function creerDisque3D(gl, noTexture, x, y, z) {
  //pour optimiser performance, ne pas creer le disque si pas en vue aerienne
  if (!binEnVueAerienne) {
    return null;
  }

  const triangle = {};
  
  const rayon  = 0.75;
  const hauteur = 0.75;
  
  
  const tabSommets = [
    0,         hauteur,  rayon,          
   -rayon*0.5, hauteur, -rayon,          
    rayon*0.5, hauteur, -rayon           
  ];
  const bufSommets = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufSommets);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabSommets), gl.STATIC_DRAW);
  triangle.vertex = bufSommets;
  
  const tabCouleurs = [];
  for (let i = 0; i < 3; i++) {
    tabCouleurs.push(1, 1, 0, 1);
  }
  const bufCouleurs = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufCouleurs);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabCouleurs), gl.STATIC_DRAW);
  triangle.couleurs = bufCouleurs;
  
  const tabTexels = [0,0,  0,0,  0,0];
  const bufTexels = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufTexels);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabTexels), gl.STATIC_DRAW);
  bufTexels.intNoTexture = noTexture;
  bufTexels.pcCouleurTexel = 0.0;
  triangle.texels = bufTexels;
  
  // indices pour un seul triangle
  const tabIndices = [0, 1, 2];
  const bufIndices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufIndices);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(tabIndices),
    gl.STATIC_DRAW
  );
  bufIndices.intNbTriangles = 1;
  bufIndices.intNbDroites = 0;
  triangle.maillage = bufIndices;
  
  // transformations initiales (position + échelle)
  triangle.transformations = creerTransformations();
  triangle.transformations[0] = x;
  triangle.transformations[1] = y;
  triangle.transformations[2] = z;
  setEchelleX(0.6, triangle.transformations);
  setEchelleZ(0.8, triangle.transformations);

  //effectuer une rotation pour montrer vers ou le joueur pointe

  var cibleZ = tgtCam[2];
  var cibleX = tgtCam[0];

  var posZ = posCam[2]
  var posX = posCam[0]
  var angle = Math.atan2(cibleX - posX, cibleZ - posZ) * (180 / Math.PI);
  setAngleY(angle, triangle.transformations);
  
  return triangle;
}




