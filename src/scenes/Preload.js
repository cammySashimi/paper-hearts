class Preload extends Phaser.Scene {

    constructor() {
        super("preloadScene");
    }

    preload() {

        var loadPercent = this.make.text ({
            x: game.config.width/2,
            y: game.config.height/2,
            text: "Loading...",
            style:{
                font: "32px monospace",
                fill: "#ffffff"
            }
        });
        loadPercent.setOrigin(0.5);

        this.load.on("progress", function(value) {
            loadPercent.setText(parseInt(value*100)+0+"%");
        });

        this.load.on("complete", function() {
            loadPercent.destroy();
        });

        this.load.image("defaultBg", "assets/defaultBg.png");
        this.load.image("phLogo", "assets/phLogo.png");
        this.load.image("btnQuit", "assets/btnQuit.png");
        this.load.image("btnCredits", "assets/btnCredits.png");
        this.load.image("btnNewProject", "assets/btnNewProject.png");
        this.load.image("btnLoadProject", "assets/btnLoadProject.png");
        this.load.image("tabCamera", "assets/tabCamera.png");
        this.load.image("tabSounds", "assets/tabSounds.png");
        this.load.image("tabRooms", "assets/tabRooms.png");
        this.load.image("tabSettings", "assets/tabSettings.png");
        this.load.image("btnNew", "assets/btnNew.png");
        this.load.image("btnSave", "assets/btnSave.png");
        this.load.image("btnFileOpen", "assets/btnFileOpen.png");
        this.load.image("btnHelp", "assets/btnHelp.png");
        this.load.image("btnNewSprite", "assets/btnNewSprite.png");
        this.load.image("btnNewSound", "assets/btnNewSound.png");
        this.load.image("btnNewRoom", "assets/btnNewRoom.png");
        this.load.image("btnScrollBarUp", "assets/btnScrollBarUp.png");        
        this.load.image("btnScrollBarDown", "assets/btnScrollBarDown.png");        
        this.load.image("btnTakePic", "assets/btnTakePic.png");        
        this.load.image("btnRecord", "assets/btnRecord.png");        
        this.load.image("btnRemove", "assets/btnRemove.png");        
        this.load.image("btnUpload", "assets/btnUpload.png");        
        this.load.image("btnAccessibility", "assets/btnAccessibility.png");        
        this.load.image("scrollBarHandle", "assets/scrollBarHandle.png");        
        this.load.image("scrollBar", "assets/scrollBar.png");        
        this.load.image("contextFrame", "assets/contextFrame.png");
        this.load.image("editorFrame", "assets/editorFrame.png");
        this.load.image("bgMusicLabel", "assets/bgMusicLabel.png");
        this.load.image("titleScreenLabel", "assets/titleScreenLabel.png");
        this.load.image("titleInputBox", "assets/titleInputBox.png");
        for (let i=0; i<15; i++) {
            this.load.image("soundIcon"+i, "assets/soundIcon"+i+".png");
        }
        this.load.image("soundIconS", "assets/soundIconS.png");

        // temp gameData for testing
        this.load.json("gameData", "assets/game/game.json");

    }

    create() {

        this.scene.start("titleScene");

    }

}
