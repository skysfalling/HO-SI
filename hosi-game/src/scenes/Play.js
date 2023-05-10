class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.physics.add.existing(this);
        this.gizmos = new Gizmos(this);
        
        this.level = 1;

    //#region [[ SPRITES ]]
        // load images/tile sprites
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');

        // load spritesheet
        this.load.spritesheet('rocket_fire', './assets/rocket.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});

        // << HAMSTER SPACESHIP >>
        this.load.spritesheet('spaceship_fly', './assets/hamster_ship/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 2});
        this.load.spritesheet('spaceship_roll', './assets/hamster_ship/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 3, endFrame: 8});

        // << BULLETS >>
        this.load.spritesheet('primary_fire', './assets/bullets/bullet_fire.png', {frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 3});

        // << ROCKET >>
        this.load.spritesheet('rocket_fire', './assets/rocket.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.spritesheet('explosion', './assets/fx/explosion.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 13});

        // << ASTEROIDS >>
        this.load.image('justAsteroid', './assets/asteroids/singleAsteroid.png');
        this.load.spritesheet('asteroid','./assets/asteroids/bigAstroidExploding.png',{frameWidth:53,frameHeight:50, startFrame: 0, endFrame: 4});

        // 

        //#endregion

    //#region [[ SCENE SETUP]]

        // << INPUTS >>
        // Define the arrow key movement controls
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Define the D dodge key control
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Define the F rocket fire key control
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        // Editor camera zoom in / out
        keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);


        // << CAMERA >>
        this.mainCamera = this.cameras.main;
        this.mainCamera.setBackgroundColor('#0000ff');

        // define editor inputs
        const cursors = this.input.keyboard.createCursorKeys();
        const editorControlConfig = {
            camera: this.mainCamera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
            acceleration: 0.01,
            drag: 10,
            maxSpeed: 0.001
        };
        this.editorCamControls = new Phaser.Cameras.Controls.SmoothedKeyControl(editorControlConfig);

        //#region << WORLD BOUNDS >>
        this.world = {
            offset: 100,
            cam_offset: -200,
            width: screen.width,
            height: screen.height,
            center: {
            x: null,
            y: null,
            },
            bounds: {
            left: null,
            right: null,
            top: null,
            bottom: null,
            },
            cam_bounds: {
                left: null,
                right: null,
                top: null,
                bottom: null,
            }
        };
        this.world.center.x = (this.world.width / 2) + this.world.offset;
        this.world.center.y = (this.world.height / 2) + this.world.offset;

        // set bounds
        this.world.bounds.left = this.world.offset;
        this.world.bounds.right = this.world.offset + this.world.width;
        this.world.bounds.top = this.world.offset;
        this.world.bounds.bottom = this.world.offset + this.world.height;

        // set cam bounds
        this.world.cam_bounds.left = this.world.cam_offset;
        this.world.cam_bounds.right = this.world.cam_offset + this.world.width;
        this.world.cam_bounds.top = this.world.cam_offset;
        this.world.cam_bounds.bottom = this.world.cam_offset + this.world.height;

        // set the world bounds
        this.physics.world.setBounds(this.world.offset,this.world.offset,this.world.width,this.world.height);
        //#endregion
      
        //#endregion

    // #region [[ GUI ]] ==============================================================
    const cam = this.mainCamera;
    this.gui = new dat.GUI();

    const mouseGUI = this.gui.addFolder('Pointer');
    mouseGUI.add(this.input, 'x').listen();
    mouseGUI.add(this.input, 'y').listen();
    mouseGUI.open();

    const help = {
        line1: 'Arrow Keys to move',
        line2: 'Z & X to zoom in/out',
    }

    const cameraGUI = this.gui.addFolder('Camera Stats');
    //cameraGUI.add(cam, 'x').listen();
    //cameraGUI.add(cam, 'y').listen();
    cameraGUI.add(cam, 'scrollX').listen();
    cameraGUI.add(cam, 'scrollY').listen();
    cameraGUI.add(cam, 'zoom', 0.1, 2).step(0.1).listen();
    cameraGUI.open();
    
    const cameraMove = this.gui.addFolder('Camera Movement');
    cameraMove.add(help, 'line1');
    cameraMove.add(help, 'line2');
    cameraMove.open();

    this.gui.domElement.style.display = "none";
    //#endregion
    
    // #region [[ LEVEL STATES ]] ===============================
    this.levelState = {
        START: {
            name: 'start',
            enter: () => {
                this.currLevelState = this.levelState.START;
                this.hamsterShip.states.DISABLED.enter();
            },
            update: () => {

            },
        },
        PLAY: {
            name: 'play',
            enter: () => {
                this.currLevelState = this.levelState.PLAY;
                this.hamsterShip.states.MOVE.enter();
            },
            update: () => {
                this.playUpdate();
            }
        },
        EDITOR: {
            name: "editor",
            enter: () => {
                this.currLevelState = this.levelState.EDITOR;
                this.hamsterShip.states.DISABLED.enter();
            },
            update: (time, delta) => {
                this.editorUpdate(delta);
            }
        }
    }

    if (editorActive) {this.currLevelState = this.levelState.EDITOR;}
    else { this.currLevelState = this.levelState.PLAY; }
    //#endregion

    // html reference to canvas
    const canvas = document.getElementById('game-container');
    }

    create() {

        // << BACKGROUND PARALLAX >>
        this.starfield = this.add.tileSprite(this.world.center.x, this.world.center.y, screen.width + (format.margin * 4), screen.height + (format.margin * 4), 'starfield').setOrigin(0.5, 0.5);



        //#region << PLAYER SHIP >>
        this.hamsterShip = new HamsterShip(this, this.world.center.x, this.world.center.y, 'spaceship_fly', 'spaceship_roll', 'primary_fire');

        // bullets
        this.hamsterShip.bullets = this.physics.add.group({
            key: 'bullets',
            quantity: 50,
            collideWorldBounds: false,
            velocityX: -600
        });
        this.hamsterShip.bullets = this.add.existing(
            new Bullets(this)
          );

        //#endregion

        //#region << ASTEROIDS >>
        // create asteroids
        this.asteroids = this.physics.add.group({
            key: 'asteroid',
            quantity: 5,
            collideWorldBounds: false,
            velocityX: -150
        });
        // spawn asteroids
        Phaser.Actions.RandomRectangle(this.asteroids.getChildren(), this.physics.world.bounds);
        // auto primary fire
        this.physics.add.overlap(
            this.asteroids,
            this.hamsterShip.primaryFireTrigger,
            (asteroid, hamsterShip) =>
            {
                //console.log("asteroid overlap");
                this.hamsterShip.primary_fire();
            });
        //#endregion

        // toggle gizmos
        const enableGizmosButton = document.querySelector("#enable-gizmos");
        enableGizmosButton.innerHTML = "Gizmos: " + gizmosDebug;
        enableGizmosButton.addEventListener("click", () => { 
            gizmosDebug = !gizmosDebug;
            enableGizmosButton.innerHTML = "Gizmos: " + gizmosDebug;
        }); 

        // toggle edit mode
        const enableEditButton = document.querySelector("#enable-edit");
        enableEditButton.innerHTML = "Edit Mode: " + editorActive;
        enableEditButton.addEventListener("click", () => { 
            editorActive = !editorActive;
            enableEditButton.innerHTML = "Edit Mode: " + editorActive;
            }); 

        // toggle primary fire
        const primaryFireToggle = document.querySelector("#enable-primary");
        primaryFireToggle.innerHTML = "Primary Fire: " + this.hamsterShip.primaryActive;
        primaryFireToggle.addEventListener("click", () => { 
            this.hamsterShip.primaryActive = !this.hamsterShip.primaryActive;
            primaryFireToggle.innerHTML = "Primary Fire: " + this.hamsterShip.primaryActive;
        }); 
        //#endregion

        // show center point
        this.gizmos.createText(this.world.center.x, this.world.center.y, "X");
    }
        
    update(time, delta) {

        if (gizmosDebug)
        {
            // >> {{ ALWAYS CLEAR GRAPHICS FIRST }} //
            this.gizmos.graphics.clear();

            // << DRAW WORLD BOUNDS >>
            this.gizmos.drawRect(this.world.center.x, this.world.center.y, this.world.width, this.world.height, 0);
        }

        console.log("PLAY SCENE STATE :: [" + this.currLevelState.name + "]");
        this.currLevelState.update(time, delta);
    }

    playUpdate(){

        this.starfield.tilePositionY -= 4;  // update tile sprite
        
        // [[ UPDATE GAME OBJECTS]]
        this.hamsterShip.update();  

        this.physics.world.wrap(this.asteroids);

        if (gizmosDebug)
        {
            // << DRAW WORLD BOUNDS >>
            this.gizmos.drawRect(this.world.center.x, this.world.center.y, this.world.width, this.world.height, 0);
        }


        // << UPDATE CAMERA >>
        this.mainCamera.startFollow(this.hamsterShip.cameraTarget, true, 0.1, 0.1, 0, screen.height/3);

        // constrain the main camera within the world bounds
        this.mainCamera.setScroll(
            Phaser.Math.Clamp(this.mainCamera.scrollX, format.margin, (this.world.width-this.mainCamera.width) + (format.margin*3)),
            Phaser.Math.Clamp(this.mainCamera.scrollY, format.margin, (this.world.height-this.mainCamera.height) + (format.margin*3))
        );

        this.mainCamera.zoom = 1;
    }

    editorUpdate(delta){
        this.mainCamera.stopFollow();

        const cameraSpeed = 10;
        const zoomSpeed = 0.1;
      
        // Move the camera with arrow keys
        if (keyLEFT.isDown) {
          this.mainCamera.scrollX -= cameraSpeed;
        }
        else if (keyRIGHT.isDown) {
          this.mainCamera.scrollX += cameraSpeed;
        }
      
        if (keyUP.isDown) {
          this.mainCamera.scrollY -= cameraSpeed;
        }
        else if (keyDOWN.isDown) {
          this.mainCamera.scrollY += cameraSpeed;
        }
      
        // Zoom in/out with Z/X keys
        if (keyZ.isDown) {
          this.mainCamera.zoom += zoomSpeed;
        }
        else if (keyX.isDown) {
          this.mainCamera.zoom -= zoomSpeed;
        }
      
        // Clamp camera zoom to a minimum value of 0.1
        this.mainCamera.zoom = Phaser.Math.Clamp(this.mainCamera.zoom, 0.1, 1);
      
        // Keep camera within the bounds of the game world
        this.mainCamera.scrollX = Phaser.Math.Clamp(this.mainCamera.scrollX, 0, this.world.width);
        this.mainCamera.scrollY = Phaser.Math.Clamp(this.mainCamera.scrollY, 0, this.world.height);
    }

    checkCollision(objectA, objectB) {
        // simple AABB checking
        if (objectA.x < objectB.x + objectB.width && 
            objectA.x + objectA.width > objectB.x && 
            objectA.y < objectB.y + objectB.height &&
            objectA.height + objectA.y > objectB. y) {
                return true;
        } else {
            return false;
        }
    }

    checkWorldBounds(sprite) {
        if (sprite.x < 0 || sprite.x > game.config.width || sprite.y < 0 || sprite.y > game.config.height) {
            return true;
        }
        return false;
    }

}
