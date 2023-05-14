class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, spawnpoint, texture = 'asteroid'){
        super(scene, spawnpoint, texture);
        this.soundManager = SoundManager.getInstance(this);
        this.scene = scene;
        scene.add.existing(this);   // add to existing, displayList, updateList
        scene.physics.add.existing(this); // add to physics

        this.spawnpoint = spawnpoint;
        this.x = spawnpoint.x;
        this.y = spawnpoint.y;
        this.endpoint;

        // asteroid rotation
        this.rotationForce = 100;
        this.setAngle(0);
        this.body.setAngularVelocity(this.rotationForce); 
        this.body.setAllowGravity(false);

        this.group = group;

        this.body.setSize(64, 64); // sets collider size
        this.body.setOffset(0, 0); // makes image center

        // Set the texture for the sprite
        this.setTexture(texture);

    }
}

class AsteroidGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene, spawner, spawnpoints, endpoints, defaultVelocity = {x: 0, y: 100}, texture = 'asteroid')
    {
        super(scene.physics.world, scene);
        this.scene = scene;
        this.spawner = spawner;
        this.texture = texture;
        scene.physics.add.existing(this);

        this.defaultVelocity = {x: 0, y: 100};

        this.spawnpoints = spawnpoints;
        this.endpoints = endpoints;

        //console.log("new asteroid group: " + JSON.stringify(this.spawnpoints) + " -> " + JSON.stringify(this.endpoints));

    }

    spawnNew (spawnpoint, velocity = this.defaultVelocity)
    {
        // create new asteroid
        const asteroid = new Asteroid(this.scene, this, spawnpoint, this.texture);
        this.add(asteroid);

        // asteroid velocity
        asteroid.body.velocity.x = velocity.x;
        asteroid.body.velocity.y = velocity.y;
    }

    spawnNewRandom (velocity = this.defaultVelocity)
    {
        // get random spawnpoint
        let spawnpoint = this.spawner.getRandomPoint(this.spawnpoints);

        // create new asteroid
        const asteroid = new Asteroid(this.scene, this, spawnpoint, this.texture);
        this.add(asteroid);

        // asteroid velocity, based on random endpoint
        if (this.endpoints.length > 0)
        {
            // get random point from the second list
            let endpoint = this.spawner.getRandomPoint(this.endpoints);
            asteroid.endpoint = endpoint;

            velocity = this.spawner.calculateVelocity(spawnpoint, endpoint, 4);

            //console.log("new random asteroid: " + JSON.stringify(spawnpoint) + " -> " + JSON.stringify(endpoint));
            //console.log(" ++ new random asteroid velocity: " + JSON.stringify(velocity));
            
        }

        // asteroid velocity
        asteroid.body.velocity.x = velocity.x;
        asteroid.body.velocity.y = velocity.y;
    }

    reset(asteroid){
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
        const delay = 2000; // Delay in milliseconds
        this.scene.time.delayedCall(delay, () => {
        //<< SET SPAWN VELOCITY >>


            let velocity = this.spawner.calculateVelocity(spawnpoint, endpoint, 5);

            asteroid.body.velocity.x = velocity.x;
            asteroid.body.velocity.y = velocity.y;
            asteroid.setActive(true);
            asteroid.setVisible(true);

        }, [], this);
    }

    
}
