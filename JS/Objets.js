// Contient tout les objets du jeu, plancher, plafond, mur ouvrable, mur non ouvrable, flèche, télé-transporteur, télé-receveur, trésor, etc...
function creerPlancher(objgl) {
  var plancher = {};

  var tabSommets = [0.0, 0.0, 0.0, 31.0, 0.0, 0.0, 31.0, 0.0, 31.0, 0.0, 0.0, 31.0];

  plancher.vertex = objgl.createBuffer();
  objgl.bindBuffer(objgl.ARRAY_BUFFER, plancher.vertex);
  objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabSommets), objgl.STATIC_DRAW);

  var tabCouleurs = [0.3, 0.3, 0.3, 1.0, 0.3, 0.3, 0.3, 1.0, 0.3, 0.3, 0.3, 1.0, 0.3, 0.3, 0.3, 1.0];

  plancher.couleurs = objgl.createBuffer();
  objgl.bindBuffer(objgl.ARRAY_BUFFER, plancher.couleurs);
  objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

  var tabTexels = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

  plancher.texels = objgl.createBuffer();
  objgl.bindBuffer(objgl.ARRAY_BUFFER, plancher.texels);
  objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

  plancher.texels.intNoTexture = 0;
  plancher.texels.pcCouleurTexel = 0.0;

  var tabIndices = [0, 1, 2, 0, 2, 3];

  plancher.maillage = objgl.createBuffer();
  objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, plancher.maillage);
  objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabIndices), objgl.STATIC_DRAW);
  plancher.maillage.intNbTriangles = 2;

  plancher.transformations = creerTransformations();

  return plancher;
}

function creerSolSpawn(objgl, x, z) {
  var solSpawn = {};

  var tabSommets = [
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 1.0,
    0.0, 0.0, 1.0
  ];

  solSpawn.vertex = objgl.createBuffer();
  objgl.bindBuffer(objgl.ARRAY_BUFFER, solSpawn.vertex);
  objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabSommets), objgl.STATIC_DRAW);

  var tabCouleurs = [
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0
  ];

  solSpawn.couleurs = objgl.createBuffer();
  objgl.bindBuffer(objgl.ARRAY_BUFFER, solSpawn.couleurs);
  objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

  var tabTexels = [
    0.0, 0.0,
    0.0, 0.0,
    0.0, 0.0,
    0.0, 0.0
  ];

  solSpawn.texels = objgl.createBuffer();
  objgl.bindBuffer(objgl.ARRAY_BUFFER, solSpawn.texels);
  objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

  solSpawn.texels.intNoTexture = 0;
  solSpawn.texels.pcCouleurTexel = 0.0;

  var tabIndices = [0, 1, 2, 0, 2, 3];

  solSpawn.maillage = objgl.createBuffer();
  objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, solSpawn.maillage);
  objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabIndices), objgl.STATIC_DRAW);
  solSpawn.maillage.intNbTriangles = 2;

  solSpawn.transformations = creerTransformations();
  solSpawn.transformations[0] = x;
  solSpawn.transformations[1] = 0.01;
  solSpawn.transformations[2] = z;

  return solSpawn;
}

function creerCiel(objgl) {
  var ciel = {};

  var tabSommets = [
    0.0, 0.0, 0.0,
    31.0, 0.0, 0.0,
    31.0, 0.0, 31.0,
    0.0, 0.0, 31.0
  ];

  ciel.vertex = objgl.createBuffer();
  objgl.bindBuffer(objgl.ARRAY_BUFFER, ciel.vertex);
  objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabSommets), objgl.STATIC_DRAW);

  // 🔵 couleur ciel
  var tabCouleurs = [
    0.5, 0.7, 1.0, 1.0,
    0.5, 0.7, 1.0, 1.0,
    0.5, 0.7, 1.0, 1.0,
    0.5, 0.7, 1.0, 1.0
  ];

  ciel.couleurs = objgl.createBuffer();
  objgl.bindBuffer(objgl.ARRAY_BUFFER, ciel.couleurs);
  objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

  var tabTexels = [
    0.0, 0.0,
    0.0, 0.0,
    0.0, 0.0,
    0.0, 0.0
  ];

  ciel.texels = objgl.createBuffer();
  objgl.bindBuffer(objgl.ARRAY_BUFFER, ciel.texels);
  objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

  ciel.texels.intNoTexture = 0;
  ciel.texels.pcCouleurTexel = 0.0;

  var tabIndices = [
    0, 2, 1,   // inversé pour être visible d’en dessous
    0, 3, 2
  ];

  ciel.maillage = objgl.createBuffer();
  objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, ciel.maillage);
  objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabIndices), objgl.STATIC_DRAW);
  ciel.maillage.intNbTriangles = 2;

  ciel.transformations = creerTransformations();

  // 🔥 hauteur au-dessus des murs
  ciel.transformations[1] = 1.5;

  return ciel;
}

function creerMurOuvrable(gl, noTexture, pcTexture, x, y, z) {
  var murOuvrable = {};

  var w = 0.5;
  var h = 1.0;
  var d = 0.5;

  var tabSommets = [
    // avant
    -w, -h, d,
    w, -h, d,
    w, h, d,
    -w, h, d,

    // arrière
    w, -h, -d,
    -w, -h, -d,
    -w, h, -d,
    w, h, -d,

    // gauche
    -w, -h, -d,
    -w, -h, d,
    -w, h, d,
    -w, h, -d,

    // droite
    w, -h, d,
    w, -h, -d,
    w, h, -d,
    w, h, d,

    // dessus
    -w, h, d,
    w, h, d,
    w, h, -d,
    -w, h, -d,

    // dessous
    -w, -h, -d,
    w, -h, -d,
    w, -h, d,
    -w, -h, d,
  ];

  murOuvrable.vertex = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, murOuvrable.vertex);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabSommets), gl.STATIC_DRAW);

  var c1 = [0.0, 0.6, 0.6, 1.0];
  var c2 = [0.0, 0.6, 0.6, 1.0];
  var c3 = [0.4, 0.4, 0.4, 1.0];

  var tabCouleurs = [];
  for (var i = 0; i < 4; i++) tabCouleurs.push(c1[0], c1[1], c1[2], c1[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c1[0], c1[1], c1[2], c1[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c1[0], c1[1], c1[2], c1[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c1[0], c1[1], c1[2], c1[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c2[0], c2[1], c2[2], c2[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c3[0], c3[1], c3[2], c3[3]);

  murOuvrable.couleurs = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, murOuvrable.couleurs);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabCouleurs), gl.STATIC_DRAW);

  var uv = [0, 0, 1, 0, 1, 1, 0, 1];
  var tabTexels = [].concat(uv, uv, uv, uv, uv, uv);

  murOuvrable.texels = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, murOuvrable.texels);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabTexels), gl.STATIC_DRAW);
  murOuvrable.texels.intNoTexture = noTexture;
  murOuvrable.texels.pcCouleurTexel = pcTexture;

  var tabIndices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];

  murOuvrable.maillage = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, murOuvrable.maillage);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabIndices), gl.STATIC_DRAW);
  murOuvrable.maillage.intNbTriangles = 12;

  murOuvrable.transformations = creerTransformations();
  murOuvrable .transformations[0] = x;
  murOuvrable .transformations[1] = y;
  murOuvrable .transformations[2] = z;

  return murOuvrable;
}

function creerMurNonOuvrable(gl, noTexture, pcTexture, x, y, z) {
  var mur = {};

  var w = 0.5;
  var h = 1.0;
  var d = 0.5;

  var tabSommets = [
    // avant
    -w, -h, d,   w, -h, d,   w, h, d,   -w, h, d,

    // arrière
    w, -h, -d,   -w, -h, -d,   -w, h, -d,   w, h, -d,

    // gauche
    -w, -h, -d,   -w, -h, d,   -w, h, d,   -w, h, -d,

    // droite
    w, -h, d,   w, -h, -d,   w, h, -d,   w, h, d,

    // dessus
    -w, h, d,   w, h, d,   w, h, -d,   -w, h, -d,

    // dessous
    -w, -h, -d,   w, -h, -d,   w, -h, d,   -w, -h, d,
  ];

  mur.vertex = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, mur.vertex);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabSommets), gl.STATIC_DRAW);

  // 🔴 Couleur rouge
  var c1 = [0.8, 0.0, 0.0, 1.0];
  var c2 = [1.0, 0.2, 0.2, 1.0];
  var c3 = [0.5, 0.0, 0.0, 1.0];

  var tabCouleurs = [];
  for (var i = 0; i < 4; i++) tabCouleurs.push(...c1);
  for (var i = 0; i < 4; i++) tabCouleurs.push(...c1);
  for (var i = 0; i < 4; i++) tabCouleurs.push(...c1);
  for (var i = 0; i < 4; i++) tabCouleurs.push(...c1);
  for (var i = 0; i < 4; i++) tabCouleurs.push(...c2);
  for (var i = 0; i < 4; i++) tabCouleurs.push(...c3);

  mur.couleurs = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, mur.couleurs);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabCouleurs), gl.STATIC_DRAW);

  var uv = [0, 0, 1, 0, 1, 1, 0, 1];
  var tabTexels = [].concat(uv, uv, uv, uv, uv, uv);

  mur.texels = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, mur.texels);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabTexels), gl.STATIC_DRAW);

  mur.texels.intNoTexture = noTexture;
  mur.texels.pcCouleurTexel = pcTexture;

  var tabIndices = [
    0,1,2, 0,2,3,
    4,5,6, 4,6,7,
    8,9,10, 8,10,11,
    12,13,14, 12,14,15,
    16,17,18, 16,18,19,
    20,21,22, 20,22,23
  ];

  mur.maillage = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mur.maillage);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabIndices), gl.STATIC_DRAW);
  mur.maillage.intNbTriangles = 12;

  mur.transformations = creerTransformations();
  mur.transformations[0] = x;
  mur.transformations[1] = y;
  mur.transformations[2] = z;

  return mur;
}

function creerPorteSpawn(gl, noTexture, pcTexture, x, y, z) {
  var porte = {};

  var w = 0.5;
  var h = 1.0;
  var d = 0.5;

  var tabSommets = [
    // avant
    -w, -h, d,   w, -h, d,   w, h, d,   -w, h, d,

    // arrière
    w, -h, -d,   -w, -h, -d,   -w, h, -d,   w, h, -d,

    // gauche
    -w, -h, -d,   -w, -h, d,   -w, h, d,   -w, h, -d,

    // droite
    w, -h, d,   w, -h, -d,   w, h, -d,   w, h, d,

    // dessus
    -w, h, d,   w, h, d,   w, h, -d,   -w, h, -d,

    // dessous
    -w, -h, -d,   w, -h, -d,   w, -h, d,   -w, -h, d,
  ];

  porte.vertex = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, porte.vertex);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabSommets), gl.STATIC_DRAW);

  var c1 = [0.8, 0.0, 0.0, 1.0];
  var c2 = [1.0, 0.2, 0.2, 1.0];
  var c3 = [0.5, 0.0, 0.0, 1.0];

  var tabCouleurs = [];
  for (var i = 0; i < 4; i++) tabCouleurs.push(c1[0], c1[1], c1[2], c1[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c1[0], c1[1], c1[2], c1[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c1[0], c1[1], c1[2], c1[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c1[0], c1[1], c1[2], c1[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c2[0], c2[1], c2[2], c2[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c3[0], c3[1], c3[2], c3[3]);

  porte.couleurs = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, porte.couleurs);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabCouleurs), gl.STATIC_DRAW);

  var uv = [0, 0, 1, 0, 1, 1, 0, 1];
  var tabTexels = [].concat(uv, uv, uv, uv, uv, uv);

  porte.texels = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, porte.texels);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabTexels), gl.STATIC_DRAW);

  porte.texels.intNoTexture = noTexture;
  porte.texels.pcCouleurTexel = pcTexture;

  var tabIndices = [
    0,1,2, 0,2,3,
    4,5,6, 4,6,7,
    8,9,10, 8,10,11,
    12,13,14, 12,14,15,
    16,17,18, 16,18,19,
    20,21,22, 20,22,23
  ];

  porte.maillage = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, porte.maillage);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabIndices), gl.STATIC_DRAW);
  porte.maillage.intNbTriangles = 12;

  porte.transformations = creerTransformations();
  porte.transformations[0] = x;
  porte.transformations[1] = y;
  porte.transformations[2] = z;

  return porte;
}

function creerCoffre(gl, x, y, z) {
  var coffre = {};

  var w = 0.2;
  var h = 0.2;
  var d = 0.2;

  var tabSommets = [
    -w, -h, d,   w, -h, d,   w, h, d,   -w, h, d,
    w, -h, -d,   -w, -h, -d,   -w, h, -d,   w, h, -d,
    -w, -h, -d,   -w, -h, d,   -w, h, d,   -w, h, -d,
    w, -h, d,   w, -h, -d,   w, h, -d,   w, h, d,
    -w, h, d,   w, h, d,   w, h, -d,   -w, h, -d,
    -w, -h, -d,   w, -h, -d,   w, -h, d,   -w, -h, d
  ];

  coffre.vertex = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, coffre.vertex);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabSommets), gl.STATIC_DRAW);

  // 🟡 jaune
  var c1 = [1.0, 1.0, 0.0, 1.0];
  var c2 = [1.0, 0.8, 0.0, 1.0];
  var c3 = [0.8, 0.6, 0.0, 1.0];

  var tabCouleurs = [];
  for (var i = 0; i < 4; i++) tabCouleurs.push(...c1);
  for (var i = 0; i < 4; i++) tabCouleurs.push(...c1);
  for (var i = 0; i < 4; i++) tabCouleurs.push(...c1);
  for (var i = 0; i < 4; i++) tabCouleurs.push(...c1);
  for (var i = 0; i < 4; i++) tabCouleurs.push(...c2);
  for (var i = 0; i < 4; i++) tabCouleurs.push(...c3);

  coffre.couleurs = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, coffre.couleurs);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabCouleurs), gl.STATIC_DRAW);

  var uv = [0,0, 1,0, 1,1, 0,1];
  var tabTexels = [].concat(uv, uv, uv, uv, uv, uv);

  coffre.texels = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, coffre.texels);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabTexels), gl.STATIC_DRAW);

  coffre.texels.intNoTexture = 0;
  coffre.texels.pcCouleurTexel = 0.0;

  var tabIndices = [
    0,1,2, 0,2,3,
    4,5,6, 4,6,7,
    8,9,10, 8,10,11,
    12,13,14, 12,14,15,
    16,17,18, 16,18,19,
    20,21,22, 20,22,23
  ];

  coffre.maillage = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coffre.maillage);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabIndices), gl.STATIC_DRAW);
  coffre.maillage.intNbTriangles = 12;

  coffre.transformations = creerTransformations();
  coffre.transformations[0] = x;
  coffre.transformations[1] = y;
  coffre.transformations[2] = z;

  return coffre;
}

function creerTeleTransporteur(gl, x, y, z) {
  var obj = {};

  var w = 0.3;
  var h = 1.0;
  var d = 0.3;

  var tabSommets = [
    -w,-h,d,  w,-h,d,  w,h,d,  -w,h,d,
    w,-h,-d, -w,-h,-d, -w,h,-d, w,h,-d,
    -w,-h,-d, -w,-h,d, -w,h,d, -w,h,-d,
    w,-h,d,  w,-h,-d,  w,h,-d,  w,h,d,
    -w,h,d,  w,h,d,  w,h,-d, -w,h,-d,
    -w,-h,-d, w,-h,-d, w,-h,d, -w,-h,d
  ];

  obj.vertex = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertex);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabSommets), gl.STATIC_DRAW);

  // 🔵 BLEU
  var c1 = [0.0, 0.4, 1.0, 1.0];
  var c2 = [0.2, 0.6, 1.0, 1.0];
  var c3 = [0.0, 0.2, 0.6, 1.0];

  var tabCouleurs = [];
  for (var i=0;i<4;i++) tabCouleurs.push(...c1);
  for (var i=0;i<4;i++) tabCouleurs.push(...c1);
  for (var i=0;i<4;i++) tabCouleurs.push(...c1);
  for (var i=0;i<4;i++) tabCouleurs.push(...c1);
  for (var i=0;i<4;i++) tabCouleurs.push(...c2);
  for (var i=0;i<4;i++) tabCouleurs.push(...c3);

  obj.couleurs = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.couleurs);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabCouleurs), gl.STATIC_DRAW);

  var uv = [0,0,1,0,1,1,0,1];
  var tabTexels = [].concat(uv,uv,uv,uv,uv,uv);

  obj.texels = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.texels);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabTexels), gl.STATIC_DRAW);

  obj.texels.intNoTexture = 0;
  obj.texels.pcCouleurTexel = 0.0;

  var tabIndices = [
    0,1,2,0,2,3, 4,5,6,4,6,7,
    8,9,10,8,10,11, 12,13,14,12,14,15,
    16,17,18,16,18,19, 20,21,22,20,22,23
  ];

  obj.maillage = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.maillage);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabIndices), gl.STATIC_DRAW);
  obj.maillage.intNbTriangles = 12;

  obj.transformations = creerTransformations();
  obj.transformations[0] = x;
  obj.transformations[1] = y;
  obj.transformations[2] = z;

  return obj;
}

function creerTeleReceveur(gl, x, y, z) {
  var obj = {};

  var w = 0.3;
  var h = 1.0;
  var d = 0.3;

  var tabSommets = [
    -w,-h,d,  w,-h,d,  w,h,d,  -w,h,d,
    w,-h,-d, -w,-h,-d, -w,h,-d, w,h,-d,
    -w,-h,-d, -w,-h,d, -w,h,d, -w,h,-d,
    w,-h,d,  w,-h,-d,  w,h,-d,  w,h,d,
    -w,h,d,  w,h,d,  w,h,-d, -w,h,-d,
    -w,-h,-d, w,-h,-d, w,-h,d, -w,-h,d
  ];

  obj.vertex = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertex);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabSommets), gl.STATIC_DRAW);

  // 🟢 VERT
  var c1 = [0.0, 0.8, 0.0, 1.0];
  var c2 = [0.3, 1.0, 0.3, 1.0];
  var c3 = [0.0, 0.4, 0.0, 1.0];

  var tabCouleurs = [];
  for (var i=0;i<4;i++) tabCouleurs.push(...c1);
  for (var i=0;i<4;i++) tabCouleurs.push(...c1);
  for (var i=0;i<4;i++) tabCouleurs.push(...c1);
  for (var i=0;i<4;i++) tabCouleurs.push(...c1);
  for (var i=0;i<4;i++) tabCouleurs.push(...c2);
  for (var i=0;i<4;i++) tabCouleurs.push(...c3);

  obj.couleurs = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.couleurs);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabCouleurs), gl.STATIC_DRAW);

  var uv = [0,0,1,0,1,1,0,1];
  var tabTexels = [].concat(uv,uv,uv,uv,uv,uv);

  obj.texels = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.texels);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabTexels), gl.STATIC_DRAW);

  obj.texels.intNoTexture = 0;
  obj.texels.pcCouleurTexel = 0.0;

  var tabIndices = [
    0,1,2,0,2,3, 4,5,6,4,6,7,
    8,9,10,8,10,11, 12,13,14,12,14,15,
    16,17,18,16,18,19, 20,21,22,20,22,23
  ];

  obj.maillage = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.maillage);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabIndices), gl.STATIC_DRAW);
  obj.maillage.intNbTriangles = 12;

  obj.transformations = creerTransformations();
  obj.transformations[0] = x;
  obj.transformations[1] = y;
  obj.transformations[2] = z;

  return obj;
}

function creerFleche(gl, x, y, z, angleY) {
  var fleche = {};

  var e = 0.08; // épaisseur

  // 7 sommets devant (y = +e) + 7 sommets derrière (y = -e)
  var tabSommets = [
    // ===== face avant =====
     0.00,  e,  0.70,  // 0 pointe
     0.35,  e,  0.15,  // 1 aile droite
     0.12,  e,  0.15,  // 2 haut tige droite
     0.12,  e, -0.70,  // 3 bas tige droite
    -0.12,  e, -0.70,  // 4 bas tige gauche
    -0.12,  e,  0.15,  // 5 haut tige gauche
    -0.35,  e,  0.15,  // 6 aile gauche

    // ===== face arrière =====
     0.00, -e,  0.70,  // 7
     0.35, -e,  0.15,  // 8
     0.12, -e,  0.15,  // 9
     0.12, -e, -0.70,  // 10
    -0.12, -e, -0.70,  // 11
    -0.12, -e,  0.15,  // 12
    -0.35, -e,  0.15   // 13
  ];

  fleche.vertex = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, fleche.vertex);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabSommets), gl.STATIC_DRAW);

  // orange
  var c1 = [1.0, 0.5, 0.0, 1.0];
  var c2 = [1.0, 0.7, 0.2, 1.0];
  var c3 = [0.8, 0.35, 0.0, 1.0];

  var tabCouleurs = [
    ...c2, ...c2, ...c1, ...c1, ...c1, ...c1, ...c2,   // avant
    ...c3, ...c3, ...c1, ...c1, ...c1, ...c1, ...c3    // arrière
  ];

  fleche.couleurs = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, fleche.couleurs);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabCouleurs), gl.STATIC_DRAW);

  var tabTexels = [];
  for (var i = 0; i < 14; i++) {
    tabTexels.push(0.0, 0.0);
  }

  fleche.texels = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, fleche.texels);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabTexels), gl.STATIC_DRAW);
  fleche.texels.intNoTexture = 0;
  fleche.texels.pcCouleurTexel = 0.0;

  var tabIndices = [
    // ===== face avant =====
    0, 1, 2,
    0, 2, 5,
    0, 5, 6,
    2, 3, 4,
    2, 4, 5,

    // ===== face arrière =====
    7, 9, 8,
    7, 12, 9,
    7, 13, 12,
    9, 11, 10,
    9, 12, 11,

    // ===== côtés =====
    0, 1, 8,   0, 8, 7,
    1, 2, 9,   1, 9, 8,
    2, 3, 10,  2, 10, 9,
    3, 4, 11,  3, 11, 10,
    4, 5, 12,  4, 12, 11,
    5, 6, 13,  5, 13, 12,
    6, 0, 7,   6, 7, 13
  ];

  fleche.maillage = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fleche.maillage);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabIndices), gl.STATIC_DRAW);
  fleche.maillage.intNbTriangles = tabIndices.length / 3;

  fleche.transformations = creerTransformations();
  fleche.transformations[0] = x;
  fleche.transformations[1] = y;
  fleche.transformations[2] = z;

  setAngleY(angleY, fleche.transformations);
  setEchelleX(0.5, fleche.transformations);
  setEchelleY(1.0, fleche.transformations);
  setEchelleZ(0.5, fleche.transformations);

  return fleche;
}

function dessinerObjet(objgl, objProgShaders, obj) {
  var matModeleVue = obtenirMatriceVue();

  mat4.translate(matModeleVue, [getPositionX(obj.transformations), getPositionY(obj.transformations), getPositionZ(obj.transformations)]);

  mat4.rotateX(matModeleVue, (getAngleX(obj.transformations) * Math.PI) / 180);
  mat4.rotateY(matModeleVue, (getAngleY(obj.transformations) * Math.PI) / 180);
  mat4.rotateZ(matModeleVue, (getAngleZ(obj.transformations) * Math.PI) / 180);

  mat4.scale(matModeleVue, [getEchelleX(obj.transformations), getEchelleY(obj.transformations), getEchelleZ(obj.transformations)]);

  objgl.uniformMatrix4fv(objProgShaders.matModeleVue, false, matModeleVue);

  objgl.bindBuffer(objgl.ARRAY_BUFFER, obj.vertex);
  objgl.vertexAttribPointer(objProgShaders.posVertex, 3, objgl.FLOAT, false, 0, 0);

  objgl.bindBuffer(objgl.ARRAY_BUFFER, obj.couleurs);
  objgl.vertexAttribPointer(objProgShaders.couleurVertex, 4, objgl.FLOAT, false, 0, 0);

  objgl.bindBuffer(objgl.ARRAY_BUFFER, obj.texels);
  objgl.vertexAttribPointer(objProgShaders.posTexel, 2, objgl.FLOAT, false, 0, 0);

  objgl.uniform1f(objProgShaders.pcCouleurTexel, obj.texels.pcCouleurTexel);

  objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, obj.maillage);
  objgl.drawElements(objgl.TRIANGLES, obj.maillage.intNbTriangles * 3, objgl.UNSIGNED_SHORT, 0);
}

