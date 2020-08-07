// Draggable prefab
class Draggable extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame) {

        super(scene, x, y, texture, frame);

        this.scene = scene;

        // save us some math and characters down the line
        this.tlx = this.scene.gameAreaRootX;
        this.tly = this.scene.gameAreaRootY;
        this.brx = this.scene.gameAreaEndX;
        this.bry = this.scene.gameAreaEndY;

        // dragging variables
        this.dragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;

        // assign an object id
        this.objID = this.scene.objectIDs++;

        // store all values objects can have, in sections for easier saving
        this.saveData = {
            
            // "setAs" value, tracks what type of object this is, not serialised
            setAs: 0,

            general: {
                spr: [
                    texture,
                    null
                ],
                x: this.x,
                y: this.y,
                xs: this.scaleX,
                ys: this.scaleY,
                angle: this.angle
            },

            npc: {
                mode: "step",
                active: true,
                destroySelf: true,
                sound: {
                    play: false,
                    sfx: 0
                },
                create: {
                    createActor: false,
                    actorId: 0
                }
            },

            teleport: {
                destR: 0,
                destX: 0,
                destY: 0
            }

        }
        
        // create still animation
        this.scene.anims.create ({
            key: "gameobj-"+this.objID+"-still",
            frames: [
                { key: texture[frame] }
            ],
            frameRate: 2,
            repeat: -1
        });

        this.setInteractive({ cursor: "grab" });

        this.on("pointerdown", function() {

            let pointer = this.scene.input.activePointer;

            this.dragOffsetX = this.x - pointer.x;
            this.dragOffsetY = this.y - pointer.y;

            this.dragging = true;
            this.setDepth(1000);

        });

        this.on("pointerup", function() {

            this.dragging = false;
            this.setDepth(this.y);

            if ((this.x < this.tlx) ||
                (this.x > this.brx)  ||
                (this.y < this.tly) ||
                (this.y > this.bry))
            {
                this.scene.gameObjects.remove(this, false, true);
            }

        });

        scene.add.existing(this);
        
    }

    update() {

        if (this.dragging) {

            let pointer = this.scene.input.activePointer;

            this.x = pointer.x + this.dragOffsetX;
            this.y = pointer.y + this.dragOffsetY;

            this.saveData.general.x = this.x;
            this.saveData.general.y = this.y;

        }

    }

}
