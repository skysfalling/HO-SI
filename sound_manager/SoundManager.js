class SoundManager {
    constructor(scene) {
      this.scene = scene;
      this.sounds = {};
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
      this.scene.load.audio('sfx_select', './assets/sounds/blip_select12.wav');
      this.scene.load.audio('sfx_explosion', './assets/sounds/explosion38.wav');
      this.scene.load.audio('sfx_rocket', './assets/sounds/rocket_shot.wav');
  
      // Register a callback for when all the sound files are loaded
      this.scene.load.on('complete', () => {
        this.addSoundsToCache();
      });
  
      this.scene.load.start();
    }
  
    addSoundsToCache() {
      console.log("Adding sounds to cache");
      this.loadSound('sfx_select');
      this.loadSound('sfx_explosion');
      this.loadSound('sfx_rocket');
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
  
    play(key, config) {
      const sound = this.scene.sound.add(key, config);
      sound.play();
      console.log("Playing " + key + " " + sound.isPlaying);
    }
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