// Teleport prefab
class Teleport extends Phaser.Physics.Matter.Sprite {

    constructor(scene, x, y, texture, frame, rm, id, destR, destX, destY) {

        super(scene.matter.world, x, y, texture, frame);

        this.rm = rm;
        this.id = id;
        this.destR = destR;
        this.destX = destX;
        this.destY = destY;
 
        this.scene = scene;   

        if (this.scene.gd.rooms[rm].teleports[id].spr[1] != undefined) {
            this.scene.anims.create ({
                key: "teleport-"+rm+"-"+id+"-anim",
                frames: [
                    { key: this.scene.gd.sprites[this.scene.gd.rooms[rm].teleports[id].spr[0]] },
                    { key: this.scene.gd.sprites[this.scene.gd.rooms[rm].teleports[id].spr[1]] }
                ],
                frameRate: 2,
                repeat: -1
            });
        } else {
            this.scene.anims.create ({
                key: "teleport-"+rm+"-"+id+"-anim",
                frames: [
                    { key: this.scene.gd.sprites[this.scene.gd.rooms[rm].teleports[id].spr[0]] }
                ],
                frameRate: 2,
                repeat: -1
            });
        }

		scene.add.existing(this);

    }

    update() {
        
    }

}
