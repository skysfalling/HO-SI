class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.gizmos = new Gizmos(this);
        this.showGizmos = true;

        this.level = 1;

    //#region [[ SPRITES ]]
        // load images/tile sprites
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('rocket_fire', './assets/rocket.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});


        // << HAMSTER SPACESHIP >>
        this.load.spritesheet('spaceship_fly', './assets/hamster_ship/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 2});
        this.load.spritesheet('spaceship_roll', './assets/hamster_ship/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 3, endFrame: 8});

        // << ASTEROIDS >>
        this.load.image('justAsteroid', './assets/asteroids/singleAsteroid.png');
        this.load.spritesheet('asteroid','./assets/asteroids/bigAstroidExploding.png',{frameWidth:53,frameHeight:50, startFrame: 0, endFrame: 4});
        //#endregion

    //#region [[ SCENE SETUP]]
        this.mainCamera = this.cameras.main;
        this.mainCamera.setBackgroundColor('#0000ff');

        // set physical world bounds
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

        const canvas = document.getElementById('game-container');
    }

    create() {

        // #region [[ CREATE OBJECTS ]]
        // << BACKGROUND PARALLAX >>
        this.starfield = this.add.tileSprite(this.world.center.x, this.world.center.y, screen.width + (format.margin * 4), screen.height + (format.margin * 4), 'starfield').setOrigin(0.5, 0.5);

        // center point
        this.gizmos.createText(this.world.center.x, this.world.center.y, "CENTER POINT");

        // << PLAYER SHIP >>
        this.hamsterShip = new HamsterShip(this, this.world.center.x, this.world.center.y, 'spaceship_fly', 'spaceship_roll');

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
        // add collide listener
        this.physics.add.overlap(
            this.asteroids,
            this.hamsterShip.primaryFireTrigger,
            (asteroid, hamsterShip) =>
            {
                console.log("asteroid overlap");
            });
        //#endregion

        // toggle squares
        const enableGizmosButton = document.querySelector("#enable-gizmos");
        enableGizmosButton.innerHTML = "Gizmos: " + this.showGizmos;
        enableGizmosButton.addEventListener("click", () => { 
            game.config.debug = !game.config.debug;
            enableGizmosButton.innerHTML = "Gizmos: " + game.config.debug;
        }); 
    }
        
    update() {
        // >> {{ ALWAYS CLEAR GRAPHICS FIRST }} //
        this.gizmos.graphics.clear();

        this.starfield.tilePositionY -= 4;  // update tile sprite
        
        // [[ UPDATE GAME OBJECTS]]
        this.hamsterShip.update();  

        this.physics.world.wrap(this.asteroids);

        // << DRAW WORLD BOUNDS >>
        this.gizmos.drawRect(this.world.center.x, this.world.center.y, this.world.width - format.margin, this.world.height - format.margin, 0);

        // follow the player with the main camera
        this.mainCamera.startFollow(this.hamsterShip, true, 0.1, 0.1);

        // constrain the main camera within the world bounds
        this.mainCamera.setScroll(
            Phaser.Math.Clamp(this.mainCamera.scrollX, format.margin, (this.world.width-this.mainCamera.width) + (format.margin*3)),
            Phaser.Math.Clamp(this.mainCamera.scrollY, format.margin, (this.world.height-this.mainCamera.height) + (format.margin*3))
        );

        this.mainCamera.zoom = 1;
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
