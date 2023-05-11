class Loading extends Phaser.Scene {
    constructor(){
        super("loadingScene");
    }

    preload(){
        this.load.image('blue_beam', './assets/hyperspace/bluefield.png');
        this.load.image('white_beam', './assets/hyperspace/whitefield.png');
        this.load.image('cyan_beam', './assets/hyperspace/cyanfield.png');
    }

    create(){
        this.testing = this.add.text(screen.topRight.x - (format.margin * 3), screen.topRight.y + format.margin, 'TRANSITION', headerConfig).setOrigin(0.5,0.5);
        this.blueBeam = this.add.tileSprite(0,0,game.config.height,game.config.width, 'blue_beam').setOrigin(0,0);
        this.whiteBeam = this.add.tileSprite(0,0,game.config.height,game.config.width, 'white_beam').setOrigin(0,0);
        this.cyanBeam = this.add.tileSprite(0,0,game.config.height,game.config.width, 'cyan_beam').setOrigin(0,0);
    }

    update(){

        this.blueBeam.tilePositionY -=10;
        this.whiteBeam.tilePositionY -=8;
        this.cyanBeam.tilePositionY -=12;
    }

}