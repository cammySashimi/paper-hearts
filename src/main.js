// <3 Paper Hearts <3
// version 0.01
// made with love by camellia shea
// https://camsh.itch.io

let config = {
	type: Phaser.AUTO,
	width: 1280,
    height: 720,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTAL
    },
	scene: [
        Preload,
        Title,
        Play,
        Editor
    ],
	physics: {
		default: "matter",
		matter: {
			debug: true 
		}
    },
    dom: {
        createContainer: true
    }

};

let game = new Phaser.Game(config);

// global vars, helpers
game.global = {

    editorVersion: "0.0.1",

    // setUpKeys()
    //   set up keyboard controls, returns object of them
    setUpKeys: function(_this) {
        let keys = {
            arrowUp: _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            arrowDown: _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            arrowLeft: _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            arrowRight: _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),

            w: _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            a: _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            s: _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            d: _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),

            z: _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            q: _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),

            enter: _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
            space: _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            shift: _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
        }
        return keys;
    },

    base64ToArrayBuffer: function(base64) {
        let binary_string = window.atob(base64);
        let len = binary_string.length;
        let bytes = new Uint8Array(len);
        for (let i=0; i<len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

}