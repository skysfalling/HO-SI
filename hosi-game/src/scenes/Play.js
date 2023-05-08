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
        const hamsterShip = new HamsterShip(this, 200, 200);
        // Enable physics for the hamsterShip
        this.physics.add.existing(hamsterShip);
        hamsterShip.body.collideWorldBounds = true;

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // toggle squares
        const enableGizmosButton = document.querySelector("#enable-gizmos");
        enableGizmosButton.innerHTML = "Gizmos: " + this.showGizmos;
        enableGizmosButton.addEventListener("click", () => { 
            this.showGizmos =!this.showGizmos;
            enableGizmosButton.innerHTML = "Gizmos: " + this.showGizmos;
        }); 
    }
        

    update(time) {

        // >> {{ ALWAYS CLEAR GRAPHICS FIRST }} //
        this.gizmos.graphics.clear();

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePosition -= 4;  // update tile sprite

        // [[ UPDATE GAME OBJECTS]]
        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
        }

        // << CHECK PLAYER OUT OF BOUNDS >>
        if (this.checkWorldBounds(this.p1Rocket)) {
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

    checkWorldBounds(sprite) {
        if (sprite.x < 0 || sprite.x > game.config.width || sprite.y < 0 || sprite.y > game.config.height) {
            return true;
        }
        return false;
    }

}
