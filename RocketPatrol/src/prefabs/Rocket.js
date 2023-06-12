// Rocket prefab
class Rocket extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add to existing, displayList, updateList
        scene.physics.add.existing(this) // add to physics
        this.gizmos = new Gizmos(this.scene);

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
        this.anims.play('fire');             // play explode animation


        // << TEXT GIZMO >>
        this.stateText = this.gizmos.createText(0, 0, 'state');
        this.posText = this.gizmos.createText(0, 0, 'pos');

        // Initialize state machine
        this.states = {
            AIM: {
                name: "aim",
                update: () => {
                    // left/right movement
                    if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                        this.x -= this.aimMoveSpeed;
                    } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                        this.x += this.aimMoveSpeed;
                    }

                    // Fire the rocket
                    if (keyF.isDown) {this.states.FIRE.enter();}

                    // Move the rocket
                    this.scene.physics.velocityFromRotation(0, 0, this.body.velocity);
                },
            },
            FIRE: {
                name: "fire",
                enter: () => {
                    this.sfxRocket.play();
                    this.currentState = this.states.FIRE;
                },
                update: () => {
                    // Move the rocket
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
            },
            FREEZE: {
                name: "freeze",
                enter: () => {
                    this.currentState = this.states.FREEZE;
                    this.body.setVelocity(0, 0);
                    this.body.setAngularVelocity(0);
                },
                update: () => {

                }
            }
        };

        // Set initial state
        this.currentState = this.states.AIM;
    }

    update() {
        this.currentState.update();

        this.gizmos.updateText(this.stateText, this.x, this.y + this.height, this.currentState.name)
        this.gizmos.updateText(this.posText, this.x, this.y - this.height, Math.floor(this.x) + " " + Math.floor(this.y));
    }

    reset() {
        this.setActive(false);
        this.setVisible(false);
        this.body.stop();
        this.setRotation(0);
        this.scene.time.addEvent({
            delay: 10,
            callback: () => {
                this.scene.children.add(this);
                this.setActive(true);
                this.setVisible(true);
                this.x = game.config.width / 2;
                this.y = game.config.height - borderUISize - borderPadding;
                this.currentState = this.states.AIM;
            },
            loop: false
        });

        this.state = this.states.AIM;
    }
}
