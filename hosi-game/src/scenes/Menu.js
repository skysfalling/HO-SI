class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/sounds/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/sounds/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/sounds/rocket_shot.wav');

        game.config.centerX = game.config.width / 2;
        game.config.centerY = game.config.height / 2;
    }

    create() {


        // show menu text
        this.add.text(game.config.centerX, game.config.centerY - borderUISize - borderPadding, 'HAMSTER ORIGINS', defaultTextStyle).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'SNAKE INVADERS', defaultTextStyle).setOrigin(0.5);
        
        defaultTextStyle.color = color_pal.green;
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', defaultTextStyle).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // Novice mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select', {volume: 0.1});
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // Expert mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select', {volume: 0.1});
          this.scene.start("playScene");    
        }

      }
}