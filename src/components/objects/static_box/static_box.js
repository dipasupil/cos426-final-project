import { Group } from 'three';
import * as THREE from 'three';


class Static_Box extends Group {
    constructor(color) {
        // Call parent Group() constructor
        super();

        const geometry = new THREE.PlaneGeometry(1,1,1 );
        const material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );
        
        this.add(plane)
    }
}

export default Static_Box;
