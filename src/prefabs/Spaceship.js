// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, name, x, y, texture, frame, points = 10, moveSpeed = 100, spawnRange = 50, debug_color = 0xff0000) {
        super(scene, x, y, texture, frame, moveSpeed);
        scene.add.existing(this);   // add to existing scene
        scene.physics.add.existing(this);  // add to physics scene
        this.soundManager = SoundManager.getInstance(this);
        this.name = name;
        this.scene = scene;
        this.graphics = this.scene.add.graphics();
        this.gizmos = new Gizmos(this.scene, this.graphics);
        this.debug_color = debug_color;
        this.showGizmos = false;

        this.points = points;
        this.moveSpeed = moveSpeed;
        this.spawnRange = spawnRange; 

        // active position
        this.x = Math.floor(x);
        this.y = Math.floor(y);

        // start position
        this.startX = this.x;
        this.startY = this.y;

        // start scale / rotation
        this.setScale(2);
        this.setAngle(-90);

        // death state
        this.dead = false;

        // spaceship fly animation config
        this.anims.create({
            key: 'spaceship_fly',
            frames: this.anims.generateFrameNumbers('spaceship_fly', { 
                start: 0, 
                end: 2, 
                first: 0
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.play('spaceship_fly');  // play fly animation

        // create name text
        this.gizmos.nameText = this.gizmos.createText(this.x, this.y + this.height, this.name, 10, 15)

        //console.log(this.startX, this.startX - screen.width, this.startY, this.spawnRange, color_pal.toInt("pink"));
    }

    update(time, deltaTime) {
        this.graphics.clear();

        if (!this.dead) {
            // move up and down in range
            const yVelocity = Math.sin(this.x / 50) * this.spawnRange / 4;
            this.body.setVelocity(-this.moveSpeed, yVelocity);
        }
        else { this.body.setVelocity(0, 0); }

        // update name text
        this.gizmos.updateText(this.gizmos.nameText, this.x, this.y + this.height, this.name, 10, 15)

        if (this.scene.showGizmos)
        {
            // show spawn range
            this.gizmos.horzlineRange(this.startX - screen.width, this.startX, this.startY, this.spawnRange, this.debug_color);
        }

        // 'kill' spaceship once hits right edge
        if(this.x <= 0 && !this.dead) {
            
            this.dead = true;
            this.reset();
        }
    }

    // position reset
    reset() {

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
