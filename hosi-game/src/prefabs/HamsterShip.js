class HamsterShip extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    // Set up physics and initial properties
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.gizmos = new Gizmos(this.scene);

    this.body.setCollideWorldBounds(true);
    this.setDepth(1);
    this.setScale(2);

    // Define the arrow key movement controls
    this.moveUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.moveDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.moveLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.moveRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    // Define the D dodge key control
    this.dodgeKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // Define the F rocket fire key control
    this.rocketKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    // << TEXT GIZMO >>
    this.stateText = this.gizmos.createText(0, 0, 'state');
    this.posText = this.gizmos.createText(0, 0, 'pos');


    
    this.moveSpeed = 300;


    this.states = {
      MOVE: {
        name: "move",
        enter: ()=> {
          this.currentState = this.states.MOVE;
        },
        update: () => {
          // horizontal movement
          if (this.moveLeft.isDown) {
              this.body.setVelocityX(-this.moveSpeed);
          } else if (this.moveRight.isDown) {
              this.body.setVelocityX(this.moveSpeed);
          } else {
            this.body.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, 0, 0.1));
          }

          // vertical movement
          if (this.moveUp.isDown) {
              this.body.setVelocityY(-this.moveSpeed);
          } else if (this.moveDown.isDown) {
              this.body.setVelocityY(this.moveSpeed);
          } else {
            this.body.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, 0, 0.1));
          }
        },
      },
      DODGE: {

      },
      ROCKET: {

      }
    }

    // set initial state
    this.currentState = this.states.MOVE;

  }
  
  update() {
    this.gizmos.updateText(this.stateText, this.x, this.y + this.height, this.currentState.name)
    this.gizmos.updateText(this.posText, this.x, this.y - this.height, Math.floor(this.x) + " " + Math.floor(this.y));

    this.currentState.update();
  }

  
}
         
  