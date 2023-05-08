class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.gizmos = new Gizmos(this);
        this.showGizmos = true;

        this.level = 1;
        this.defaultShipSpeed = 100;

        // load images/tile sprites
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('rocket_fire', './assets/rocket.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});

        this.load.spritesheet('spaceship_fly', './assets/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 2});
        this.load.spritesheet('spaceship_roll', './assets/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 3, endFrame: 9});

        const canvas = document.getElementById('game-container');
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket_fire').setOrigin(0.5);

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, "ship1", game.config.width, game.config.height * 0.25, 'spaceship', 0, 10, this.defaultShipSpeed);        
        this.ship02 = new Spaceship(this, "ship2", game.config.width, game.config.height * 0.50, 'spaceship', 0, 10, this.defaultShipSpeed);
        this.ship03 = new Spaceship(this, "ship3", game.config.width, game.config.height * 0.75, 'spaceship', 0, 10, this.defaultShipSpeed);
        this.fastShip = new Spaceship(this, "fastboi", game.config.width, game.config.height * 0.5, 'spaceship', 0, 10, (this.defaultShipSpeed*2), screen.height - (format.margin*4), color_pal.toInt("green"));
        this.fastShip.setScale(1);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // toggle squares
        const enableGizmosButton = document.querySelector("#enable-gizmos");
        enableGizmosButton.innerHTML = "Gizmos: " + this.showGizmos;
        enableGizmosButton.addEventListener("click", () => { 
            this.showGizmos =!this.showGizmos;
            enableGizmosButton.innerHTML = "Gizmos: " + this.showGizmos;
        });

        // explode animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30
        });

        //#region  >>>>> GAME UI 
        // initialize score
        this.p1Score = 0;

        // score value
        // time passed
        this.scoreValueText = this.add.text(screen.topLeft.x + (format.margin * 3), screen.topLeft.y + format.margin, 'Score', headerConfig).setOrigin(0.5,0.5);
        
        // time passed
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

        // GAME OVER flag
        this.gameOver = false;
        this.startTime = 10;
        this.curTime = this.startTime;
        this.extraTime = 0;
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
              this.curTime--;
              if (this.curTime <= 0) {
                this.endGame();
              }
            },
            callbackScope: this,
            loop: true
        });    
        
        this.levelUpDelay = this.time.addEvent({
            delay: 30 * 1000,
            callback: () => {
                this.level ++;

                // update ship speeds based on level
                this.ship01.moveSpeed = this.level * this.defaultShipSpeed;
                this.ship02.moveSpeed = this.level * this.defaultShipSpeed;
                this.ship03.moveSpeed = this.level * this.defaultShipSpeed;
                this.fastShip.moveSpeed = this.level * (this.defaultShipSpeed * 2);

            },
            callbackScope: this,
            loop: true
        });    
    }
        

    update(time) {

        // >> {{ ALWAYS CLEAR GRAPHICS FIRST }} //
        this.gizmos.graphics.clear();

        // update time
        this.timePassedText.setText(`${this.curTime}`);
        this.levelText.setText(`LVL: ${this.level}`);

        // Update profiler
        this.gizmos.updateText(this.fpsText, screen.topRight.x - format.margin, screen.topMid.y + format.margin, "FPS: " + Math.round(this.game.loop.actualFps));
        this.gizmos.updateText(this.deltaText, screen.topRight.x - format.margin, screen.topMid.y + format.margin * 1.5, "Delta: " + Math.round(this.game.loop.delta));

        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        //#endregion

        this.starfield.tilePositionX -= 4;  // update tile sprite

        // [[ UPDATE GAME OBJECTS]]
        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
            this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            this.fastShip.update();
        }

        // << CHECK PLAYER OUT OF BOUNDS >>
        if (this.checkWorldBounds(this.p1Rocket)) {
            this.p1Rocket.reset();
        }

        // << ROCKET COLLISIONS >>
        if (!this.ship01.dead && this.checkCollision(this.p1Rocket, this.ship01))
        {
            this.shipExplode(this.ship01);
            this.p1Rocket.reset();
        }
        if (!this.ship02.dead && this.checkCollision(this.p1Rocket, this.ship02))
        {
            this.shipExplode(this.ship02);
            this.p1Rocket.reset();
        }
        if (!this.ship03.dead && this.checkCollision(this.p1Rocket, this.ship03))
        {
            this.shipExplode(this.ship03);
            this.p1Rocket.reset();
        }

        if (!this.fastShip.dead && this.checkCollision(this.p1Rocket, this.fastShip))
        {
            this.shipExplode(this.fastShip);
            this.p1Rocket.reset();
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

    endGame() {


        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', headerConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', headerConfig).setOrigin(0.5);
        this.gameOver = true;

    }

}
