class Waves {
    constructor(scene){
        this.scene=scene;

        this.level = 0;
        this.score = 0;

        this.vertAsteroids = {
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
        this.horzAsteroids = {
            group: null,
            count: 2,
            velocity: {x: 100, y: 0}, // "speed"
            size: 2, // "scale"
            spawnDelay: 2,
            spawnDuration: 2,
            level_update: (level) => {
                if (level % 3 === 0) {
                    horzAsteroids.count += 1;
                    horzAsteroids.velocity.x += 100;
                }
            }
        }


        this.greenShips = {
            group: null,
            count: 3,
            size: 2, // "scale"
            spawnDelay: 2,
            level_update: (level) => {
                if (level % 5 === 0) {
                    greenShips.count += 1;
                }
            }
        }
        this.orangeShips = {
            group: null,
            count: 3,
            size: 2, // "scale"
            spawnDelay: 2,
            level_update: (level) => {
                if (level % 5 === 0) {
                    orangeShips.count += 1;
                }
                if(level % 10 === 0){
                    orangeShips.count+=1 + Math.round(Math.random());
                }
            }
        }
        this.purpleShips = {
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
}