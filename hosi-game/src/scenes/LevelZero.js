//const { Sound } = require("phaser");

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

        this.soundManager = new SoundManager(this);

        this.level = 1;
        this.defaultShipSpeed = 100;

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        //keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        

        //#region << SPRITES >>
        // load backgrounds/tile sprites
        this.load.image('spaceship', './assets/spaceship.png');
        //this.load.image('starfield', './assets/starfield.png');
        this.load.image('takeoff', './assets/takeoff.png');

        // load spritesheet
        this.load.spritesheet('rocket_fire', './assets/rocket.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});

        // << HAMSTER SPACESHIP >>
        this.load.spritesheet('spaceship_fly', './assets/hamster_ship/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 2});
        this.load.spritesheet('spaceship_roll', './assets/hamster_ship/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 3, endFrame: 8});
    
        // << ENEMY SPACESHIPS >>
        this.load.image('greenSnake1', './assets/greenSnakeShip0.png');
        // << BULLETS >>
        this.load.spritesheet('primary_fire', './assets/bullets/bullet_fire.png', {frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 3});

        // << ROCKET >>
        this.load.spritesheet('rocket_fire', './assets/rocket.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.spritesheet('explosion', './assets/fx/explosion.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 13});

        // << ASTEROIDS >>
        this.load.image('justAsteroid', './assets/asteroids/asteroid.png');

        // << BUNKER >>
        this.load.image('bunker', './assets/bunker.png');

        // << TEXTURE ATLAS >>
        this.load.atlas('hosi_atlas', './assets/hosi_sprite_sheet.png', './assets/hosi_texture_atlas.json');

        //#endregion 

        // refernece to HTML Webpage for debugger buttons and things
        const canvas = document.getElementById('game-container');   
    }

    create() {

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

        this.soundManager.level0Music();

        //#endregion
        
        //#region << SPACE BACKGROUNDS >>
        this.takeoff = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'takeoff').setOrigin(1, 1);

        this.bunker = this.add.sprite(game.config.width/2, game.config.height - borderUISize - borderPadding, 'bunker');

        //#endregion
        
        //#region << ROCKET AND SPACESHIPS >>
        // add Rocket (p1)

        this.p1Rocket = new Rocket(this, this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket_fire').setOrigin(0.5).setVisible(false);
        this.tutorialRocket = new TutorialRocket(this, game.config.width/2, game.config.height -100, 'rocket_fire').setOrigin(0.5);
        this.hamsterShip = new HamsterShip(this, game.config.width/2, game.config.height - 100, 'spaceship_fly', 'spaceship_roll', 'primary_fire').setVisible(false);
        this.hamsterShip.rocket.setVisible(false);  // make rocket attached to ship invisibile

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, "ship1", game.config.width, game.config.height * 0.25, 'greenSnake1', 0, 10, this.defaultShipSpeed);        
        this.ship02 = new Spaceship(this, "ship2", game.config.width, game.config.height * 0.50, 'greenSnake1', 0, 10, this.defaultShipSpeed);
        this.ship03 = new Spaceship(this, "ship3", game.config.width, game.config.height * 0.75, 'greenSnake1', 0, 10, this.defaultShipSpeed);
        this.fastShip = new Spaceship(this, "fastboi", game.config.width, game.config.height * 0.5, 'purpleSnakeShip0', 0, 10, (this.defaultShipSpeed*2), screen.height - (format.margin*4)/*, color_pal.toInt("green")*/);
        this.fastShip.setScale(1);
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
        // initialize score
        this.p1Score = 0;

        // score value
        this.scoreValueText = this.add.text(screen.topLeft.x + (format.margin * 3), screen.topLeft.y + format.margin, 'Score', headerConfig).setOrigin(0.5,0.5);
        
        // time passed --> unsure if we want this shown
        this.timePassedText = this.add.text(screen.topRight.x - (format.margin * 3), screen.topRight.y + format.margin, 'Time', headerConfig).setOrigin(0.5,0.5);

        // title
        headerConfig.fixedWidth = 0;
        this.titleText = this.add.text(screen.topMid.x, screen.topMid.y + format.margin, "Rocket Patrol", headerConfig).setOrigin(0.5,0.5);
        
        // fps / delta text
        this.fpsText = this.gizmos.createText(screen.topMid.x, screen.topMid.y + format.margin, "FPS: ");
        this.deltaText = this.gizmos.createText(screen.topMid.x, screen.topMid.y + format.margin * 1.5, "Delta: ");

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
    init(){
        console.log('running init')
        //#region << DEFINE KEYS >>
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        //keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        //#endregion
    }    

    update(time) {

        // >> {{ ALWAYS CLEAR GRAPHICS FIRST }} //
        this.gizmos.graphics.clear();

        this.init(); //STUPID KEY RE ASSIGNING

        if(Phaser.Input.Keyboard.JustDown(keyESC)){
            this.input.keyboard.resetKeys();
            console.log("esc pressed");
            this.pauseScene = this.scene.launch("pauseScene", {prevScene: "levelZeroScene"});
            //this.pauseScene.scene.main
            console.log("pause scene: " + this.pauseScene);
            this.scene.pause();
        }

        // update time
        this.timePassedText.setText(`${this.curTime}`);
        this.levelText.setText(`LVL: ${this.level}`);

        // Update profiler
        this.gizmos.updateText(this.fpsText, screen.topRight.x - format.margin, screen.topMid.y + format.margin, "FPS: " + Math.round(this.game.loop.actualFps));
        this.gizmos.updateText(this.deltaText, screen.topRight.x - format.margin, screen.topMid.y + format.margin * 1.5, "Delta: " + Math.round(this.game.loop.delta));

        //#endregion

        //this.starfield.tilePositionX;  // update tile sprite

        // [[ UPDATE GAME OBJECTS]]
        if(this.hitcount < 3){
            this.tutorialRocket.update();             // update tutorial rocket 
        }
        this.ship01.update();               // update spaceship (x3)
        this.ship02.update();
        this.ship03.update();
        this.fastShip.update();
        this.bunker.update();
        

        // << CHECK PLAYER OUT OF BOUNDS >>
        if (this.checkWorldBounds(this.p1Rocket)) {
            this.tutorialRocket.reset();
            this.tutorialRocket.setPosition(20,20);
        }

        //#region << ROCKET COLLISIONS >>
        if (!this.ship01.dead && (this.checkCollision(this.tutorialRocket, this.ship01))) //|| (this.checkCollision(this.hamsterShip, this.ship01)))
        {
            this.hitcount++;
            this.shipExplode(this.ship01);
            this.tutorialRocket.setPosition(20,20);
        }
        if (!this.ship02.dead && this.checkCollision(this.tutorialRocket, this.ship02)) //|| (this.checkCollision(this.hamsterShip, this.ship02)))
        {
            this.hitcount++;
            this.shipExplode(this.ship02);
            this.tutorialRocket.reset();
        }
        if (!this.ship03.dead && this.checkCollision(this.tutorialRocket, this.ship03)) //|| (this.checkCollision(this.hamsterShip, this.ship03)))
        {
            this.hitcount++;
            this.shipExplode(this.ship03);
            this.tutorialRocket.reset();
        }
        /*
        if (!this.fastShip.dead && this.checkCollision(this.tutorialRocket, this.fastShip))
        {
            this.hitcount++;
            this.shipExplode(this.fastShip);
            this.tutorialRocket.reset();
        }*/
        //#endregion

        if(this.hitcount >= 3 && !this.loading){
            // change scenes / move onto level 0.5
            // we want to add animation here about hamster getting in the ship and launching
            // so make ship appear

            // update controls so the player can freely move
            // delete tutorial rocket bring out rocket attached to hamster
            //this.p1Rocket.update();
            //this.hamsterShip.update();
            //this.hamsterShip.visible = true;
            this.tutorialRocket.setVisible(false);
            this.scene.launch("loadingScene", {
                prevScene: "levelZeroScene",
                nextScene: 'playScene',
                hamsterShipX: this.hamsterShip.x,
                hamsterShipY: this.hamsterShip.y             
            });
            this.soundManager.stopCurrentMusic();

            this.scene.pause();
            

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
