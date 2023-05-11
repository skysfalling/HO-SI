class SoundManager {
    constructor(scene) {
      this.scene = scene;
      this.sounds = {};
      this.currentMusic = null;
    }
  
    loadSound(key, path) {
      this.scene.load.audio(key, path);
    }
  
    loadAllSounds() {
      //this.loadSound('music1', 'assets/sounds/music1.mp3');
      //this.loadSound('music2', 'assets/sounds/music2.mp3');
      console.log("loading all Sounds");
      this.loadSound('sfx_select', './assets/sounds/blip_select12.wav');
      this.loadSound('sfx_explosion', './assets/sounds/explosion38.wav');
      this.loadSound('sfx_rocket', './assets/sounds/rocket_shot.wav');
      // Load more sounds as needed
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
      console.log("playing " + key + " " + sound.isPlaying);
    }
    play(key, config) { //plays oneshot
        var sound= this.scene.sound.add(key, config);
        sound.play();
        console.log("playing " + key + " " + sound.isPlaying);
    }

    // Add more methods as needed, e.g., pause, stop, volume control, etc.
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