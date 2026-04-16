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

function creerPilier(gl, noTexture, pcTexture, x, y, z) {
  var pilier = {};

  var w = 0.5;
  var h = 1.0;
  var d = 0.5;

  var tabSommets = [
    // avant
    -w,
    -h,
    d,
    w,
    -h,
    d,
    w,
    h,
    d,
    -w,
    h,
    d,

    // arrière
    w,
    -h,
    -d,
    -w,
    -h,
    -d,
    -w,
    h,
    -d,
    w,
    h,
    -d,

    // gauche
    -w,
    -h,
    -d,
    -w,
    -h,
    d,
    -w,
    h,
    d,
    -w,
    h,
    -d,

    // droite
    w,
    -h,
    d,
    w,
    -h,
    -d,
    w,
    h,
    -d,
    w,
    h,
    d,

    // dessus
    -w,
    h,
    d,
    w,
    h,
    d,
    w,
    h,
    -d,
    -w,
    h,
    -d,

    // dessous
    -w,
    -h,
    -d,
    w,
    -h,
    -d,
    w,
    -h,
    d,
    -w,
    -h,
    d,
  ];

  pilier.vertex = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pilier.vertex);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabSommets), gl.STATIC_DRAW);

  var c1 = [0.0, 0.6, 0.6, 1.0];
  var c2 = [0.8, 0.8, 0.8, 1.0];
  var c3 = [0.4, 0.4, 0.4, 1.0];

  var tabCouleurs = [];
  for (var i = 0; i < 4; i++) tabCouleurs.push(c1[0], c1[1], c1[2], c1[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c1[0], c1[1], c1[2], c1[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c1[0], c1[1], c1[2], c1[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c1[0], c1[1], c1[2], c1[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c2[0], c2[1], c2[2], c2[3]);
  for (var i = 0; i < 4; i++) tabCouleurs.push(c3[0], c3[1], c3[2], c3[3]);

  pilier.couleurs = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pilier.couleurs);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabCouleurs), gl.STATIC_DRAW);

  var uv = [0, 0, 1, 0, 1, 1, 0, 1];
  var tabTexels = [].concat(uv, uv, uv, uv, uv, uv);

  pilier.texels = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pilier.texels);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabTexels), gl.STATIC_DRAW);
  pilier.texels.intNoTexture = noTexture;
  pilier.texels.pcCouleurTexel = pcTexture;

  var tabIndices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];

  pilier.maillage = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pilier.maillage);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabIndices), gl.STATIC_DRAW);
  pilier.maillage.intNbTriangles = 12;

  pilier.transformations = creerTransformations();
  pilier.transformations[0] = x;
  pilier.transformations[1] = y;
  pilier.transformations[2] = z;

  return pilier;
}
