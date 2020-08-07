// Editor scene (the big one)
class Editor extends Phaser.Scene {

    constructor() {
        super("editorScene");
    }

    init(gameData) {
        this.gd = gameData;
    }

    create() {

         /*¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯*\
        | Variables + Constants |
         \*___________________*/

        // self = this scene (for button callback scoping)
        var self = this;

        // which room the editor is in
        this.currentRoom = 0;

        // where the top-left corner of the game area is
        this.gameAreaRootY = 0;
        this.gameAreaRootX = 560;

        // where the bottom-right corner of the game area is
        this.gameAreaEndY = 720;
        this.gameAreaEndX = 1280;

        // current context menu tab
        this.contextMenuTab = undefined;

        // current scroll level of menus
        this.cameraMenuScrollLevel = 0;
        this.soundMenuScrollLevel = 0;
        this.roomMenuScrollLevel = 0;

        // says it on the tin
        this.UIDepth = 10;

        // numbers for scrollbars
        this.numSprites = this.gd.sprites.length;
        this.numSounds = this.gd.sounds.length;
        this.numRooms = this.gd.rooms.length;

        // variables for draggable object sizing + spacing
        this.draggableMaxHeight = 100;
        this.draggableMaxWidth = 100;
        this.draggableStartX = 100;
        this.draggableStartY = 190;
        this.draggableXStep = 140;
        this.draggableYStep = 150;
        this.draggableNumCols = 3;
        this.draggableNumRows = 2;

        // variables for scrollbar handle positioning
        this.scrollBarX = 490;
        this.scrollBarYTop = 235;
        this.scrollBarYBottom = 460;
        this.scrollBarRange = this.scrollBarYBottom - this.scrollBarYTop;

        // array for context menu objects
        this.contextObjects = [];

        // group for game object
        this.gameObjects = this.add.group({runChildUpdate: true});

        // assign IDs to objects
        this.objectIDs = 0;

         /*¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯*\
        | Create Editor Objects |
         \*___________________*/

        // add bg
        this.add.image(0, 0, "defaultBg").setOrigin(0, 0);

        // add frames (magic numbers incoming)
        this.add.image(915, 360, "editorFrame").setDepth(this.UIDepth);
        this.add.image(277, 340, "contextFrame").setDepth(this.UIDepth);

        // add buttons
        this.btnFileMenu = new Button (
            this, 342, 646, "btnFileOpen", 0, 0,
            function() {
                self.serialiseObjects(self.currentRoom);
            }
        ).setDepth(this.UIDepth);
        this.btnHelp = new Button (this, 480, 645, "btnHelp", 0, 0).setDepth(this.UIDepth);

        // add tabs
        this.tabCamera = new Button (
            this, 87, 57, "tabCamera", 0, 1,
            function() {
                self.createCameraMenu();
            }
        ).setDepth(this.UIDepth);

        this.tabSounds = new Button (
            this, 220, 64, "tabSounds", 0, 1,
            function() {
                self.createSoundMenu();
            }
        ).setDepth(this.UIDepth);

        this.tabRooms = new Button (
            this, 339, 63, "tabRooms", 0, 1,
            function() {
                self.createRoomMenu();
            }
        ).setDepth(this.UIDepth);

        this.tabSettings = new Button (
            this, 473, 62, "tabSettings", 0, 1,
            function() {
                self.createSettingsMenu();
            }
        ).setDepth(this.UIDepth);

        // open up camera menu as current tab
        this.createCameraMenu();

    }

    update() {

        // update tabs
        this.tabCamera.update();
        this.tabSounds.update();
        this.tabRooms.update();
        this.tabSettings.update();

        //update game objects
        this.gameObjects.preUpdate();

    }










     /*¯¯¯¯¯¯¯¯¯¯¯*\
    | Tab Functions |
     \*___________*/    

    // creates the camera context menu
    createCameraMenu() {

        // self = this scene (for button callback scoping)
        var self = this;

        if (this.contextMenuTab != this.tabCamera) {

            // remove old scroll bar (if present)
            if (this.scrollBar) {this.scrollBar.destroy();}
            if (this.scrollBarHandle) {this.scrollBarHandle.destroy();}
            if (this.btnScrollBarUp) {this.btnScrollBarUp.destroy();}
            if (this.btnScrollBarDown) {this.btnScrollBarDown.destroy();}
            if (this.newAssetButton) {this.newAssetButton.destroy();}

            // add scrollBar
            this.scrollBar = this.add.image(485, 340, "scrollBar");
            this.scrollBarHandle = this.add.image(485, 230, "scrollBarHandle");

            this.btnScrollBarUp = new Button (
                this, 485, 170, "btnScrollBarUp", 0, 0,
                function() {
                    if (self.cameraMenuScrollLevel > 0) {
                        self.cameraMenuScrollLevel--;
                        self.fillCameraMenu(self.cameraMenuScrollLevel);
                    }
                }
            );
    
            this.btnScrollBarDown = new Button (
                this, 485, 520, "btnScrollBarDown", 0, 0,
                function() {
                    if (self.cameraMenuScrollLevel < (self.numSprites/self.draggableNumCols)-self.draggableNumRows) {
                        self.cameraMenuScrollLevel++;
                        self.fillCameraMenu(self.cameraMenuScrollLevel);
                    }
                }
            );

            this.newAssetButton = new Button (
                this, 235, 480, "btnNewSprite", 0, 0,
                function() {
                    self.createCameraWindow();                    
                }
            );

            // create context menu sprites at current scroll level
            this.fillCameraMenu(this.cameraMenuScrollLevel);

            // set context menu state
            this.contextMenuTab = this.tabCamera;

        }

    }

    // fills the camera menu with draggable sprites based on scroll level
    fillCameraMenu(scrollLevel) {

        // clean up context menu objects
        this.contextObjects.forEach((obj) => {
            if (obj) {
                obj.destroy();
            }
        });
                    
        // keep track of how many levels we've skipped over, in order to
        // start scroll in the right place
        let levelsSkipped = 0;

        // keep track of how many rows we've filled, so we can stop at the
        // right time
        let rowsFilled = 0;

        // keep track of where to place objects
        let _x = this.draggableStartX;
        let _y = this.draggableStartY;
        
        // create draggable objects
        let sprIndex = 0;
        this.gd.sprites.forEach((spr) => {

            // only continue if we haven't filled the menu
            if (rowsFilled < this.draggableNumRows) {
                   
                // skip creating object if we haven't reached the current scroll level yet
                if (levelsSkipped < scrollLevel * this.draggableNumCols) {

                    levelsSkipped++;

                // otherwise, make the object
                } else {

                    console.log(spr[0]);

                    let obj = new DraggableSpawner (
                        this,
                        _x, _y,
                        spr[0], 0
                    ).setOrigin(0.5, 0.5);
                    sprIndex++;
                    
                    // scale object to fit size
                    if (obj.width > obj.height) {
                        obj.setScale(this.draggableMaxWidth / obj.width);
                    } else {
                        obj.setScale(this.draggableMaxHeight / obj.height);
                    }

                    // push object to the context objects array
                    this.contextObjects.push(obj);

                    // set up variables to place the next object correctly
                    if (_x <= (this.draggableXStep*this.draggableNumCols) - this.draggableStartX) {
                        _x += this.draggableXStep;
                    } else {
                        _x = this.draggableStartX;
                        _y += this.draggableYStep;
                        rowsFilled++;
                    }

                }
            
            }

        });

        // put scrollbar where it needs to be
        let scrollAmount = this.scrollBarRange / (
            (this.numSprites/this.draggableNumCols) - this.draggableNumRows
        );
        this.scrollBarHandle.y = this.scrollBarYTop + (scrollAmount*scrollLevel);

    }

    createCameraWindow() {

        // camera code from
        // https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
        // thanks, mdn! <3

        let width = 320;
        let height = 0;
        let streaming = false;

        // create camera div
        let camDiv = document.createElement("DIV");
        camDiv.className = "camera";
        document.body.appendChild(camDiv);
        
        // create video element
        let video = document.createElement("VIDEO");
        video.id = "video";
        camDiv.appendChild(video);
        
        video.style.position = "fixed";
        video.style.top = "50%";
        video.style.left = "50%";
        video.style.zIndex = "9999";
        video.style.transform = "translate(-50%, -50%)";

        // create photo takin button
        let takePhoto = document.createElement("BUTTON");
        takePhoto.id = "takePhoto";
        camDiv.appendChild(takePhoto);

        takePhoto.style.position = "fixed";
        takePhoto.style.top = "50%";
        takePhoto.style.left = "50%";
        takePhoto.style.zIndex = "10000";
        takePhoto.style.transform = "translate(-50%, -50%)";

        // create canvas for video frames
        let canv = document.createElement("CANVAS");
        canv.id = "canvas";
        document.body.appendChild(canv);
        
        canv.style.display = "none";

        // create output div
        let outDiv = document.createElement("DIV");
        outDiv.className = "output";
        document.body.appendChild(outDiv);

        // create image element
        let photo = document.createElement("IMG");
        photo.id = "photo";
        outDiv.appendChild(photo);

        // can i have video a stream?? pretty please?
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.log("An error occurred: " + err);
        });

        // set video attributes when streaming starts
        video.addEventListener('canplay', function(ev) {

            if (!streaming) {
                height = video.videoHeight / (video.videoWidth/width);
                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }

        }, false);

        takePhoto.addEventListener('click', function(ev){

            var context = canvas.getContext('2d');
            if (width && height) {

                canvas.width = width;
                canvas.height = height;
                context.drawImage(video, 0, 0, width, height);
            
                var data = canvas.toDataURL("image/png");
            
                photo.setAttribute("src", data);
                
                this.textures.once('addtexture', function () {
                    //this.add.image(500, 230, "testimg");
                    this.add.image(1000, 230, "btnFileOpen");
                }, this);

                this.textures.addBase64("testimg", data);

            }

            ev.preventDefault();
            
        }, false);

        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);

    }

    // creates the sound context menu
    createSoundMenu() {

        // self = this scene (for button callback scoping)
        var self = this;

        if (this.contextMenuTab != this.tabSounds) {

            // remove old scroll bar (if present)
            if (this.scrollBar) {this.scrollBar.destroy();}
            if (this.scrollBarHandle) {this.scrollBarHandle.destroy();}
            if (this.btnScrollBarUp) {this.btnScrollBarUp.destroy();}
            if (this.btnScrollBarDown) {this.btnScrollBarDown.destroy();}
            if (this.newAssetButton) {this.newAssetButton.destroy();}

            // add scrollBar
            this.scrollBar = this.add.image(485, 340, "scrollBar");
            this.scrollBarHandle = this.add.image(485, 230, "scrollBarHandle");

            this.btnScrollBarUp = new Button (
                this, 485, 170, "btnScrollBarUp", 0, 0,
                function() {
                    if (self.soundMenuScrollLevel > 0) {
                        self.soundMenuScrollLevel--;
                        self.fillSoundMenu(self.soundMenuScrollLevel);
                    }
                }
            );

            this.btnScrollBarDown = new Button (
                this, 485, 520, "btnScrollBarDown", 0, 0,
                function() {
                    if (self.soundMenuScrollLevel < (self.numSounds/self.draggableNumCols)-self.draggableNumRows) {
                        self.soundMenuScrollLevel++;
                        self.fillSoundMenu(self.soundMenuScrollLevel);
                    }
                }
            );

            this.newAssetButton = new Button (
                this, 235, 480, "btnNewSound", 0, 0,
                function() {
                    // TODO: sound recording interface
                }
            );

            // create context menu sounds at current scroll level
            this.fillSoundMenu(this.soundMenuScrollLevel);

            // set context menu state
            this.contextMenuTab = this.tabSounds;

        }
    }

    // fills the sound menu with draggable sprites based on scroll level
    fillSoundMenu(scrollLevel) {

        // clean up context menu objects
        this.contextObjects.forEach((obj) => {
            if (obj) {
                obj.destroy();
            }
        });
                    
        // keep track of how many levels we've skipped over, in order to
        // start scroll in the right place
        let levelsSkipped = 0;

        // keep track of how many rows we've filled, so we can stop at the
        // right time
        let rowsFilled = 0;

        // keep track of where to place objects
        let _x = this.draggableStartX;
        let _y = this.draggableStartY;

        // number of sound draggables made this round
        // starts at -1 because it's incremented immediately
        let soundsMade = -1;

        // number of times the sound icons wrapped
        let iconsWrapped = 0;

        // number of sound icons
        let soundIcons = 15;

        // tints for when we loop icons
        let tints = [
            0x27D8C5,
            0x6D27D8,
            0xD8273A,
            0x92D827,
        ]
        let currentTint = tints[0];
        
        // create draggable objects
        this.gd.sounds.forEach((snd) => {

            // only continue if we haven't filled the menu
            if (rowsFilled < this.draggableNumRows) {
                   
                // skip creating object if we haven't reached the current scroll level yet
                if (levelsSkipped < scrollLevel * this.draggableNumCols) {

                    // if we still have icons, increment which we're using
                    // otherwise, change the tint and start over
                    if (soundsMade < soundIcons-1) {
                        soundsMade++;
                    } else {
                        soundsMade = 0;
                        iconsWrapped++;
                        if (iconsWrapped < tints.length) {
                            currentTint = tints[iconsWrapped];
                        }
                    }

                    levelsSkipped++;

                // otherwise, make the object
                } else {

                    // if we still have tints to apply to icons, keep going
                    if (iconsWrapped < tints.length) {

                        // if we still have icons, increment which we're using
                        // otherwise, change the tint and start over
                        if (soundsMade < soundIcons-1) {
                            soundsMade++;
                        } else {
                            soundsMade = 0;
                            iconsWrapped++;
                            if (iconsWrapped < tints.length) {
                                currentTint = tints[iconsWrapped];
                            }
                        }

                        let obj;

                        // secret final sound icon >:)
                        if (iconsWrapped == tints.length) {
                            obj = new DraggableSpawner (
                                this,
                                _x, _y,
                                "soundIconS", 0
                            ).setOrigin(0.5, 0.5);
                        } else {
                            obj = new DraggableSpawner (
                                this,
                                _x, _y,
                                "soundIcon"+soundsMade, 0
                            ).setOrigin(0.5, 0.5);
                            obj.tint = currentTint;
                        }
                    
                        // scale object to fit size
                        if (obj.width > obj.height) {
                            obj.setScale(this.draggableMaxWidth / obj.width);
                        } else {
                            obj.setScale(this.draggableMaxHeight / obj.height);
                        }

                        // push object to the context objects array
                        this.contextObjects.push(obj);

                        // set up variables to place the next object correctly
                        if (_x <= (this.draggableXStep*this.draggableNumCols) - this.draggableStartX) {
                            _x += this.draggableXStep;
                        } else {
                            _x = this.draggableStartX;
                            _y += this.draggableYStep;
                            rowsFilled++;
                        }
                    
                    }

                }
            
            }

        });

        // put scrollbar where it needs to be
        let scrollAmount = this.scrollBarRange / (
            (this.numSounds/this.draggableNumCols) - this.draggableNumRows
        );
        this.scrollBarHandle.y = this.scrollBarYTop + (scrollAmount*scrollLevel);

    }

    // creates the room context menu
    createRoomMenu() {

        let self = this;

        if (this.contextMenuTab != this.tabRooms) {

            // remove old scroll bar (if present)
            if (this.scrollBar) {this.scrollBar.destroy();}
            if (this.scrollBarHandle) {this.scrollBarHandle.destroy();}
            if (this.btnScrollBarUp) {this.btnScrollBarUp.destroy();}
            if (this.btnScrollBarDown) {this.btnScrollBarDown.destroy();}
            if (this.newAssetButton) {this.newAssetButton.destroy();}

            // add scrollBar
            this.scrollBar = this.add.image(485, 340, "scrollBar");
            this.scrollBarHandle = this.add.image(485, 230, "scrollBarHandle");

            this.btnScrollBarUp = new Button (
                this, 485, 170, "btnScrollBarUp", 0, 0,
                function() {
                    if (self.roomMenuScrollLevel > 0) {
                        self.roomMenuScrollLevel--;
                        self.fillRoomMenu(self.roomMenuScrollLevel);
                    }
                }
            );

            this.btnScrollBarDown = new Button (
                this, 485, 520, "btnScrollBarDown", 0, 0,
                function() {
                    if (self.roomMenuScrollLevel < self.numRooms) {
                        self.roomMenuScrollLevel++;
                        self.fillRoomMenu(self.roomMenuScrollLevel);
                    }
                }
            );

            this.newAssetButton = new Button (
                this, 235, 480, "btnNewRoom", 0, 0,
                function() {
                    // TODO: lots
                }
            );

            this.fillRoomMenu(self.roomMenuScrollLevel);
            
            // set context menu state
            this.contextMenuTab = this.tabRooms;

        }
    
    }

    fillRoomMenu(scrollLevel) {

        // clean up context menu objects
        this.contextObjects.forEach((obj) => {
            if (obj) {
                obj.destroy();
            }
        });

        // put scrollbar where it needs to be
        let scrollAmount = this.scrollBarRange / this.numRooms-1;
        this.scrollBarHandle.y = this.scrollBarYTop + (scrollAmount*scrollLevel);

    }

    // creates the settings context menu
    createSettingsMenu() {

        let self = this;

        if (this.contextMenuTab != this.tabSettings) {

            // remove old scroll bar (if present)
            if (this.scrollBar) {this.scrollBar.destroy();}
            if (this.scrollBarHandle) {this.scrollBarHandle.destroy();}
            if (this.btnScrollBarUp) {this.btnScrollBarUp.destroy();}
            if (this.btnScrollBarDown) {this.btnScrollBarDown.destroy();}
            if (this.newAssetButton) {this.newAssetButton.destroy();}

            // clean up context menu objects
            this.contextObjects.forEach((obj) => {
                if (obj) {
                    obj.destroy();
                }
            });

            this.fillSettingsMenu(0);

            // set context menu state
            this.contextMenuTab = this.tabSettings;

        }
    }

    fillSettingsMenu(page) {

        if (page == 0) {

            this.titleInputBox = new Button (this, 277, 160, "titleInputBox", 0, 0);
            this.contextObjects.push(this.titleInputBox);

            this.titleScreenLabel = this.add.image(82, 255, "titleScreenLabel");
            this.contextObjects.push(this.titleScreenLabel);
            
            this.btnTakePic = new Button (this, 205, 255, "btnTakePic", 0, 0);
            this.contextObjects.push(this.btnTakePic);
            
            this.uploadPic = new Button (this, 338, 258, "btnUpload", 0, 0);
            this.contextObjects.push(this.uploadPic);

            this.removePic = new Button (this, 467, 255, "btnRemove", 0, 0);
            this.contextObjects.push(this.removePic);

            this.bgMusicLabel = this.add.image(83, 372, "bgMusicLabel");
            this.contextObjects.push(this.bgMusicLabel);

            this.btnRecord = new Button (this, 205, 372, "btnRecord", 0, 0);
            this.contextObjects.push(this.btnRecord);
            
            this.uploadBGM = new Button (this, 338, 375, "btnUpload", 0, 0);
            this.contextObjects.push(this.uploadBGM);

            this.removeBGM = new Button (this, 467, 372, "btnRemove", 0, 0);
            this.contextObjects.push(this.removeBGM);

            this.btnAccessibility = new Button (this, 275, 490, "btnAccessibility", 0, 0);
            this.contextObjects.push(this.btnAccessibility);

        }

    }

    // serialise game objects to a string for saving
    serialiseObjects(roomNum) {

        let gameData = {};
        let objID = 0;

        
        this.gameObjects.getChildren().forEach((obj) => {
    
            switch (obj.data.setAs) {

                // wall
                case 0:
                    gameData.rooms[roomNum].walls[objID] = obj.data.general;
                    console.log(JSON.stringify(gameData.rooms[roomNum].walls[objID]));
                    break;

                // decor
                case 1:
                    break;

                // actor
                case 2:
                    break;

                // teleport
                case 3:
                    break;

                // player
                case 4:
                    break;

            }

        objID++;
        });
    
    }

}  
