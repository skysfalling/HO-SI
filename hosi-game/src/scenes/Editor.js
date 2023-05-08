
class Editor extends Phaser.Scene {
    constructor() {
      super("editorScene");
    }

    preload() {
      this.graphics = this.add.graphics();
      this.gizmos = new Gizmos(this);

      this.editorActive = false;

      //#region [[ LOAD ASSETS]]
      // load images/tile sprites
      this.load.image('spaceship', './assets/spaceship.png');
      this.load.image('starfield', './assets/starfield.png');

      // load spritesheets
      this.load.spritesheet('rocket_fire', './assets/rocket.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});
      this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
      this.load.spritesheet('spaceship_fly', './assets/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 2});
      this.load.spritesheet('spaceship_roll', './assets/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 3, endFrame: 9});
      //#endregion

      //#region [[ SCENE SETUP]]
      this.mainCamera = this.cameras.main;
      this.mainCamera.setBackgroundColor('#0000ff');

      // set physical world bounds
      this.world = {
        offset: -1000,
        width: screen.width * 3,
        height: screen.height * 10,
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
      };
      this.world.center.x = (this.world.width / 2) + this.world.offset;
      this.world.center.y = (this.world.height / 2) + this.world.offset;

      this.world.bounds.left = this.world.offset;
      this.world.bounds.right = this.world.offset + this.world.width;
      this.world.bounds.top = this.world.offset;
      this.world.bounds.bottom = this.world.offset + this.world.height;

      this.physics.world.setBounds(this.world.offset,this.world.offset,this.world.width,this.world.height);



      //#endregion
    }

    create() {
      // place tile sprite and extend to be bigger than world bounds
      this.starfield = this.add.tileSprite(this.world.center.x, this.world.center.y, this.world.width * 2, this.world.height * 2, 'starfield').setOrigin(0.5);

      // create player
      this.player_rocket = new Rocket(this, this.world.center.x, this.world.center.y * 2, 'rocket_fire').setOrigin(0.5);
      this.mainCamera.startFollow(this.player_rocket, false, 1, 0.05, 0, screen.height/3);
      this.player_rocket.setCollideWorldBounds(true);

      // create spaceship
      this.ship01 = new Spaceship(this, "ship1", this.world.bounds.right, this.world.center.y, 'spaceship', 0);  


      //#region [[ GIZMOS ]] ==============================================================
      this.graphics.clear();
      // draw world bounds
      console.log("World Bounds: ", this.world);
      this.gizmos.drawRect(this.world.center.x, this.world.center.y, this.world.width - format.margin, this.world.height - format.margin, 0);
      //#endregion

      // define keys
      keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
      keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
      keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

      // define inputs
      const cursors = this.input.keyboard.createCursorKeys();
      const editorControlConfig = {
          camera: this.mainCamera,
          left: cursors.left,
          right: cursors.right,
          up: cursors.up,
          down: cursors.down,
          zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
          zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
          acceleration: 0.01,
          drag: 10,
          maxSpeed: 0.001
      };

      this.editorCamControls = new Phaser.Cameras.Controls.SmoothedKeyControl(editorControlConfig);
      /* this.input.keyboard.on('keydown', function (event) {
          this.cameras.main.rotation += 0.01;
          console.log("z");
      }, this); */


      // #region [[ GUI ]] ==============================================================
      const cam = this.mainCamera;
      this.gui = new dat.GUI();

      const mouseGUI = this.gui.addFolder('Pointer');
      mouseGUI.add(this.input, 'x').listen();
      mouseGUI.add(this.input, 'y').listen();
      mouseGUI.open();

      const help = {
          line1: 'Arrow Keys to move',
          line2: 'Z & X to zoom in/out',
      }

      
      const cameraGUI = this.gui.addFolder('Camera Stats');
      //cameraGUI.add(cam, 'x').listen();
      //cameraGUI.add(cam, 'y').listen();
      cameraGUI.add(cam, 'scrollX').listen();
      cameraGUI.add(cam, 'scrollY').listen();
      cameraGUI.add(cam, 'zoom', 0.1, 2).step(0.1).listen();
      cameraGUI.open();
      


      const cameraMove = this.gui.addFolder('Camera Movement');
      cameraMove.add(help, 'line1');
      cameraMove.add(help, 'line2');
      cameraMove.open();
      //#endregion
    }

    update(delta) {
      // #region [[ CONSTANT INPUTS ]] ==============================================================
      if(Phaser.Input.Keyboard.JustDown(keyE)) {
        if (this.editorActive) {this.editorActive = false;}
        else {this.editorActive = true;}
        console.log("Editor active: ", this.editorActive);
      }

      if(Phaser.Input.Keyboard.JustDown(keyR)) {
        this.gui.close();
        this.scene.restart();
      }
      //#endregion

      // #region [[ UPDATE ]] ==============================================================
      
      // >> CONSTANT UPDATES
      this.graphics.clear();
      // >> EDITOR UPDATE
      if (this.editorActive) { this.editorUpdate(delta); return; }

      // >> PLAY MODE UPDATE
      if (this.player_rocket.currentState == this.player_rocket.states.FREEZE){
        this.player_rocket.states.FIRE.enter();
      }
      this.player_rocket.update(); 
      this.ship01.update();

      // make camera follow player
      this.mainCamera.startFollow(this.player_rocket, false, 1, 0.05, 0, screen.height/3);
      this.mainCamera.zoom = 1;
      //#endregion

    }
    
    editorUpdate(delta){

      // FREEZE player rocket
      this.player_rocket.states.FREEZE.enter();

      // Independent Camera Movement
      this.mainCamera.stopFollow();
      this.editorCamControls.update(delta);

    }
}