class Waves {
    constructor(scene, spawner){
        this.scene = scene;
        this.spawner = spawner;

        this.level = 0;
        this.score = 0;




        scene.events.on('update', this.update, this);
    }

    update(){
        
    }
}