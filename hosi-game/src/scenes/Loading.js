class Loading extends Phaser.Scene {
    constructor(){
        super("loadingScene");
    }

    preload(){


    }

    create(){
        this.testing = this.add.text(screen.topRight.x - (format.margin * 3), screen.topRight.y + format.margin, 'TRANSITION', headerConfig).setOrigin(0.5,0.5);

    }

    update(){


    }

}