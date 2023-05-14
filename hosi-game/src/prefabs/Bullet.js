class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.soundManager = SoundManager.getInstance(this);
    // Add the bullet to the game
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set the bullet's properties
    this.setScale(1);
    this.body.setAllowGravity(false);
    this.destroyDelay = 1000;

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

    // destroy after a period of time
    scene.time.delayedCall(
      this.destroyDelay, 
      () => {
        this.destroy();
      }, 
      [], this);
  }
}

class BulletGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.scale = 1;
    this.destroyDelay = 1000;
    this.angle = 90;
    this.velocity = {x: 0, y: 600}

  }

  fire (scene, x, y, velocity = this.velocity) {
    const bullet = new Bullet(scene, x, y, 'bullet');
    this.add(bullet);

    bullet.setScale(this.scale);
    bullet.destroyDelay = this.destroyDelay;
    bullet.setAngle(this.angle);

    bullet.body.setVelocityX(velocity.x);
    bullet.body.setVelocityY(velocity.y);
  }
}