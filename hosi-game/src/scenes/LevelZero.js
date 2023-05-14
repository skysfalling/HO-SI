class LevelZero extends Phaser.Scene {
    constructor() {
        super("levelZeroScene");
        this.loading=false;
    }
    init(data){
        this.soundManager = data.soundManager;
    }

    preload() {
        this.gizmos = new Gizmos(this);
        this.showGizmos = true;
        this.loading=false;

        this.level = 1;
        this.defaultShipSpeed = 100;
        
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        //#region << SPRITES >>
        // load backgrounds/tile sprites
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('takeoff', './assets/takeoff.png');

        // load spritesheet
        this.load.spritesheet('rocket_fire', './assets/rocket.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});

        // << HAMSTER SPACESHIP >>
        this.load.spritesheet('spaceship_fly', './assets/hamster_ship/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 2});
        this.load.spritesheet('spaceship_roll', './assets/hamster_ship/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 3, endFrame: 8});
    
        // << ENEMY SPACESHIPS >>
        this.load.image('greenSnakeShip', './assets/greenSnakeShip0.png');
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

            //#region << WORLD BOUNDS >>
            //#region << FORMAT VALUES >>
            this.grid = {
                cellSize: 64, // 64 pixels
            };

            this.uiFormat = {
                camMargin : this.grid.cellSize * 2
            }

            const worldSize = 9 * this.grid.cellSize;
            const offset = {x: 4 * this.grid.cellSize, y: 4 * this.grid.cellSize};
            const camMargin = this.uiFormat.camMargin;
            
            this.world = {
                width: worldSize,
                height: worldSize * 1.5,
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

            this.spawner = new Spawner(this);
            this.skychart = this.spawner.skychart;

            // set the world bounds
            this.physics.world.setBounds(this.world.x, this.world.y, this.world.width, this.world.height);
            //#endregion

        // refernece to HTML Webpage for debugger buttons and things
        const canvas = document.getElementById('game-container');   
    }

    create() {
        console.log("create Level0");

        this.spawner.create();

        //#region << ENEMY SNAKESHIPS >>
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
        
        //#region << SPACE BACKGROUNDS >>
        this.takeoffBackground = this.add.tileSprite(0,-1900,0,0, 'takeoff').setOrigin(0,0); // haha sorry it's a lil hard coded

        this.bunker = this.add.sprite(game.config.width/2, screen.botMid.y - format.margin - 20, 'bunker');

        //#endregion
        
        //#region << ROCKET AND SPACESHIPS >>
        // add Rocket (p1)
        this.startRocket = new TutorialRocket(this, game.config.width/2, game.config.height  - 200, 'rocket_fire');

        //this.hamsterShip = new HamsterShip(this, game.config.width/2, game.config.height - 100, 'spaceship_fly', 'spaceship_roll', 'primary_fire').setVisible(false);
        //this.hamsterShip.rocket.setVisible(false);
        //#endregion

        //#region << DEFINE KEYS >>
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        //keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        //#endregion

        //#region << SKY GIZMOS THINGS >>
        // toggle squares
        const enableGizmosButton = document.querySelector("#enable-gizmos");
        enableGizmosButton.innerHTML = "Gizmos: " + this.showGizmos;
        enableGizmosButton.addEventListener("click", () => { 
            this.showGizmos =!this.showGizmos;
            enableGizmosButton.innerHTML = "Gizmos: " + this.showGizmos;
        });
        //#endregion

        //#region << ROCKET ANIMATION >>
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
            //#region << Beige Hamster >>
        this.anims.create({
            key: 'beigeIdle',
            frames: this.anims.generateFrameNames('hosi_atlas', { 
                prefix: "beige_hamster_idle",
                start: 1, 
                end: 7, 
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'beigeMarch',
            frames: this.anims.generateFrameNames('hosi_atlas', { 
                prefix: "beige_hamster_marching",
                start: 1, 
                end: 4, 
            }),
            frameRate: 10,
            repeat: -1
        });
        //#endregion
            //#region << Green Hamster >>
        this.anims.create({
            key: 'greenIdle',
            frames: this.anims.generateFrameNames('hosi_atlas', { 
                prefix: "green_hamster_idle",
                start: 1, 
                end: 7, 
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'greenMarch',
            frames: this.anims.generateFrameNames('hosi_atlas', { 
                prefix: "green_hamster_marching",
                start: 1, 
                end: 4, 
            }),
            frameRate: 10,
            repeat: -1
        });
        //#endregion
            //#region << Pink Hamster >>
        this.anims.create({
            key: 'pinkIdle',
            frames: this.anims.generateFrameNames('hosi_atlas', { 
                prefix: "pink_hamster_idle",
                start: 1, 
                end: 7, 
            }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'pinkMarch',
            frames: this.anims.generateFrameNames('hosi_atlas', { 
                prefix: "pink_hamster_marching",
                start: 1, 
                end: 4, 
            }),
            frameRate: 10,
            repeat: -1
        });
        //#endregion
            //#region << Blue Hamster >>
        this.anims.create({
            key: 'blueIdle',
            frames: this.anims.generateFrameNames('hosi_atlas', { 
                prefix: "blue_hamster_idle",
                start: 1, 
                end: 7, 
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'blueMarch',
            frames: this.anims.generateFrameNames('hosi_atlas', { 
                prefix: "blue_hamster_marching",
                start: 1, 
                end: 4, 
            }),
            frameRate: 10,
            repeat: -1
        });
        //#endregion
            //#region << Black Hamster >> 
        this.anims.create({
            key: 'blackIdle',
            frames: this.anims.generateFrameNames('hosi_atlas', { 
                prefix: "black_hamster_idle",
                start: 1, 
                end: 7, 
            }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'blackMarch',
            frames: this.anims.generateFrameNames('hosi_atlas', { 
                prefix: "black_hamster_marching",
                start: 1, 
                end: 4, 
            }),
            frameRate: 10,
            repeat: -1
        });
            //#endregion
        //#endregion

        //#region  << GAME UI >>        
        // time passed --> unsure if we want this shown
        this.timePassedText = this.add.text(screen.topRight.x - (format.margin * 3), screen.topRight.y + format.margin, 'Time', headerConfig).setOrigin(0.5,0.5);

        // title
        headerConfig.fixedWidth = 0;
        this.titleText = this.add.text(screen.topMid.x, screen.topMid.y + format.margin, "Rocket Patrol", headerConfig).setOrigin(0.5,0.5);

        // level text
        this.levelText = this.gizmos.createText(screen.topMid.x, screen.topMid.y + format.margin * 1.6, "LVL: 0");

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
        
        // initalize total hit count
        this.hitcount = 0;
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
      

    update(time) {

        // >> {{ ALWAYS CLEAR GRAPHICS FIRST }} //
        this.gizmos.graphics.clear();

        //this.initKeys(); //STUPID KEY RE ASSIGNING

        this.startRocket.update();

        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.launch("pauseScene", { prevScene: "levelZeroScene", gameScene: this });
        
            // Pause the current scene
            this.scene.pause();
    
            // Disable input listeners in the game scene
            this.input.keyboard.enabled = false;
        }

        // update time
        this.timePassedText.setText(`${this.curTime}`);
        //this.levelText.setText(`LVL: ${this.level}`);

        //#endregion

        // [[ UPDATE GAME OBJECTS]]
        if(this.hitcount < 3){
            this.startRocket.update();             // update tutorial rocket 
        }

        this.bunker.update();
        

        // << CHECK PLAYER OUT OF BOUNDS >>
        if (this.checkWorldBounds(this.startRocket)) {
            this.startRocket.reset();
            this.startRocket.setPosition(20,20);
        }


        if(this.hitcount >= 3 && !this.loading){
            // change scenes / move onto level 0.5
            // we want to add animation here about hamster getting in the ship and launching
            // so make ship appear

            // update controls so the player can freely move
            // delete tutorial rocket bring out rocket attached to hamster
            this.startRocket.update();
            //this.hamsterShip.update();
            //this.hamsterShip.visible = true;
            this.takeoffBackground.tilePositionY --;
            this.startRocket.setVisible(false);
            /*
            this.scene.launch("loadingScene", {
                prevScene: "levelZeroScene",
                nextScene: 'playScene',
                hamsterShipX: this.hamsterShip.x,
                hamsterShipY: this.hamsterShip.y                
            });
            this.scene.pause();
            */

        }
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

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;  
        ship.dead = true;

        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });

        // score add and repaint
        this.p1Score += ship.points;        
        this.scoreValueText.setText(this.p1Score.toString())
        this.addTime();

        this.sound.play('sfx_explosion');
    }

    checkWorldBounds(sprite) {
        if (sprite.x < 0 || sprite.x > game.config.width || sprite.y < 0 || sprite.y > game.config.height) {
            return true;
        }
        return false;
    }
    
    // Add seconds to the game timer
    addTime(timeAddition = 2) {
        this.curTime += timeAddition;
    }

}
