//const { Sound } = require("phaser");

class LevelZero extends Phaser.Scene {
    constructor() {
        super("levelZeroScene");
    }

    init(data){
        this.soundManager = data.soundManager;
    }

    preload() {
        this.gizmos = new Gizmos(this);
        this.loading=false;

        this.soundManager = new SoundManager(this);

        this.level = 1;
        this.defaultShipSpeed = 100;

        
        //#region << SPRITES >>
        // load backgrounds/tile sprites
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('takeoff', './assets/takeoff.png');

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

        // << BUNKER >>
        this.load.image('bunker', './assets/bunker.png');

        // << SNAKESHIPS >>
        
        this.load.atlas('textureAtlasKey', './assets/hosi_sprite_sheet.png', './assets/hosi_texture_atlas.json');

        //#endregion 

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
            const offset = {x: 0 * this.grid.cellSize, y: 4 * this.grid.cellSize};
            const camMargin = this.uiFormat.camMargin;
            
            this.world = {
                width: worldSize,
                height: worldSize,
                x: offset.x,
                y: offset.y,
                center: {
                    x: (worldSize / 2) + offset.x,
                    y: (worldSize / 2) + offset.y
                },
                bounds: {
                    left: offset.x,
                    right: offset.x + worldSize,
                    top: offset.y * 1.5,
                    bottom: offset.y + worldSize
                },
                cam_bounds: {
                    left: offset.x + camMargin,
                    right: offset.x + worldSize - camMargin,
                    top: offset.y + camMargin,
                    bottom: offset.y + worldSize - camMargin,
                    width: worldSize - (2 * camMargin),
                    height: worldSize - (2 * camMargin)
                }
            };
            //#endregion

        // setup camera
        this.mainCamera = this.cameras.main;

        this.spawner = new LevelZeroSpawner(this);
        this.skychart = this.spawner.skychart;

        // set the world bounds
        this.physics.world.setBounds(this.world.x, this.world.y, this.world.width, this.world.height);

        this.worldRect = this.gizmos.createRect(this.world.x, this.world.y, this.world.width, this.world.height, color_pal.toInt("white"), 5, 1, {x: 0, y: 0});

        this.tutorialRocketStartPos = {x: this.world.center.x, y: screen.height * 0.8};
        this.hamsterShipStartPos = {x: this.world.center.x, y: this.world.center.y + 200};


        // #region [[ LEVEL STATES ]] ===============================
        this.levelState = {
            TUTORIAL_START: {
                name: 'tutorial start',
                enter: () => {
                    this.currLevelState = this.levelState.TUTORIAL_START;
                },
                update: () => {

                    this.tutorialRocket.update();

                    // [[ UPDATE GAME OBJECTS]]
                    if(this.hitcount >= 3){
                        
                        this.levelState.TUTORIAL_CONTINUE.enter();
                        this.soundManager.play('sfx_takeoff');
                        this.tutorialRocket.tutorialOver = true;

                    }
                }
            },
            TUTORIAL_CONTINUE: {
                name: 'tutorial continue',
                enter: () => {
                    this.currLevelState = this.levelState.TUTORIAL_CONTINUE;
                    console.log("START LEVEL ZERO / 2 ::  " + this.currLevelState.name);

                    this.bunker.tilePositionY -=2;
                    this.hamsterShip.setPosition(this.tutorialRocketStartPos.x, this.tutorialRocketStartPos.y);
                    this.hamsterShip.setActive(true);
                    this.hamsterShip.setVisible(true);
                    this.hamsterShip.rocket.setActive(true);
                    this.hamsterShip.rocket.setVisible(true);

                    this.time.addEvent({
                        delay: 5000,
                        callback: () => {
                            this.levelState.LEVEL_EXIT.enter();
                        },
                        loop: false
                    });
                },
                update: () => {
                    this.hamsterShip.update();
                    this.takeoffBackground.tilePositionY -= 2;
                    this.bunker.y += 2;
                    this.beigeHam.y +=2;
                    this.blueHam.y +=2;
                    this.blackHam.y+=2;
                    this.pinkHam.y+=2;
                }
            },
            LEVEL_EXIT: {
                name: 'level exit',
                enter: () => {
                    this.currLevelState = this.levelState.LEVEL_EXIT;

                    this.hamsterShip.setActive(false);
                    this.hamsterShip.rocket.setActive(false);
                    this.hamsterShip.setVelocity(0);

                    // Move the player to the start position
                    this.tweens.add({
                        targets: [this.hamsterShip, this.hamsterShip.rocket],
                        x: this.hamsterShipStartPos.x,
                        y: this.hamsterShipStartPos.y,
                        duration: 1000,
                        ease: 'Linear',
                    });

                    this.time.delayedCall(1000, () => {
                        this.mainCamera.fadeOut(1000, 0, 0, 0);
                    }, null, this);

                    this.time.delayedCall(1200, () => {
                        this.soundManager.stopCurrentMusic();
                        this.soundManager.play('sfx_hyperdrive');
                        this.scene.launch("loadingScene", {
                            prevScene: "levelZeroScene",
                            nextScene: 'playScene',
                            hamsterShipX: this.hamsterShipStartPos.x,
                            hamsterShipY: this.hamsterShipStartPos.y                
                        });
                    }, null, this);

                },
                update: (time, delta) => {
                    //this.editorUpdate(delta);
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
        else { this.levelState.TUTORIAL_START.enter();}

        console.log("START LEVEL ZERO ::  " + this.currLevelState.name);

        //#endregion

        // refernece to HTML Webpage for debugger buttons and things
        const canvas = document.getElementById('game-container');   
    }

    create() {

        //#region << DEFINE KEYS >>
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        
        // Editor camera zoom in / out
        keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        //#endregion

        this.soundManager.level0Music();

        //#region << BACKGROUNDS >>
        this.takeoffBackground = this.add.tileSprite(this.world.center.x, this.world.center.y, screen.width, 0, 'takeoff').setOrigin(0.5, 0.8).setDepth(depthLayers.skybox); 
        this.bunker = this.add.sprite(game.config.width/2, screen.botMid.y - format.margin - 20, 'bunker');
        //#endregion
        
        //#region << ENEMY SNAKESHIPS ANIMATIONS >>
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

        //#region << ROCKET ANIMATIONS >>
        // explode animation config
        // rocket fly animation config
        
        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('rocket_fire', { 
                start: 0, 
                end: 1, 
                first: 0
            }),
            frameRate: 8,
            repeat: -1
        });
        
        // explode animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 8,
        });
        
        //#endregion

        //#region << HAMSTER ANIMATIONS >>
            
            //#region ( Beige Hamster )
            this.anims.create({
                key: 'beigeIdle',
                frames: this.anims.generateFrameNames('textureAtlasKey', { 
                    prefix: "beige_hamster_idle",
                    start: 1, 
                    end: 7, 
                }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'beigeMarch',
                frames: this.anims.generateFrameNames('textureAtlasKey', { 
                    prefix: "beige_hamster_marching",
                    start: 1, 
                    end: 4, 
                }),
                frameRate: 10,
                repeat: -1
            });
            //#endregion
                
            //#region ( Green Hamster )
            this.anims.create({
                key: 'greenIdle',
                frames: this.anims.generateFrameNames('textureAtlasKey', { 
                    prefix: "green_hamster_idle",
                    start: 1, 
                    end: 7, 
                }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'greenMarch',
                frames: this.anims.generateFrameNames('textureAtlasKey', { 
                    prefix: "green_hamster_marching",
                    start: 1, 
                    end: 4, 
                }),
                frameRate: 10,
                repeat: -1
            });
            //#endregion
                
            //#region ( Pink Hamster )
            this.anims.create({
                key: 'pinkIdle',
                frames: this.anims.generateFrameNames('textureAtlasKey', { 
                    prefix: "pink_hamster_idle",
                    start: 1, 
                    end: 7, 
                }),
                frameRate: 10,
                repeat: -1
            });
            
            this.anims.create({
                key: 'pinkMarch',
                frames: this.anims.generateFrameNames('textureAtlasKey', { 
                    prefix: "pink_hamster_marching",
                    start: 1, 
                    end: 4, 
                }),
                frameRate: 10,
                repeat: -1
            });
            //#endregion
            
            //#region ( Blue Hamster )
            this.anims.create({
                key: 'blueIdle',
                frames: this.anims.generateFrameNames('textureAtlasKey', { 
                    prefix: "blue_hamster_idle",
                    start: 1, 
                    end: 7, 
                }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'blueMarch',
                frames: this.anims.generateFrameNames('textureAtlasKey', { 
                    prefix: "blue_hamster_marching",
                    start: 1, 
                    end: 4, 
                }),
                frameRate: 10,
                repeat: -1
            });
            //#endregion
                
            //#region ( Black Hamster ) 
            this.anims.create({
                key: 'blackIdle',
                frames: this.anims.generateFrameNames('textureAtlasKey', { 
                    prefix: "black_hamster_idle",
                    start: 1, 
                    end: 7, 
                }),
                frameRate: 10,
                repeat: -1
            });
            
            this.anims.create({
                key: 'blackMarch',
                frames: this.anims.generateFrameNames('textureAtlasKey', { 
                    prefix: "black_hamster_marching",
                    start: 1, 
                    end: 4, 
                }),
                frameRate: 10,
                repeat: -1
            });
                //#endregion
            
        //#endregion

        //#region << CREATE PLAYER ROCKET AND SPACESHIP >>
        this.tutorialRocket = new TutorialRocket(this, this.tutorialRocketStartPos.x, this.tutorialRocketStartPos.y);
        this.tutorialRocket.setDepth(depthLayers.playArea);
        this.tutorialRocket.setScale(1.5);
        
        // Level 0.5 ship
        this.hamsterShip = new HamsterShip(this, this.world.center.x, screen.height - 200, 'spaceship_fly', 'spaceship_roll', 'primary_fire').setVisible(false);
        this.hamsterShip.setActive(false);
        this.hamsterShip.rocket.setVisible(false);
        this.hamsterShip.rocket.setActive(false);
        //#endregion

        //#region << CREATE ENEMY GROUP && OVERLAP >>
        this.spawner.tutorialEnemyGroup = this.spawner.createPlaneGroup(this.spawner.right_spawnpoints, this.spawner.left_spawnpoints, 4);
        this.spawner.tutorialEnemyGroup.spawnNew(1, 1);
        this.spawner.tutorialEnemyGroup.spawnNew(3, 3);
        this.spawner.tutorialEnemyGroup.spawnNew(5, 5);


        // auto primary fire trigger
        this.physics.add.overlap(this.hamsterShip.primaryFireTrigger, this.spawner.tutorialEnemyGroup, this.onOverlap, () => {
            //console.log("asteroid overlap");
            
            if (this.tutorialRocket.tutorialOver)
            {
                this.hamsterShip.primary_fire();
            }
            //this.soundManager.play('sfx_primaryFire');
        });

        // primary fire vs. enemies
        this.physics.add.overlap(this.spawner.tutorialEnemyGroup, this.hamsterShip.bullets, (enemy, bullet) => {
            this.hamsterShip.bullets.remove(bullet, true, true);
            this.spawner.resetSpawnObject(enemy);
            this.soundManager.playExplosion();
        });

        // rocket vs. enemies
        this.physics.add.overlap(this.tutorialRocket, this.spawner.tutorialEnemyGroup, (rocket, enemy) => {
            this.hitcount++;
            console.log(">> hitcount : " + this.hitcount);

            if (this.hitcount >= 3) {
                this.tutorialRocket.tutorialOver = true;
            }
            this.tutorialRocket.states.EXPLODE.enter();
            this.spawner.resetSpawnObject(enemy);
            this.soundManager.playExplosion();
        });
        //#endregion

        //#region  << GAME UI >>        

        // title
        headerConfig.fixedWidth = 0;
        this.titleText = this.add.text(screen.topMid.x, screen.topMid.y + format.margin, "Defend Hamster Society!", headerConfig).setOrigin(0.5,0.5);

        // level text
        this.titleText = this.add.text(screen.topMid.x, screen.topMid.y + (format.margin*4), "Press F to Fire Rocket", defaultTextStyle).setOrigin(0.5,0.5);
        this.titleText.setColor("#ffffff");

        this.titleText = this.add.text(screen.topMid.x, screen.topMid.y + (format.margin*5), "Press <--> to Aim Rocket in Air", defaultTextStyle).setOrigin(0.5,0.5);
        this.titleText.setColor("#ffffff");
        //#endregion

        //#region << GAME TIMER >> 
        this.startTime = 0;
        this.curTime = this.startTime;
        this.extraTime = 0;
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
              this.curTime++;
            },
            callbackScope: this,
            loop: true
        }); 
        //#endregion   
        
        /*
        //#region << HTML REFERENCES >>
        // toggle squares
        const enableGizmosButton = document.querySelector("#enable-gizmos");
        enableGizmosButton.innerHTML = "Gizmos: " + this.showGizmos;
        enableGizmosButton.addEventListener("click", () => { 
            this.showGizmos =!this.showGizmos;
            enableGizmosButton.innerHTML = "Gizmos: " + this.showGizmos;
        });
        //#endregion
        */

        // initalize total hit count
        this.hitcount = 0;
        this.movingHamsters();
    }

    movingHamsters(){
        this.beigeHam = this.add.sprite(screen.botMid.x+20, screen.botMid.y-45).play('beigeIdle').setDepth(100).setScale(2);
        this.blackHamAbove = this.add.sprite(screen.botLeft.x-15, screen.botLeft.y-185).play('blackMarch').setDepth(100).setScale(2);
        this.blackHam = this.add.sprite(screen.botMid.x-185, screen.botMid.y-55).play('blackMarch').setDepth(100).setScale(2);
        this.blueHam = this.add.sprite(screen.botMid.x-40, screen.botMid.y-45).play('blueIdle').setDepth(100).setScale(2);
        this.pinkHam = this.add.sprite(screen.botMid.x+80, screen.botMid.y-45).play('pinkIdle').setDepth(100).setScale(2);
    }

    update(time, delta) {

        this.currLevelState.update(time, delta);

        //this.initKeys(); //STUPID KEY RE ASSIGNING
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.launch("pauseScene", { prevScene: "levelZeroScene", soundManager: this.soundManager});
        
            // Pause the current scene
            this.scene.pause();
    
            // Disable input listeners in the game scene
            this.input.keyboard.enabled = false;
        }


        //#endregion
        
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

    initKeys(){
        console.log('running init')
        //#region << DEFINE KEYS >>
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        //keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        //#endregion
    }

    resumeGameScene() {
        // Enable keyboard input in the game scene
        this.input.keyboard.enabled = true;
      
        // Resume the game scene
        this.scene.resume(this.pauseScene);
        this.scene.stop();
    }

    checkWorldBounds(sprite) {
        if (sprite.x < 0 || sprite.x > game.config.width || sprite.y < 0 || sprite.y > game.config.height) {
            return true;
        }
        return false;
    }
    
    addTime(timeAddition = 2) {
        this.curTime += timeAddition;
    }
}
