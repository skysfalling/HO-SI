// Simple Rocket prefab
class TutorialRocket extends Phaser.GameObjects.Sprite{
    constructor(scene, x,y, texture, frame){
        super(scene, x,y,texture,frame);
        this.soundManager = SoundManager.getInstance(this);
        // add object to exisiting scene
        scene.add.existing(this);   // add to existing, displayList, updateList
        this.isFiring = false;      // track rockets firing status
        this.moveSpeed = 2;         // pixels per frame
        //this.sfxRocket = scene.sound.add('sfx_rocket');

        scene.physics.add.existing(this);  // add to physics scene
        this.rocketRotationForce = 20;
    }

    update(){
         // left/right movement
         if(!this.isFiring) {
            if(keyLEFT.isDown) {
                //this.rotation--;    // i def need to do a physics thing there ugh
            } else if (keyRIGHT.isDown) {
                //this.rotation++;
            }
        }
        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.soundManager.play('sfx_rocket');
        }
        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
            this.y -= this.moveSpeed;
        }
        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    reset(){
        this.isFiring = false;
        this.y = game.config.height - 100;
        this.x = game.config.width/2;
    }
}