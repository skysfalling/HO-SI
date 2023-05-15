class SoundManager {
    constructor(scene) {
      this.scene = scene;
      this.sounds = {};
      this.sfx = {};
      this.currentMusic = null;
    }
  
    static getInstance(scene) {
      if (!SoundManager.instance) {
        SoundManager.instance = new SoundManager(scene);
      }
      return SoundManager.instance;
    }
  
    loadSound(key) {
      this.scene.sound.add(key);
    }
  
    loadAllSounds() {
      console.log("Loading all Sounds");

            //#region /////////////////// LOADING MUSIC ///////////////////
      
      //JUST CHORDS
      this.scene.load.audio('just_chords', './assets/sounds/music/just_chords.mp3');
      //LEVEL 1v1
      this.scene.load.audio('level1v1', './assets/sounds/music/level1v1.mp3');
      //LEVEL 1v2
      this.scene.load.audio('level1v2', './assets/sounds/music/level1v2.mp3');
      //LEVEL 0.5
      this.scene.load.audio('level05', './assets/sounds/music/level05.mp3');
      /*
      // JUST CHORDS // SIMPLER CHORDS, KICK DRUM
      this.scene.load.audio('just_chords', './assets/sounds/music/just_chords.wav');
      // MAIN LINE LEVEL 1 //SIMPLER CHORDS, SIMPLE MELODY, HARMONIES,KICK DRUM
      this.scene.load.audio('main_line_L1', './assets/sounds/music/main_line_L1.wav');
      // MAIN LINE LEVEL 2 //REG CHORDS, REG MELODY, SIMPLE COUNTER MELODY, HARMONIES, EVENTUAL HIHATS, KICK DRUM
      this.scene.load.audio('main_line_L2', './assets/sounds/music/main_line_L2.wav');
      // MAIN LINE LEVEL 3 //REG CHORDS, REG MELODY, REG COUNTER MELODY, HARMONIES, HIHATS, KICK DRUM
      this.scene.load.audio('main_line_L3', './assets/sounds/music/main_line_L3.wav');
      // VARIATION 1 // REG CHORDS, COUNTER & HARMONY, HIHATS & KICK DRUM
      this.scene.load.audio('var_1', './assets/sounds/music/var_1.wav');
      // VARIATION 2 // REG CHORDS, COUNTER & HARMONY, HIHATS & KICK DRUM
      this.scene.load.audio('var_2', './assets/sounds/music/var_2.wav');
      */
      //#endregion MUSIC

      //#region /////////////////// LOADING SFX ///////////////////
      this.scene.load.audio('sfx_select', './assets/sounds/sfx/blipSelect.wav');
      this.scene.load.audio('sfx_dodge', './assets/sounds/sfx/dodge.wav');
      this.scene.load.audio('sfx_explosion', './assets/sounds/sfx/explosion.wav');
      this.scene.load.audio('sfx_explosion1', './assets/sounds/sfx/explosion1.wav');
      this.scene.load.audio('sfx_explosion2', './assets/sounds/sfx/explosion1.wav');
      this.scene.load.audio('sfx_hyperdrive', './assets/sounds/sfx/hyperdrive.wav');
      this.scene.load.audio('sfx_primaryFire', './assets/sounds/sfx/playerShoot.wav');
      this.scene.load.audio('sfx_rocket', './assets/sounds/sfx/rocket_shot.wav');
      this.scene.load.audio('sfx_takeoff', './assets/sounds/sfx/takeoff.wav');
      //#endregion
      

      
      // Register a callback for when all the sound files are loaded
      this.scene.load.on('complete', () => {
        this.addSoundsToCache();
      });
      this.scene.load.start();
    }
    addSoundsToCache() {
      console.log("Adding sounds to cache");
      this.loadSound('sfx_select');
      this.loadSound('sfx_dodge');
      this.loadSound('sfx_explosion');
      this.loadSound('sfx_explosion1');
      this.loadSound('sfx_explosion2');
      this.loadSound('sfx_hyperdrive');
      this.loadSound('sfx_primaryFire');
      this.loadSound('sfx_rocket');
      this.loadSound('sfx_takeoff');
    }

    setVolume(x){
      s_config.volume=x;
      if(this.currentMusic){
        this.currentMusic.volume=x;
      }
      if(this.sfx){
        for(let i in this.sfx){
          if(this.sfx.hasOwnProperty(i)){
            this.sfx[i].volume= x
          }
        }
      }
    }

    //#region MUSIC KEY
    //LEVEL 0
      /*
        JUST CHORDS      
      */
    //LEVEL 0.5
      /*
        MAIN LINE LEVEL 1
        VARIATION 1
        VARIATION 2
        MAIN LINE LEVEL 2
        VARIATION 1
      */
    //LEVEL 1 --> ONWARDS
      /*
        MAIN LINE LEVEL 1 
        VARIATION 1
        MAIN LINE LEVEL 2
        VARIATION 1
        VARIATION 2
        MAIN LINE LEVEL 3
        VARIATION 1
        AFTER THAT RANDOM:
        SAME, OR CUT OUR THE FIRST 2
      */
    //#endregion
    
    level0Music(){
      this.playMusic('just_chords', {loop: true});
    }
    stopLevel0Music(){
      this.stop;
    }
    level05Music(){
      this.playMusic('level05', {loop: true});
    }
    level1Music(key){
      if (this.currentMusic && this.currentMusic.isPlaying) {
        this.currentMusic.once('complete', () => {
          if (!this.sounds[key]) {
            this.sounds[key] = this.scene.sound.add(key, config);
          }
          this.currentMusic = this.sounds[key];
          this.currentMusic.play();
          console.log("Playing " + key + " " + this.currentMusic.isPlaying);
          this.currentMusic.once('complete', () => { 
            if(Math.round(Math.random())){ 
              this.level05Music('level1v1');
            }else{
              this.level05Music('level1v2');
            }
          });
        });
        this.currentMusic.stop();
      }else {
        if (!this.sounds[key]) {
          this.sounds[key] = this.scene.sound.add(key, s_config);
        }
        this.currentMusic = this.sounds[key];
        this.currentMusic.play();
        console.log("Playing " + key + " " + this.currentMusic.isPlaying);
        this.currentMusic.once('complete', () => {
          if(Math.round(Math.random())){ 
            this.level05Music('level1v1');
          }else{
            this.level05Music('level1v2');
          }
        });
      }
    }

    playExplosion(){
      switch(Math.floor(Math.random()*3)){
        case 0:
          this.play('sfx_explosion');
          break;
        case 1:
          this.play('sfx_explosion1');
          break;
        case 2:
          this.play('sfx_explosion2');
      }
    }



    
    playMusic(key, config) {
      if (this.currentMusic && this.currentMusic.isPlaying) {
        this.currentMusic.once('complete', () => {
          this.startNewMusic(key, config);
        });
        this.currentMusic.stop();
      } else {
        this.startNewMusic(key, config);
      }
    }
  
    startNewMusic(key, config) {
      if (!this.sounds[key]) {
        this.sounds[key] = this.scene.sound.add(key, config);
      }
      this.currentMusic = this.sounds[key];
      this.currentMusic.play();
      console.log("Playing " + key + " " + this.currentMusic.isPlaying);
      
    }
    stopCurrentMusic() {
      if (this.currentMusic && this.currentMusic.isPlaying) {
        this.currentMusic.stop();
      }
    }

    play(key, config) {
      if(!this.sfx[key]){
        this.sfx[key] = this.scene.sound.add(key, config);
      }
      this.sfx[key].play();
      console.log("Playing " + key + " " + this.sfx[key].isPlaying);
    }
  }
  

  let s_config = {
    loop: false,
    volume: 1,
  }





  /*
    import SoundManager from './SoundManager.js';

    class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.soundManager = new SoundManager(this);
        this.soundManager.loadAllSounds();
    }

    create() {
        // Play the first music variation
        this.soundManager.playMusic('music1', { loop: true });

        // After some time or game event, switch to the second music variation
        setTimeout(() => {
        this.soundManager.playMusic('music2', { loop: true });
        }, 5000);
    }

    // Other methods and game logic...
    }
  */