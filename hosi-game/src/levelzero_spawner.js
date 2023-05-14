class LevelZeroSpawner {
    constructor(scene, horzIndexRange = {min: 3, max: 9}, vertIndexRange = {min: 3, max: 9}) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.gizmos = new Gizmos(scene);
        this.world = this.scene.world;
    
        this.spawnArea = {
            center: {
                x: this.world.center.x,
                y: this.world.center.y * 1.5
            },
            width: this.world.width * 1.2,
            height: this.world.height 
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
        this.horzIndexRange = {min: 0, max: 16};
        this.top_spawnpoints = this.getPointsInRange(this.skychart.points.top, this.vertIndexRange.min, this.vertIndexRange.max);
        this.bot_spawnpoints = this.getPointsInRange(this.skychart.points.bottom, this.vertIndexRange.min, this.vertIndexRange.max);
        this.left_spawnpoints = this.getPointsInRange(this.skychart.points.left, this.horzIndexRange.min, this.horzIndexRange.max);
        this.right_spawnpoints = this.getPointsInRange(this.skychart.points.right, this.horzIndexRange.min, this.horzIndexRange.max);
        //#endregion

        // << ALL SPAWN OBJECTS >>
        this.tutorialGroup;
        this.scene.events.on('update', this.update, this);
    }

    create(){
        // draw vert range            
        this.gizmos.drawLine(this.top_spawnpoints[0], this.bot_spawnpoints[0], color_pal.toInt("pink"), 5, 1);
        this.gizmos.drawLine(this.top_spawnpoints[this.top_spawnpoints.length-1], this.bot_spawnpoints[this.bot_spawnpoints.length-1], color_pal.toInt("pink"), 5, 1);

        // draw horz range
        this.gizmos.drawLine(this.left_spawnpoints[0], this.right_spawnpoints[0], color_pal.toInt("green"), 5, 1);
        this.gizmos.drawLine(this.left_spawnpoints[this.left_spawnpoints.length-1], this.right_spawnpoints[this.right_spawnpoints.length-1], color_pal.toInt("green"), 5, 1);
    }

    update(time, delta) {
        if (this.tutorialEnemyGroup){
            this.tutorialEnemyGroup.getChildren().forEach(ship => {
                if (ship.x < this.leftResetBound){
                    this.tutorialEnemyGroup.reset(ship);
                }
            });
        }
    }

    // ==============================
    //      CREATE GROUPS
    // ==============================

    // << ASTEROID GROUP >> ==============================================
    createRandomAsteroids(spawnpoints, endpoints, count = 1, velocity_duration = 5, maxDelay = 5000){

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

    // << STATIC PATH GROUP >> ==============================================
    createStaticPathGroup(spawnpoints, endpoints, velocity_duration, maxDelay = 100, texture = 'greenSnake'){

        const staticPathGroup = new AsteroidGroup(this.scene, this, spawnpoints, endpoints, velocity_duration, maxDelay, texture);
        return staticPathGroup;
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

