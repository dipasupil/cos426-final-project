/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import * as THREE from 'three';


// Initialize core ThreeJS components
const camera = new PerspectiveCamera();

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const hit_sound = new THREE.Audio( listener );
const miss_sound = new THREE.Audio(listener);
const background = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
const audioLoader1 = new THREE.AudioLoader();
var started = false;

function hitsound() {
    audioLoader.load('src/components/sounds/hitsound.wav', function( buffer ) {
        hit_sound.setBuffer( buffer );
        hit_sound.play();
    });
}

function misssound() {
    audioLoader1.load( 'src/components/sounds//miss_sound.wav', function( buffer ) {
        miss_sound.setBuffer( buffer );
        miss_sound.playbackRate = 1.5;
        miss_sound.setVolume(1.5);
        miss_sound.play();
    });
}

function backgroundSound() {
    audioLoader1.load( 'src/components/sounds/background.mp3', function( buffer ) {
        background.setBuffer( buffer );
        background.setLoop(true);
        background.setVolume(.5);
        background.play();
    });
}

const scene = new SeedScene();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(0,20,20);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();


function handleKeyPress(event) {
    const keyMap = {
        KeyD: 0,
        KeyF: 1,
        Space:  2,
        KeyJ: 3,
        KeyK: 4,
        Enter: 5,
    };

    if ((keyMap[event.code] >= 0 && keyMap[event.code] <= 4) && started) {
        var hit = scene.updateKeyPress(keyMap[event.code]);
        if (hit) {
            hitsound();
        }
        if (!hit || hit === undefined) {
            misssound();
        }

        renderer.render(scene, camera);
    }

    if (keyMap[event.code] == 5 && started == false) {
        started = true;
        window.requestAnimationFrame(onAnimationFrameHandler);
        backgroundSound();
    }
}


// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    var miss = scene.update(timeStamp, started);
    
    if (miss) {
        misssound();
    }

    
    if (!scene.gameOver()) {
        window.requestAnimationFrame(onAnimationFrameHandler);
    }
    else {
        scene.updateGameOver();

        // scoreBoard
        var loader = new THREE.FontLoader();
        loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
        var textGeometry = new THREE.TextGeometry( "Final Score:", {

            font: font,
            size: 1,
            height: 0,
            curveSegments: 12,
        });

        var textGeometry1 = new THREE.TextGeometry(scene.finalScore().toString(), {
            font: font,
            size: 1,
            height: 0,
            curveSegments: 12,
        });

        var textMaterial = new THREE.MeshPhongMaterial( 
            { color: 0xffffff, specular: 0xffffff }
        );

        var scoreBoard = new THREE.Mesh( textGeometry, textMaterial );
        scoreBoard.name = "score";
        scene.add(scoreBoard);
        scoreBoard.position.set(-10, 0, 0);

        var score = new THREE.Mesh( textGeometry1, textMaterial);
        score.name = "score_num";
        scene.add(score);
        score.position.set(-10, -2, 0); 
        camera.position.set(0,0,20);
        camera.lookAt(-10, -1, 0);

        renderer.render(scene, camera);
        });   

    }
};

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};

windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
window.addEventListener("keydown", handleKeyPress);
