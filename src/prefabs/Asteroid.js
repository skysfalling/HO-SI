class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, spawnpoint, endpoint, velocity, texture = 'asteroid'){
        super(scene, spawnpoint, endpoint, velocity, texture);
        this.soundManager = SoundManager.getInstance(this);
        this.scene = scene;
        scene.add.existing(this);   // add to existing, displayList, updateList
        scene.physics.add.existing(this); // add to physics

        this.group = group;
        this.group.add(this);

        this.spawnpoint = spawnpoint;
        this.endpoint = endpoint;
        this.x = spawnpoint.x;
        this.y = spawnpoint.y;

        // set velocity
        this.body.velocity.x = velocity.x;
        this.body.velocity.y = velocity.y;

        // asteroid rotation
        this.rotationForce = 100;
        this.setAngle(0);

        // set colliders
        this.body.setSize(64, 64); // sets collider size
        this.body.setOffset(0, 0); // makes image center

        // Set the texture for the sprite
        // Create animations


        this.setTexture(texture);
    }
}

class AsteroidGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene, spawner, spawnpoints, endpoints, velocity_duration = 5, maxDelay = 1000, texture = 'asteroid'){
        super(scene.physics.world, scene);
        this.scene = scene;
        this.spawner = spawner;
        this.texture = texture;
        scene.physics.add.existing(this);

        this.spawnpoints = spawnpoints;
        this.endpoints = endpoints;

        this.maxDelay = maxDelay;
        this.velocity_duration = velocity_duration;
    }
    //new func (set up config) takes in var "config:" sets all vals

    spawnNew(spawnpointIndex, endpointIndex, velocity_duration = this.velocity_duration)
    {
        // << DELAY NEW SPAWN >>
        // Delayed call to set spawn velocity
        const delay = Phaser.Math.Between(100, this.maxDelay);
        this.scene.time.delayedCall(delay, () => {

            // calculate the necessary velocity
            let velocity = this.spawner.calculateVelocity(this.spawnpoints[spawnpointIndex], this.endpoints[endpointIndex], velocity_duration);

            // asteroid velocity
            const asteroid = new Asteroid(this.scene, this, this.spawnpoints[spawnpointIndex], this.endpoints[endpointIndex], this.texture);
            asteroid.body.velocity.x = velocity.x;
            asteroid.body.velocity.y = velocity.y;

            //console.log("spawned new object: " + JSON.stringify(asteroid));

        }, [], this);
    }

    spawnNewRandom ()
    {
        // << DELAY NEW SPAWN >>
        // Delayed call to set spawn velocity
        const delay = Phaser.Math.Between(100, this.maxDelay);
        this.scene.time.delayedCall(delay, () => {
        
            // get random spawnpoint
            let spawnpoint = this.spawner.getRandomPoint(this.spawnpoints);

            // get random point from the second list
            let endpoint = this.spawner.getRandomPoint(this.endpoints);

            // calculate the necessary velocity
            let velocity = this.spawner.calculateVelocity(spawnpoint, endpoint, this.velocity_duration);

            // asteroid velocity
            const asteroid = new Asteroid(this.scene, this, spawnpoint, endpoint, this.texture);
            asteroid.body.velocity.x = velocity.x;
            asteroid.body.velocity.y = velocity.y;

        }, [], this);
    }

    reset(asteroid)
    {
        //<< RESET ASTEROID >>
        asteroid.setActive(false);
        asteroid.setVisible(false);

        // make em EXPLODE!!!!
        const emitter = this.scene.add.particles(asteroid.x, asteroid.y, 'asteriodParticle', {
            lifespan: 500,
            speed: { min: 150, max: 250 },
            scale: { start: 0.8, end: 0 },
            gravityY: 150,
            emitting: false
        });
        emitter.explode(16);
        
        asteroid.body.velocity.x = 0;
        asteroid.body.velocity.y = 0;

        // move asteroid
        asteroid.x = asteroid.spawnpoint.x;
        asteroid.y = asteroid.spawnpoint.y;

        // << DELAY NEW SPAWN >>
        // Delayed call to set spawn velocity
        const delay = Phaser.Math.Between(100, this.maxDelay);
        this.scene.time.delayedCall(delay, () => {
        //<< SET SPAWN VELOCITY >>
            let velocity = this.spawner.calculateVelocity(asteroid.spawnpoint, asteroid.endpoint, this.velocity_duration);
            asteroid.body.velocity.x = velocity.x;
            asteroid.body.velocity.y = velocity.y;
            asteroid.setActive(true);
            asteroid.setVisible(true);

        }, [], this);
    }

    resetRandom(asteroid){

        //<< RESET ASTEROID >>
        asteroid.setActive(false);
        asteroid.setVisible(false);
        asteroid.body.velocity.x = 0;
        asteroid.body.velocity.y = 0;

        // get random spawnpoint
        let spawnpoint = this.spawner.getRandomPoint(this.spawnpoints);

        // get random point from the second list
        let endpoint = this.spawner.getRandomPoint(this.endpoints);

        // set points
        asteroid.spawnpoint = spawnpoint;
        asteroid.endpoint = endpoint;

        // move asteroid
        asteroid.x = spawnpoint.x;
        asteroid.y = spawnpoint.y;

        // << DELAY NEW SPAWN >>
        // Delayed call to set spawn velocity
        const delay = Phaser.Math.Between(100, this.maxDelay);
        this.scene.time.delayedCall(delay, () => {
        //<< SET SPAWN VELOCITY >>
            let velocity = this.spawner.calculateVelocity(spawnpoint, endpoint, this.velocity_duration);
            asteroid.body.velocity.x = velocity.x;
            asteroid.body.velocity.y = velocity.y;
            asteroid.setActive(true);
            asteroid.setVisible(true);

        }, [], this);
    }

    
}
