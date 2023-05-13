class Spawner {
    constructor(scene, horzIndexRange = {min: 3, max: 9}, vertIndexRange = {min: 3, max: 9}) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.graphics.setDepth(2);
        this.gizmos = new Gizmos(scene, this.graphics);
    
        // << SKYCHART >>
        this.skychart = new SkyChart(this.scene, this.scene.world.center.x, this.scene.world.center.y * 0.5, this.scene.world.width * 2, this.scene.world.height * 2.5);

        // << ENTITY RESET BOUNDS >>
        this.topResetBound = this.skychart.rect.top;
        this.bottomResetBound = this.skychart.rect.bottom;
        this.leftResetBound = this.skychart.rect.left;
        this.rightResetBound = this.skychart.rect.right;

        // << ENEMY POS TARGETS >>
        this.enemyPosTarget = {
            closeRect: new Phaser.Geom.Rectangle(this.scene.world.center.x - (this.scene.world.width/2), this.skychart.rect.y*0.75, this.scene.world.width*0.75, this.skychart.rect.height/4)
        }

        // << CREATE POINT RANGES >>
        this.vertIndexRange = {min: 4, max: 12};
        this.horzIndexRange = {min: 4, max: 16};

        this.top_spawnpoints = this.getPointsInRange(this.skychart.points.top, this.vertIndexRange.min, this.vertIndexRange.max);
        this.bot_spawnpoints = this.getPointsInRange(this.skychart.points.bottom, this.vertIndexRange.min, this.vertIndexRange.max);
        this.left_spawnpoints = this.getPointsInRange(this.skychart.points.left, this.horzIndexRange.min, this.horzIndexRange.max);
        this.right_spawnpoints = this.getPointsInRange(this.skychart.points.right, this.horzIndexRange.min, this.horzIndexRange.max);

        // << ALL SPAWN OBJECTS >>
        this.vertResetAsteroids;
        this.horzResetAsteroids;
        this.snakeshipGroup;

        // Add this line to ensure the update function is called automatically
        this.scene.events.on('update', this.update, this);
    }

    create(){

        // Create groups
        this.vertResetAsteroids = this.createVerticalAsteroids(this.top_spawnpoints, this.bot_spawnpoints);
        this.horzResetAsteroids = this.createHorizontalAsteroids(this.left_spawnpoints, this.right_spawnpoints);
        this.ResetAsteroids = this.createHorizontalAsteroids(this.left_spawnpoints, this.right_spawnpoints);

        this.snakeshipGroup = this.createSnakeshipGroup(this.top_spawnpoints, this.enemyPosTarget.closeRect);

        if (gizmosActive)
        {        
            // draw vert range            
            this.gizmos.drawLine(this.top_spawnpoints[0], this.bot_spawnpoints[0], color_pal.toInt("pink"), 5, 0.1);
            this.gizmos.drawLine(this.top_spawnpoints[this.top_spawnpoints.length-1], this.bot_spawnpoints[this.bot_spawnpoints.length-1], color_pal.toInt("pink"), 5, 0.1);

            // draw horz range
            this.gizmos.drawLine(this.left_spawnpoints[0], this.right_spawnpoints[0], color_pal.toInt("green"), 5, 0.1);
            this.gizmos.drawLine(this.left_spawnpoints[this.left_spawnpoints.length-1], this.right_spawnpoints[this.right_spawnpoints.length-1], color_pal.toInt("green"), 5, 0.1);
        }
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

    createVerticalAsteroids(spawnpoints, endpoints){
        // << VERTICAL ASTEROIDS >> ==============================================

        // create asteroid group with these points ^^^
        const vertResetAsteroids = new AsteroidGroup(this.scene, this, spawnpoints, endpoints);
        vertResetAsteroids.spawnNewRandom(); // spawn 1 new random asteroid

        return vertResetAsteroids;
    }

    createHorizontalAsteroids(spawnpoints, endpoints = []){
        // << HORIZONTAL ASTEROIDS >> ============================================
        // not worried about target points, just using the top points

        // create group
        const horzResetAsteroids = new AsteroidGroup(this.scene, this, spawnpoints, endpoints);
        
        // create 5 new random asteroids
        for (let i = 0; i < 5; i++){
            horzResetAsteroids.spawnNewRandom({x: 100, y: 0});
        }
    }

    createSnakeshipGroup(spawnpoints, targetRect) {    
        // Create snakeship group with these points
        const defaultSnakeships = new SnakeshipGroup(this.scene, this, spawnpoints, targetRect);
        defaultSnakeships.spawnNewRandom(); // Spawn 1 new random snakeship
    
        return defaultSnakeships;
    }

    // ==============================
    //      HELPER FUNCTIONS
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

