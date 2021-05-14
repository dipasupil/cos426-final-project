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
            lives: 5,
            notesPressed: 0,
            columns_x: [-4, -2, 0, 2, 4],
            score: 0
        };

        this.lane_notes = {
            0: "note0",
            1: "note1",
            2: "note2",
            3: "note3",
            4: "note4",
        };

        this.speeds = [900, 900, 900, 900, 900]

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
        goal1.name = "goal5"
        this.add(goal1)
        goal1.position.set(-4,0,4)

        var goal2 = new THREE.Mesh(boxGeom, boxMaterial);
        goal1.name = "goal5"
        this.add(goal2)
        goal2.position.set(-2,0,4)

        var goal3 = new THREE.Mesh(boxGeom, boxMaterial);
        goal1.name = "goal5"
        this.add(goal3)
        goal3.position.set(0,0,4)

        var goal4 = new THREE.Mesh(boxGeom, boxMaterial);
        goal1.name = "goal5"
        this.add(goal4)
        goal4.position.set(2,0,4)

        var goal5 = new THREE.Mesh(boxGeom, boxMaterial);
        goal1.name = "goal5"
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

        var life4 = new THREE.Mesh(lifeGeom, lifeMaterial);
        life4.name = "life4";
        this.add(life4)
        life4.position.set(-6,0,1)

        var life5 = new THREE.Mesh(lifeGeom, lifeMaterial);
        life5.name = "life5";
        this.add(life5)
        life5.position.set(-6,0,0)

        // scoreboard
        //'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'

    }
    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    random_lane() {
        return Math.floor(Math.random()*(5))
    }

    update(timeStamp) {
         // note test
        var speed; 
        
        if (timeStamp < 10000) speed = this.speeds[0];
        else if (timeStamp < 20000) speed = this.speeds[1];
        else if (timeStamp < 30000) speed = this.speeds[2];
        else if (timeStamp < 40000) speed = this.speeds[3];
        else if (timeStamp >= 40000) speed = this.speeds[4];

        // adds note every X seconds
        if ((Math.ceil(timeStamp / 10) * 10) % speed == 0) {
         
        var random = this.random_lane();
        while (this.getObjectByName(this.lane_notes[random]) != undefined) {
            random = this.random_lane();
         }

         var note_test = new Note(random);
         note_test.name = "note" + random.toString();
         this.addToUpdateList(note_test)
         this.add(note_test)
         note_test.position.set(this.gameElements.columns_x[random],0,-10) 
        }

        var ls = [...this.state.updateList]

        // updates position of all notes that are moving
        for (const obj of ls) {
            obj.update(timeStamp);
            obj.updateMatrix();
            
            if (obj.position.z >= 5.5) {
                this.remove(obj);
                let index = this.state.updateList.indexOf(obj);
                this.state.updateList.splice(index, 1);

                // remove a life if no keypress and note goes too far
                this.removeLives();
                return true;
            }
        }
    }

    checkHit(obj) {        
        // if within bounds, add score
        var object_pos = obj.getWorldPosition(new THREE.Vector3()).z;
        if (object_pos > 3 && object_pos < 5.5) {
            if (object_pos < 4) {
                this.gameElements.score += Math.floor((100 * (1 - (4 - object_pos))));
            }
            
            if (object_pos >= 4) {
                this.gameElements.score += Math.floor((100 * (1 - (object_pos - 4))));
            }
            
            var ls = [...this.state.updateList];
            for (const obj1 of ls) { 
                if (obj.name == obj1.name) {
                    this.remove(obj);
                    let index = this.state.updateList.indexOf(obj);
                    this.state.updateList.splice(index, 1);
                }
            }
            
            return true;
            
        }
       
       // if not, remove life
        else {
            this.removeLives();
            return false;
        }
    }

    updateKeyPress(lane) {

        if (lane == 0) {
            // first will always be one farthest down the grid, so should work. 
            var obj = this.getObjectByName("note0");
            if (obj === undefined || obj.name != "note0") {
                // this.removeLives();
                return;
            }
            else {
                var hit = this.checkHit(obj);
                return hit
            }
        }

        if (lane == 1) {
            var obj = this.getObjectByName("note1");
            if (obj === undefined || obj.name != "note1") {
                // this.removeLives();
                return;
            } 
            else {
                var hit = this.checkHit(obj);
                return hit;
            }
        }

        if (lane == 2) {
            var obj = this.getObjectByName("note2");
            if (obj === undefined || obj.name != "note2") {
                // this.removeLives();
                return;
            }
            else {
                var hit = this.checkHit(obj);
                return hit;
            }
        }

        if (lane == 3) {
            var obj = this.getObjectByName("note3");
            if (obj === undefined || obj.name != "note3") {
                // his.removeLives();
                return;
            }
            else {
                var hit = this.checkHit(obj);
                return hit;
            }
        }

        if (lane == 4) {
            var obj = this.getObjectByName("note4");
            if (obj === undefined || obj.name != "note4") {
                // this.removeLives();
                return;
            }
            else {
                var hit = this.checkHit(obj);
                return hit;
            }
        }
    }
    
    removeLives() {
            this.gameElements.lives -= 1;

            if (this.gameElements.lives == 4) {
                var selectedObject = this.getObjectByName("life1");
                this.remove(selectedObject)
            }

            if (this.gameElements.lives == 3) {
                var selectedObject = this.getObjectByName("life2");
                this.remove(selectedObject)
            }

            if (this.gameElements.lives == 2) {
                var selectedObject = this.getObjectByName("life3");
                this.remove(selectedObject)
            }

            if (this.gameElements.lives == 1) {
                var selectedObject = this.getObjectByName("life4");
                this.remove(selectedObject)
            }

            if (this.gameElements.lives == 0) {
                var selectedObject = this.getObjectByName("life5");
                this.remove(selectedObject)
            }
    }

    gameOver() {
        if (this.gameElements.lives <= 0) {
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
            if(this.children[i].type === "GridHelper" || this.children[i].type === "Mesh")
                this.remove(this.children[i]);
        }
        

    }
}

export default GameScene;