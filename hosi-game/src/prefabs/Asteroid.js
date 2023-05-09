//Asteroid Prefab
class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, name, x, y, texture, frame, moveSpeed = 50, spawnRange = 50, debug_color = 0xffffff){
        super(scene, x, y, texture, frame, moveSpeed);

        scene.add.existing(this);   // add to existing, displayList, updateList
        scene.physics.add.existing(this) // add to physics
        //this.gizmos = new Gizmos(this.scene);

        this.name = name;
        this.scene = scene;
        this.graphics = this.scene.add.graphics();
        //this.gizmos = new Gizmos(this.scene, this.graphics);
        this.debug_color = debug_color;
        //this.showGizmos = false;

        //this.points = points;
        this.moveSpeed = moveSpeed;
        this.spawnRange = spawnRange;
        
        this.asteroidRotationForce = .2;

        // active position
        this.x = Math.floor(x);
        this.y = Math.floor(y);

        // start position
        this.startX = this.x;
        this.startY = this.y;
        this.ast_scale = 3;
        // start scale / rotation
        this.setScale(3);
        this.setAngle(0);

        // death state
        this.dead = false;

        // spaceship fly animation config
        /*this.anims.create({
            key: 'asteroid',
            frames: this.anims.generateFrameNumbers('asteroid', { 
                start: 0, 
                end: 1, 
                first: 0
            }),
            frameRate: 8,
            repeat: -1
        });
*/ 
        this.anims.create({
            key: 'ast',
            frames: this.anims.generateFrameNumbers('asteroid', {
                start: 0,
                end: 0,
                first: 0,
            }),
            frameRate: 8,
            repeat: -1,
        })
        this.anims.play('ast');
        //this.anims.play('asteroid');  // play fly animation
        this.anims.create({
            key: 'ast_explosion',
            frames: this.anims.generateFrameNumbers('asteroid', { 
                start: 0, 
                end: 4, 
                first: 0
            }),
            frameRate: 8,
            //repeat: 1,
        });

    }
    flipRotation(){ //makes da asteroid rotate the other direction
        this.asteroidRotationForce*=-1;
    }
    update(){
        //rotates da asteroid
        this.body.setAngularVelocity(this.body.angularVelocity + this.asteroidRotationForce); 
        if (!this.dead) {
            // move up and down in range
            const yVelocity = Math.sin(this.x / 50) * this.spawnRange / 4;
            this.body.setVelocity(-this.moveSpeed, yVelocity);
        }
        else { this.body.setVelocity(0, 0); }
        if(this.x <= 0 && !this.dead) {
            
            this.dead = true;
            this.respawn();
        }
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