class Spawner {
    constructor(scene, horzIndexRange = {min: 3, max: 9}, vertIndexRange = {min: 3, max: 9}) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.graphics.setDepth(2);
        this.gizmos = new Gizmos(scene, this.graphics);
    
        //<< SKYCHART >>
        this.skychart = new SkyChart(this.scene, this.scene.world.center.x, this.scene.world.center.y / 2, this.scene.world.width * 2, this.scene.world.height * 2);

        // << SPAWN BOUNDS >>
        this.topResetBound = this.skychart.rect.top;
        this.bottomResetBound = this.skychart.rect.bottom;
        this.leftResetBound = this.skychart.rect.left;
        this.rightResetBound = this.skychart.rect.right;

        // << ALL SPAWN OBJECTS >>
        this.vertResetAsteroids;
        this.vertIndexRange = {min: 5, max: 10};

        this.horzResetAsteroids;
        this.horzIndexRange = {min: 7, max: 12};

        this.snakeshipGroup;

        // Add this line to ensure the update function is called automatically
        this.scene.events.on('update', this.update, this);
    }

    create(){

        // Create groups
        //this.vertResetAsteroids = this.createVerticalAsteroids();
        //this.horzResetAsteroids = this.createHorizontalAsteroids();
        this.snakeshipGroup = this.createSnakeshipGroup();

    }


    update(time, delta) {

        // VERTICAL ASTEROIDS RESET
        if (this.vertResetAsteroids){
            this.vertResetAsteroids.getChildren().forEach(asteroid => {
                if (asteroid.y > this.bottomResetBound){
                    this.vertResetAsteroids.reset(asteroid, true);
                }
            });
        }

        // HORZONTAL ASTEROIDS RESET
        if (this.horzResetAsteroids) {
            this.horzResetAsteroids.getChildren().forEach(asteroid => {
                if (asteroid.x > this.rightResetBound){
                    this.horzResetAsteroids.reset(asteroid, true);
                }
            });
        }

        // SnakeshipGroup reset
        if (this.snakeshipGroup) {
            this.snakeshipGroup.getChildren().forEach(snakeship => {
                if (snakeship.y > this.bottomResetBound) {
                    this.snakeshipGroup.reset(snakeship, true);
                }
            });
        }
    }

    // ==============================
    //      CREATE GROUPS
    // ==============================

    createVerticalAsteroids(){
        // << VERTICAL ASTEROIDS >> ==============================================
        // create range of points to spawn from
        let top_spawnpoints = this.getPointsInRange(this.skychart.points.top, this.vertIndexRange.min, this.vertIndexRange.max);
        // create range of points to target
        let bot_spawnpoints = this.getPointsInRange(this.skychart.points.bottom, this.vertIndexRange.min, this.vertIndexRange.max);

        // draw spawn range for vertical asteroids
        this.gizmos.drawLine(top_spawnpoints[0], bot_spawnpoints[0], color_pal.toInt("pink"));
        this.gizmos.drawLine(top_spawnpoints[top_spawnpoints.length-1], bot_spawnpoints[bot_spawnpoints.length-1], color_pal.toInt("pink"));

        // create asteroid group with these points ^^^
        const vertResetAsteroids = new AsteroidGroup(this.scene, this, top_spawnpoints, bot_spawnpoints);
        vertResetAsteroids.spawnNewRandom(); // spawn 1 new random asteroid

        return vertResetAsteroids;
    }

    createHorizontalAsteroids(){
        // << HORIZONTAL ASTEROIDS >> ============================================
        // not worried about target points, just using the top points
        let horz_spawnpoints = this.getPointsInRange(this.skychart.points.left, this.horzIndexRange.min, this.horzIndexRange.max);
        // create group
        const horzResetAsteroids = new AsteroidGroup(this.scene, this, horz_spawnpoints);
        
        // create 5 new random asteroids
        for (let i = 0; i < 5; i++){
            horzResetAsteroids.spawnNewRandom({x: 100, y: 0});
        }
    }

    createSnakeshipGroup() {
        // Create range of points to spawn from
        let topSpawnpoints = this.getPointsInRange(this.skychart.points.top, this.vertIndexRange.min, this.vertIndexRange.max);
    
        // Create range of points to target (optional)
        let botSpawnpoints = this.getPointsInRange(this.skychart.points.bottom, this.vertIndexRange.min, this.vertIndexRange.max);
    
        // Draw spawn range for vertical snakeships
        this.gizmos.drawLine(topSpawnpoints[0], botSpawnpoints[0], color_pal.toInt("pink"));
        this.gizmos.drawLine(topSpawnpoints[topSpawnpoints.length - 1], botSpawnpoints[botSpawnpoints.length - 1], color_pal.toInt("pink"));
    
        // Create snakeship group with these points
        const snakeshipGroup = new SnakeshipGroup(this.scene, this, topSpawnpoints, botSpawnpoints);
        snakeshipGroup.spawnNewRandom(); // Spawn 1 new random snakeship
    
        return snakeshipGroup;
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

