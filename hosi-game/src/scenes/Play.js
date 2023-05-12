class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    init(data){
        this.soundManager = data.soundManager;
    }

    preload() {
        this.physics.add.existing(this);
        this.scene_graphics = this.add.graphics();
        this.gizmos = new Gizmos(this, this.add.graphics());
        
        this.level = 1;

        this.hamsterShip;



    //#region [[ SPRITES ]]
        // load images/tile sprites
        //this.load.image('spaceship', './assets/spaceship.png');
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
        this.load.image('asteroid', './assets/asteroids/asteriod.png');
        //this.load.spritesheet('asteroid','./assets/asteroids/bigAstroidExploding.png',{frameWidth:53,frameHeight:50, startFrame: 0, endFrame: 4});
        this.load.image('asteriodParticle', './assets/asteroids/asteroid_Crumble.png');
        // 

    //#endregion

    //#region [[ SCENE SETUP]]



        //#region << FORMAT VALUES >>
        this.grid = {
            cellSize: 64, // 64 pixels
        };

        this.uiFormat = {
            camMargin : this.grid.cellSize * 2
        }
        
        //#endregion

        // << CAMERA >>
        this.mainCamera = this.cameras.main;
        this.mainCamera.setBackgroundColor('#0000ff');

        //#region << WORLD BOUNDS >>
        this.world = {
            offset: 3 * this.grid.cellSize,
            width: 9 * this.grid.cellSize,
            height: 9 * this.grid.cellSize,
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
                width: null,
                height: null
            },
        };
        this.world.center.x = (this.world.width / 2) + this.world.offset;
        this.world.center.y = (this.world.height / 2) + this.world.offset;

        // set bounds
        this.world.bounds.left = this.world.offset;
        this.world.bounds.right = this.world.offset + this.world.width;
        this.world.bounds.top = this.world.offset;
        this.world.bounds.bottom = this.world.offset + this.world.height;

        // set cam bounds
        this.world.cam_bounds.left = this.world.offset + this.uiFormat.camMargin;
        this.world.cam_bounds.right = (this.world.offset + this.world.width) - this.uiFormat.camMargin;
        this.world.cam_bounds.top = this.world.offset + this.uiFormat.camMargin;
        this.world.cam_bounds.bottom = (this.world.offset + this.world.height) - this.uiFormat.camMargin;

        this.world.cam_bounds.width = this.world.cam_bounds.right - this.world.cam_bounds.left;
        this.world.cam_bounds.height = this.world.cam_bounds.bottom - this.world.cam_bounds.top;


        // set the world bounds
        this.physics.world.setBounds(this.world.offset,this.world.offset,this.world.width,this.world.height);
        //#endregion
    
        //#region << SKYCHART >>
        this.spawner = new Spawner(this);
        this.skychart = this.spawner.skychart;

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
                //this.hamsterShip.states.MOVE.enter();
            },
            update: () => {
                this.playUpdate();
            }
        },
        EDITOR: {
            name: 'editor',
            enter: () => {
                this.currLevelState = this.levelState.EDITOR;
            },
            update: (time, delta) => {
                this.editorUpdate(delta);
            }
        }
    }
    // set level type
    if (editorActive) { 
        this.levelState.EDITOR.enter(); 
    }
    else { this.levelState.PLAY.enter();}
    //#endregion

    // html reference to canvas
    const canvas = document.getElementById('game-container');
    }

    // ================================================================================= ///??^
    //                          CREATE
    // ======= its hamster time ===========================================)) 0o0p ~

    create() {
        // << CREATE GIZMOS >>
        this.gizmosCreate();
        this.spawner.create();
        
        //#region << INPUTS >>
        // Define the arrow key movement controls
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Define the D dodge key control
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Define the F rocket fire key control
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        // Editor camera zoom in / out
        keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        //#endregion
        
        
        // set the mainCamera to world center
        this.mainCamera.scrollX = this.world.center.x;
        this.mainCamera.scrollY = this.world.center.y;

        //#region << BACKGROUND PARALLAX >>
        this.starfield = this.add.tileSprite(this.world.center.x, this.world.center.y, this.world.width*4, this.world.height*4, 'starfield').setOrigin(0.5, 0.5);
        //#endregion

        //#region << PLAYER SHIP >>
        this.hamsterShip = new HamsterShip(this, this.world.center.x, this.world.center.y, 'spaceship_fly', 'spaceship_roll', 'primary_fire');
        this.hamsterShip.bullets = new BulletGroup(this); // create bullet group       
        //#endregion
        
        //#region [[ TRIGGERS ]] >>
        
        // set all enemy targets
        this.enemyTargets = [this.spawner.vertResetAsteroids, this.spawner.horzResetAsteroids];
        this.asteroids = [this.spawner.vertResetAsteroids, this.spawner.horzResetAsteroids]

        // auto primary fire trigger
        this.physics.add.overlap(this.hamsterShip.primaryFireTrigger, this.enemyTargets, this.onOverlap, () => {
            //console.log("asteroid overlap");
            this.hamsterShip.primary_fire();
        });

        // primary fire vs. asteroids
        this.physics.add.overlap(this.asteroids, this.hamsterShip.bullets,
            (asteroid, bullet) => {
                this.hamsterShip.bullets.remove(bullet, true, true);
                this.spawner.resetAsteroid(asteroid, true);
            });

        // handle collision between rocket and asteroid
        this.physics.add.overlap(this.hamsterShip.rocket, this.enemyTargets, (rocket, asteroid) => {
            //console.log("rocket hit asteroid");
            if (rocket.currentState.name == "fire")
            {
                rocket.states.EXPLODE.enter();
                this.spawner.resetAsteroid(asteroid, true);
            }
        });

        //this is stupid -t
        this.physics.add.overlap(this.asteroids, this.hamsterShip, () => {
            this.teeext = this.add.text(this.mainCamera.x, this.mainCamera.y, 'lol get rekt', defaultTextStyle).setOrigin(0.5);
            console.log(this.teeext.text);
            
            this.time.delayedCall(1000, () => {
                this.slow = false;
                this.scene.start('menuScene');
            }, null, this);
        });

        //#endregion

        //#region << HTML REFERENCES >>
        // toggle gizmos
        const enableGizmosButton = document.querySelector("#enable-gizmos");
        enableGizmosButton.innerHTML = "Gizmos: " + gizmosActive;
        enableGizmosButton.addEventListener("click", () => { 
            gizmosActive = !gizmosActive;
            enableGizmosButton.innerHTML = "Gizmos: " + gizmosActive;
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

    }

    gizmosCreate(){
        if (!gizmosActive) { return; }

        // show center point
        this.gizmos.createText(this.world.center.x, this.world.center.y, "X");

        // << DRAW SCREEN BOUNDS >> ( white )
        this.gizmos.drawRect(this.world.center.x, this.world.center.y, screen.width, screen.height, 0, color_pal.toInt("white"), 1);

        // << DRAW WORLD BOUNDS >> ( bold white )
        this.gizmos.drawRect(this.world.center.x, this.world.center.y, this.world.width, this.world.height, 0, color_pal.toInt("white"), 1, 1);

        // << DRAW CAMERA BOUNDS >> ( blue )
        //console.log("cam bounds: " + this.world.cam_bounds.width + "x" + this.world.cam_bounds.height);
        this.gizmos.drawRect(this.world.center.x, this.world.center.y, this.world.cam_bounds.width, this.world.cam_bounds.height, 360, color_pal.toInt("blue"), 2);

        this.gizmos.drawLine(this.skychart.points.top[2], this.skychart.points.bottom[2]);
    }

    // ================================================================================= // *~
    //                          UPDATE
    // ==================================================// >>

    //#region << INIT KEYS SO PAUSE DOESN'T DIE >>
    init(){
        // this is respectfully the stupidest shit JEEZ
        console.log('running init')
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        //keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        // Editor camera zoom in / out
        keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    }   
    //#endregion

    update(time, delta) {

        this.init(); //STUPID KEY REASSIGNING THING
        
        if(Phaser.Input.Keyboard.JustDown(keyESC)){
            this.input.keyboard.resetKeys();
            this.pauseScene = this.scene.launch("pauseScene", {prevScene: "playScene"});
            //this.pauseScene.scene.main
            console.log("pause scene: " + this.pauseScene);
            this.scene.pause();
        }

        this.gizmosUpdate();

        //console.log("PLAY SCENE STATE :: [" + this.currLevelState.name + "]");
        this.currLevelState.update(time, delta);

    }

    gizmosUpdate(){
        if (!gizmosActive) { return; }

        // >> {{ ALWAYS CLEAR GRAPHICS FIRST }} //
        //this.gizmos.graphics.clear();
    }

    playUpdate(){

        this.starfield.tilePositionY -= 4;  // update tile sprite
        
        // [[ UPDATE GAME OBJECTS]]
        this.hamsterShip.update();  

        //this.physics.world.wrap(this.asteroids);

        // << UPDATE CAMERA >>
        this.mainCamera.startFollow(this.hamsterShip.cameraTarget, true, 0.1, 0.1, 0, screen.height/3);
        // In the update loop, move the camera towards the camera target
        this.mainCamera.scrollX = Phaser.Math.Linear(this.mainCamera.scrollX, this.hamsterShip.cameraTarget.x, 0.1);
        this.mainCamera.scrollY = Phaser.Math.Linear(this.mainCamera.scrollY, this.hamsterShip.cameraTarget.y, 0.1);
        this.mainCamera.zoom = 1;
    }

    editorUpdate(){
        this.editorCamUpdate();
    }

    editorCamUpdate(){
        this.mainCamera.stopFollow();

        const cameraSpeed = 10;
        const zoomSpeed = 0.01;
      
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
        this.mainCamera.zoom = Phaser.Math.Clamp(this.mainCamera.zoom, 0.1, 0.5);
      
        // Keep camera within the bounds of the game world
        this.mainCamera.scrollX = Phaser.Math.Clamp(this.mainCamera.scrollX, 0, this.world.width);
        this.mainCamera.scrollY = Phaser.Math.Clamp(this.mainCamera.scrollY, 0, this.world.height);


    }

    // ================================================================================= )) o00 ++
    //                          HELPER FUNCTIONS
    // ==================================================// 00o

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
