$(document).ready(function () {
    $(document).on('click', function(event) {
        console.log("Got click");
        var vector = new THREE.Vector3();
        vector.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            - (event.clientY / window.innerHeight) * 2 + 1,
            0.5 );

        vector.unproject( camera );
        var dir = vector.sub( camera.position ).normalize();
        var distance = - camera.position.z / dir.z;
        var pos = camera.position.clone().add( dir.multiplyScalar( distance ));
        console.log(pos);
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


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var board = new Board();
board.build(scene);

var vFOV = camera.fov * Math.PI / 180;        // convert vertical fov to radians
var height = 2 * Math.tan( vFOV / 2 ) * 10; // visible height
var aspect = window.innerWidth / window.innerHeight;
var width = height * aspect;
