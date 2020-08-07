// Player prefab
class Player extends Phaser.Physics.Matter.Sprite {

    constructor(scene, x, y, texture, frame, speed) {

        super(scene.matter.world, x, y, texture, frame);
 
        this.scene = scene;
        
        if (speed != undefined) {
            this.speed = speed;
        } else {
            this.speed = 5;
        }

        this.velX = 0;
        this.velY = 0;
        this.accel = 0.025;

        if (this.scene.gd.player.spr[1] != undefined) {
            this.scene.anims.create ({
                key: "player-anim",
                frames: [
                    { key: this.scene.gd.sprites[this.scene.gd.player.spr[0]] },
                    { key: this.scene.gd.sprites[this.scene.gd.player.spr[1]] }
                ],
                frameRate: 2,
                repeat: -1
            });
        } else {
            this.scene.anims.create ({
                key: "player-anim",
                frames: [
                    { key: this.scene.gd.sprites[this.scene.gd.player.spr[0]] }
                ],
                frameRate: 2,
                repeat: -1
            });
        }

		scene.add.existing(this);

    }
    
    update() {

        // Movement
        // Matter physics doesn't have any way to like, read velocity to limit it
        // and I'm no physics major, so I just coded my own basic accel/decel system
        // and I pass that to the setVelocity function
        
        let dx = 0;
        let dy = 0;
        
        if (this.scene.keys.arrowUp.isDown ||
            this.scene.keys.w.isDown       ||
            this.scene.keys.z.isDown       )
        {
            dy--;
        }

        if (this.scene.keys.arrowDown.isDown ||
            this.scene.keys.s.isDown         )
        {
            dy++;
        }
        
        if (this.scene.keys.arrowLeft.isDown ||
            this.scene.keys.a.isDown         ||
            this.scene.keys.q.isDown         )
        {
            dx--;
        }
        
        if (this.scene.keys.arrowRight.isDown ||
            this.scene.keys.d.isDown)
        {
            dx++;
        }

        if (dy < 0) {
            if (this.velY - this.speed*this.accel*2 > -this.speed) {
                this.velY -= this.speed*this.accel*2;
            } else {
                this.velY = -this.speed;
            }
        } else if (dy > 0) {
            if (this.velY + this.speed*this.accel*2 < this.speed) {
                this.velY += this.speed*this.accel*2;
            } else {
                this.velY = this.speed;
            }
        } else {
            if (this.velY < 0) {
                if (this.velY + this.speed*this.accel < 0) {
                    this.velY += this.speed*this.accel;
                } else {
                    this.velY = 0;
                }
            } else if (this.velY > 0) {
                if (this.velY - this.speed*this.accel > 0) {
                    this.velY -= this.speed*this.accel;
                } else {
                    this.velY = 0;
                }
            }
        }
        
        if (dx < 0) {
            if (this.velX - this.speed*this.accel*2 > -this.speed) {
                this.velX -= this.speed*this.accel*2;
            } else {
                this.velX = -this.speed;
            }
        } else if (dx > 0) {
            if (this.velX + this.speed*this.accel*2 < this.speed) {
                this.velX += this.speed*this.accel*2;
            } else {
                this.velX = this.speed;
            }
        } else {
            if (this.velX < 0) {
                if (this.velX + this.speed*this.accel < 0) {
                    this.velX += this.speed*this.accel;
                } else {
                    this.velX = 0;
                }
            } else if (this.velX > 0) {
                if (this.velX - this.speed*this.accel > 0) {
                    this.velX -= this.speed*this.accel;
                } else {
                    this.velX = 0;
                }
            }
        }

        if (dx != 0 || dy != 0) {
            this.setDepth(3000 + this.y);
        }

        this.setVelocityY(this.velY);
        this.setVelocityX(this.velX);

        // interaction
        if (Phaser.Input.Keyboard.JustDown(this.scene.keys.space) ||
            Phaser.Input.Keyboard.JustDown(this.scene.keys.enter) ||
            Phaser.Input.Keyboard.JustDown(this.scene.keys.shift) )
        {
            console.log("boop");
        }

    }

}