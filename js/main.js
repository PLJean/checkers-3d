var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(80,
    window.innerWidth / window.innerHeight,
    0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var board = new Board();
board.build(scene);

camera.position.z = 10;

render();

function render() {
    requestAnimationFrame(render);

    renderer.render(scene, camera);
}