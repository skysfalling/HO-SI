class Spawner {
    constructor(scene, horzIndexRange = {min: 3, max: 9}, vertIndexRange = {min: 3, max: 9}) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.graphics.setDepth(2);
        this.gizmos = new Gizmos(scene, this.graphics);
    
        //<< SKYCHART >>
        this.skychart = new SkyChart(this.scene, this.scene.world.center.x, this.scene.world.center.y / 2, this.scene.world.width * 2, this.scene.world.height * 2);

        this.horzIndexRange = {min: 5, max: 12};
        this.vertIndexRange = {min: 2, max: 9};

        // SPAWN BOUNDS
        this.topResetBound = this.skychart.rect.top;
        this.bottomResetBound = this.skychart.rect.bottom;
        this.leftResetBound = this.skychart.rect.left;
        this.rightResetBound = this.skychart.rect.right;

        // << OBJECTS >>
        this.vertResetAsteroids;
        this.horzResetAsteroids;


        // Add this line to ensure the update function is called automatically
        this.scene.events.on('update', this.update, this);
    }

    create(){
        this.vertResetAsteroids = new AsteroidGroup(this.scene);
        this.vertResetAsteroids.spawner = this;
        this.vertResetAsteroids.spawnpoints = this.getPointsInRange(this.skychart.points.top, this.horzIndexRange.min, this.horzIndexRange.max);

        this.vertResetAsteroids.spawnNewRandom('asteroid');

        //this.createNewRandomAsteroid(this.vertResetAsteroids, this.skychart.points.top, {x: 0, y: 300}, 5);

        //this.horzResetAsteroids = new AsteroidGroup(this, this.scene);
        //let horzSpawnPoints = this.getPointsInRange(this.skychart.points.left, this.vertIndexRange.min, this.vertIndexRange.max);
        //this.createNewRandomAsteroid(this.horzResetAsteroids, horzSpawnPoints, 5, {x: 300, y: 0});

        this.gizmos.drawLine({x: 0, y: this.topResetBound}, {x: this.scene.world.width, y: this.topResetBound}, 0xff0000);
        this.gizmos.drawLine({x: 0, y: this.bottomResetBound}, {x: this.scene.world.width, y: this.bottomResetBound}, 0xff0000);
    }

    update(time, delta) {

        // TOP -> BOTTOM
        if (this.vertResetAsteroids) {
            this.vertResetAsteroids.getChildren().forEach(asteroid => {
                if (asteroid.y > this.bottomResetBound){
                    this.resetAsteroid(asteroid);
                }
            });
        }

        // TOP -> BOTTOM
        if (this.horzResetAsteroids) {
            this.horzResetAsteroids.getChildren().forEach(asteroid => {
                if (asteroid.x > this.rightResetBound){
                    this.resetAsteroid(asteroid);
                }
            });
        }
    }


    getPointsInRange(points, min, max)
    {
        return points.slice(min, max + 1);
    }

    getRandomPoint(points)
    {
        const randomIndex = Phaser.Math.RND.between(0, points.length-1);
        return points[randomIndex];
    }

    createNewRandomAsteroid(asteroidGroup, count = 1){
        for (let i = 0; i < count; i++) 
        {
            let randPoint = this.getRandomPoint(spawnPoints);
            asteroidGroup.spawnNewRandom('asteroid');
        }
    }

    resetAsteroid(asteroid){
        this.scene.asteroids.remove(asteroid, true, true);
        //asteroidGroup.spawnNewRandom('asteroid');
    }
}

