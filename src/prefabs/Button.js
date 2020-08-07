// Clickable button prefab
// can be passed a callback function and an array of arguments
class Button extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, type, callback) {

        super(scene, x, y, texture, frame);

        this.scene = scene;
        this.type = type;

        let buttonClickDown;

        switch (type) {
            // type 0: basic button
            case 0:
                buttonClickDown = 5;
                break;
            // type 1: ui tab
            case 1:
                buttonClickDown = 0;
                break;
        }

        this.baseX = this.x;
        this.baseY = this.y

        // clicky stuff
        this.setInteractive({ cursor: "pointer" });
        
        this.on("pointerdown", function() {
            this.y = this.baseY + buttonClickDown;
            this.tint = 0xaaaaaa;
        });
        
        this.on("pointerup", function() {
            this.y = this.baseY;
            this.tint = 0xffffff;
            if (callback != null) {
                callback();            
            }
        });
        
        this.on("pointerout", function() {
            this.y = this.baseY;
            this.tint = 0xffffff;
        });

        // add to scene
		scene.add.existing(this);

    }

    update() {

        if (this.type == 1) {

            if (this.scene.contextMenuTab == this) {
                this.tint = 0xaaaaaa;
            } else {
                this.tint = 0xffffff;
            }
        
        }

    }

}