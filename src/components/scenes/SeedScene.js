import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Heart, Note } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from 'three';



class GameScene extends Scene {
        
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            // gui: new Dat.GUI(), // Create GUI for scene
            updateList: [],
        };

        var instructions = document.createElement('div');
        instructions.style.position = 'absolute';
        instructions.style.backgroundColor = "white";
        instructions.style.fontFamily = "Roboto";
        instructions.innerHTML = "The 'D', 'F', Space, 'J', and 'K' keys correspond to</br> each of the five lanes, respectively. When a note</br> reaches the lane's 'goal', tap the corresponding key!</br> Your score will increment based on how accurate</br> your timing was. If you lose all five lives, the game ends.</br></br>Start the game by hitting Enter!";
        instructions.style.top = 100 + 'px';
        instructions.style.left = 100 + 'px';
        document.body.appendChild(instructions);

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

        this.lane_goals = {
            0: "goal0",
            1: "goal1",
            2: "goal2",
            3: "goal3",
            4: "goal4",
        }

        this.speeds = [472, 472, 900, 900, 900]

        // Add meshes to scene
        const lights = new BasicLights();

        this.add(lights);

        const size = 10;
        const divisions = 5;

        const gridHelper = new THREE.GridHelper( size, divisions );
        this.add(gridHelper)

        // goal areas for notes
        var boxGeom = new THREE.BoxGeometry(1.3,0.5,.7);
        var boxMaterial1 = new THREE.MeshBasicMaterial({color: 0xffffff, transparent:true, opacity:0.5});
        var boxMaterial2 = new THREE.MeshBasicMaterial({color: 0xffffff, transparent:true, opacity:0.5});
        var boxMaterial3 = new THREE.MeshBasicMaterial({color: 0xffffff, transparent:true, opacity:0.5});
        var boxMaterial4 = new THREE.MeshBasicMaterial({color: 0xffffff, transparent:true, opacity:0.5});
        var boxMaterial5 = new THREE.MeshBasicMaterial({color: 0xffffff, transparent:true, opacity:0.5});


        this.goal1 = new THREE.Mesh(boxGeom, boxMaterial1);
        this.goal1.name = "goal1"
        this.add(this.goal1)
        this.goal1.position.set(-4,0,4)

        this.goal2 = new THREE.Mesh(boxGeom, boxMaterial2);
        this.goal2.name = "goal2"
        this.add(this.goal2)
        this.goal2.position.set(-2,0,4)

        this.goal3 = new THREE.Mesh(boxGeom, boxMaterial3);
        this.goal3.name = "goal3"
        this.add(this.goal3)
        this.goal3.position.set(0,0,4)

        this.goal4 = new THREE.Mesh(boxGeom, boxMaterial4);
        this.goal4.name = "goal4"
        this.add(this.goal4)
        this.goal4.position.set(2,0,4)

        this.goal5 = new THREE.Mesh(boxGeom, boxMaterial5);
        this.goal5.name = "goal5"
        this.add(this.goal5)
        this.goal5.position.set(4,0,4)

        
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

    update(timeStamp, started) {
         // note test
        var speed; 
        
        if (timeStamp < 10000) speed = this.speeds[0];
        else if (timeStamp < 20000) speed = this.speeds[1];
        else if (timeStamp < 30000) speed = this.speeds[2];
        else if (timeStamp < 40000) speed = this.speeds[3];
        else if (timeStamp >= 40000) speed = this.speeds[4];

        // adds note every X seconds
        if (((Math.ceil(timeStamp / 10) * 10) % speed == 0) || !started) {
         
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

        // Handle hit effects
        switch(this.goal1.material.color.getHex().toString(16)) {
            case 'ff00':
                this.goal1.material.color.setHex('0x01ff01');
                break;
            case '1ff01':
                this.goal1.material.color.setHex('0x02ff02');
                break;
            case '2ff02':
                this.goal1.material.color.setHex('0x03ff03');
                break;
            case '3ff03':
                this.goal1.material.color.setHex('0x04ff04');
                break;
            case '4ff04':
                this.goal1.material.color.setHex('0x05ff05');
                break;
            default:
                this.goal1.material.color.setHex('0xffffff');
                break;
        }

        switch(this.goal2.material.color.getHex().toString(16)) {
            case 'ff00':
                this.goal2.material.color.setHex('0x01ff01');
                break;
            case '1ff01':
                this.goal2.material.color.setHex('0x02ff02');
                break;
            case '2ff02':
                this.goal2.material.color.setHex('0x03ff03');
                break;
            case '3ff03':
                this.goal2.material.color.setHex('0x04ff04');
                break;
            case '4ff04':
                this.goal2.material.color.setHex('0x05ff05');
                break;
            default:
                this.goal2.material.color.setHex('0xffffff');
                break;
        }

        switch(this.goal3.material.color.getHex().toString(16)) {
            case 'ff00':
                this.goal3.material.color.setHex('0x01ff01');
                break;
            case '1ff01':
                this.goal3.material.color.setHex('0x02ff02');
                break;
            case '2ff02':
                this.goal3.material.color.setHex('0x03ff03');
                break;
            case '3ff03':
                this.goal3.material.color.setHex('0x04ff04');
                break;
            case '4ff04':
                this.goal3.material.color.setHex('0x05ff05');
                break;
            default:
                this.goal3.material.color.setHex('0xffffff');
                break;
        }

        switch(this.goal4.material.color.getHex().toString(16)) {
            case 'ff00':
                this.goal4.material.color.setHex('0x01ff01');
                break;
            case '1ff01':
                this.goal4.material.color.setHex('0x02ff02');
                break;
            case '2ff02':
                this.goal4.material.color.setHex('0x03ff03');
                break;
            case '3ff03':
                this.goal4.material.color.setHex('0x04ff04');
                break;
            case '4ff04':
                this.goal4.material.color.setHex('0x05ff05');
                break;
            default:
                this.goal4.material.color.setHex('0xffffff');
                break;
        }

        switch(this.goal5.material.color.getHex().toString(16)) {
            case 'ff00':
                this.goal5.material.color.setHex('0x01ff01');
                break;
            case '1ff01':
                this.goal5.material.color.setHex('0x02ff02');
                break;
            case '2ff02':
                this.goal5.material.color.setHex('0x03ff03');
                break;
            case '3ff03':
                this.goal5.material.color.setHex('0x04ff04');
                break;
            case '4ff04':
                this.goal5.material.color.setHex('0x05ff05');
                break;
            default:
                this.goal5.material.color.setHex('0xffffff');
                break;
        }
        

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

    checkHit(obj, lane) {        
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

            if (lane == 0) {
                this.goal1.material.color.setHex('0x00ff00');
                return true;
            }
            
            else if (lane == 1) {
                this.goal2.material.color.setHex('0x00ff00');
                return true;
            } 

            else if (lane == 2) {
                this.goal3.material.color.setHex('0x00ff00');
                return true;
            } 

            else if (lane == 3) {
                this.goal4.material.color.setHex('0x00ff00');
                return true;
            } 

            else if (lane == 4) {
                this.goal5.material.color.setHex('0x00ff00');
                return true;
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
                var hit = this.checkHit(obj, lane);
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
                var hit = this.checkHit(obj, lane);
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
                var hit = this.checkHit(obj, lane);
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
                var hit = this.checkHit(obj, lane);
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
                var hit = this.checkHit(obj, lane);
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
