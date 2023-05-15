/*

================================================================

===// HAMSTER ORIGINS : SNAKE INVADERS //========
----- Sky Casey, Tatiana Lucero, Athena Patronas -----------
>> 60 hours

In the unforgiving void of space, a battle rages in Hamster Origins: Snake Invaders. As a war-weary hamster, you'll command your spacecraft through an endless onslaught of cold-blooded snake adversaries.

With each passing wave, the struggle intensifies, pushing you to the edge of survival. Collect hard-earned upgrades and fight for every inch of progress, as you etch your name into the annals of high scores. 

In the grim darkness there's no respite — only the eternal struggle between hamster and snake, where war is hell, and every battle could be your last. **




================================================================

*/

//#region [[ GAME CONFIG ]] ======================================================
let game_config = {
    type: Phaser.CANVAS,
    width: 64 * 9,
    height: 64 * 16 ,
    parent: 'game-container',
    physics: {
      default: 'arcade',  
      arcade: {
          debug: false,
          gravity: { y: 0 }
      }
    },  
    scene: [ Menu, LevelZero, Play, Pause, Loading ],
    pixelArt: true,
    fps: 60
}
const game = new Phaser.Game(game_config);

// debugging
let gizmosActive = false;
let editorActive = false;

// reserve keyboard variables
let keyE, keyD, keyF, keyZ, keyX, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyESC, keyENTER;

// instances
let prevScene;
let soundManager;
//#region [[]] ==============================================================
let waves;

//#endregion

//#region [[ WAVE ALGORITHM ]] ==============================================================
let waveAlgo={
  level: 0,
  enemyCounts: {
    
  },
}
//#endregion

// #region [[ FORMATTING ]] =================================================

// screen
let scaleRatio = window.devicePixelRatio / 3;
let screen = {
  center: { 
    x: game.config.width/2, 
    y: game.config.height/2 
  },
  width: game.config.width,
  height: game.config.height,

  topLeft: {
    x: 0,
    y: 0
  },
  topMid: {
    x: game.config.width / 2,
    y: 0
  },
  topRight: {
    x: game.config.width,
    y: 0
  },
  rightMid: {
    x: game.config.width,
    y: game.config.height/2
  },
  botRight: { 
    x: game.config.width, 
    y: game.config.height 
  },
  botMid: {
    x: game.config.width/2,
    y: game.config.height
  },
  botLeft: { 
    x: 0, 
    y: game.config.height 
  },
  leftMid: {
    x: 0,
    y: game.config.height/2
  },
}
let format = {
  margin: 50
}
// border size
let borderUISize = 20;
let borderPadding = 10;

let depthLayers = {
  skybox: 0,
  gizmos: 1,
  background: 1,
  playArea: 2,
  foreground: 3,
  ui: 4 
}

//#endregion

//#region [[ CUSTOM COLORS ]] =============================================================
let color_pal = {
  red: "#eb2646",
  orange: "#d45404",
  yellow: "#f9c22b",
  green: "#62C25B",
  teal: "#0eaf9b",
  blue: "#4C86A8", 
  purple: "#a884f3",
  pink: "#F6518A",
  white: "#FFFFFF",
  grey: "#3e3546",
  black: "#101119",
  toInt: function(colorName) {
    return parseInt(this[colorName].replace("#", "0x"));
  }
};

let neon_color_pal = {
  pink: "#EF45F5",
  purple: "#7C3CD6",
  toInt: function(colorName) {
    return parseInt(this[colorName].replace("#", "0x"));
  }
}
//#endregion

//#region [[ TEXT STYLES ]] =============================================================
// header config
let headerConfig = {
  fontFamily: 'Courier New',
  fontSize: '30px',
  backgroundColor: color_pal.black,
  color: color_pal.white,
  align: 'center',
  padding: {
      top: 5,
      bottom: 5,
      left: 5,
      right: 5
  },
  fixedWidth: 100
}

// menu text configuration
let defaultTextStyle = {
  fontFamily: 'Courier',
  fontSize: screen.width/25,
  color: color_pal.pink,
  align: 'right',
  padding: 5,
  fixedWidth: 0,
}
//#endregion

