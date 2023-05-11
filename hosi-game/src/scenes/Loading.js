class Loading extends Phaser.Scene {
    constructor(){
        super("loadingScene");
    }

    init (data){
        this.prevScene = data.prevScene;
        this.nextScene = data.nextScene;
        this.hamsterShipX = data.hamsterShipX;
        this.hamsterShipY = data.hamsterShipY;
    }       

    preload(){
        //#region << LOADING IN BEAMS >>
        this.load.image('blue_beam', './assets/hyperspace/bluefield.png');
        this.load.image('white_beam', './assets/hyperspace/whitefield.png');
        this.load.image('cyan_beam', './assets/hyperspace/cyanfield.png');
        //#endregion

        this.hamsterShip = new HamsterShip(this, this.hamsterShipX, this.hamsterShipY - 100, 'spaceship_fly', 'spaceship_roll', 'primary_fire');
    }

    create(){
        
        this.blueBeam = this.add.tileSprite(game.config.x, game.config.y, game.config.height, game.config.width, 'blue_beam').setOrigin(0,0).setScale(2);
        this.whiteBeam = this.add.tileSprite(game.config.x, game.config.y, game.config.height, game.config.width, 'white_beam').setOrigin(0,0).setScale(2);
        this.cyanBeam = this.add.tileSprite(game.config.x, game.config.y, game.config.height, game.config.width, 'cyan_beam').setOrigin(0,0).setScale(2);
        this.slow = true;

        //#region << DELAYED CALLS THAT SHIFT THROUGH SCENES >>
        this.time.delayedCall(2000, () => {
            this.slow = false;
            this.scene.setVisible(false, this.prevScene);
            this.scene.stop(this.prevScene)

        }, null, this);
        
        this.time.delayedCall(5000, () => {
            this.slow = true;
            this.scene.launch(this.nextScene, {
                hampsterShipX: this.hamsterShip.x,
                hamsterShipY: this.hamsterShip.y
            });
            this.hamsterShip.setVisible(false);
        }, null, this);

        this.time.delayedCall(7500, () => {
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