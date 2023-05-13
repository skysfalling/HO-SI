class Snakeship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, spawnpoint, endPosRect, texture = 'greenSnakeShip') {
        super(scene, spawnpoint.x, spawnpoint.y, texture);

        this.soundManager = SoundManager.getInstance(this);
        this.scene = scene;
        scene.add.existing(this);   // add to existing, displayList, updateList
        scene.physics.add.existing(this); // add to physics

        this.gizmos = new Gizmos(scene);
        this.gizmos.graphics.setDepth(2);

        this.spawnpoint = spawnpoint;
        this.endPosRect = endPosRect;
        this.endpoint = null;

        this.state = 'SPAWN'; // Initial state
        this.attackRange = 30; // Distance threshold to switch to ATTACK state
        

        this.strafeDelay = 1000;
        this.strafeVelocity = 100;

        
        this.primaryFireDelay = 3000;
        this.lastFired;
        this.bullets = new BulletGroup(this.scene);
        this.bulletVelocity = {x: 0, y: 200};

        // ship rotation
        this.setAngle(-90);
        this.body.setAllowGravity(false);

        this.group;
        this.setDepth(2);

        this.body.setSize(64, 64); // sets collider size
        this.body.setOffset(0, 0); // makes image center

        // Create animations
        this.anims.create({
            key: 'greenSnakeShip',
            frames: [
                { key: 'textureAtlasKey', frame: 'greenSnakeShip0' },
                { key: 'textureAtlasKey', frame: 'greenSnakeShip1' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // Play the animation
        this.anims.play('greenSnakeShip');

        this.states = {
            SPAWN: {
              name: "spawn",
              enter: () => {
                this.currentState = this.states.SPAWN;

                // << ROTATE BODY TOWARDS VELOCITY >>
                // Get the angle between the current velocity and the x-axis
                const angle = Phaser.Math.Angle.Between(0, 0, this.body.velocity.x, this.body.velocity.y);

                // Convert the angle to degrees
                const angleDegrees = Phaser.Math.RadToDeg(angle);

                // Set the rotation of the body to face the velocity
                this.body.rotation = angleDegrees;
              },
              update: () => {
                if (this.checkAttackRange()) {
                  this.states.ATTACK.enter();
                }
              }
            },
            ATTACK: {
              name: "attack",
              enter: () => {
                this.currentState = this.states.ATTACK;
                // Start firing bullets
                this.fireLoop = this.scene.time.addEvent({
                    delay: this.primaryFireDelay,
                    callback: () => {
                      this.bullets.fire(this.scene, this.x, this.y, this.bulletVelocity);
                    },
                    callbackScope: this,
                    loop: true
                  });

                // strafe
                this.strafeTween = this.scene.tweens.add({
                    targets: this.body.velocity,
                    x: { from: -this.strafeVelocity, to: this.strafeVelocity }, // Move between -200 and 200
                    y: 0,
                    duration: 500,
                    ease: 'Linear',
                    repeat: -1, // Repeat indefinitely
                    yoyo: true, // Reverse the movement
                });

              },
              update: () => {}
            },

            RESET: {
              name: "reset",
              enter: () => {
                this.currentState = this.states.RESET;
                if (this.strafeTween) {
                    this.strafeTween.destroy();
                }
                if (this.fireLoop) {
                    this.fireLoop.destroy();
                }

                this.body.setVelocity(0);
                // Delayed call to set spawn velocity
                const delay = 2000; // Delay in milliseconds

                this.scene.time.delayedCall(delay, () => {
                //#region << SET SPAWN VELOCITY >>
                    // get random spawnpoint
                    let spawnpoint = this.spawner.getRandomPoint(this.group.spawnpoints);

                    // get random point from the second list
                    let endpoint = Phaser.Geom.Rectangle.Random(this.group.endPosRect);

                    // set points
                    this.spawnpoint = spawnpoint;
                    this.endpoint = endpoint;

                    this.x = spawnpoint.x;
                    this.y = spawnpoint.y;

                    let velocity = this.spawner.calculateVelocity(spawnpoint, endpoint, 1);

                    // snakeship velocity
                    this.body.velocity.x = velocity.x;
                    this.body.velocity.y = velocity.y;
                //#endregion
                }, [], this);

              },
              update: () => {}
            }
        };

        
        this.currentState = this.states.SPAWN;
        this.currentState.enter();

        this.scene.events.on('update', this.update, this);
    }

    update(){
        this.currentState.update();




        if (gizmosActive && this.endpoint)
        {
            this.gizmos.graphics.clear();
            this.gizmos.drawCircle(this.endpoint.x, this.endpoint.y, this.attackRange, 0xff0000, 0, 3);
            this.gizmos.drawLine(this.spawnpoint, this.endpoint, 0xff0000);
        }
    }


    checkAttackRange() {
        if (this.endpoint)
        {
            // Calculate the distance to the endpoint
            const distance = Phaser.Math.Distance.Between(this.x, this.y, this.endpoint.x, this.endpoint.y);
        
            // Check if the ship is within the attack range
            return distance <= this.attackRange;
        }
    }

}

class SnakeshipGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene, spawner, spawnpoints, endPosRect, defaultVelocity = { x: 0, y: 100 }, texture = 'greenSnakeShip') {
        super(scene.physics.world, scene);
        this.scene = scene;
        this.spawner = spawner;
        this.texture = texture;
        scene.physics.add.existing(this);

        this.defaultVelocity = { x: 0, y: 100 };

        this.spawnpoints = spawnpoints;
        this.endPosRect = endPosRect;

        console.log("new snakeship group: " + JSON.stringify(this.spawnpoints) + " -> " + JSON.stringify(this.endPosRect));
    }

    spawnNewRandom(velocity = this.defaultVelocity) {

        // get random spawnpoint
        let spawnpoint = this.spawner.getRandomPoint(this.spawnpoints);

        // create new snakeship
        const snakeship = new Snakeship(this.scene, spawnpoint, this.endPosRect, this.texture);
        this.add(snakeship);
        snakeship.group = this;
        snakeship.spawner = this.spawner;

        // get random point from the second list
        let endpoint = Phaser.Geom.Rectangle.Random(this.endPosRect);
        snakeship.endpoint = endpoint;

        velocity = this.spawner.calculateVelocity(spawnpoint, endpoint, 1);

        //console.log("new random snakeship: " + JSON.stringify(spawnpoint) + " -> " + JSON.stringify(endpoint));
        //console.log(" ++ new random snakeship velocity: " + JSON.stringify(velocity));

        // snakeship velocity
        snakeship.body.velocity.x = velocity.x;
        snakeship.body.velocity.y = velocity.y;
    }

    reset(snakeship) {



        snakeship.states.RESET.enter();




    }
}

