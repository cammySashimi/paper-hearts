// Draggable Spawner prefab
class DraggableSpawner extends Phaser.GameObjects.Image {

    constructor(scene, x, y, texture, frame) {

        super(scene, x, y, texture, frame);
 
        this.scene = scene;

        this.setInteractive({ cursor: "grab" });

        this.on("pointerdown", function() {
            let test = new Draggable(scene, x, y, texture, 0);
            test.setScale(this.scale);
            test.dragging = true;
            this.scene.gameObjects.add(test);
        });

        scene.add.existing(this);
        
    }

}
