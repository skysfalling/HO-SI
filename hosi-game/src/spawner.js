class Spawner {
    constructor(scene, horzIndexRange = {min: 3, max: 9}, vertIndexRange = {min: 3, max: 9}) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.gizmos = new Gizmos(scene);
        this.world = this.scene.world;
    
        this.spawnArea = {
            center: {
                x: this.world.center.x,
                y: this.world.center.y * 0.5
            },
            width: this.world.width * 2,
            height: this.world.height * 2.5
        }

        // << SKYCHART >>
        this.skychart = new SkyChart(this.scene, this.spawnArea.center.x, this.spawnArea.center.y, this.spawnArea.width, this.spawnArea.height);

        //#region << ENTITY RESET BOUNDS >>
        this.topResetBound = this.skychart.rect.top;
        this.bottomResetBound = this.skychart.rect.bottom;
        this.leftResetBound = this.skychart.rect.left;
        this.rightResetBound = this.skychart.rect.right;
        //#endregion

        //#region << CREATE POINT RANGES >>
        this.vertIndexRange = {min: 4, max: 12};
        this.horzIndexRange = {min: 6, max: 20};
        this.top_spawnpoints = this.getPointsInRange(this.skychart.points.top, this.vertIndexRange.min, this.vertIndexRange.max);
        this.bot_spawnpoints = this.getPointsInRange(this.skychart.points.bottom, this.vertIndexRange.min, this.vertIndexRange.max);
        this.left_spawnpoints = this.getPointsInRange(this.skychart.points.left, this.horzIndexRange.min, this.horzIndexRange.max);
        this.right_spawnpoints = this.getPointsInRange(this.skychart.points.right, this.horzIndexRange.min, this.horzIndexRange.max);
        //#endregion

        //#region << ENEMY SPAWN AREAS >>
        this.fullSpawnArea = this.gizmos.createRect(
            this.skychart.x, 
            this.skychart.y * 0.25, 
            this.world.width * 1.3, 
            this.skychart.height * 0.6,
            color_pal.toInt("white"),
            10,
            0.1
        );

        this.closeSpawnArea = this.gizmos.createRectFill(
            this.skychart.x, 
            this.skychart.y * 0.5, 
            this.world.width * 0.9, 
            200,
            color_pal.toInt("green"),
            10, 
            0.1
        );

        this.midSpawnArea = this.gizmos.createRectFill(
            this.skychart.x, 
            this.skychart.y * 0.5, 
            this.fullSpawnArea.width, 
            400,
            color_pal.toInt("blue"),
            10, 
            0.1
        );

        this.backSpawnArea = this.gizmos.createRectFill(
            this.skychart.x, 
            this.skychart.y * -0.5, 
            this.fullSpawnArea.width, 
            400,
            color_pal.toInt("red"),
            10, 
            0.1
        );
        //#endregion

        // << ALL SPAWN OBJECTS >>
        this.vertResetAsteroids;
        this.left_ResetAsteroids;
        this.right_ResetAsteroids;
        this.snakeshipGroup;

        this.scene.events.on('update', this.update, this);
    }

    create(){
        // create groups
        this.vertResetAsteroids = this.createAsteroids(this.top_spawnpoints, this.bot_spawnpoints);
        this.left_ResetAsteroids = this.createAsteroids(this.left_spawnpoints, this.right_spawnpoints, 2);
        this.right_ResetAsteroids = this.createAsteroids(this.right_spawnpoints, this.left_spawnpoints, 4);
        this.snakeshipGroup = this.createSnakeshipGroup(this.top_spawnpoints, this.closeSpawnArea, 3);

        // draw vert range            
        this.gizmos.drawLine(this.top_spawnpoints[0], this.bot_spawnpoints[0], color_pal.toInt("pink"), 5, 1);
        this.gizmos.drawLine(this.top_spawnpoints[this.top_spawnpoints.length-1], this.bot_spawnpoints[this.bot_spawnpoints.length-1], color_pal.toInt("pink"), 5, 1);

        // draw horz range
        this.gizmos.drawLine(this.left_spawnpoints[0], this.right_spawnpoints[0], color_pal.toInt("green"), 5, 1);
        this.gizmos.drawLine(this.left_spawnpoints[this.left_spawnpoints.length-1], this.right_spawnpoints[this.right_spawnpoints.length-1], color_pal.toInt("green"), 5, 1);
    }

    update(time, delta) {

        if (this.vertResetAsteroids){
            this.vertResetAsteroids.getChildren().forEach(asteroid => {
                if (asteroid.y > this.bottomResetBound){
                    this.vertResetAsteroids.resetRandom(asteroid);
                }
            });
        }

        // HORZONTAL ASTEROIDS RESET
        if (this.left_ResetAsteroids) {
            this.left_ResetAsteroids.getChildren().forEach(asteroid => {
                if (asteroid.x > this.rightResetBound){
                    this.left_ResetAsteroids.resetRandom(asteroid);
                }
            });
        }

        if (this.right_ResetAsteroids) {
            this.right_ResetAsteroids.getChildren().forEach(asteroid => {
                if (asteroid.x < this.leftResetBound){
                    this.left_ResetAsteroids.resetRandom(asteroid);
                }
            });
        }
        
        // SnakeshipGroup reset
        if (this.snakeshipGroup) {
            this.snakeshipGroup.getChildren().forEach(snakeship => {
                if (snakeship.y > this.bottomResetBound) {
                    this.snakeshipGroup.reset(snakeship);
                }
            });
        }
    }

    // ==============================
    //      CREATE GROUPS
    // ==============================

    // << ASTEROID GROUP >> ==============================================
    createAsteroids(spawnpoints, endpoints, count = 1, velocity_duration = 5, maxDelay = 5000){

        // create asteroid group with these points ^^^
        const asteroids = new AsteroidGroup(this.scene, this, spawnpoints, endpoints, velocity_duration, maxDelay, 'asteroid');

        for (let i = 0; i < count; i++)
        {
            asteroids.spawnNewRandom();
        }

        return asteroids;
    }

    // << SNAKE GROUP >> ==============================================
    createSnakeshipGroup(spawnpoints, targetRect) {    
        // Create snakeship group with these points
        const defaultSnakeships = new SnakeshipGroup(this.scene, this, spawnpoints, targetRect);
        defaultSnakeships.spawnNewRandom(); // Spawn 1 new random snakeship
    
        return defaultSnakeships;
    }

    // ==============================
    //      HELPER FUNCTIONS
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

    calculateVelocity(startPoint, endPoint, time) {
        // Calculate the displacement vector from start to end
        let displacement = new Phaser.Math.Vector2(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
        
        // Calculate the velocity vector by dividing displacement by time
        let velocity = displacement.scale(1 / time);
        
        return velocity;
    }

    createNewRandomSpawnObj(objGroup, count = 1){
        for (let i = 0; i < count; i++) 
        {
            objGroup.spawnNewRandom();
        }
    }

    resetSpawnObject(obj, random){
        obj.group.reset(obj, random);
    }
    //#endregion
}

