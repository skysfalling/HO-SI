class HamsterShip extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, ss_fly, ss_dodge) {
    super(scene, x, y, ss_fly);

    // Set up physics and initial properties
    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.scene = scene;
    this.physics = scene.physics;

    this.body.setCollideWorldBounds(true);
    this.setDepth(1);
    this.setScale(2);


    // [[ INPUTS ]] ====================================================================
    // Define the arrow key movement controls
    this.moveUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.moveDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.moveLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.moveRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    // Define the D dodge key control
    this.dodgeKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // Define the F rocket fire key control
    this.rocketKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    // [[ GIZMOS]] =====================================================
    this.gizmos = new Gizmos(this.scene);

    // << TEXT GIZMO >>
    this.stateText = this.gizmos.createText(0, 0, 'state');
    this.posText = this.gizmos.createText(0, 0, 'pos');

    // [[ SHIP VALUES ]] ===================================================================
    this.moveSpeed = 300;
    this.dodgeForce = 600;
    this.dodgeDuration = 500;
    this.rocketForce = 400;

    this.fireCheckLength = screen.height * 0.8;
    this.fireDelay = 200;
    this.lastFired = 0;

  // [[ ANIMATIONS ]] ===================================================================

    // spaceship fly animation config
    this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNumbers(ss_fly, { 
            start: 0, 
            end: 2, 
            first: 0
        }),
        frameRate: 8,
        repeat: -1
    });

    // spaceship dodge animation config
    this.anims.create({
          key: 'dodge',
          frames: this.anims.generateFrameNumbers(ss_dodge, { 
              start: 0, 
              end: 5, 
              first: 0
          }),
          frameRate: 8,
          repeat: 0
      });

    this.anims.play('fly');   

  

  // [[ STATES ]] ===================================================================

    this.states = {
      MOVE: {
        name: "move",
        enter: ()=> {
          this.currentState = this.states.MOVE;
          this.anims.play('fly');
        },
        update: () => {
          
          // horizontal movement
          if (this.moveLeft.isDown) {
            this.body.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, -this.moveSpeed, 0.1));
          } else if (this.moveRight.isDown) {
            this.body.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, this.moveSpeed, 0.1));
          } else {
            this.body.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, 0, 0.1));
          }

          // vertical movement
          if (this.moveUp.isDown) {
            this.body.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, -this.moveSpeed, 0.1));
          } else if (this.moveDown.isDown) {
            this.body.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, this.moveSpeed, 0.1));
          } else {
            this.body.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, 0, 0.1));
          }

          // dodge
          if (this.dodgeKey.isDown && this.currentState == this.states.MOVE && !this.dodgeUsed) {
            this.states.DODGE.enter();
            this.dodgeUsed = true;
          }

          // fire rocket
          if (this.rocketKey.isDown && this.currentState== this.states.MOVE && !this.rocketUsed) {
            this.states.ROCKET.enter();
          }

          // << PRIMARY FIRE >>



        },
      },
      DODGE: {
        name: "dodge",
        enter: ()=> {
          this.currentState = this.states.DODGE;

          if (this.moveLeft.isDown) {
            this.dodgeDirection = new Phaser.Math.Vector2(-1, 0);
          } else if (this.moveRight.isDown) {
            this.dodgeDirection = new Phaser.Math.Vector2(1, 0);
          } else if (this.moveUp.isDown) {
            this.dodgeDirection = new Phaser.Math.Vector2(0, -1);
          } else if (this.moveDown.isDown) {
            this.dodgeDirection = new Phaser.Math.Vector2(0, 1);
          }
          
          this.dodgeDirection.normalize();
          this.body.setVelocity(this.dodgeDirection.x * this.dodgeForce, this.dodgeDirection.y * this.dodgeForce);

          this.anims.play('dodge');

          scene.time.addEvent({
            delay: this.dodgeDuration,
            callback: () => {
              this.states.MOVE.enter();
            },
            loop: false
          });
        },
        update: () => {}
      },
      ROCKET: {
        name: "rocket",
        enter: ()=> {},
        update: () => {

        }
      }
    }

    // set initial state
    this.currentState = this.states.MOVE;

  // [[ FIRE MODES ]] ===============================================================
    this.primaryFireTrigger = scene.add.rectangle(this.x, this.y, this.width, this.fireCheckLength).setStrokeStyle(2, 0xffff00).setOrigin(0.5,1);

    this.asteroidInFireRange = false;

  }
  
  update() {
    this.gizmos.updateText(this.stateText, this.x, this.y + this.height + 10, this.currentState.name)
    this.gizmos.updateText(this.posText, this.x, this.y - this.height, Math.floor(this.x) + " " + Math.floor(this.y));

    if (!this.dodgeKey.isDown && this.dodgeUsed) { this.dodgeUsed = false; }

    //if (!this.rocketKey.isDown && this.rocketUsed) { this.rocketUsed = false; }

    this.primaryFireTrigger.setPosition(this.x, this.y);

    this.currentState.update();
  }

  overlap_asteroid(){
    console.log("overlap asteroid");
    this.asteroidInFireRange = true;
  }
}
         
  