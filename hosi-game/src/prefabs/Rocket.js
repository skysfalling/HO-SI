// Rocket prefab
class Rocket extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, ship, x, y, texture, frame) {
        super(scene, ship, x, y, texture, frame);

        this.scene = scene;
        this.ship = ship;
        scene.add.existing(this);   // add to existing, displayList, updateList
        this.ship.physics.add.existing(this) // add to physics
        this.body.setCollideWorldBounds(true);


        this.gizmos = new Gizmos(this.scene);

        this.setDepth(2);
        this.setScale(1);

        this.aimMoveSpeed = 2;         // pixels per frame
        this.rocketForce = 400;         // pixels per frame
        this.rocketRotationForce = 20;

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
        this.anims.play('fire');            
        
        // explode animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 8,
        });

        // << TEXT GIZMO >>
        this.stateText = this.gizmos.createText(0, 0, 'state');
        this.posText = this.gizmos.createText(0, 0, 'pos');

        // Initialize state machine
        this.states = {
            FIRE: {
                name: "fire",
                enter: () => {
                    this.sfxRocket.play({volume: 0.1});
                    this.currentState = this.states.FIRE;
                    this.play('fire');
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
                    this.play('fire');
                },
                update: () =>{
                    this.setPosition(this.ship.x , this.ship.y + this.ship.height);
                }
            },
            EXPLODE: {
                name: "explode",
                enter: () => {
                    this.currentState = this.states.EXPLODE;
                    this.play('explode');
                    this.body.stop();
                    this.setRotation(0);
                    this.reset();

                    console.log('rocket-explode');
                },
                update: () =>{}
            }
        };

        // Set initial state
        this.currentState = this.states.IDLE;

        this.scene.events.on('update', () => {
            if(!this.scene.physics.world.bounds.contains(this.x + format.margin, this.y + format.margin)) {
                this.states.EXPLODE.enter();
            }
        })

    }

    update() {
        this.currentState.update();

        this.gizmos.updateText(this.stateText, this.x, this.y + this.height, this.currentState.name)
        this.gizmos.updateText(this.posText, this.x, this.y - this.height, Math.floor(this.x) + " " + Math.floor(this.y));
    }

    reset() {
        this.setActive(false);
        this.setVisible(false);
        this.scene.time.addEvent({
            delay: 500,
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
