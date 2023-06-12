class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    
    init(data){
        this.soundManager = data.soundManager;
    }

    preload() {
        this.physics.add.existing(this);

        this.gizmos = new Gizmos(this);

        this.soundManager = new SoundManager(this);

        this.mainCamera = this.cameras.main;

        //#region << FORMAT VALUES >>
        this.grid = {
            cellSize: 64, // 64 pixels
        };

        this.uiFormat = {
            camMargin : this.grid.cellSize * 2
        }
        //#endregion

        //#region << WORLD BOUNDS >>
        
            const worldSize = 9 * this.grid.cellSize;
            const worldOffset = {x: 4 * this.grid.cellSize, y: 4 * this.grid.cellSize};
            const camMargin = this.uiFormat.camMargin;

            this.world = {
                width: worldSize,
                height: worldSize * 1.5,
                x: worldOffset.x,
                y: worldOffset.y,
                center: {
                    x: (worldSize / 2) + worldOffset.x,
                    y: (worldSize / 2) + worldOffset.y
                },
                bounds: {
                    left: worldOffset.x,
                    right: worldOffset.x + worldSize,
                    top: worldOffset.y * 1.5,
                    bottom: worldOffset.y + worldSize
                },
                cam_bounds: {
                    left: worldOffset.x + camMargin,
                    right: worldOffset.x + worldSize - camMargin,
                    top: worldOffset.y + camMargin,
                    bottom: worldOffset.y + worldSize - camMargin,
                    width: worldSize - (2 * camMargin),
                    height: worldSize - (2 * camMargin)
                }
            };

            // set the world bounds
            this.physics.world.setBounds(this.world.x, this.world.y, this.world.width, this.world.height);
        //#endregion



        this.graphics = this.add.graphics().setDepth(depthLayers.playArea);
        this.gameOver = false;

        this.hamsterShip;
        this.startPosition;

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

            // << SNAKESHIPS >>
            this.load.atlas('textureAtlasKey', './assets/hosi_sprite_sheet.png', './assets/hosi_texture_atlas.json');

            // << PLANETS >>
            this.load.image('greenPlanet','./assets/planets/greenPlanet.png');
            this.load.image('blackPlanet','./assets/planets/blackPlanet.png');
            this.load.image('pinkPlanet','./assets/planets/pinkPlanet.png');
            this.load.image('bluePlanet','./assets/planets/bluePlanet.png');

        //#endregion
        //#region << SNAKESHIPS >>    
        this.anims.create({
            key: 'greenSnake',
            frames: this.anims.generateFrameNames('hosi_atlas', { 
                prefix: "greenSnakeShip",
                start: 0, 
                end: 1, 
            }),
            frameRate: 10,
            repeat: -1
          });
      
        this.anims.create({
            key: 'purpleSnake',
            frames: this.anims.generateFrameNames('hosi_atlas', { 
                prefix: "purpleSnakeShip",
                start: 0, 
                end: 1, 
            }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'orangeSnake',
            frames: this.anims.generateFrameNames('hosi_atlas', { 
                prefix: "orangeSnakeShip",
                start: 0, 
                end: 1, 
            }),
            frameRate: 10,
            repeat: -1
        });
        //#endregion
        //#region [[ SCENE SETUP ]]

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


        // ========================
        //        WAVES          ... >>>>   //// 
        //-------------------------------
        this.spawner = new Spawner(this);
        this.spawner.create();
        this.skychart = this.spawner.skychart;
        this.waves = new Waves(this, this.spawner);
        this.ui = new UI(this, this.waves);

        this.vertAsteroidsConfig = {
            group: this.spawner.vertResetAsteroids,
            currCount: 0,
            waveStartCount: 2,
            velocity: {x: 0, y: 100}, // "speed"
            size: 2, // "scale"
            spawnDelay: 2,
            spawnDuration: 2,
            level_update: (level) => {
                if (level % 2 === 0) {
                    this.vertAsteroidsConfig.waveStartCount += 1;
                }
                if (level % 5 === 0) {
                    this.vertAsteroidsConfig.velocity.y += 100;
                }
            }
        }
        this.leftAsteroidsConfig = {
            group: this.spawner.leftResetAsteroids,
            currCount: 0,
            waveStartCount: 1,
            velocity: {x: 100, y: 0}, // "speed"
            size: 2, // "scale"
            spawnDelay: 2,
            spawnDuration: 2,
            level_update: (level) => {
                if (level % 3 === 0) {
                    this.horzAsteroids.waveStartCount += 1;
                    this.horzAsteroids.velocity.x += 100;
                }
            }
        }
        this.rightAsteroidsConfig = {
            group: this.spawner.rightResetAsteroids,
            currCount: 0,
            waveStartCount: 1,
            velocity: {x: 100, y: 0}, // "speed"
            size: 2, // "scale"
            spawnDelay: 2,
            spawnDuration: 2,
            level_update: (level) => {
                if (level % 3 === 0) {
                    this.horzAsteroids.waveStartCount += 1;
                    this.horzAsteroids.velocity.x += 100;
                }
            }
        }
        this.greenShipsConfig = {
            group: this.spawner.greenSnakeships,
            currEntityCount: 0,
            waveStartCount: 1,
            currLifeCount: 0,
            groupLives: 2,
            size: 2, // "scale"
            spawnDelay: 2,
            level_update: (level) => {
                if (level % 5 === 0) {
                    this.greenShips.waveStartCount += 1;
                }
                if (level % 3 === 0) {
                    this.greenShips.groupLives += 2;
                }
            }
        }
        this.orangeShipsConfig = {
            group: this.spawner.orangeSnakeships,
            currCount: 0,
            waveStartCount: 2,
            size: 2, // "scale"
            spawnDelay: 2,
            level_update: (level) => {
                if (level % 5 === 0) {
                    this.orangeShips.waveStartCount += 1;
                }
                if(level % 10 === 0){
                    this.orangeShips.waveStartCount+=1 + Math.round(Math.random());
                }
            }
        }
        this.purpleShipsConfig = {
            group: this.spawner.purpleSnakeships,
            currCount: 0,
            waveStartCount: 2,
            size: 2, // "scale"
            spawnDelay: 2,
            level_update: (level) => {
                if(level % 10 === 0){
                    this.chunkyShip.waveStartCount+=1;
                }
            }
        }


        // html reference to canvas
        const canvas = document.getElementById('game-container');
    }

    // ================================================================================= ///??^
    //                          CREATE
    // ======= its hamster time ===========================================)) 0o0p ~

    create() {
        // << CREATE GIZMOS >>
        this.gizmosCreate();
        

        
        //#region << INPUTS >>
        // Define the arrow key movement controls
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // editor control
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Define the D dodge key control
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Define the F rocket fire key control
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        // Editor camera zoom in / out
        keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        //#endregion
        
        this.soundManager.level1Music('level1v1');
        
        // set the mainCamera to world center
        this.mainCamera.scrollX = this.world.x;
        this.mainCamera.scrollY = this.world.y;

        this.greenSnakeShipUI = this.add.sprite(format.margin, format.margin, 'textureAtlasKey', 'greenSnakeShip0');
        this.greenSnakeShipUI.setScrollFactor(0);

        this.orangeSnakeShipUI = this.add.sprite(format.margin * 2, format.margin, 'textureAtlasKey', 'orangeSnakeShip0');
        this.orangeSnakeShipUI.setScrollFactor(0);

        this.purpleSnakeShipUI = this.add.sprite(format.margin * 3, format.margin, 'textureAtlasKey', 'purpleSnakeShip0');
        this.purpleSnakeShipUI.setScrollFactor(0);

        //#region << BACKGROUND PARALLAX >>
        this.starfield = this.add.tileSprite(this.world.center.x, this.world.center.y, this.world.width*4, this.world.height*4, 'starfield').setOrigin(0.5, 0.5);
        this.starfield.depth = -10;
        //#endregion

        //#region << PLAYER SHIP INIT >>
        this.hamsterShip = new HamsterShip(this, this.world.center.x, this.world.center.y, 'spaceship_fly', 'spaceship_roll', 'primary_fire');
        //#endregion
        
        //#region [[ OVERLAP TRIGGERS ]] >>
        // set all enemy targets
        this.enemyTargets = [this.spawner.vertResetAsteroids, this.spawner.leftResetAsteroids, this.spawner.rightResetAsteroids, this.spawner.greenSnakeships];

        // set enemy groups
        this.asteroids = [this.spawner.vertResetAsteroids, this.spawner.leftResetAsteroids, this.spawner.rightResetAsteroids];
        this.enemyShips = [this.spawner.greenSnakeships];

        // auto primary fire trigger
        this.physics.add.overlap(this.hamsterShip.primaryFireTrigger, this.enemyTargets, this.onOverlap, () => {
            //console.log("asteroid overlap");
            this.hamsterShip.primary_fire();
            //this.soundManager.play('sfx_primaryFire');
        });

        // primary fire vs. enemies
        this.physics.add.overlap(this.enemyTargets, this.hamsterShip.bullets, (enemy, bullet) => {
            this.hamsterShip.bullets.remove(bullet, true, true);
            this.spawner.resetSpawnObject(enemy);
            this.soundManager.playExplosion();
        });

        // rocket vs. enemies
        this.physics.add.overlap(this.hamsterShip.rocket, this.enemyTargets, (rocket, enemy) => {
            //console.log("rocket hit asteroid");
            if (rocket.currentState.name == "fire")
            {
                rocket.states.EXPLODE.enter();
                this.spawner.resetSpawnObject(enemy);
            }
            this.soundManager.playExplosion();
        });

        //this is stupid -t
        if(!this.gameOver){
            this.physics.add.overlap(this.asteroids, this.hamsterShip, () => {
                this.gameOver = true;
                this.teeext = this.add.text(this.hamsterShip.cameraTarget.x, this.hamsterShip.cameraTarget.y, 'lol get rekt', defaultTextStyle).setOrigin(0.5);
                console.log(this.teeext.text);
                
                this.time.delayedCall(1000, () => {
                    //this.slow = false;
                    this.scene.start('menuScene');
                    this.soundManager.stopCurrentMusic();
                    this.cameras.resetAll()
                    this.scene.stop();
                }, null, this);
            });
        }
        //#endregion

        //#region << HTML REFERENCES >>
        // toggle gizmos
        const enableGizmosButton = document.querySelector("#enable-gizmos");
        enableGizmosButton.innerHTML = "Gizmos: " + this.gizmos.visible;
        enableGizmosButton.addEventListener("click", () => { 
            this.gizmos.visible = !this.gizmos.visible;
            enableGizmosButton.innerHTML = "Gizmos: " + this.gizmos.visible;
        }); 

        // toggle edit mode
        const enableEditButton = document.querySelector("#enable-edit");
        enableEditButton.innerHTML = "Edit Mode: " + editorActive;
        enableEditButton.addEventListener("click", () => { 
            editorActive = !editorActive;
            enableEditButton.innerHTML = "Edit Mode: " + editorActive;
            }); 
        //#endregion


        // Wave state machine
        this.waveState = {
            NEW_WAVE: {
                name: 'new wave',
                enter: () => {
                    this.currWaveState = this.waveState.NEW_WAVE;
                    console.log(">> NEW WAVE : " + this.waves.level);

                    // Helper function for spawning asteroids
                    const spawnWaveAsteroids = (config) => {

                        for (let i = 0; i < config.waveStartCount - config.currCount; i++) {
                            config.group.spawnNewRandom();
                            config.currCount++; // Increment the currCount
                        }
                    };

                    spawnWaveAsteroids(this.vertAsteroidsConfig);
                    console.log("vert asteroid count " + this.vertAsteroidsConfig.currCount);

                    spawnWaveAsteroids(this.leftAsteroidsConfig);
                    console.log("left asteroid count " + this.leftAsteroidsConfig.currCount);

                    spawnWaveAsteroids(this.rightAsteroidsConfig);
                    console.log("right asteroid count " + this.rightAsteroidsConfig.currCount);


                    this.greenShipsConfig.currLifeCount = this.greenShipsConfig.group.combinedLives;

                    for (let i = 0; i < this.greenShipsConfig.waveStartCount - this.greenShipsConfig.currEntityCount; i++) {
                        this.greenShipsConfig.group.spawnNewRandom();
                        this.greenShipsConfig.currEntityCount++;
                    }
                    
                    console.log("green ships count " + this.greenShipsConfig.waveStartCount);

                    //spawnWaveEntities(this.orangeShipsConfig);
                    //console.log("orange ships count " + this.orangeShipsConfig.currCount);

                    //spawnWaveEntities(this.purpleShipsConfig);
                    //console.log("purple ships count " + this.purpleShipsConfig.currCount);

                    this.waveState.UPDATE.enter();
                },
                update: () => {
                },
            },
            UPDATE: {
                name: 'update wave',
                enter: () => {
                    this.currWaveState = this.waveState.UPDATE;
                },
                update: () => {

                    this.greenShipsConfig.currLifeCount = this.greenShipsConfig.groupLives - this.greenShipsConfig.group.livesUsed;

                    if (this.greenShipsConfig.group.livesUsed >= this.greenShipsConfig.groupLives) { this.waveState.RESET.enter()};
                }
            },
            DEATH_LOOP: {
                name: 'DEATH LOOP',
                enter: () => {
                    this.currWaveState = this.waveState.DEATH_LOOP;
                },
                update: () => {
                }
            },
            RESET: {
                name: 'reset',
                enter: () => {
                    this.currWaveState = this.waveState.RESET;

                    
                    this.waves.level ++;

                    this.greenShipsConfig.level_update();
                    this.greenShipsConfig.group.livesUsed = 0;


                    this.waveState.NEW_WAVE.enter();
                },
                update: (time, delta) => {
                }
            }
        }
        this.waveState.NEW_WAVE.enter();
    }

    gizmosCreate(){
        if (!gizmosActive) { return; }

        // show center point
        this.gizmos.createText(this.world.center.x, this.world.center.y, "world center");

        // << DRAW WORLD BOUNDS >> ( bold white )
        this.gizmos.createRect(this.world.center.x, this.world.center.y, this.world.width, this.world.height, color_pal.toInt("white"), 5, 0.5);

        // << DRAW CAMERA BOUNDS >> ( blue )
        //console.log("cam bounds: " + this.world.cam_bounds.width + "x" + this.world.cam_bounds.height);
        this.gizmos.createRect(this.world.center.x, this.world.center.y, this.world.cam_bounds.width, this.world.cam_bounds.height, color_pal.toInt("blue"), 2);
    }

    // ================================================================================= // *~
    //                          UPDATE
    // ==================================================// >>

    //#region << INIT KEYS SO PAUSE DOESN'T DIE >>
    init(){
        // this is respectfully the stupidest shit JEEZ
        //console.log('running init')
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

        this.waves.score = this.greenShipsConfig.group.combinedScore;

        if(Phaser.Input.Keyboard.JustDown(keyESC)){
            this.input.keyboard.resetKeys();
            this.pauseScene = this.scene.launch("pauseScene", {prevScene: "playScene", soundManager: this.soundManager});
            //this.pauseScene.scene.main
            console.log("pause scene: " + this.pauseScene);
            this.scene.pause();
        }

        this.gizmosUpdate();
        //console.log("PLAY SCENE STATE :: [" + this.currLevelState.name + "]");
        this.currLevelState.update(time, delta);
        this.currWaveState.update(time, delta);

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
        this.mainCamera.startFollow(this.hamsterShip.cameraTarget, false, 0.1, 0.1, 0, screen.height*0.25);
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
