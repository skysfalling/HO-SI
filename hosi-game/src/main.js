/*

================================================================

HAMSTER ORIGINS : SNAKE INVADERS 

> In the unforgiving void of space, a battle rages in Hamster Origins: Snake Invaders. As a war-weary hamster, you'll command your spacecraft through an endless onslaught of cold-blooded snake adversaries.
> 
> 
> With each passing wave, the struggle intensifies, pushing you to the edge of survival. Collect hard-earned upgrades and fight for every inch of progress, as you etch your name into the annals of high scores. 
> 
> In the grim darkness there's no respite—only the eternal struggle between hamster and snake, where war is hell, and every battle could be your last.**
>

================================================================

*/
let config = {
    type: Phaser.CANVAS,
    width: 64*9,
    height: 960 ,
    parent: 'game-container',
    physics: {
      default: 'arcade',  
      arcade: {
          debug: false,
          gravity: { y: 0 }
      }
    },  
    scene: [ Menu, LevelZero, Play, Editor, Pause, Loading ],
    pixelArt: true,
    fps: 60
}
const game = new Phaser.Game(config);
let gizmosActive = true;
let editorActive = false;

// reserve keyboard variables
let keyD, keyF, keyZ, keyX, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyESC, keyENTER;
let prevScene;
//#region [[]] ==============================================================

let waveAlgo={
  enemyHealth: {
  
  },
  enemySpawns: {
  
  },
  enemyFrequency: {

  },
}

//#engregion

// #region [[ FORMATTING ]] =================================================

let scaleRatio = window.devicePixelRatio / 3;

// screen points
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

//#endregion

//#region [[ CUSTOM COLORS ]] =============================================================
let color_pal = {
  pink: "#F6518A",
  orange: "#d45404",
  yellow: "#f9c22b",
  blue: "#4C86A8", 
  green: "#62C25B",
  purple: "#a884f3",
  teal: "#0eaf9b",
  white: "#FFFFFF",
  grey: "#3e3546",
  black: "#101119",
  toInt: function(colorName) {
    return parseInt(this[colorName].replace("#", "0x"));
  }
};

let neon_color_pal = {
  pink: "#EF45F5",
  purple: "#7C3CD6"
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
  fontSize: screen.width / 50,
  color: color_pal.pink,
  align: 'right',
  padding: 5,
  fixedWidth: 0,
}
//#endregion

