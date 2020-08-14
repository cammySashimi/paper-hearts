// Title screen scene
class Title extends Phaser.Scene {

    constructor() {
        super("titleScene");
    }

    preload() {
        this.loadGame();
    }

    create() {

        let buttonHorizontalSpacer = 235;
        let buttonVerticalSpacer = 200;
        let buttonVerticalStart = 350;

        this.add.image(0, 0, "defaultBg").setOrigin(0, 0);
        this.add.image(game.config.width/2, 150, "phLogo");

        // self variable for button scoping
        var self = this;

        this.btnNewProject = new Button (
            this,
            game.config.width/2 - buttonHorizontalSpacer,
            buttonVerticalStart,
            "btnNewProject", 0, 0,
            function() {
                let gd = self.newGame();
                self.scene.start("editorScene", gd);
                //self.loadGame();
                //self.scene.start("editorScene", self.gameData);
            }
        );

        var self = this;
        this.btnLoadProject = new Button (
            this,
            game.config.width/2 + buttonHorizontalSpacer,
            buttonVerticalStart,
            "btnLoadProject", 0, 0,
            function() {
                self.scene.start("playScene", self.gameData);
            }
        );

        this.btnCredits = new Button (
            this,
            game.config.width/2 - buttonHorizontalSpacer,
            buttonVerticalStart + buttonVerticalSpacer,
            "btnCredits", 0, 0
        );

        this.btnQuit = new Button (
            this,
            game.config.width/2 + buttonHorizontalSpacer,
            buttonVerticalStart + buttonVerticalSpacer,
            "btnQuit", 0, 0
        );

    }

    newGame() {

        // create empty gamedata shell      
        let gd = {
            version: this.game.global.editorVersion,
            title: "New Game",
            titleSceen: null,
            bgm: null,
            firstRoom: 0,
            player: {
            },
            sprites: [
            ],
            backgrounds: [
                ["defaultBg", "defaultBg.png"]
            ],
            sounds: [
            ],
            rooms: [
                {
                    bg: 0,
                    walls: [
                    ],
                    decor: [
                    ],
                    actors: [
                    ],
                    teleports: [
                    ]
                }
            ]
        }

        return gd;

    }

    loadGame(gd) {

        this.gameData = this.cache.json.get("gameData");

        this.gameData.sprites.forEach((spr) => {
            this.load.image(spr[0], "assets/game/"+spr[1]);
        });

        this.load.audio("bgm", "assets/game/"+this.gameData.bgm);

    }

}