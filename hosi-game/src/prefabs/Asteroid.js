//Asteroid Prefab
class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, startPoint, resetPoint, texture, velocity = 200){
        super(scene, startPoint, resetPoint, texture, velocity);

        this.scene = scene;
        scene.add.existing(this);   // add to existing, displayList, updateList
        scene.physics.add.existing(this) // add to physics
        this.gizmos = new Gizmos(this.scene);

        this.velocity = velocity;
        this.rotationForce = 2;

        // start position
        this.spawnPoint = startPoint; // {x, y}
        this.resetPoint = resetPoint; // {x, y}

        this.setScale(3);
        this.setAngle(0);
        
        const angle = Phaser.Math.Angle.BetweenPoints(this.spawnPoint, endPoint);
        this.setAngle(Phaser.Math.RadToDeg(angle));
        
        const velocityX = this.velocity * Math.cos(angle);
        const velocityY = this.velocity * Math.sin(angle);
        this.setVelocity(velocityX, velocityY);

    }

    // ========================================================================================= /// **
    //                          UPDATE
    // ==================================================================/// >>> 


    update(){

        //rotates da asteroid
        this.body.setAngularVelocity(this.body.angularVelocity + this.rotationForce); 
        

    }

    respawn(){

        // disable
        this.setActive(false);
        this.setVisible(false);

        // get random height inside spawn range
        let min = - this.spawnRange / 2;
        let max = this.spawnRange / 2;
        let randomHeight = Math.floor(Math.random() * (max - min + 1)) + min;
        this.x = this.startX;
        this.y = this.startY + randomHeight;

        // get random spawn delay
        let minDelay = 500; // minimum delay of 0.5 second
        let maxDelay = 1500; // maximum delay of 1.5 seconds
        let randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        // add random delay and height to start spawn
        this.scene.time.addEvent({
            delay: randomDelay,
            callback: () => {

                // enable
                this.setActive(true);
                this.setVisible(true);

                this.dead = false;
            },
            loop: false
        });
    }

}