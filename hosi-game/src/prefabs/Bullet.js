class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
      this.soundManager = SoundManager.getInstance(this);
      // Add the bullet to the game
      scene.add.existing(this);
      scene.physics.add.existing(this);

      // Set the bullet's properties
      this.setScale(1);

      // Set the bullet's velocity
      this.bulletForce = -600;
      this.setVelocityY(this.bulletForce);

      this.setAngle(-90);

      this.anims.create({
        key: 'primary_fire',
        frames: scene.anims.generateFrameNumbers("primary_fire", { 
            start: 0, 
            end: 3, 
            first: 0
        }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.play('primary_fire');

      // handle overlap 
      scene.physics.add.overlap(scene.asteroids, this, (asteroid, bullet) => {
        console.log("asteroid hit: " + JSON.stringify(asteroid));
    });

      // destroy after a period of time
      scene.time.delayedCall(
        2000, 
        () => {
          this.destroy();
        }, 
      [], this);
  }
}

class BulletGroup extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene);
    }

    fire (ship, x, y, texture)
    {
      // fire bullet
      const bullet = new Bullet(ship.scene, x, y, texture);
    }
}