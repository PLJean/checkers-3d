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

var raycaster = new THREE.Raycaster();
var mouse = { x : 0, y : 0 };


$(document).ready(function () {
    $(document.body).mousedown(function(event) {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        //2. set the picking ray from the camera position and mouse coordinates
        raycaster.setFromCamera( mouse, camera );

        //3. compute intersections
        var intersects = raycaster.intersectObjects( scene.children );

        for ( var i = 0; i < intersects.length; i++ ) {

            if (intersects[i].object['checkersObject'] == 'Piece') {
                // console.log(intersects[i]);
                board.grab(intersects[i].object["col"], intersects[i].object["row"]);
                board.showLegals(intersects[i].object["col"], intersects[i].object["row"], scene);
            }
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

    });

    $(document.body).mouseup(function (event) {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        //2. set the picking ray from the camera position and mouse coordinates
        raycaster.setFromCamera( mouse, camera );

        //3. compute intersections
        var intersects = raycaster.intersectObjects( scene.children );

        for ( var i = 0; i < intersects.length; i++ ) {

            if (intersects[i].object['checkersObject'] == 'Tile') {
                // console.log(intersects[i]);
                board.drop(intersects[i].object["col"], intersects[i].object["row"], scene);
            } else {
                // board.drop(board.holding.mesh['col'], board.holding.mesh['row']);
            }

            board.unshowLegals(scene);
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
    });
    render();
});

$(window).resize(function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
});

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
