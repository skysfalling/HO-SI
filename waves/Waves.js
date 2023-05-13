class Waves {
    constructor(scene, level, score){
        this.scene=scene;
        this.level=level;

        let vertAsteroids = {
            group: null,
            count: 2,
            velocity: {x: 0, y: 100}, // "speed"
            size: 2, // "scale"
            spawnDelay: 2,
            spawnDuration: 2,
            level_update: (level) => {
                if (level % 2 === 0) {
                    vertAsteroids.count += 1;
                }
                if (level % 5 === 0) {
                    vertAsteroids.velocity.y += 100;
                }
            }
        }
        let horzAsteroids = {
            group: null,
            count: 2,
            velocity: {x: 100, y: 0}, // "speed"
            size: 2, // "scale"
            spawnDelay: 2,
            level_update: (level) => {
                if (level % 3 === 0) {
                    horzAsteroids.count += 1;
                    horzAsteroids.velocity.x += 100;
                }
            }
        }
        let smallShips = {
            group: null,
            count: 3,
            size: 2, // "scale"
            spawnDelay: 2,
            level_update: (level) => {
                if (level % 5 === 0) {
                    smallShips.count += 1;
                }
            }
        }
        let medShips = {
            group: null,
            count: 3,
            size: 2, // "scale"
            spawnDelay: 2,
            level_update: (level) => {
                if (level % 5 === 0) {
                    medShips.count += 1;
                }
                if(level % 10 === 0){
                    medShips.count+=1 + Math.round(Math.random());
                }
            }
        }
        let chunkyShips = {
            group: null,
            count: 1,
            size: 2, // "scale"
            spawnDelay: 2,
            level_update: (level) => {
                if(level % 10 === 0){
                    chunkyShip.count+=1;
                }
            }
        }
    }


    levelUpdate(level){
        this.level = level;
        vertAsteroids.level_update(level);
        horzAsteroids.level_update(level);
        smallShips.level_update(level);
        medShips.level_update(level);
        chunkyShips.level_update(level);
    }


    static getInstance(scene, level, score) {
        if (!Waves.instance) {
          Waves.instance = new Waves(scene, level, score);
        }
        return Waves.instance;
    }

    //count, speed & size, spawn delay, 
    //
    /*
    levelUpdate(){
        if(level==1){
            this.chunkCount = 0;
            this.medCount = 3;
            this.smallCount = 3;
            this.astCount = 1;
        }else if(level==3){
            this.smallCount = 5;
            this.medCount = 5;
        }
        if(level%10){
            //how e/a thing changes every 10 levels
            //chunky ships
            this.chunkCount = this.level/10;
            //med ships
            this.medCount += 1 + Math.round(Math.random());
        }
        if(level%5){
            //how e/a thing changes every 5 levels
            //med ships
            medCount+=1;
            //small ships
            this.smallCount += 1;
            //asteroids
            this.ast.direction= "vert";
            this.ast.speed = 8;
            this.ast.size.min = 1;
            this.ast.size.max = 2;
        }
        if(level%3){
            //how e/a thing changes every 3 levels
            //asteroids
            this.ast.count+=1;
            this.ast.speed = 2;
            this.ast.direction= "horz";
            this.ast.size.min = 1;
            this.ast.size.max = 2;
        }
        if(level%2){
            //how e/a thing changes every 2 levels
            this.ast.count+=1;
            this.ast.speed = 2;
            this.ast.direction= "vert";
            this.ast.size.min = 3;
            this.ast.size.max = 5;
        }
    }
    */
}