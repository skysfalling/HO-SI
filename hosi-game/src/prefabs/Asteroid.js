class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, spawnpoint, texture){
        super(scene, spawnpoint, texture);

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

        this.group;
        this.setDepth(2);

        this.anims.create({
            key: 'asteroid',
            frames: scene.anims.generateFrameNumbers('asteroid', { 
                start: 0, 
                end: 1, 
                first: 0
            }),
            frameRate: 8,
            repeat: -1
          });
        this.anims.play('asteroid');
    }
}

class AsteroidGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene, spawner, spawnpoints = [], endpoints = [], defaultVelocity = {x: 0, y: 100}, texture = 'asteroids')
    {
        super(scene.physics.world, scene);
        this.scene = scene;
        this.spawner = spawner;
        this.texture = texture;
        scene.physics.add.existing(this);

        this.defaultVelocity = {x: 0, y: 100};

        this.spawnpoints = spawnpoints;
        this.endpoints = endpoints;

        console.log("new asteroid group: " + JSON.stringify(this.spawnpoints) + " -> " + JSON.stringify(this.endpoints));

    }

    spawnNew (spawnpoint, velocity = this.defaultVelocity)
    {
        // create new asteroid
        const asteroid = new Asteroid(this.scene, spawnpoint, this.texture);
        this.add(asteroid);
        asteroid.group = this;

        // asteroid velocity
        asteroid.body.velocity.x = velocity.x;
        asteroid.body.velocity.y = velocity.y;
    }

    spawnNewRandom (velocity = this.defaultVelocity)
    {
        // get random spawnpoint
        let spawnpoint = this.spawner.getRandomPoint(this.spawnpoints);

        // create new asteroid
        const asteroid = new Asteroid(this.scene, spawnpoint, this.texture);
        this.add(asteroid);
        asteroid.group = this;

        // asteroid velocity, based on random endpoint
        if (this.endpoints.length > 0)
        {
            // get random point from the second list
            let endpoint = this.spawner.getRandomPoint(this.endpoints);
            asteroid.endpoint = endpoint;

            velocity = this.spawner.calculateVelocity(spawnpoint, endpoint, 1);

            console.log("new random asteroid: " + JSON.stringify(spawnpoint) + " -> " + JSON.stringify(endpoint));
            console.log(" ++ new random asteroid velocity: " + JSON.stringify(velocity));
            
        }

        // asteroid velocity
        asteroid.body.velocity.x = velocity.x;
        asteroid.body.velocity.y = velocity.y;
    }

    reset(asteroid, random){

        if (random)
        {
            asteroid.spawnpoint = this.spawner.getRandomPoint(this.spawnpoints);
            if (this.endpoints.length > 0) 
            { 
                // get random point from the second list
                let endpoint = this.spawner.getRandomPoint(this.endpoints);
                asteroid.endpoint = endpoint;

                let velocity = this.spawner.calculateVelocity(asteroid.spawnpoint, asteroid.endpoint, 1);

                // asteroid velocity
                asteroid.body.velocity.x = velocity.x;
                asteroid.body.velocity.y = velocity.y;
            }
        }

        asteroid.x = asteroid.spawnpoint.x;
        asteroid.y = asteroid.spawnpoint.y;

        
    }

    
}