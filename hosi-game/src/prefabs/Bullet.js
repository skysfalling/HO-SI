class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
  
        // Add the bullet to the game
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set the bullet's properties
        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
        this.setScale(2);

        // Set the bullet's velocity
        this.bulletForce = -600;
        this.setVelocityY(this.bulletForce);

        this.setAngle(-90);

        this.body.onWorldBounds = true;
        this.body.world.on('worldbounds', (body) => {
            this.destroy();
        });
    }
  
  }