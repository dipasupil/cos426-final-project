import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';


class Text extends Group {
    constructor() {
        // Call parent Group() constructor
        super();
        
       loader = new THREE.FontLoader();
       loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
       var textGeometry = new THREE.TextGeometry( "test", {
       
           font: font,
           size: 1,
           height: 0,
           curveSegments: 12,
       });
       
       var textMaterial = new THREE.MeshPhongMaterial( 
           { color: 0xff0000, specular: 0xffffff }
       );
       var textMesh = new THREE.Mesh( textGeometry, textMaterial );
       textMesh.name = "score_num"
       this.add(textMesh)
       });   

    }

    update(objects) {

    }
}

export default Text;
