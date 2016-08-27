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

var black = document.createElement('div');
black.setAttribute('id', 'black');
black.style.position = 'absolute';
//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
black.style.width = 100;
black.style.height = 100;
black.innerHTML = "<div>BLACK's TURN</div><div>Pieces Left: 12</div>";
black.style.border ="thick solid #000000";
black.style.top = 1.5 + '%';
black.style.left = 10 + '%';
black.style.padding = "1%";
black.style.borderRadius = "10%";

var red = document.createElement('div');
red.setAttribute('id', 'red');
red.style.position = 'absolute';
//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
red.style.color = 'red';
red.style.width = 100;
red.style.height = 100;
red.innerHTML = "<div>RED</div><div>Pieces Left: 12</div>";
red.style.top = 1.5 + '%';
red.style.left = 80 + '%';
red.style.padding = "1%";
red.style.borderRadius = "10%";

document.body.appendChild(black);
document.body.appendChild(red);

var mousedown = null;

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

        board.moveHolding(scene, camera, mouse.x, mouse.y);
    });

    $(document.body).mousemove(function(event) {

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        board.moveHolding(scene, camera, mouse.x, mouse.y);
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
