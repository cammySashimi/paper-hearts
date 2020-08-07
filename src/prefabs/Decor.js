// Decor prefab
class Decor extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, rm, id) {

        super(scene, x, y, texture, frame);
 
        this.scene = scene;   
        this.rm = rm;
        this.id = id;

        if (this.scene.gd.rooms[rm].decor[id].spr[1] != undefined) {
            this.scene.anims.create ({
                key: "decor-"+rm+"-"+id+"-anim",
                frames: [
                    { key: this.scene.gd.sprites[this.scene.gd.rooms[rm].decor[id].spr[0]] },
                    { key: this.scene.gd.sprites[this.scene.gd.rooms[rm].decor[id].spr[1]] }
                ],
                frameRate: 2,
                repeat: -1
            });
        } else {
            this.scene.anims.create ({
                key: "decor-"+rm+"-"+id+"-anim",
                frames: [
                    { key: this.scene.gd.sprites[this.scene.gd.rooms[rm].decor[id].spr[0]] }
                ],
                frameRate: 2,
                repeat: -1
            });
        }

        scene.add.existing(this);

    }
    
}
