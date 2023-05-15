class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");

        //this.mainScene;
    }
    //-resume -restart the game -see current stats -volume slider
    init (data)
    {
        this.prevScene = data.prevScene;
        this.soundManager = data.soundManager;
    }
    preload(){

        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        //this.previousScene=playScene;
        //#region [[PAUSE STATE]]

        let volPercent=1;
        this.title=this.add.text(screen.topMid.x,screen.center.y-50, 'PAUSE MENU', defaultTextStyle,{depth: depthLayers.ui, backgroundColor: color_pal.black }).setOrigin(0.5);
        this.resText=this.add.text(screen.topMid.x,screen.center.y+40, 'RESUME', defaultTextStyle,{depth: depthLayers.ui, backgroundColor: color_pal.black}).setOrigin(0.5);
        this.volSlider=this.add.text(screen.topMid.x,screen.center.y+100, '----o', defaultTextStyle, {depth: depthLayers.ui, backgroundColor: color_pal.black}).setOrigin(0.5);
        this.volText=this.add.text(screen.topMid.x,screen.center.y+80, 'VOLUME:', defaultTextStyle, {depth: depthLayers.ui, backgroundColor: color_pal.black}).setOrigin(0.5);
        this.volSliderTextShit(volPercent);
        this.restartText=this.add.text(screen.topMid.x,screen.center.y+140, 'RESTART', defaultTextStyle, {depth: 10}).setOrigin(0.5);

        this.title.setBackgroundColor(color_pal.black);
        this.resText.setBackgroundColor(color_pal.black);
        //this.volSlider.setBackgroundColor(color_pal.black);
        this.volText.setBackgroundColor(color_pal.black);
        this.restartText.setBackgroundColor(color_pal.black);
        



        console.log()
        this.pauseState = {
            RESUMEBUT: {
                name: 'resumeButton',
                enter: () => {
                    this.currPauseState = this.pauseState.RESUMEBUT;
                    this.resText.setBackgroundColor(color_pal.grey);
                    //make button less setBackgroundColor
                    console.log('resume enter');
                },
                update: () => {
                    if(Phaser.Input.Keyboard.JustDown(keyENTER)){ //if enter is pressed, run resume
                        console.log("pressed enter while resume");
                        this.resText.setBackgroundColor(color_pal.black);
                        //this.resumeScene(this.data.key);
                        this.resumeScene(this.prevScene, this.input);
                        //this.scene.resume("playScene");
                    }
                    if(Phaser.Input.Keyboard.JustDown(keyDOWN)){ //if down, change state to VOLSLIDER & enter
                        //this.currPauseState=this.pauseState.VOLSLIDER;
                        this.resText.setBackgroundColor(color_pal.black);
                        this.pauseState.VOLSLIDER.enter();
                    }
                    if(Phaser.Input.Keyboard.JustDown(keyUP)){ //if down, enter RESTARTBUT & 
                        //this.currPauseState=this.pauseState.VOLSLIDER;
                        this.resText.setBackgroundColor(color_pal.black);
                        this.pauseState.RESTARTBUT.enter();
                    }
                },
            },
            VOLSLIDER: {
                name: 'volumeSlider',
                enter: () => {
                    this.currPauseState = this.pauseState.VOLSLIDER;
                    this.volText.setBackgroundColor(color_pal.grey);
                    this.volSlider.setColor(neon_color_pal.pink);
                    this.volSlider.setBackgroundColor(color_pal.grey);
                    //make knob more
                    console.log('volume enter');
                },
                update: () => {
                    if(Phaser.Input.Keyboard.JustDown(keyLEFT)){
                        if(volPercent==0){
                            this.volSliderTextShit(0);
                        }else{
                            volPercent-=.25;
                            this.volSliderTextShit(volPercent);
                            this.soundManager.setVolume(volPercent);
                        }
                    }
                    if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
                        if(volPercent==1){
                            this.volSliderTextShit(1);
                        }else{
                            volPercent+=.25;
                            this.volSliderTextShit(volPercent);
                            this.soundManager.setVolume(volPercent);
                        }
                    }
                    if(Phaser.Input.Keyboard.JustDown(keyDOWN)){
                        //this.currPauseState=this.pauseState.RESTARTBUT;
                        this.volText.setBackgroundColor(color_pal.black);
                        this.volSlider.setBackgroundColor(color_pal.black);
                        this.volSlider.setColor(color_pal.green);
                        this.pauseState.RESTARTBUT.enter();
                    }
                    if(Phaser.Input.Keyboard.JustDown(keyUP)){ //if down, change state to VOLSLIDER & enter
                        //this.currPauseState=this.pauseState.VOLSLIDER;
                        this.volText.setBackgroundColor(color_pal.black);
                        this.volSlider.setBackgroundColor(color_pal.black);
                        this.volSlider.setColor(color_pal.green);
                        this.pauseState.RESUMEBUT.enter();
                    }
                    //if arrow keys left & right, move knob
                    //if down, change state to restatButton

                }
            },
            RESTARTBUT: {
                name: 'restartButton',
                enter: () => {
                    this.currPauseState = this.pauseState.RESTARTBUT;
                    this.restartText.setBackgroundColor(color_pal.grey);
                    console.log('restart enter');
                },
                update: () => {
                    if(Phaser.Input.Keyboard.JustDown(keyENTER)){
                        this.restartText.setBackgroundColor(color_pal.black);
                        console.log("going to menu scene");
                        this.scene.setVisible(false, this.prevScene);
                        console.log(this.prevScene + " " + this.scene.isVisible(this.prevScene));
                        this.prevScene.soundManager.stopCurrentMusic();
                        this.scene.stop(this.prevScene);
                        this.scene.start('menuScene');
                        this.scene.setVisible(true, 'menuScene');
                        this.scene.stop();
                        //this.pauseState.RESTARTBUT.enter();
                    }
                    if(Phaser.Input.Keyboard.JustDown(keyDOWN)){ //if down, change state to VOLSLIDER & enter
                        //this.currPauseState=this.pauseState.VOLSLIDER;
                        this.restartText.setBackgroundColor(color_pal.black)
                        this.pauseState.RESUMEBUT.enter();
                    }
                    if(Phaser.Input.Keyboard.JustDown(keyUP)){ //if down, change state to VOLSLIDER & enter
                        //this.currPauseState=this.pauseState.VOLSLIDER;
                        this.restartText.setBackgroundColor(color_pal.black)
                        this.pauseState.VOLSLIDER.enter();
                    }
                }
            },   
            /*ENTER: {
                name: 'enter',
                enter: (previousPauseState) => {
                    this.currPauseState = this.pauseState.ENTER;
                    
                },
                update: () => {

                }
            }*/
        }
        this.pauseState.RESUMEBUT.enter();

        //#endregion

    }
    create(){
        //this.add.text(game.config.centerX, game.config.centerY - borderUISize - borderPadding, 'HAMSTER ORIGINS', defaultTextStyle).setOrigin(0.5);
        //this.add.text(game.config.width/2, game.config.height/2, 'SNAKE INVADERS', defaultTextStyle).setOrigin(0.5);
        /*
        this.title=this.add.text(screen.topMid.x,screen.topMid.y, 'PAUSE MENU', defaultTextStyle).setOrigin(0.5);
        this.resText=this.add.text(screen.topMid.x,screen.topMid.y-40, 'RESUME', defaultTextStyle).setOrigin(0.5);
        this.volText=this.add.text(screen.topMid.x,screen.topMid.y-40, 'VOLUME:', defaultTextStyle).setOrigin(0.5);
        this.volSlider=this.add.text(screen.topMid.x,screen.topMid.y-20, '----o', defaultTextStyle).setOrigin(0.5);
        this.volSliderTextShit(SoundManager.volPercent);
        this.restartText=this.add.text(screen.topMid.x,screen.topMid.y-40, 'RESUME', defaultTextStyle).setOrigin(0.5);
        */
        this.gameScene = this.scene.get(this.prevScene);

        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update(){

        console.log("PAUSE SCENE STATE :: [" + this.currPauseState.name + "]");
        this.currPauseState.update();
    }

    resumeScene(x, input) {
        console.log("in resume scene function");
        console.log(x);
      
        // Enable the input listeners in the game scene
        const gameScene = this.scene.get(this.prevScene);
        gameScene.input.keyboard.enabled = true;
      
        this.scene.stop();
        
        console.log("started " + x + " about to stop pause menu");
        gameScene.scene.resume(this.prevScene);
    }

    volSliderTextShit(x){
        console.log(x);
        if(x==0){
            this.volSlider.text='o----'
        }else if(x==.25){
            this.volSlider.text='-o---'
        }
        else if(x==.5){
            this.volSlider.text='--o--'
        }
        else if(x==.75){
            this.volSlider.text='---o-'
        }else if(x==1){
            this.volSlider.text='----o'
        }
    }

}