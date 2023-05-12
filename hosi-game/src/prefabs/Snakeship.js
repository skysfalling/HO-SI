class Snakeship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, spawnpoint, texture = 'greenSnakeShip') {
        super(scene, spawnpoint.x, spawnpoint.y, texture);

        this.soundManager = SoundManager.getInstance(this);
        this.scene = scene;
        scene.add.existing(this);   // add to existing, displayList, updateList
        scene.physics.add.existing(this); // add to physics

        this.spawnpoint = spawnpoint;
        this.endpoint;

        // ship rotation
        this.setAngle(-90);
        this.body.setAllowGravity(false);

        this.group;
        this.setDepth(2);

        this.body.setSize(64, 64); // sets collider size
        this.body.setOffset(0, 0); // makes image center

        // Create animations
        this.anims.create({
            key: 'greenSnakeShip',
            frames: [
                { key: 'textureAtlasKey', frame: 'greenSnakeShip0' },
                { key: 'textureAtlasKey', frame: 'greenSnakeShip1' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // Play the animation
        this.anims.play('greenSnakeShip');
    }
}

class SnakeshipGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene, spawner, spawnpoints = [], endpoints = [], defaultVelocity = { x: 0, y: 100 }, texture = 'greenSnakeShip') {
        super(scene.physics.world, scene);
        this.scene = scene;
        this.spawner = spawner;
        this.texture = texture;
        scene.physics.add.existing(this);

        this.defaultVelocity = { x: 0, y: 100 };

        this.spawnpoints = spawnpoints;
        this.endpoints = endpoints;

        console.log("new snakeship group: " + JSON.stringify(this.spawnpoints) + " -> " + JSON.stringify(this.endpoints));

    }

    spawnNew(spawnpoint, velocity = this.defaultVelocity) {
        // create new snakeship
        const snakeship = new Snakeship(this.scene, spawnpoint, this.texture);
        this.add(snakeship);
        snakeship.group = this;

        // snakeship velocity
        snakeship.body.velocity.x = velocity.x;
        snakeship.body.velocity.y = velocity.y;
    }

    spawnNewRandom(velocity = this.defaultVelocity) {
        // get random spawnpoint
        let spawnpoint = this.spawner.getRandomPoint(this.spawnpoints);

        // create new snakeship
        const snakeship = new Snakeship(this.scene, spawnpoint, this.texture);
        this.add(snakeship);
        snakeship.group = this;

        // snakeship velocity, based on random endpoint
        if (this.endpoints.length > 0) {
            // get random point from the second list
            let endpoint = this.spawner.getRandomPoint(this.endpoints);
            snakeship.endpoint = endpoint;

            velocity = this.spawner.calculateVelocity(spawnpoint, endpoint, 4);

            console.log("new random snakeship: " + JSON.stringify(spawnpoint) + " -> " + JSON.stringify(endpoint));
            console.log(" ++ new random snakeship velocity: " + JSON.stringify(velocity));

        }

        // snakeship velocity
        snakeship.body.velocity.x = velocity.x;
        snakeship.body.velocity.y = velocity.y;
    }

    reset(snakeship, random) {

        if (random) {
            snakeship.spawnpoint = this.spawner.getRandomPoint(this.spawnpoints);
            if (this.endpoints.length > 0) {
                // get random point from the second list
                let endpoint = this.spawner.getRandomPoint(this.endpoints);
                snakeship.endpoint = endpoint;

                let velocity = this.spawner.calculateVelocity(snakeship.spawnpoint, snakeship.endpoint, 4);

                // snakeship velocity
                snakeship.body.velocity.x = velocity.x;
                snakeship.body.velocity.y = velocity.y;
            }
        }

        snakeship.x = snakeship.spawnpoint.x;
        snakeship.y = snakeship.spawnpoint.y;
    }
}

