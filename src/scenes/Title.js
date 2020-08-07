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
                self.loadGame();
                self.scene.start("editorScene", self.gameData);
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

    loadGame(gd) {

            this.gameData = this.cache.json.get("gameData");

        this.gameData.sprites.forEach((spr) => {
            this.load.image(spr[0], "assets/game/"+spr[1]);
            console.log(spr[0] + " /// " + spr[1]);
        });

        this.load.audio("bgm", "assets/game/"+this.gameData.bgm);

    }

}