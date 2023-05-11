class HamsterShip extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, ss_fly, ss_dodge, ss_bullet) {
    super(scene, x, y, ss_fly, ss_dodge, ss_bullet);

    // Set up physics and initial properties
    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.scene = scene;
    this.physics = scene.physics;

    this.body.setCollideWorldBounds(true);
    this.setDepth(1);
    this.setScale(2); //64px

    // Create the camera target variable
    this.mainCamera = scene.cameras.main;
    this.cameraTarget = new Phaser.Math.Vector2(this.x, this.y);

    this.primaryActive = true;
    this.bullets;
    this.ss_bullet = ss_bullet;

    //#region [[ INPUTS ]] ====================================================================
    // Define the arrow key movement controls
    this.moveUp = keyUP;
    this.moveDown = keyDOWN;
    this.moveLeft = keyLEFT;
    this.moveRight = keyRIGHT;

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
    this.rocketText = this.gizmos.createText(0, 0,'rocket');
    this.camTargetText = this.gizmos.createText(0, 0,'cam');

    //#endregion

    //#region [[ SHIP VALUES ]] ===================================================================
    this.moveSpeed = 200;
    this.dodgeForce = 600;
    this.dodgeDuration = 250;

    // primary fire
    this.primaryFireCheckLength = screen.height * 0.8;
    this.primaryFireDelay = 200;
    this.primarylastFired = 0;

    // rocket fire
    this.rocket;
    this.rocketPos = {x: this.x + this.width, y: this.y};
    this.rocketForce = 400;

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
          frameRate: 16,
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
            this.body.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, 0, 1));
          }

          // vertical movement
          if (this.moveUp.isDown) {
            this.body.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, -this.moveSpeed, 0.1));
          } else if (this.moveDown.isDown) {
            this.body.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, this.moveSpeed, 0.1));
          } else {
            this.body.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, 0, 1));
          }

          // dodge
          if (this.dodgeKey.isDown && this.currentState == this.states.MOVE && !this.dodgeUsed) {
            this.states.DODGE.enter();
            this.dodgeUsed = true;
          }

          // fire rocket
          if (this.rocketKey.isDown && this.currentState === this.states.MOVE && this.rocket.currentState.name === "idle") {
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
      },
      DISABLE: {
        name: "disable",
        enter: () => {
          this.currentState = this.states.DISABLE;
        },
        update: () => {}
      }
    }

    // set initial state
    this.currentState = this.states.MOVE;

  //#region [[ FIRE MODES ]] ===============================================================

    // << PRIMARY FIRE TRIGGER >>
    this.primaryFireTrigger = scene.add.rectangle(this.x, this.y, this.width*3, this.primaryFireCheckLength).setOrigin(0.5,1);
    this.physics.add.existing(this.primaryFireTrigger);
    
    // << ROCKET FIRE >>
    this.rocket = new Rocket(scene, this, this.x, this.y, 'rocket_fire').setOrigin(0.5);
    this.physics.add.existing(this.rocket);

  //#endregion
  }
  
  /* ========================================================================================
                      UPDATE
  ======================================================== */

  update(time) {

    //#region << UPDATE CAMERA >>
    if (this.scene.currLevelState.name == "play")
    {

      // avoid 'half' pixels
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);

      // Update the camera target position based on the player's position
      this.cameraTarget.lerp(new Phaser.Math.Vector2(this.x, this.y), 0.1);

      // follow the midpoint between the rocket and ship with the main camera
      if (this.currentState.name == "rocket_fire") {
          const rocket = this.rocket;
          const midpointX = (this.x + rocket.x) / 2;
          const midpointY = (this.y + rocket.y) / 2;

          // Update the camera target position based on the player's position
          this.cameraTarget.lerp(new Phaser.Math.Vector2(midpointX, midpointY), 0.5);
      }

      // constrain the camera target within the world bounds
      this.cameraTarget.x = Phaser.Math.Clamp(this.cameraTarget.x, this.scene.world.cam_bounds.left, this.scene.world.cam_bounds.right);
      this.cameraTarget.y = Phaser.Math.Clamp(this.cameraTarget.y, this.scene.world.cam_bounds.top, this.scene.world.cam_bounds.bottom);

    }

    //#endregion
    
    //#region << GIZMOS >>
    if (gizmosActive)
    {
      this.gizmos.updateText(this.stateText, this.x, this.y + this.height + 10, this.currentState.name)
      this.gizmos.updateText(this.posText, this.x, this.y - this.height, Math.floor(this.x) + " " + Math.floor(this.y));
      this.gizmos.updateText(this.rocketText, this.rocket.x, this.rocket.y + this.rocket.height, this.rocket.currentState.name, color_pal.green);
      this.gizmos.updateText(this.camTargetText, this.cameraTarget.x, this.cameraTarget.y, "cam-tgt", color_pal.blue);

      
    }
    //#endregion

    // check for dodge
    if (!this.dodgeKey.isDown && this.dodgeUsed) { this.dodgeUsed = false; }

    // set fire trigger position
    this.primaryFireTrigger.setPosition(this.x, this.y);

    // check for explosion
    if (this.rocket.currentState.name == 'explode' && this.currentState == this.states.ROCKET_FIRE) {
      this.states.MOVE.enter();
    }

    // check for fire
    this.rocket.currentState.update(this.moveLeft.isDown, this.moveRight.isDown);
    this.currentState.update();
  }
  
  primary_fire() {

    if (!this.primaryActive) {return;}

    if (this.scene.time.now < this.lastFired + this.primaryFireDelay) return; 
    this.lastFired = this.scene.time.now;


    this.bullets.fire(this.scene, this.x, this.y);
  }

}
         
  