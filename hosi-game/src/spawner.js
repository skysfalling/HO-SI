class Spawner {
    constructor(scene, horzIndexRange = {min: 3, max: 9}, vertIndexRange = {min: 3, max: 9}) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.graphics.setDepth(2);
        this.gizmos = new Gizmos(scene, this.graphics);
    
        //<< SKYCHART >>
        this.skychart = new SkyChart(this.scene, this.scene.world.center.x, this.scene.world.center.y / 2, this.scene.world.width * 2, this.scene.world.height * 2);

        this.horzIndexRange = {min: 5, max: 12};
        this.vertIndexRange = {min: 3, max: 9};
    
        // << OBJECTS >>
        this.asteroids;
    }

    createNewRandomAsteroids(count = 5){

        for (let i = 0; i < count; i++) 
        {
            this.asteroids.spawn(this.scene, this.getRandomPointInRange(this.skychart.points.top), 'asteroid', 0, 300);
        }
    }

    getRandomPointInRange(points = this.skychart.points.top, min = this.horzIndexRange.min, max = this.horzIndexRange.max)
    {
        const randomIndex = Phaser.Math.RND.between(min, max);
        return points[randomIndex];
    }

    resetAsteroid(asteroid){
        this.scene.asteroids.remove(asteroid, true, true);
        this.createNewRandomAsteroids(3);    
    }
}

