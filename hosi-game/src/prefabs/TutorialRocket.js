// Rocket prefab
class TutorialRocket extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.soundManager = SoundManager.getInstance(this);
        this.scene = scene;
        scene.add.existing(this);   // add to existing, displayList, updateList
        this.scene.physics.add.existing(this) // add to physics
        this.body.setCollideWorldBounds(false);
        this.gizmos = new Gizmos(scene);

        this.startPos = {x: x, y: y};

        this.aimMoveSpeed = 2;         // pixels per frame
        this.rocketForce = 400;         // pixels per frame
        this.rocketRotationForce = 20;
        this.explode_delay = 3000;
        this.reset_delay = 500;

        this.tutorialOver = false;

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
        });

        // Initialize state machine
        this.states = {
            FIRE: {
                name: "fire",
                enter: () => {
                    this.body.setVelocityY(-100);
                    this.soundManager.play('sfx_rocket',{volume: 0.1});
                    this.currentState = this.states.FIRE;
                    this.anims.play('fire');

                    this.timed_explosion();
                },
                update: () => {
                    // Move the rocket
                    if (this.body && this.body.velocity) {
                        this.scene.physics.velocityFromAngle(this.angle - 90, this.rocketForce, this.body.velocity); 

                        // Aim the rocket based on user input
                        if (keyLEFT.isDown) {
                            this.body.setAngularVelocity(this.body.angularVelocity - this.rocketRotationForce);
                        } else if (keyRIGHT.isDown) {
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
                    this.setPosition(this.startPos.x , this.startPos.y);
                    this.setRotation(0);
                },
                update: () => {
                    if(keyF.isDown) {
                        this.states.FIRE.enter();
                    }
                }
            },
            EXPLODE: {
                name: "explode",
                enter: () => {
                    this.currentState = this.states.EXPLODE;
                    this.anims.play('explode');
                    this.body.stop();
                    this.scene.time.addEvent({
                        delay: this.reset_delay,
                        callback: () => {
                            this.reset();
                        },
                        loop: false
                    });
                },
                update: () =>{}
            }
        };
        this.states.IDLE.enter();
        
        this.stateText = this.gizmos.createText(this.x, this.y, this.currentState.name, color_pal.green);

    }

    update() {
        // avoid 'half' pixels
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);

        if (this.currentState)
        {
            this.currentState.update();
        }

        this.gizmos.updateText(this.stateText, this.x, this.y + this.height, this.currentState.name, color_pal.green);
    }

    timed_explosion(){
        this.scene.time.addEvent({
            delay: this.explode_delay,
            callback: () => {
                if (this.currentState == this.states.FIRE)
                {
                    this.states.EXPLODE.enter();
                }
            },
            loop: false
        });
    }

    reset() {
        this.scene.time.addEvent({
            delay: this.reset_delay,
            callback: () => {

                if (this.tutorialOver == true) {
                    this.destroy; 
                    this.anims.stop('explode'); // Stop the explode animation
                    this.setActive(false);
                    this.setVisible(false);
                    this.setPosition(this.startPos.x, this.startPos.y);
                    return;
                }

                this.setActive(true);
                this.setVisible(true);
                this.states.IDLE.enter();
            },
            loop: false
        });
    }
}