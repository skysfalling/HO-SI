// Rocket prefab
class Rocket extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, ship, x, y, texture, frame) {
        super(scene, ship, x, y, texture, frame);

        this.scene = scene;
        this.ship = ship;
        scene.add.existing(this);   // add to existing, displayList, updateList
        this.ship.physics.add.existing(this) // add to physics
        this.body.setCollideWorldBounds(false);

        this.gizmos = new Gizmos(scene);

        this.setDepth(2);
        this.setScale(1);

        this.aimMoveSpeed = 2;         // pixels per frame
        this.rocketForce = 400;         // pixels per frame
        this.rocketRotationForce = 20;
        this.explode_delay = 2000;
        this.reset_delay = 1000;

        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
        
        // rocket fly animation config
        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('rocket_fire', { 
                start: 0, 
                end: 1, 
                first: 0
            }),
            frameRate: 8,
            repeat: -1
        });
        
        // explode animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 8,
            repeat: -1
        });

        // Initialize state machine
        this.states = {
            FIRE: {
                name: "fire",
                enter: () => {
                    this.body.setVelocityY(-100);
                    this.sfxRocket.play({volume: 0.1});
                    this.currentState = this.states.FIRE;
                    this.anims.play('fire');

                    this.timed_explosion();
                },
                update: (leftDown, rightDown) => {
                    // Move the rocket
                    if (this.body && this.body.velocity) {
                        this.scene.physics.velocityFromAngle(this.angle - 90, this.rocketForce, this.body.velocity); 

                        // Aim the rocket based on user input
                        if (leftDown) {
                            this.body.setAngularVelocity(this.body.angularVelocity - this.rocketRotationForce);
                        } else if (rightDown) {
                            this.body.setAngularVelocity(this.body.angularVelocity + this.rocketRotationForce);
                        } else {
                            this.body.setAngularVelocity(Phaser.Math.Linear(this.body.angularVelocity, 0, 0.1));
                        }
                      }
                }
            },
            IDLE: {
                name: "idle",
                enter: () => {
                    this.currentState = this.states.IDLE;
                    this.anims.play('fire');
                    this.setPosition(this.ship.x , this.ship.y + this.ship.height);

                },
                update: () =>{
                    this.setPosition(this.ship.x , this.ship.y + this.ship.height);
                }
            },
            EXPLODE: {
                name: "explode",
                enter: () => {
                    this.currentState = this.states.EXPLODE;
                    this.anims.play('explode');
                    this.body.stop();
                    this.setRotation(0);
                    this.scene.time.addEvent({
                        delay: this.reset_delay,
                        callback: () => {
                            this.reset();
                        },
                        loop: false
                    });

                    console.log('rocket-explode');
                },
                update: () =>{}
            }
        };

        // Set initial state
        this.states.IDLE.enter();
            

    }

    update() {
        this.currentState.update();
    }

    timed_explosion(){
        this.scene.time.addEvent({
            delay: this.explode_delay,
            callback: () => {
                this.states.EXPLODE.enter();
            },
            loop: false
        });
    }

    reset() {
        this.setActive(false);
        this.setVisible(false);
        this.scene.time.addEvent({
            delay: this.reset_delay,
            callback: () => {
                this.scene.children.add(this);
                this.setActive(true);
                this.setVisible(true);
                this.x = this.ship.x;
                this.y = this.ship.y;
                this.states.IDLE.enter();
            },
            loop: false
        });
    }
}
