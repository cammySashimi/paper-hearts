// Game player
class Play extends Phaser.Scene {

    constructor() {
        super("playScene");
    }

    init(gameData) {
        this.gd = gameData;
    }

    create() {

        // resize canvas to be 1:1
        this.scale.setGameSize(720, 720);

        // set page title to game title
        document.title = this.gd.title;

        // set up keyboard controls
        this.keys = this.game.global.setUpKeys(this);

        // set up physics
        this.matter.world.setBounds().disableGravity();

        // load first room
        this.loadRoom(this.gd.firstRoom);

        // add player
        this.player = new Player (
            this,
            this.gd.player.startX, this.gd.player.startY,
            this.gd.sprites[this.gd.player.spr[0]], 0,
            this.gd.player.speed,
        ).setOrigin(0.5, 0.5).setDepth(3000 + this.gd.player.startY).play("player-anim");

        this.player.scaleX = this.gd.player.xs;
        this.player.scaleY = this.gd.player.ys;
        this.player.angle = this.gd.player.angle;
        this.player.setFrictionAir(0.1);
        this.player.setFixedRotation();
        this.player.setOnCollideWith(this.teleports, this.teleportPlayer.bind(this));        
        
        // play bgm
        this.bgm = this.sound.add("ocean");
        this.bgm.play();

    }

    update() {

        this.player.update();

    }

    // loads a room, given the int id of the room
    loadRoom(rm) {

        console.log(JSON.stringify(this.gd, null, 4));

        // add background
        this.bg = this.add.image (
            0, 0,
            this.gd.backgrounds[this.gd.rooms[rm].bg]
        ).setOrigin(0, 0);

        // add decor
        let decID = 0;
        this.decor = []; 
        this.gd.rooms[rm].decor.forEach((dec) => {
            let decObj = new Decor (
                this,
                dec.x, dec.y,
                this.gd.sprites[dec.spr[0]], 0,
                rm, decID
            ).setDepth(1000 + dec.y).play("decor-"+rm+"-"+decID+"-anim");
            decObj.scaleX = dec.xs;
            decObj.scaleY = dec.ys;
            decObj.angle = dec.angle;
            this.decor.push(decObj);  
            decID++;
        });

        // add walls
        let wallID = 0;
        this.walls = [];
        this.gd.rooms[rm].walls.forEach((wall) => {
            let wallObj = new Wall (
                this,
                wall.x, wall.y,
                this.gd.sprites[wall.spr[0]], 0,
                rm, wallID
            ).setStatic(true).setDepth(wall.y).play("wall-"+rm+"-"+wallID+"-anim");
            wallObj.scaleX = wall.xs;
            wallObj.scaleY = wall.ys;
            wallObj.angle = wall.angle; 
            this.walls.push(wallObj);
            wallID++;
        });

        // add teleports
        let teleID = 0;
        this.teleports = []
        this.gd.rooms[rm].teleports.forEach((tele) => {
            let teleObj = new Teleport (
                this,
                tele.x, tele.y,
                this.gd.sprites[tele.spr[0]], 0,
                rm, teleID,
                tele.destR, tele.destX, tele.destY
            ).setStatic(true).setSensor(true).setDepth(1000 + tele.y).play("teleport-"+rm+"-"+teleID+"-anim");
            teleObj.scaleX = tele.xs;
            teleObj.scaleY = tele.ys;
            teleObj.angle = tele.angle;   
            this.teleports.push(teleObj);
            teleID++;
        });

    }

    // empties the room, to allow for moving to another one
    clearRoom() {

        // delete old objects
        this.teleports.forEach((t) => {
            t.destroy();
        });
        this.walls.forEach((w) => {
            w.destroy();
        });
        this.decor.forEach((d) => {
            d.destroy();
        });

        // delete background
        this.bg.destroy();

    }

    // teleports the player to another room
    teleportPlayer(tp) {

        let destR = tp.gameObject.destR;
        let destX = tp.gameObject.destX;
        let destY = tp.gameObject.destY;

        this.clearRoom();
        this.loadRoom(destR);

        this.player.x = destX;
        this.player.y = destY;

    }
}
