class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.soundManager = SoundManager.getInstance(this);
        this.soundManager.loadAllSounds();

        this.waves = Waves.getInstance(this, 1, 0);
        //console.log(this.soundManager);


        game.config.centerX = game.config.width / 2;
        game.config.centerY = game.config.height / 2;

    }

    create() {
        // show menu text
        this.add.text(game.config.centerX, game.config.centerY - borderUISize - borderPadding, 'HAMSTER ORIGINS', defaultTextStyle).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'SNAKE INVADERS', defaultTextStyle).setOrigin(0.5);
        
        defaultTextStyle.color = color_pal.green;
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Play.js or → for Level0', defaultTextStyle).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        
        // toggle gizmos
        const enableGizmosButton = document.querySelector("#enable-gizmos");
        enableGizmosButton.innerHTML = "Gizmos: " + gizmosActive;
        enableGizmosButton.addEventListener("click", () => { 
            gizmosActive = !gizmosActive;
            enableGizmosButton.innerHTML = "Gizmos: " + gizmosActive;
        }); 

        // toggle edit mode
        const enableEditButton = document.querySelector("#enable-edit");
        enableEditButton.innerHTML = "Edit Mode: " + editorActive;
        enableEditButton.addEventListener("click", () => { 
            editorActive = !editorActive;
            enableEditButton.innerHTML = "Edit Mode: " + editorActive;
          }); 
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // Novice mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000
          }
          this.soundManager.play('sfx_select', {volume: .10});
          console.log(this.soundManager);
          this.scene.start("playScene", {soundManager: this.soundManager});    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // Expert mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000    
          }
          this.soundManager.play('sfx_select', {volume: .10});
          console.log(this.soundManager);
          this.scene.start("levelZeroScene", {soundManager: this.soundManager});    
        }

      }
}