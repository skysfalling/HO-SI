class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, spawnpoint, texture){
        super(scene, spawnpoint, texture);

        this.scene = scene;
        scene.add.existing(this);   // add to existing, displayList, updateList
        scene.physics.add.existing(this) // add to physics

        this.spawnpoint = spawnpoint;
        this.x = spawnpoint.x;
        this.y = spawnpoint.y;
        console.log("new asteroid: " + this.spawnpoint.x + this.spawnpoint.y);

        // asteroid rotation
        this.rotationForce = 100;
        this.setAngle(0);
        this.body.setAngularVelocity(this.rotationForce); 
        

        this.anims.create({
            key: 'asteroid',
            frames: scene.anims.generateFrameNumbers('asteroid', { 
                start: 0, 
                end: 1, 
                first: 0
            }),
            frameRate: 8,
            repeat: -1
          });
        this.anims.play('asteroid');

        /*
        if (this.spawnpoint && this.resetPoint){
            const angle = Phaser.Math.Angle.BetweenPoints(this.spawnPoint, this.resetPoint);
            this.setAngle(Phaser.Math.RadToDeg(angle));
            
            const velocityX = this.velocity * Math.cos(angle);
            const velocityY = this.velocity * Math.sin(angle);
            this.setVelocity(velocityX, velocityY);
        }
        */

        this.reaction = {
            EXLPODE: {
                anim: () => {
                    console.log("Asteroid Explode");
                }
            }


        }
    }

    explode(){
    }
}

class AsteroidGroup extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene);
        this.scene = scene;
    }

    spawn (spawnpoint, texture)
    {
        console.log(JSON.stringify(spawnpoint));

        const asteroid = new Asteroid(this.scene, spawnpoint, texture);
        this.scene.asteroids.add(asteroid);

    }
}