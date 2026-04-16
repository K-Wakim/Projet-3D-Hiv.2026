// Contient tout les objets du jeu, plancher, plafond, mur ouvrable, mur non ouvrable, flèche, télé-transporteur, télé-receveur, trésor, etc...
function creerPlancher(objgl) {
  var plancher = {};

  var tabSommets = [
    0.0, 0.0, 0.0,
    31.0, 0.0, 0.0,
    31.0, 0.0, 31.0,
    0.0, 0.0, 31.0
  ];

  plancher.vertex = objgl.createBuffer();
  objgl.bindBuffer(objgl.ARRAY_BUFFER, plancher.vertex);
  objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabSommets), objgl.STATIC_DRAW);

  var tabCouleurs = [
    0.3, 0.3, 0.3, 1.0,
    0.3, 0.3, 0.3, 1.0,
    0.3, 0.3, 0.3, 1.0,
    0.3, 0.3, 0.3, 1.0
  ];

  plancher.couleurs = objgl.createBuffer();
  objgl.bindBuffer(objgl.ARRAY_BUFFER, plancher.couleurs);
  objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

  var tabTexels = [
    0.0, 0.0,
    0.0, 0.0,
    0.0, 0.0,
    0.0, 0.0
  ];

  plancher.texels = objgl.createBuffer();
  objgl.bindBuffer(objgl.ARRAY_BUFFER, plancher.texels);
  objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

  plancher.texels.intNoTexture = 0;
  plancher.texels.pcCouleurTexel = 0.0;

  var tabIndices = [
    0, 1, 2,
    0, 2, 3
  ];

  plancher.maillage = objgl.createBuffer();
  objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, plancher.maillage);
  objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabIndices), objgl.STATIC_DRAW);
  plancher.maillage.intNbTriangles = 2;

  plancher.transformations = creerTransformations();

  return plancher;
}

function dessinerObjet(objgl, objProgShaders, obj) {
  var matModeleVue = obtenirMatriceVue();

  mat4.translate(matModeleVue, [
    getPositionX(obj.transformations),
    getPositionY(obj.transformations),
    getPositionZ(obj.transformations)
  ]);

  mat4.rotateX(matModeleVue, getAngleX(obj.transformations) * Math.PI / 180);
  mat4.rotateY(matModeleVue, getAngleY(obj.transformations) * Math.PI / 180);
  mat4.rotateZ(matModeleVue, getAngleZ(obj.transformations) * Math.PI / 180);

  mat4.scale(matModeleVue, [
    getEchelleX(obj.transformations),
    getEchelleY(obj.transformations),
    getEchelleZ(obj.transformations)
  ]);

  objgl.uniformMatrix4fv(objProgShaders.matModeleVue, false, matModeleVue);

  objgl.bindBuffer(objgl.ARRAY_BUFFER, obj.vertex);
  objgl.vertexAttribPointer(objProgShaders.posVertex, 3, objgl.FLOAT, false, 0, 0);

  objgl.bindBuffer(objgl.ARRAY_BUFFER, obj.couleurs);
  objgl.vertexAttribPointer(objProgShaders.couleurVertex, 4, objgl.FLOAT, false, 0, 0);

  objgl.bindBuffer(objgl.ARRAY_BUFFER, obj.texels);
  objgl.vertexAttribPointer(objProgShaders.posTexel, 2, objgl.FLOAT, false, 0, 0);

  objgl.uniform1f(objProgShaders.pcCouleurTexel, obj.texels.pcCouleurTexel);

  objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, obj.maillage);
  objgl.drawElements(
    objgl.TRIANGLES,
    obj.maillage.intNbTriangles * 3,
    objgl.UNSIGNED_SHORT,
    0
  );
}