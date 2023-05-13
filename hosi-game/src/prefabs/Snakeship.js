class Snakeship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, spawnpoint, endPosRect, texture = 'greenSnakeShip') {
        super(scene, spawnpoint.x, spawnpoint.y, texture);

        this.scene = scene;
        scene.add.existing(this);   // add to existing, displayList, updateList
        scene.physics.add.existing(this); // add to physics

        this.soundManager = SoundManager.getInstance(this); // get singleton instance

        this.gizmos = new Gizmos(scene); // gizmos instance
        this.gizmos.graphics.setDepth(2);

        this.group; // store group
        this.setDepth(2);

        this.body.setSize(64, 64); // sets collider size
        this.body.setOffset(0, 0); // makes image center

        // target positions
        this.spawnpoint = spawnpoint;
        this.endPosRect = endPosRect;
        this.endpoint = null;

        // ship rotation
        this.rotationOffset = -90;
        this.body.setAllowGravity(false);

        // << STATE VARIABLES >>
        // SPAWN state
        this.spawnDelay = 1000;
        this.spawnDuration = 2000;

        // ATTACK state
        this.attackRange = 30; // Distance threshold to switch to ATTACK state
        this.strafeDelay = 1000;
        this.strafeVelocity = 100;

        // bullet values
        this.primaryFireDelay = 2000;
        this.bullets = new BulletGroup(this.scene);
        this.bulletVelocity = {x: 0, y: 200};

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
        this.anims.play('greenSnakeShip');

        this.states = {
            SPAWN: {
              name: "spawn",
              enter: (velocity) => {
                this.currentState = this.states.SPAWN;

                // snakeship init velocity
                this.body.velocity.x = velocity.x;
                this.body.velocity.y = velocity.y;

                this.setVisible(true);
                this.setActive(true);

              },
              update: () => {
                if (this.checkAttackRange()) {
                  this.states.ATTACK.enter();
                }

                if (this.endpoint)
                {
                  // << ROTATE BODY TOWARDS ENDPOINT >>
                  // Get the angle between the current velocity and the x-axis
                  const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, this.endpoint.x, this.endpoint.y);

                  // Set the rotation of the body to face the velocity
                  this.body.rotation = targetAngle + this.rotationOffset;
                }
              }
            },
            ATTACK: {
              name: "attack",
              enter: () => {
                this.currentState = this.states.ATTACK;

                // Fire Bullets Loop
                this.fireLoop = this.scene.time.addEvent({
                    delay: this.primaryFireDelay,
                    callback: () => {
                      this.bullets.fire(this.scene, this.x, this.y, this.bulletVelocity);
                    },
                    callbackScope: this,
                    loop: true
                  });

                // Strafe Loop
                this.body.setVelocity(0);
                this.strafeTween = this.scene.tweens.add({
                    targets: this.body.velocity,
                    x: { from: -this.strafeVelocity, to: this.strafeVelocity }, // Move between -200 and 200
                    y: 0,
                    duration: 750,
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

                //#region << RESET POSITION OF SHIP >>
                this.setActive(false);
                this.setVisible(false);

                // get random spawnpoint
                let spawnpoint = this.spawner.getRandomPoint(this.group.spawnpoints);

                // get random point from the second list
                let endpoint = Phaser.Geom.Rectangle.Random(this.group.endPosRect);

                // set points
                this.spawnpoint = spawnpoint;
                this.endpoint = endpoint;

                // move ship
                this.x = spawnpoint.x;
                this.y = spawnpoint.y;
                this.body.setVelocity(0); // kill velocity
                //#endregion

                // << KILL LOOPS >>
                if (this.strafeTween) {
                    this.strafeTween.destroy();
                }
                if (this.fireLoop) {
                    this.fireLoop.destroy();
                }

                // << DELAY NEW SPAWN >>
                // Delayed call to set spawn velocity
                const delay = 2000; // Delay in milliseconds
                this.scene.time.delayedCall(delay, () => {
                //<< SET SPAWN VELOCITY >>
                    let velocity = this.spawner.calculateVelocity(spawnpoint, endpoint, 1);
                    this.states.SPAWN.enter(velocity);
                }, [], this);

              },
              update: () => {}
            }
        };

        if (this.currentState)
        {
          this.stateText = this.gizmos.createText(this.x, this.y + this.height, this.currentState.name, color_pal.toInt("green"));
        } else {        
          this.stateText = this.gizmos.createText(this.x, this.y + this.height, "null state", color_pal.toInt("green"));
        }

        this.scene.events.on('update', this.update, this);
    }

    update(){
        this.currentState.update();

        if (gizmosActive && this.endpoint)
        {
            this.gizmos.graphics.clear();
            this.gizmos.drawCircle(this.endpoint.x, this.endpoint.y, this.attackRange, 0xff0000, 0, 3);
            this.gizmos.drawLine(this.spawnpoint, this.endpoint, 0xff0000);
            this.gizmos.updateText(this.stateText, this.x, this.y - this.height, this.currentState.name, color_pal.green);
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
        snakeship.states.RESET.enter();
    }

    reset(snakeship) {
        snakeship.states.RESET.enter();
    }
}

