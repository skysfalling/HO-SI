class HamsterShip extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, ss_fly, ss_dodge, ss_bullet) {
    super(scene, x, y, ss_fly, ss_dodge, ss_bullet);

    // Set up physics and initial properties
    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.scene = scene;
    this.physics = scene.physics;

    this.body.setCollideWorldBounds(true);
    this.setDepth(1);
    this.setScale(2);

    this.bullets;
    this.ss_bullet = ss_bullet;

    //#region [[ INPUTS ]] ====================================================================
    // Define the arrow key movement controls
    this.moveUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.moveDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.moveLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.moveRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    // Define the D dodge key control
    this.dodgeKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // Define the F rocket fire key control
    this.rocketKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    //#endregion
    
    //#region [[ GIZMOS]] =====================================================
    this.gizmos = new Gizmos(this.scene);

    // << TEXT GIZMO >>
    this.stateText = this.gizmos.createText(0, 0, 'state');
    this.posText = this.gizmos.createText(0, 0, 'pos');
    //#endregion

    //#region [[ SHIP VALUES ]] ===================================================================
    this.moveSpeed = 300;
    this.dodgeForce = 600;
    this.dodgeDuration = 500;
    this.rocketForce = 400;

    this.fireCheckLength = screen.height * 0.8;
    this.fireDelay = 200;
    this.lastFired = 0;
    //#endregion

  //#region [[ ANIMATIONS ]] ===================================================================
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
  //#endregion

  // [[ STATES ]] ===================================================================

    this.states = {
      MOVE: {
        name: "move",
        enter: ()=> {
          this.currentState = this.states.MOVE;
          this.anims.play('fly');
          this.setAlpha(1);
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
            this.states.ROCKET_FIRE.enter();
          }

        },
      },
      DODGE: {
        name: "dodge",
        enter: ()=> {
          this.currentState = this.states.DODGE;
          this.setAlpha(1);

          this.dodgeDirection = new Phaser.Math.Vector2(0, 0);
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

          // dodge duration
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
      ROCKET_FIRE: {
        name: "rocket_fire",
        enter: ()=> {
          this.currentState = this.states.ROCKET_FIRE;
          this.body.setVelocity(0, 0);
          this.rocket.states.FIRE.enter();
          this.setAlpha(0.5);
        },
        update: () => {
        }
      }
    }

    // set initial state
    this.currentState = this.states.MOVE;

  //#region [[ FIRE MODES ]] ===============================================================

    // << PRIMARY FIRE TRIGGER >>
    this.primaryFireTrigger = scene.add.rectangle(this.x, this.y, this.width*3, this.fireCheckLength).setOrigin(0.5,1);
    this.physics.add.existing(this.primaryFireTrigger);

    // << ROCKET FIRE >>
    this.rocket = new Rocket(this.scene, this, this.x, this.y, 'rocket_fire').setOrigin(0.5);
    this.physics.add.existing(this.rocket);

    this.rocketAvailable = true;

  //#endregion
  }
  


  /* ========================================================================================
                      UPDATE
  ========================================================*/

  update() {
    this.gizmos.updateText(this.stateText, this.x, this.y + this.height + 10, this.currentState.name)
    this.gizmos.updateText(this.posText, this.x, this.y - this.height, Math.floor(this.x) + " " + Math.floor(this.y));

    // check for dodge
    if (!this.dodgeKey.isDown && this.dodgeUsed) { this.dodgeUsed = false; }

    // set fire trigger position
    this.primaryFireTrigger.setPosition(this.x, this.y);

    // check for explosion
    if (this.rocket.currentState.name == 'explode' && this.currentState == this.states.ROCKET_FIRE) {
      this.states.MOVE.enter();
      this.rocketAvailable = false;
    }
  

    this.rocket.currentState.update(this.moveLeft.isDown, this.moveRight.isDown);
    this.currentState.update();
  }
  
  primary_fire() {


    // check fire delay
    if (this.scene.time.now < this.lastFired + this.fireDelay) return;
    this.lastFired = this.scene.time.now;

    this.bullets.fire(this, this.x, this.y, this.ss_bullet);


  }

}
         
  