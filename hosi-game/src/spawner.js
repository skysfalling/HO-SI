class Spawner {
    constructor(scene, horzIndexRange = {min: 3, max: 9}, vertIndexRange = {min: 3, max: 9}) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.graphics.setDepth(2);
        this.gizmos = new Gizmos(scene, this.graphics);
    
        //<< SKYCHART >>
        this.skychart = new SkyChart(this.scene, this.scene.world.center.x, this.scene.world.center.y / 2, this.scene.world.width * 2, this.scene.world.height * 2);

        // SPAWN BOUNDS
        this.topResetBound = this.skychart.rect.top;
        this.bottomResetBound = this.skychart.rect.bottom;
        this.leftResetBound = this.skychart.rect.left;
        this.rightResetBound = this.skychart.rect.right;

        // << OBJECTS >>
        this.targetGroups = scene.physics.add.group();

        this.vertResetAsteroids;
        this.vertIndexRange = {min: 7, max: 12};

        this.horzResetAsteroids;
        this.horzIndexRange = {min: 7, max: 12};

        // Add this line to ensure the update function is called automatically
        this.scene.events.on('update', this.update, this);
    }

    create(){
        // << VERTICAL ASTEROIDS >>
        let top_spawnpoints = this.getPointsInRange(this.skychart.points.top, this.vertIndexRange.min, this.vertIndexRange.max);
        let bot_spawnpoints = this.getPointsInRange(this.skychart.points.bottom, this.vertIndexRange.min, this.vertIndexRange.max);

        this.vertResetAsteroids = new AsteroidGroup(this.scene, this, top_spawnpoints, bot_spawnpoints);
        
        this.vertResetAsteroids.spawnNewRandom();
        this.targetGroups.addMultiple(this.vertResetAsteroids);

        // << HORIZONTAL ASTEROIDS >>
        let horz_spawnpoints = this.getPointsInRange(this.skychart.points.left, this.horzIndexRange.min, this.horzIndexRange.max);
        this.horzResetAsteroids = new AsteroidGroup(this.scene, this, horz_spawnpoints);
        this.horzResetAsteroids.spawnNewRandom({x: 100, y: 0});
        this.targetGroups.addMultiple(this.horzResetAsteroids);
        
        // Enable physics for asteroids in targetGroups
        this.targetGroups.getChildren().forEach(child => {
            child.enableBody(true);
        });

        // draw bounds
        this.gizmos.drawLine({x: 0, y: this.topResetBound}, {x: this.scene.world.width, y: this.topResetBound}, 0xff0000);
        this.gizmos.drawLine({x: 0, y: this.bottomResetBound}, {x: this.scene.world.width, y: this.bottomResetBound}, 0xff0000);
    }


    update(time, delta) {

        // VERTICAL ASTEROIDS RESET
        if (this.vertResetAsteroids){
            this.vertResetAsteroids.getChildren().forEach(asteroid => {
                if (asteroid.y > this.bottomResetBound){
                    this.vertResetAsteroids.reset(asteroid);
                }
            });
        }

        // HORZONTAL ASTEROIDS RESET
        if (this.horzResetAsteroids) {
            this.horzResetAsteroids.getChildren().forEach(asteroid => {
                if (asteroid.x > this.rightResetBound){
                    this.horzResetAsteroids.reset(asteroid);
                }
            });
        }
    }

    // ==============================
    //          HELPER FUNCTIONS
    // ==============================
    getPointsInRange(points, min, max)
    {
        return points.slice(min, max + 1);
    }

    getRandomPoint(points)
    {
        const randomIndex = Phaser.Math.RND.between(0, points.length-1);
        return points[randomIndex];
    }


    // ==============================
    //        ASTEROIDS
    // ==============================
    createNewRandomAsteroid(asteroidGroup, count = 1){
        for (let i = 0; i < count; i++) 
        {
            asteroidGroup.spawnNewRandom();
        }
    }

    resetAsteroid(asteroid){
        asteroid.group.reset(asteroid);
    }
}

