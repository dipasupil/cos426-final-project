import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';


class Note extends Group {
    constructor(random) {
        // Call parent Group() constructor
        super();
        
        var color1;
        if (random == 0) {
            color1 = 0x5CFF5C
        }
        
        if (random == 1) {
            color1 = 0xFFFF8A
        }

        if (random == 2) {
            color1 = 0xDB8780
        }

        if (random == 3) {
            color1 = 0xFFD68A
        }

        if (random == 4) {
            color1 = 0x214ED3
        }
        
        var note = new THREE.Mesh(new THREE.BoxGeometry(.5, .5,.5), new THREE.MeshBasicMaterial({color: color1, transparent:false, opacity:0.5}));
        
        if (random == 0) {
            note.name = "note0"
        }
        
        if (random == 1) {
            note.name = "note1"
        }

        if (random == 2) {
            note.name = "note2"            
        }

        if (random == 3) {
            note.name = "note3"
        }

        if (random == 4) {
            note.name = "note4"
        } 
        
        this.add(note)

    }

    update(objects) {
        this.position.add(new THREE.Vector3(0,  0, .15));
    }


}

export default Note;
