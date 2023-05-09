class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

      // Add the bullet to the game
      scene.add.existing(this);
      scene.physics.add.existing(this);

      // Set the bullet's properties
      this.body.setAllowGravity(false);
      this.setScale(1);

      // Set the bullet's velocity
      this.bulletForce = -600;
      this.setVelocityY(this.bulletForce);

      this.setAngle(-90);
  }


}

class Bullets extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene);
    }

    fire (ship, x, y, texture)
    {

      // fire bullet
      const bullet = new Bullet(ship.scene, x, y, texture);

      bullet.anims.create({
        key: 'primary_fire',
        frames: ship.scene.anims.generateFrameNumbers("primary_fire", { 
            start: 0, 
            end: 3, 
            first: 0
        }),
        frameRate: 8,
        repeat: -1
      });
      bullet.anims.play('primary_fire');

      // handle overlap 
      ship.scene.physics.add.overlap(bullet, ship.scene.asteroids, (bullet, asteroid) => {
        bullet.destroy();
        asteroid.destroy();
      });

      ship.scene.physics.add.overlap(bullet, ship.scene.world, (bullet, world) => {
        console.log("bullet hit world");
        bullet.destroy();
      });
    
        
    }
}