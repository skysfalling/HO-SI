class HamsterShip extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    // Set up physics and initial properties
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.setDepth(1);
    this.dodging = false;
    this.rocketActive = false;d

    // Define the arrow key movement controls
    this.moveUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.moveDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.moveLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.moveRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    // Define the D dodge key control
    this.dodgeKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // Define the F rocket fire key control
    this.rocketKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    // Set up an event to automatically fire primary weapons when enemies are nearby
    scene.events.on('update', () => {
      if (!this.rocketActive && !this.dodging) {
        const nearbyEnemies = scene.enemies.getChildren().some(enemy => {
          const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
          return distance < 200;
        });
        if (nearbyEnemies) {
          this.emit('primary-fire');
        }
      }
    });
  
  
  
  }
  
  update() {

    // Handle arrow key movement controls
    if (!this.dodging) {
      if (this.moveUp.isDown) {
        this.body.setVelocityY(-200);
      } else if (this.moveDown.isDown) {
        this.body.setVelocityY(200);
      } else {
        this.body.setVelocityY(0);
      }

      if (this.moveLeft.isDown) {
        this.body.setVelocityX(-200);
      } else if (this.moveRight.isDown) {
        this.body.setVelocityX(200);
      } else {
        this.body.setVelocityX(0);
      }
    }

    // Handle dodge control
    if (Phaser.Input.Keyboard.JustDown(this.dodgeKey) && !this.rocketActive) {
      this.dodge();
    }

    // Handle rocket fire control
    if (Phaser.Input.Keyboard.JustDown(this.rocketKey) && !this.dodging) {
      this.fireRocket();
    }
  }
  
  dodge() {
    if (!this.dodging) {
      this.dodging = true;
      this.body.setVelocityX(400);
      this.setTint(0x999999);
      this.emit('dodging');

      this.scene.time.addEvent({
        delay: 500,
        callback: () => {
          this.dodging = false;
          this.body.setVelocityX(0);
          this.clearTint();
        },
        loop: false
      });
    }
  }
  
}
         
  