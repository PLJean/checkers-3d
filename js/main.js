var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xb2b2ff, 1);
document.body.appendChild(renderer.domElement);

var board = new Board();
board.build(scene);

var vFOV = camera.fov * Math.PI / 180;        // convert vertical fov to radians
var height = 2 * Math.tan( vFOV / 2 ) * 10; // visible height
var aspect = window.innerWidth / window.innerHeight;
var width = height * aspect;

var raycaster, mouse = { x : 0, y : 0 };

init();

function init () {

    //Usual setup code here.

    raycaster = new THREE.Raycaster();
    renderer.domElement.addEventListener( 'click', raycast, false );

    //Next setup code there.

}

$(document).ready(function () {
    // $(document).on('click', function(event) {
    //     console.log("Got click");
    //     var vector = new THREE.Vector3();
    //     vector.set(
    //         (event.clientX / window.innerWidth) * 2 - 1,
    //         - (event.clientY / window.innerHeight) * 2 + 1,
    //         0.5 );
    //
    //     vector.unproject( camera );
    //     var dir = vector.sub( camera.position ).normalize();
    //     var distance = - camera.position.z / dir.z;
    //     var pos = camera.position.clone().add( dir.multiplyScalar( distance ));
    //     board.anyTilesClicked(pos.x, pos.y);
    //     console.log(pos.x + ', ' + pos.y);
    // });
    render();
});

function raycast ( e ) {

    //1. sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    //2. set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera( mouse, camera );

    //3. compute intersections
    var intersects = raycaster.intersectObjects( scene.children );

    for ( var i = 0; i < intersects.length; i++ ) {
        console.log( intersects[ i ] );
        /*
         An intersection has the following properties :
         - object : intersected object (THREE.Mesh)
         - distance : distance from camera to intersection (number)
         - face : intersected face (THREE.Face3)
         - faceIndex : intersected face index (number)
         - point : intersection point (THREE.Vector3)
         - uv : intersection point in the object's UV coordinates (THREE.Vector2)
         */
    }

}

$(window).resize(function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
});

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
