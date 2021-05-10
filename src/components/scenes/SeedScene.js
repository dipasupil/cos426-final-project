import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Heartm, Note } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from 'three';
import HelvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json';



class GameScene extends Scene {
        
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x89CFF0);

        // set up variables for usage
        this.gameElements = {
            lives: 3,
            notesPressed: 0,
            columns_x: [-4, -2, 0, 2, 4],
            score: 0
        };

        // Add meshes to scene
        const lights = new BasicLights();

        this.add(lights);

        const size = 10;
        const divisions = 5;

        const gridHelper = new THREE.GridHelper( size, divisions );
        this.add(gridHelper)

        // goal areas for notes
        var boxGeom = new THREE.BoxGeometry(1.3,0.5,.7);
        var boxMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent:true, opacity:0.5});

        var goal1 = new THREE.Mesh(boxGeom, boxMaterial);
        this.add(goal1)
        goal1.position.set(-4,0,4)

        var goal2 = new THREE.Mesh(boxGeom, boxMaterial);
        this.add(goal2)
        goal2.position.set(-2,0,4)

        var goal3 = new THREE.Mesh(boxGeom, boxMaterial);
        this.add(goal3)
        goal3.position.set(0,0,4)

        var goal4 = new THREE.Mesh(boxGeom, boxMaterial);
        this.add(goal4)
        goal4.position.set(2,0,4)

        var goal5 = new THREE.Mesh(boxGeom, boxMaterial);
        this.add(goal5)
        goal5.position.set(4,0,4)

        
        // life counters
        var lifeGeom = new THREE.BoxGeometry(0.5,0.5,.5);
        var lifeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, transparent:true, opacity:.75});
       
        var life1 = new THREE.Mesh(lifeGeom, lifeMaterial);
        life1.name = "life1";
        this.add(life1)
        life1.position.set(-6,0,4)

        var life2 = new THREE.Mesh(lifeGeom, lifeMaterial);
        life2.name = "life2";
        this.add(life2)
        life2.position.set(-6,0,3)

        var life3 = new THREE.Mesh(lifeGeom, lifeMaterial);
        life3.name = "life3";
        this.add(life3)
        life3.position.set(-6,0,2)

        // scoreboard
        //'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'

    }
    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
         // note test

         // adds a note every second
         if ((Math.ceil(timeStamp / 10) * 10) % 1500 == 0) {
         var random = Math.floor(Math.random()*(5))
         var note_test = new Note(random);
         this.addToUpdateList(note_test)
         this.add(note_test)
         note_test.position.set(this.gameElements.columns_x[random],0,-10) 

         // test to update score

        }

        // updates position of all notes that are moving
        for (const obj of this.state.updateList) {
            obj.update(timeStamp);
            if (obj.position.z > 5) {
                this.remove(obj)
                let index = this.state.updateList.indexOf(obj)
                this.state.updateList.splice(index, 1)
                this.gameElements.lives -= 1;

                if (this.gameElements.lives == 2) {
                    var selectedObject = this.getObjectByName("life1");
                    this.remove(selectedObject)
                }

                if (this.gameElements.lives == 1) {
                    var selectedObject = this.getObjectByName("life2");
                    this.remove(selectedObject)
                }

                if (this.gameElements.lives == 0) {
                    var selectedObject = this.getObjectByName("life3");
                    this.remove(selectedObject)
                }
                console.log(this.gameElements.lives);
            }
         }
    }

    gameOver() {
        if (this.gameElements.lives == 0) {
            return true;
        }
        else return false;
    }

    finalScore() {
        return this.gameElements.score;
    }

    updateGameOver() {
        
        // remove all meshes (https://stackoverflow.com/questions/35060831/how-to-remove-all-mesh-objects-from-the-scene-in-three-js)
        for (let i = this.children.length - 1; i >= 0; i--) {
            if(this.children[i].type === "Mesh" || this.children[i].type === "GridHelper")
                this.remove(this.children[i]);
        }
        

    }
}

export default GameScene;
