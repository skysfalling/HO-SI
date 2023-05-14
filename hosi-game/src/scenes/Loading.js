class Loading extends Phaser.Scene {
    constructor(){
        super("loadingScene");
    }

    init (data){
        this.prevScene = data.prevScene;
        this.nextScene = data.nextScene;
        this.startPosX = data.hamsterShipX;
        this.startPosY = data.hamsterShipY;
    }       

    preload(){
        //#region << LOADING IN BEAMS >>
        this.load.image('blue_beam', './assets/hyperspace/bluefield.png');
        this.load.image('white_beam', './assets/hyperspace/whitefield.png');
        this.load.image('cyan_beam', './assets/hyperspace/cyanfield.png');
        //#endregion

        this.loadHamsterShip = new HamsterShip(this, this.startPosX, this.startPosY, 'spaceship_fly', 'spaceship_roll', 'primary_fire');
    }

    create(){
        
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.blueBeam = this.add.tileSprite(game.config.x, game.config.y, game.config.height, game.config.width, 'blue_beam').setOrigin(0,0).setScale(2);
        this.whiteBeam = this.add.tileSprite(game.config.x, game.config.y, game.config.height, game.config.width, 'white_beam').setOrigin(0,0).setScale(2);
        this.cyanBeam = this.add.tileSprite(game.config.x, game.config.y, game.config.height, game.config.width, 'cyan_beam').setOrigin(0,0).setScale(2);
        this.slow = true;

        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.time.delayedCall(2000, () => {
            this.slow = false;
            this.scene.setVisible(false, this.prevScene);
            this.scene.stop(this.prevScene)
        }, null, this);
        
        this.time.delayedCall(4000, () => {
            this.slow = true;
            this.scene.launch(this.nextScene, {
                hampsterShipX: this.loadHamsterShip.x,
                hamsterShipY: this.loadHamsterShip.y
            });
            this.loadHamsterShip.setVisible(false);
            this.loadHamsterShip.rocket.setVisible(false);
        }, null, this);

        this.time.delayedCall(7000, () => {
            this.cameras.main.fadeOut(2000, 0, 0, 0);
        }, null, this);

        this.time.delayedCall(7000, () => {
            this.scene.setVisible(false, "loadingScene");
            this.scene.stop("loadingScene");
        }, null, this);
        //#endregion

    }

    update(){

        //#region << HYPERBEAMS >>
        if(this.slow == true){
            this.blueBeam.tilePositionY -=2;
            this.whiteBeam.tilePositionY -=3;
            this.cyanBeam.tilePositionY -=4;
        }

        if(this.slow == false){
            this.blueBeam.tilePositionY -=5;
            this.whiteBeam.tilePositionY -=7;
            this.cyanBeam.tilePositionY -=6;
        }
        //#endregion
    }
}