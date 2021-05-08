import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Static_Box } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from 'three';
import { static_box } from '../objects/static_box';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            updateList: [],
            numberOfBoxes: 5,
        };

        // Set background to a nice color
        this.background = new Color(0x000000);

        // Add meshes to scene
        
        const lights = new BasicLights();

        var total = this.state.numberOfBoxes
        console.log(total)

        for (let i = 0; i < total; i++) {
            let color = 0xffffff;

            let box = new Static_Box(color);
            this.add(box)
            box.position.set(i + i - 3, 0, 0)
        }

        this.add(lights);

        // Populate GUI
        // this.state.gui.add(this.state, 'numberOfBoxes', 1, 5);

    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const {updateList } = this.state;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;
