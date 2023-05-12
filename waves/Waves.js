class WaveAlgo {
    constructor(scene, level, score){
        this.scene=scene;
        this.level=level;
        this.chunkCount = 0;
        this.medCount = 3;
        this.smallCount = 3;
        this.astCount = 1;
    }
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
            
            //small ships (5 level changes)
            this.smallCount += 1;
            
            //asteroids (5 level changes)
            this.ast.count+=1;
            this.ast.direction= "vert";
            this.ast.speed = 8;
            this.ast.size.min = 1;
            this.ast.size.max = 2;
        }
        else if(level%5){
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
        else if(level%3){
            //how e/a thing changes every 3 levels
            //asteroids
            this.ast.count+=1;
            this.ast.speed = 2;
            this.ast.direction= "horz";
            this.ast.size.min = 1;
            this.ast.size.max = 2;
        }
        else if(level%2){
            //how e/a thing changes every 2 levels
            this.ast.count+=1;
            this.ast.speed = 2;
            this.ast.direction= "vert";
            this.ast.size.min = 3;
            this.ast.size.max = 5;
        }
    }
}