// photosphere.js

var scene = new THREE.Scene();
var width  = window.innerWidth, height = window.innerHeight;
var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 0);
camera.position.x = -1000;
camera.position.y = 0;
camera.position.z = 0;
camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
//var controls = new THREE.TrackballControls(camera);
var sphere;
var vidSphere;
var globe_vid = {};

var ambientLight = new THREE.AmbientLight( 0xffffff );
scene.add( ambientLight );
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

function render() {
  //controls.update();
  requestAnimationFrame(render);
  //sphere.rotation.y = Date.now() * 0.0001;

  /*
  if ( globe_vid.video.readyState === globe_vid.video.HAVE_ENOUGH_DATA ) {
  globe_vid.imageContext.drawImage( globe_vid.video, -2, -2 );
  globe_vid.texture.needsUpdate = true;
}
*/

renderer.render(scene, camera);
//composer.render();
}

//var basicMaterial;
//var vidMaterial;


// See http://threejs.org/docs/#Reference/Extras.Geometries/SphereGeometry

//var heightFraction = 0.2;
//var widthFraction = 0.2;


loadCanvas = function( canvas, layernum, widthFraction, heightFraction ){
  var texture = new THREE.ImageUtils.loadTexture(canvas.toDataURL());
  texture.needsUpdate = true;
  texture.minFilter = THREE.NearestFilter;

  var basicMaterial = new THREE.MeshBasicMaterial( { overdraw: 1.0, side: THREE.BackSide } );
  basicMaterial.map = texture;
  var south = (-0.5 + heightFraction/2.0) * Math.PI;
  var snLen = -heightFraction * Math.PI;
  var east = (0.0 - widthFraction/2.0) * Math.PI;
  var ewLen = widthFraction * Math.PI;
  var geometry = new THREE.SphereGeometry( 500 + layernum, 100, 100, east, ewLen, south, snLen);
  sphere = new THREE.Mesh(	geometry, basicMaterial );
  scene.add( sphere );
  return sphere;
}

loadVideo = function( video, widthFraction, heightFraction ){
  globe_vid.video = video;
  globe_vid.texture = new THREE.VideoTexture( globe_vid.video );
  globe_vid.texture.offset.x = 0.0;
  globe_vid.texture.offset.y =  0.0;
  globe_vid.texture.repeat.x = 1.0;
  globe_vid.texture.repeat.y= 1.0;
  globe_vid.texture.minFilter = THREE.NearestFilter;
  globe_vid.texture.magFilter = THREE.NearestFilter;
  globe_vid.texture.format = THREE.RGBFormat;
  var vidMaterial = new THREE.MeshBasicMaterial( { overdraw: 1.0, side: THREE.BackSide } );
  vidMaterial.map = globe_vid.texture;
  var south = (-0.5 + heightFraction/2.0) * Math.PI;
  var snLen = -heightFraction * Math.PI;
  var east = (0.0 - widthFraction/2.0) * Math.PI;
  var ewLen = widthFraction * Math.PI;
  var vidGeometry = new THREE.SphereGeometry( 499, 100, 100, east, ewLen, south, snLen);
  vidSphere = new THREE.Mesh(	vidGeometry, vidMaterial );
  scene.add( vidSphere );
  return vidSphere;
}




var composer = new THREE.EffectComposer( renderer );
var input = new THREE.RenderPass( scene, camera );
composer.addPass( input );

/*
var effect = new THREE.ShaderPass( THREE.PaletteShader );
palTexture = new THREE.ImageUtils.loadTexture(palette.toDataURL());
palTexture.magFilter = THREE.NearestFilter;
effect.uniforms[ 'tPalette' ].value = palTexture;
effect.renderToScreen = true;
composer.addPass( effect );
*/
var effect = new THREE.ShaderPass( THREE.CopyShader );
effect.renderToScreen = true;
composer.addPass( effect );
