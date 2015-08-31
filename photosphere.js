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

var basicMaterial;
var geometry = new THREE.SphereGeometry( 500, 100, 100 );


function loadImage( url, cb ){
  var tmpImage = new Image();
  tmpImage.onload = function(){
    var canv = document.createElement('canvas');
    var ctx = canv.getContext('2d');
    canv.width = this.width;
    canv.height = this.height;
    ctx.drawImage(this, 0, 0);
    cb(canv.toDataURL());
  }
  tmpImage.crossOrigin = 'anonymous';
  tmpImage.src =  url;
}

function loadVideo( url, cb ){
  var video_canv = document.createElement('canvas');
  var video = document.createElement( 'video' );
  video.loop = true;
  video.id = 'video';
  video.src = url;
  video.crossOrigin = "Anonymous";
  video.autoplay = true;
  video.load(); // must call after setting/changing source
  video.playbackRate = 0.5;
  video.addEventListener("loadedmetadata", function () {
    cb( video )
  })
  video.addEventListener('loadeddata', function() {
    video.play()
  })
}




/* make a palette */
function makePalette(){
  var canv = document.createElement('canvas');
  canv.width = 256;
  canv.height = 1;
  var context = canv.getContext('2d');
  var palette = context.createLinearGradient(0, 0, canv.width, 0);
  palette.addColorStop(0, '#000000');
  palette.addColorStop(1.0, '#FFFFFF');
  context.fillStyle = palette;
  context.fillRect(0, 0, canv.width, 1);
  return canv;
}

var palette = makePalette();

/*
loadImage( 'images/PANO_20150824_162752_small.jpg',
function(img){
  wmsTexture = new THREE.ImageUtils.loadTexture(img);
  wmsTexture.needsUpdate = true;
  basicMaterial.map = wmsTexture;
  scene.add( sphere );
});
*/

loadCanvas = function( canvas ){
  wmsTexture = new THREE.ImageUtils.loadTexture(canvas.toDataURL());
  wmsTexture.needsUpdate = true;
  basicMaterial.map = wmsTexture;
  scene.add( sphere );
}

/*
loadVideo( 'videos/co2.webm',
function(video){
globe_vid.video = video;
globe_vid.texture = new THREE.VideoTexture( globe_vid.video );
globe_vid.texture.offset.x = 0.0;
globe_vid.texture.offset.y =  0.0;
globe_vid.texture.repeat.x = 1.0;
globe_vid.texture.repeat.y= 1.0;
globe_vid.texture.minFilter = THREE.NearestFilter;
globe_vid.texture.magFilter = THREE.NearestFilter;
globe_vid.texture.format = THREE.RGBFormat;
basicMaterial.map = globe_vid.texture;
scene.add( sphere );
});
*/

basicMaterial = new THREE.MeshBasicMaterial( { overdraw: 1.0, side: THREE.BackSide } );

sphere = new THREE.Mesh(	geometry, basicMaterial );

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
